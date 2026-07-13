import type { AuthUser } from "@/lib/backend/auth";
import { DEFAULT_LIFETIME_CREDITS } from "@/lib/backend/session";
import type { BillingPlan } from "@/lib/backend/stripe";
import { cancelStripeSubscription, stripePriceId, STRIPE_PLAN_CREDITS, lookupStripeRefundStatus, upgradeStripeSubscription } from "@/lib/backend/stripe";
import { billingDb, billingKv } from "@/lib/backend/cloudflare";
import { calculateExpiredPaidCreditRemoval, calculateStripeCreditReplacement, inferStripePriorPaidRemaining, stripeBillingPeriodDecision, stripeCreditGrantSourceId } from "@/lib/backend/stripe-plan";

export type BillingAccount = {
  userId: string;
  email?: string;
  plan: "free" | BillingPlan;
  creditsRemaining: number;
  creditsHeld?: number;
  subscriptionStatus: "none" | "active" | "trialing" | "paused" | "scheduled_cancel" | "canceled" | "past_due" | "expired" | "refund_requested" | "refunded" | "disputed";
  subscriptionId?: string;
  customerId?: string;
  lastStripeEventId?: string;
  lastRefundRequestId?: string;
  updatedAt: number;
  createdAt: number;
};

const creditLockedStatuses = new Set<BillingAccount["subscriptionStatus"]>(["refund_requested", "refunded", "disputed"]);
const SELF_SERVICE_REFUND_WINDOW_DAYS = 7;
const SELF_SERVICE_REFUND_MAX_PAID_CREDIT_USAGE = 0.2;
const BILLING_PLAN_ORDER: Record<BillingPlan, number> = { starter: 1, creator: 2, studio: 3 };
const STRIPE_PLAN_PRICES_CENTS: Record<BillingPlan, number> = { starter: 799, creator: 1499, studio: 2999 };
const DEFAULT_BILLING_PERIOD_DAYS = 30;
const STALE_STRIPE_CHECKOUT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

type ProratedUpgradePreview = {
  currentPlan: BillingPlan;
  targetPlan: BillingPlan;
  currentCredits: number;
  targetCredits: number;
  creditsDeltaMonthly: number;
  creditsToGrant: number;
  currentPriceCents: number;
  targetPriceCents: number;
  priceDeltaCents: number;
  estimatedProratedChargeCents: number;
  remainingRatio: number;
  remainingDays: number;
  periodStart?: number;
  periodEnd?: number;
  nextCreditsBalance: number;
};

function publicBillingAccount(account: BillingAccount): BillingAccount {
  if (account.subscriptionStatus === "refunded") {
    return {
      ...account,
      plan: "free",
      creditsHeld: undefined,
      creditsRemaining: account.creditsRemaining,
    };
  }
  if (!creditLockedStatuses.has(account.subscriptionStatus)) return account;
  return {
    ...account,
    creditsHeld: account.creditsRemaining,
    creditsRemaining: 0,
  };
}

export type RefundRequest = {
  requestId: string;
  userId: string;
  email?: string;
  plan: BillingAccount["plan"];
  subscriptionStatus: BillingAccount["subscriptionStatus"];
  creditsRemaining: number;
  subscriptionId?: string;
  customerId?: string;
  reason?: string;
  status: "submitted";
  createdAt: number;
};

type FreeCreditRefundBalance = {
  paidGranted: number;
  generationDebited: number;
  generationRefunded: number;
  paidCreditsConsumedFirst: number;
  freeCreditsConsumed: number;
  freeCreditsRemaining: number;
};

type RefundEligibility = {
  eligible: boolean;
  code?: string;
  message?: string;
  paidGranted: number;
  paidCreditsConsumed: number;
  paidCreditsUsagePercent: number;
  latestPaymentId?: string;
  latestPaymentAt?: number;
  amountCents?: number;
  currency?: string;
};

export type PublicSelfServiceRefundStatus = {
  canRequest: boolean;
  code: string;
  message: string;
  refundWindowDays: number;
  daysSinceLatestPayment?: number;
  paidCreditsUsagePercent?: number;
};

export type CreditGrantInput = {
  eventId: string;
  eventType: string;
  userId?: string | null;
  email?: string | null;
  plan: BillingPlan;
  credits: number;
  subscriptionId?: string | null;
  customerId?: string | null;
  checkoutId?: string | null;
  transactionId?: string | null;
  invoiceId?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  billingReason?: string | null;
  previousPlan?: BillingPlan | null;
  periodStart?: number | null;
  periodEnd?: number | null;
  rawEvent?: unknown;
};

type SubscriptionStateInput = {
  eventId: string;
  eventType: string;
  userId?: string | null;
  email?: string | null;
  status: BillingAccount["subscriptionStatus"];
  plan?: BillingPlan | null;
  subscriptionId?: string | null;
  customerId?: string | null;
  checkoutId?: string | null;
  transactionId?: string | null;
  invoiceId?: string | null;
  rawEvent?: unknown;
};

type RefundStateInput = Omit<SubscriptionStateInput, "status"> & {
  refundId?: string | null;
  amountCents?: number | null;
  currency?: string | null;
};

type UserRow = {
  id: string;
  email: string;
  plan: BillingAccount["plan"];
  status: BillingAccount["subscriptionStatus"];
  credits_remaining: number;
  stripe_customer_id: string | null;
  created_at: number;
  updated_at: number;
};

type SubscriptionRow = {
  id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan?: BillingPlan | null;
  status: BillingAccount["subscriptionStatus"];
  current_period_start?: number | null;
  current_period_end?: number | null;
};

type WebhookRow = {
  processed_status: string;
  related_user_id: string | null;
};

export async function billingStoreStatus() {
  const [db, kv] = await Promise.all([billingDb(), billingKv()]);
  return { db: Boolean(db), kv: Boolean(kv), primary: db ? "d1" : kv ? "kv" : "none" };
}

export async function ensureBillingAccount(user: AuthUser): Promise<BillingAccount | null> {
  const db = await billingDb();
  return db ? ensureD1BillingAccount(db, user) : null;
}

export async function accountForPublicUser(user: AuthUser) {
  const account = await ensureBillingAccount(user);
  const pendingRefund = await pendingRefundRequestForUser(user.id);
  if (account?.subscriptionStatus === "refund_requested" || pendingRefund) {
    const reconciled = await reconcilePendingStripeRefund(user.id);
    if (reconciled) return publicBillingAccount(reconciled);
    if (pendingRefund && account && account.subscriptionStatus !== "refunded") {
      const synced = await syncAccountToPendingRefund(user.id);
      return publicBillingAccount(synced || { ...account, subscriptionStatus: "refund_requested" as const, lastRefundRequestId: pendingRefund.id });
    }
  }
  return account ? publicBillingAccount(account) : {
    userId: user.id,
    email: user.email,
    plan: user.plan,
    creditsRemaining: user.creditsRemaining,
    creditsHeld: undefined,
    subscriptionStatus: "none" as const,
  };
}

async function pendingRefundRequestForUser(userId: string) {
  const db = await billingDb();
  if (!db) return null;
  return db.prepare("SELECT id FROM refund_requests WHERE user_id = ? AND status IN ('submitted', 'pending', 'refund_requested') ORDER BY requested_at DESC LIMIT 1")
    .bind(userId)
    .first<{ id: string }>();
}

async function syncAccountToPendingRefund(userId: string) {
  const db = await billingDb();
  if (!db) return null;
  const now = Date.now();
  await db.prepare("UPDATE users SET status = 'refund_requested', updated_at = ? WHERE id = ? AND status NOT IN ('refunded', 'disputed')")
    .bind(now, userId)
    .run();
  return readD1Account(db, userId);
}

export async function billingCheckoutAttemptSeed(userId: string) {
  const db = await billingDb();
  if (!db) return "billing-db-unavailable";
  const row = await db.prepare("SELECT MAX(updated_at) AS latest_update FROM payments WHERE user_id = ?")
    .bind(userId)
    .first<{ latest_update: number | null }>();
  return String(row?.latest_update || 0);
}

export async function recentPendingCheckoutForUser(userId: string) {
  const db = await billingDb();
  if (!db) return null;
  const now = Date.now();
  const staleBefore = now - STALE_STRIPE_CHECKOUT_MAX_AGE_MS;
  await db.prepare(`UPDATE payments
    SET status = CASE
      WHEN stripe_checkout_id LIKE 'cs_%' THEN 'expired'
      ELSE 'canceled'
    END,
    updated_at = ?
    WHERE user_id = ?
      AND status = 'checkout_pending'
      AND (
        created_at <= ?
        OR stripe_checkout_id IS NULL
        OR stripe_checkout_id NOT LIKE 'cs_%'
      )`)
    .bind(now, userId, staleBefore)
    .run();

  const row = await db.prepare(`SELECT pending.id, pending.stripe_checkout_id, pending.plan, pending.created_at
    FROM payments pending
    WHERE pending.user_id = ?
      AND pending.status = 'checkout_pending'
      AND NOT EXISTS (
        SELECT 1
        FROM payments completed
        WHERE completed.user_id = pending.user_id
          AND completed.id != pending.id
          AND completed.stripe_checkout_id = pending.stripe_checkout_id
          AND completed.status IN ('paid', 'refunded', 'canceled', 'expired', 'disputed')
      )
    ORDER BY pending.created_at DESC
    LIMIT 1`)
    .bind(userId)
    .first<{ id: string; stripe_checkout_id: string | null; plan: string; created_at: number }>();
  if (!row?.id) return null;
  return {
    checkoutId: row.stripe_checkout_id || row.id,
    plan: row.plan,
    createdAt: row.created_at,
  };
}

export async function markPendingCheckoutStatus(checkoutId: string, status: "expired" | "canceled" | "paid") {
  const db = await billingDb();
  if (!db || !checkoutId) return { persisted: false };
  const result = await db.prepare("UPDATE payments SET status = ?, updated_at = ? WHERE stripe_checkout_id = ? AND status = 'checkout_pending'")
    .bind(status, Date.now(), checkoutId)
    .run();
  return { persisted: Boolean(result.meta?.changes) };
}

export async function recordPendingCheckoutForUser(input: { userId: string; plan: BillingPlan; checkoutId: string; amountCents?: number | null; currency?: string | null }) {
  const db = await billingDb();
  if (!db || !input.checkoutId) return { persisted: false };
  const now = Date.now();
  await db.prepare(`INSERT INTO payments (id, user_id, subscription_id, stripe_checkout_id, stripe_transaction_id, stripe_invoice_id, plan, status, currency, amount_cents, raw_event_id, paid_at, created_at, updated_at)
    VALUES (?, ?, NULL, ?, NULL, NULL, ?, 'checkout_pending', ?, ?, ?, NULL, ?, ?)
    ON CONFLICT(id) DO UPDATE SET status = payments.status, updated_at = excluded.updated_at`)
    .bind(input.checkoutId, input.userId, input.checkoutId, input.plan, input.currency || "USD", input.amountCents || 0, `checkout_started_${input.checkoutId}`, now, now)
    .run();
  return { persisted: true };
}

export async function reconcilePendingStripeRefund(userId: string) {
  const db = await billingDb();
  if (!db || !(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY)) return null;
  const pending = await db.prepare(`SELECT
      rr.id AS refund_request_id,
      rr.payment_id AS refund_payment_id,
      rr.subscription_id AS refund_subscription_id,
      p.id AS payment_id,
      p.stripe_transaction_id,
      p.stripe_checkout_id,
      p.stripe_invoice_id,
      p.subscription_id AS payment_subscription_id
    FROM refund_requests rr
    LEFT JOIN payments p ON p.user_id = rr.user_id AND (p.id = rr.payment_id OR p.stripe_transaction_id = rr.payment_id OR p.subscription_id = rr.subscription_id)
    WHERE rr.user_id = ? AND rr.status IN ('submitted', 'pending', 'refund_requested')
    ORDER BY rr.requested_at DESC, p.created_at DESC
    LIMIT 1`)
    .bind(userId)
    .first<{ refund_request_id: string; refund_payment_id: string | null; refund_subscription_id: string | null; payment_id: string | null; stripe_transaction_id: string | null; stripe_checkout_id: string | null; stripe_invoice_id: string | null; payment_subscription_id: string | null }>();
  if (!pending?.refund_request_id) return null;

  const lookup = await lookupStripeRefundStatus({
    paymentId: pending.refund_payment_id || pending.payment_id,
    transactionId: pending.stripe_transaction_id || pending.refund_payment_id,
    checkoutId: pending.stripe_checkout_id,
    invoiceId: pending.stripe_invoice_id,
    subscriptionId: pending.refund_subscription_id || pending.payment_subscription_id,
  });
  if (!lookup.refunded) return null;

  const eventId = `stripe_reconcile_refund_${Date.now()}_${pending.refund_request_id}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  const result = await markRefundedAccountD1(db, {
    eventId,
    eventType: "refund.created",
    userId,
    subscriptionId: pending.refund_subscription_id || pending.payment_subscription_id,
    transactionId: pending.stripe_transaction_id || pending.refund_payment_id || pending.payment_id,
    checkoutId: pending.stripe_checkout_id,
    invoiceId: pending.stripe_invoice_id,
    refundId: lookup.refundId || eventId,
    rawEvent: { source: "stripe_api_reconciliation", lookup: { source: lookup.source, resourceId: lookup.resourceId, status: lookup.status, refundId: lookup.refundId } },
  });
  if (result.persisted) {
    await recordWebhookEvent(db, eventId, "stripe.reconcile_refund", { source: "stripe_api_reconciliation", lookup: { source: lookup.source, resourceId: lookup.resourceId, status: lookup.status, refundId: lookup.refundId } }, userId, "processed", null, true);
  }
  return result.account || null;
}

export async function reconcileAllPendingStripeRefunds(limit = 20) {
  const db = await billingDb();
  if (!db || !process.env.STRIPE_API_KEY) return { ok: false, reason: "missing_db_or_stripe_api_key", checked: 0, reconciled: 0 };
  const rows = await db.prepare(`SELECT DISTINCT user_id
    FROM refund_requests
    WHERE status IN ('submitted', 'pending', 'refund_requested')
    ORDER BY requested_at ASC
    LIMIT ?`)
    .bind(Math.max(1, Math.min(50, limit)))
    .all<{ user_id: string }>();
  let checked = 0;
  let reconciled = 0;
  const errors: Array<{ userId: string; message: string }> = [];
  for (const row of rows.results || []) {
    if (!row.user_id) continue;
    checked += 1;
    try {
      const result = await reconcilePendingStripeRefund(row.user_id);
      if (result?.subscriptionStatus === "refunded") reconciled += 1;
    } catch (error) {
      errors.push({ userId: row.user_id, message: error instanceof Error ? error.message : String(error) });
    }
  }
  return { ok: true, checked, reconciled, errors };
}

export async function grantCreditsFromStripe(input: CreditGrantInput) {
  const db = await billingDb();
  if (db) return grantCreditsFromStripeD1(db, input);
  return { persisted: false, duplicate: false, reason: "D1 billing database is required for atomic Stripe credit grants" };
}

export async function recordStripeWebhookEvent(input: { eventId: string; eventType: string; rawEvent: unknown; userId?: string | null }) {
  const db = await billingDb();
  if (!db) return { persisted: false, reason: "D1 billing database is required for durable Stripe webhook acknowledgement" };
  await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent, input.userId || null, "processed", null, true);
  return { persisted: true };
}

export async function debitCreditForUser(user: AuthUser, amount = 1, sourceId?: string) {
  const db = await billingDb();
  if (db) return debitCreditForUserD1(db, user, amount, sourceId);
  return { persisted: false, creditsRemaining: user.creditsRemaining, insufficient: true, reason: "D1 billing database is required for credit debits" };
}

export async function refundCreditForUser(user: AuthUser, amount = 1, sourceId?: string) {
  if (!sourceId || amount <= 0) return { persisted: false, creditsRemaining: user.creditsRemaining, reason: "A positive amount and owned source id are required" };
  const db = await billingDb();
  if (db) {
    const account = await ensureD1BillingAccount(db, user);
    const now = Date.now();
    const ledgerId = `generation_refund_${sourceId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
    try {
      const results = await db.batch([
        db.prepare(`UPDATE users SET credits_remaining = credits_remaining + ?, updated_at = ?
          WHERE id = ?
            AND EXISTS (SELECT 1 FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_debit' AND source_id = ?)
            AND NOT EXISTS (SELECT 1 FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_refund' AND source_id = ?)`)
          .bind(amount, now, user.id, user.id, sourceId, user.id, sourceId),
        db.prepare(`INSERT INTO credit_ledger (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at)
          SELECT ?, id, 'generation_refund', ?, ?, credits_remaining, 'Generation safety refund', ?, ? FROM users WHERE id = ? AND updated_at = ?`)
          .bind(ledgerId, sourceId, amount, JSON.stringify({ amount }), now, user.id, now),
      ]);
      if (!results[0]?.meta?.changes || !results[1]?.meta?.changes) {
        const fresh = await readD1Account(db, user.id);
        const existing = await db.prepare("SELECT id FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_refund' AND source_id = ? LIMIT 1").bind(user.id, sourceId).first<{ id: string }>();
        return { persisted: Boolean(existing), creditsRemaining: fresh?.creditsRemaining ?? account.creditsRemaining, duplicate: Boolean(existing), reason: existing ? undefined : "No matching debit" };
      }
      const fresh = await readD1Account(db, user.id);
      return { persisted: true, creditsRemaining: fresh?.creditsRemaining ?? account.creditsRemaining + amount };
    } catch {
      const fresh = await readD1Account(db, user.id);
      const existing = await db.prepare("SELECT id FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_refund' AND source_id = ? LIMIT 1").bind(user.id, sourceId).first<{ id: string }>();
      return { persisted: Boolean(existing), creditsRemaining: fresh?.creditsRemaining ?? account.creditsRemaining, duplicate: Boolean(existing), reason: existing ? undefined : "Refund transaction failed" };
    }
  }
  return { persisted: false, creditsRemaining: user.creditsRemaining, reason: "D1 billing database is required for generation refunds" };
}

export async function updateSubscriptionState(input: {
  eventId: string;
  eventType: string;
  userId?: string | null;
  email?: string | null;
  status: BillingAccount["subscriptionStatus"];
  plan?: BillingPlan | null;
  subscriptionId?: string | null;
  customerId?: string | null;
  rawEvent?: unknown;
}) {
  const db = await billingDb();
  if (db) return updateSubscriptionStateD1(db, input);
  return { persisted: false, reason: "D1 billing database is required for subscription state updates" };
}

export async function selfServiceRefundStatusForUser(user: AuthUser): Promise<PublicSelfServiceRefundStatus | null> {
  const db = await billingDb();
  if (!db) return null;
  const account = await ensureD1BillingAccount(db, user);
  if (account.plan === "free") {
    return {
      canRequest: false,
      code: "NO_PAID_PLAN",
      message: "No paid plan on this account.",
      refundWindowDays: SELF_SERVICE_REFUND_WINDOW_DAYS,
    };
  }
  if (account.subscriptionStatus === "refunded") {
    return {
      canRequest: false,
      code: "ALREADY_REFUNDED",
      message: "This account has already been refunded.",
      refundWindowDays: SELF_SERVICE_REFUND_WINDOW_DAYS,
    };
  }
  if (account.subscriptionStatus === "refund_requested") {
    return {
      canRequest: false,
      code: "REFUND_ALREADY_PENDING",
      message: "Refund review is already pending.",
      refundWindowDays: SELF_SERVICE_REFUND_WINDOW_DAYS,
    };
  }

  const eligibility = await evaluateRefundEligibilityD1(db, user.id);
  const daysSinceLatestPayment = eligibility.latestPaymentAt
    ? Math.max(0, Math.floor((Date.now() - eligibility.latestPaymentAt) / (1000 * 60 * 60 * 24)))
    : undefined;
  return {
    canRequest: eligibility.eligible,
    code: eligibility.eligible ? "ELIGIBLE" : eligibility.code || "NOT_ELIGIBLE",
    message: eligibility.eligible ? "Refund review is available." : eligibility.message || "This payment is not eligible for refund review.",
    refundWindowDays: SELF_SERVICE_REFUND_WINDOW_DAYS,
    daysSinceLatestPayment,
    paidCreditsUsagePercent: eligibility.paidCreditsUsagePercent,
  };
}

export async function submitRefundRequestForUser(user: AuthUser, reason?: string) {
  const db = await billingDb();
  if (!db) {
    // Refund eligibility depends on payment-scoped ledger history. KV cannot
    // prove the 7-day/20% rule, so policy must fail closed rather than bypass it.
    return { ok: false, code: "BILLING_DB_REQUIRED_FOR_REFUND", reason: "Refund review is temporarily unavailable because the billing database cannot verify eligibility." };
  }
  return submitRefundRequestD1(db, user, reason);
}

export async function submitSubscriptionCancellationForUser(user: AuthUser) {
  const db = await billingDb();
  if (!db) return { ok: false, reason: "D1 billing database is required before changing a Stripe subscription" };
  const account = await ensureD1BillingAccount(db, user);
  if (account.plan === "free") return { ok: false, reason: "No paid subscription on this account" };
  if (account.subscriptionStatus === "canceled" || account.subscriptionStatus === "scheduled_cancel") return { ok: true, duplicate: true, account };
  if (!account.subscriptionId) return { ok: false, reason: "Stripe subscription ID is not available for this account" };

  const stripeResult = await cancelStripeSubscription(account.subscriptionId);
  if (!stripeResult.ok) return { ok: false, reason: stripeResult.message || "Stripe subscription cancellation failed", status: stripeResult.status };

  const now = Date.now();
  const updated: BillingAccount = { ...account, subscriptionStatus: "scheduled_cancel", updatedAt: now };
  const cancellationSourceId = account.subscriptionId;
  const cancellationLedgerId = `subscription_cancel_${cancellationSourceId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  await db.batch([
    db.prepare("UPDATE users SET email = COALESCE(?, email), plan = ?, status = ?, credits_remaining = ?, stripe_customer_id = COALESCE(?, stripe_customer_id), updated_at = ? WHERE id = ?")
      .bind(updated.email || null, updated.plan, updated.subscriptionStatus, updated.creditsRemaining, updated.customerId || null, now, updated.userId),
    db.prepare(`INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_customer_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'scheduled_cancel', NULL, NULL, ?, ?)
      ON CONFLICT(id) DO UPDATE SET status = 'scheduled_cancel', plan = excluded.plan, stripe_customer_id = COALESCE(excluded.stripe_customer_id, subscriptions.stripe_customer_id), updated_at = excluded.updated_at`)
      .bind(account.subscriptionId, updated.userId, account.subscriptionId, updated.customerId || null, updated.plan, now, now),
    db.prepare("INSERT OR IGNORE INTO credit_ledger (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at) VALUES (?, ?, 'subscription_cancel', ?, 0, ?, 'subscription_cancel', ?, ?)")
      .bind(cancellationLedgerId, updated.userId, cancellationSourceId, updated.creditsRemaining, JSON.stringify({ stripe: stripeResult.payload, cancelAtPeriodEnd: true }), now),
  ]);
  return { ok: true, duplicate: false, account: updated, stripe: stripeResult.payload };
}

export async function previewSubscriptionUpgradeForUser(user: AuthUser, targetPlan: BillingPlan) {
  const account = await ensureBillingAccount(user);
  if (!account) return { ok: false as const, code: "ACCOUNT_UNAVAILABLE", message: "Billing account is unavailable." };
  if (!isUpgradeableAccountPlan(account.plan)) return { ok: false as const, code: "NO_PAID_PLAN", message: "Choose a paid plan before upgrading." };
  if (!isActiveSubscriptionStatus(account.subscriptionStatus)) return { ok: false as const, code: "SUBSCRIPTION_NOT_ACTIVE", message: "Only active subscriptions can be upgraded." };
  if (!account.subscriptionId) return { ok: false as const, code: "SUBSCRIPTION_ID_MISSING", message: "Stripe subscription ID is not available for this account yet." };
  if (BILLING_PLAN_ORDER[targetPlan] <= BILLING_PLAN_ORDER[account.plan]) {
    return { ok: false as const, code: "TARGET_PLAN_NOT_HIGHER", message: "Select a higher plan to upgrade." };
  }
  return { ok: true as const, account, preview: await buildProratedUpgradePreview(account, targetPlan) };
}

export async function upgradeSubscriptionForUser(user: AuthUser, targetPlan: BillingPlan) {
  const previewResult = await previewSubscriptionUpgradeForUser(user, targetPlan);
  if (!previewResult.ok) return previewResult;

  const { account, preview } = previewResult;
  const priceId = stripePriceId(targetPlan);
  if (!priceId) return { ok: false as const, code: "STRIPE_PRICE_NOT_CONFIGURED", message: "Target plan is not configured." };

  const stripeResult = await upgradeStripeSubscription(account.subscriptionId!, priceId);
  if (!stripeResult.ok) {
    return { ok: false as const, code: "STRIPE_UPGRADE_FAILED", message: stripeResult.message || "Stripe subscription upgrade failed.", status: stripeResult.status };
  }

  // Stripe's successful invoice payment webhook is the sole credit authority.
  // Do not mutate plan, payment rows, or credits from this request: the
  // subscription update can succeed while its invoice payment later fails.
  return {
    ok: true as const,
    duplicate: false,
    pendingPayment: true,
    account,
    preview,
    stripe: stripeResult.payload,
  };
}

export async function markRefundedAccount(input: RefundStateInput) {
  const db = await billingDb();
  return db ? markRefundedAccountD1(db, input) : { persisted: false, reason: "D1 billing database is required for refund state updates" };
}

function isUpgradeableAccountPlan(plan: BillingAccount["plan"]): plan is BillingPlan {
  return plan === "starter" || plan === "creator" || plan === "studio";
}

function isActiveSubscriptionStatus(status: BillingAccount["subscriptionStatus"]) {
  return status === "active" || status === "trialing" || status === "past_due";
}

async function buildProratedUpgradePreview(account: BillingAccount, targetPlan: BillingPlan): Promise<ProratedUpgradePreview> {
  if (!isUpgradeableAccountPlan(account.plan)) throw new Error("Current plan is not upgradeable.");
  const period = await readCurrentSubscriptionPeriod(account.userId, account.subscriptionId);
  const now = Date.now();
  const periodStart = period?.current_period_start ? Number(period.current_period_start) : undefined;
  const periodEnd = period?.current_period_end ? Number(period.current_period_end) : undefined;
  const fallbackEnd = now + DEFAULT_BILLING_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  const effectiveStart = periodStart && periodStart < now ? periodStart : now;
  const effectiveEnd = periodEnd && periodEnd > now ? periodEnd : fallbackEnd;
  const fullPeriod = Math.max(1, effectiveEnd - effectiveStart);
  const remainingMs = Math.max(0, effectiveEnd - now);
  const remainingRatio = Math.max(0, Math.min(1, remainingMs / fullPeriod));
  const currentCredits = STRIPE_PLAN_CREDITS[account.plan];
  const targetCredits = STRIPE_PLAN_CREDITS[targetPlan];
  const creditsDeltaMonthly = Math.max(0, targetCredits - currentCredits);
  const priceDeltaCents = Math.max(0, STRIPE_PLAN_PRICES_CENTS[targetPlan] - STRIPE_PLAN_PRICES_CENTS[account.plan]);
  const creditsToGrant = creditsDeltaMonthly;
  const nextCreditsBalance = account.creditsRemaining + creditsToGrant;
  return {
    currentPlan: account.plan,
    targetPlan,
    currentCredits,
    targetCredits,
    creditsDeltaMonthly,
    creditsToGrant,
    currentPriceCents: STRIPE_PLAN_PRICES_CENTS[account.plan],
    targetPriceCents: STRIPE_PLAN_PRICES_CENTS[targetPlan],
    priceDeltaCents,
    estimatedProratedChargeCents: Math.max(0, Math.round(priceDeltaCents * remainingRatio)),
    remainingRatio: Math.round(remainingRatio * 10000) / 10000,
    remainingDays: Math.ceil(remainingMs / (24 * 60 * 60 * 1000)),
    periodStart: periodStart || undefined,
    periodEnd: periodEnd || undefined,
    nextCreditsBalance,
  };
}

async function readCurrentSubscriptionPeriod(userId: string, subscriptionId?: string) {
  const db = await billingDb();
  if (!db) return null;
  const row = subscriptionId
    ? await db.prepare("SELECT current_period_start, current_period_end FROM subscriptions WHERE user_id = ? AND (id = ? OR stripe_subscription_id = ?) ORDER BY updated_at DESC LIMIT 1")
      .bind(userId, subscriptionId, subscriptionId)
      .first<{ current_period_start: number | null; current_period_end: number | null }>()
    : await db.prepare("SELECT current_period_start, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1")
      .bind(userId)
      .first<{ current_period_start: number | null; current_period_end: number | null }>();
  return row;
}

async function reconcileExpiredPaidCreditBucketsD1(db: D1Database, userId: string, now = Date.now()) {
  const buckets = await db.prepare(`SELECT id
    FROM credit_buckets
    WHERE user_id = ? AND remaining > 0 AND expires_at <= ?
    ORDER BY expires_at ASC, created_at ASC, id ASC`)
    .bind(userId, now)
    .all<{ id: string }>();

  for (const bucket of buckets.results || []) {
    const row = await db.prepare(`SELECT b.id, b.remaining, u.credits_remaining
      FROM credit_buckets b
      JOIN users u ON u.id = b.user_id
      WHERE b.id = ? AND b.user_id = ? AND b.remaining > 0 AND b.expires_at <= ?`)
      .bind(bucket.id, userId, now)
      .first<{ id: string; remaining: number; credits_remaining: number }>();
    if (!row) continue;
    const before = Math.max(0, Number(row.credits_remaining || 0));
    const expiredPaidRemaining = Math.max(0, Number(row.remaining || 0));
    const { after, ledgerDelta } = calculateExpiredPaidCreditRemoval({ before, expiredPaidRemaining });
    const ledgerId = `stripe_credit_expiry_${row.id}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
    const expiryClaim = crypto.randomUUID();
    const results = await db.batch([
      db.prepare(`UPDATE credit_buckets SET remaining = 0, expiry_claim = ?, updated_at = ?
        WHERE id = ? AND user_id = ? AND remaining = ? AND expires_at <= ? AND expiry_claim IS NULL
          AND EXISTS (SELECT 1 FROM users WHERE id = ? AND credits_remaining = ?)`)
        .bind(expiryClaim, now, row.id, userId, expiredPaidRemaining, now, userId, before),
      db.prepare(`INSERT OR IGNORE INTO credit_ledger
        (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at)
        SELECT ?, ?, 'stripe_credit_expiry', ?, ?, ?, 'Paid credits expired at the end of their Stripe billing period', ?, ?
        FROM credit_buckets
        WHERE id = ? AND user_id = ? AND remaining = 0 AND expiry_claim = ?`)
        .bind(ledgerId, userId, row.id, ledgerDelta, after, JSON.stringify({ bucketId: row.id, expiredPaidRemaining }), now, row.id, userId, expiryClaim),
      db.prepare(`UPDATE users SET credits_remaining = ?, updated_at = ?
        WHERE id = ? AND credits_remaining = ?
          AND EXISTS (SELECT 1 FROM credit_buckets WHERE id = ? AND user_id = ? AND remaining = 0 AND expiry_claim = ?)
          AND EXISTS (SELECT 1 FROM credit_ledger WHERE id = ? AND user_id = ?)`)
        .bind(after, now, userId, before, row.id, userId, expiryClaim, ledgerId, userId),
    ]);
    if (!results[0]?.meta?.changes) {
      const unresolved = await db.prepare("SELECT id FROM credit_buckets WHERE id = ? AND user_id = ? AND remaining > 0 AND expires_at <= ?")
        .bind(row.id, userId, now)
        .first<{ id: string }>();
      if (unresolved) throw new Error("STRIPE_CREDIT_EXPIRY_RECONCILIATION_RETRY");
    }
  }
}

async function ensureD1BillingAccount(db: D1Database, user: AuthUser): Promise<BillingAccount> {
  const now = Date.now();
  const email = user.email.trim().toLowerCase();
  const existing = await readD1Account(db, user.id, email);
  if (!existing) {
    await db.prepare("INSERT INTO users (id, email, plan, status, credits_remaining, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(user.id, email, user.plan || "free", "none", typeof user.creditsRemaining === "number" ? user.creditsRemaining : DEFAULT_LIFETIME_CREDITS, now, now)
      .run();
    await insertCreditLedger(db, user.id, "free_signup", "initial_grant", DEFAULT_LIFETIME_CREDITS, DEFAULT_LIFETIME_CREDITS, "Initial free credits", { email });
    return { userId: user.id, email, plan: user.plan || "free", creditsRemaining: DEFAULT_LIFETIME_CREDITS, subscriptionStatus: "none", createdAt: now, updatedAt: now };
  }

  if (existing.userId !== user.id || existing.email !== email) {
    await db.prepare("UPDATE users SET id = ?, email = ?, updated_at = ? WHERE id = ?")
      .bind(user.id, email, now, existing.userId)
      .run();
    await reconcileExpiredPaidCreditBucketsD1(db, user.id, now);
    return (await readD1Account(db, user.id, email)) || { ...existing, userId: user.id, email, updatedAt: now };
  }
  await reconcileExpiredPaidCreditBucketsD1(db, existing.userId, now);
  return (await readD1Account(db, existing.userId, email)) || existing;
}

async function readD1Account(db: D1Database, userId?: string | null, email?: string | null): Promise<BillingAccount | null> {
  let row: UserRow | null = null;
  if (userId) row = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first<UserRow>();
  if (!row && email) row = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email.trim().toLowerCase()).first<UserRow>();
  if (!row) return null;
  const sub = await db.prepare(`SELECT id, stripe_subscription_id, stripe_customer_id, plan, status, current_period_start, current_period_end
    FROM subscriptions
    WHERE user_id = ?
    ORDER BY
      CASE
        WHEN stripe_subscription_id IS NOT NULL AND status IN ('active', 'trialing', 'past_due', 'scheduled_cancel') THEN 0
        WHEN stripe_subscription_id IS NOT NULL THEN 1
        ELSE 2
      END,
      updated_at DESC
    LIMIT 1`)
    .bind(row.id)
    .first<SubscriptionRow>();
  const refund = await db.prepare("SELECT id FROM refund_requests WHERE user_id = ? AND status IN ('submitted', 'pending', 'refund_requested') ORDER BY requested_at DESC LIMIT 1")
    .bind(row.id)
    .first<{ id: string }>();
  return {
    userId: row.id,
    email: row.email,
    plan: row.plan || "free",
    creditsRemaining: Number(row.credits_remaining || 0),
    subscriptionStatus: row.status || sub?.status || "none",
    subscriptionId: sub?.stripe_subscription_id || undefined,
    customerId: row.stripe_customer_id || sub?.stripe_customer_id || undefined,
    lastRefundRequestId: refund?.id,
    createdAt: Number(row.created_at || Date.now()),
    updatedAt: Number(row.updated_at || Date.now()),
  };
}

async function grantCreditsFromStripeD1(db: D1Database, input: CreditGrantInput) {
  if (!input.eventId || !input.plan || input.credits <= 0) return { persisted: false, duplicate: false, reason: "Missing grant fields" };
  const dedupeKey = webhookDedupeKey(input.eventId);
  const existing = await db.prepare("SELECT processed_status, related_user_id FROM webhook_events WHERE dedupe_key = ?").bind(dedupeKey).first<WebhookRow>();
  if (existing?.processed_status === "processed") {
    const account = existing.related_user_id ? await readD1Account(db, existing.related_user_id) : null;
    return { persisted: true, duplicate: true, account };
  }

  const userId = await resolveD1UserId(db, input);
  if (!userId) {
    await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, null, "failed", "Missing user_id/email/customer mapping", true);
    return { persisted: false, duplicate: false, reason: "Missing user_id/email/customer mapping" };
  }

  const now = Date.now();
  await reconcileExpiredPaidCreditBucketsD1(db, userId, now);
  const current = await readD1Account(db, userId);
  const sameLockedSubscription = Boolean(current?.subscriptionId && input.subscriptionId && current.subscriptionId === input.subscriptionId);
  if (current?.subscriptionStatus === "refund_requested" || current?.subscriptionStatus === "disputed" || (current?.subscriptionStatus === "refunded" && (!input.subscriptionId || sameLockedSubscription))) {
    await recordWebhookEvent(db, input.eventId, input.eventType, { ignored: "account_locked_for_refund", raw: input.rawEvent || input }, userId, "processed", null, true);
    return { persisted: true, duplicate: true, account: current };
  }
  const email = input.email?.trim().toLowerCase() || current?.email || `${userId}@unknown.local`;
  if (!current) {
    await db.prepare("INSERT INTO users (id, email, plan, status, credits_remaining, stripe_customer_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(userId, email, input.plan, "active", DEFAULT_LIFETIME_CREDITS, input.customerId || null, now, now)
      .run();
  }

  const cycleSourceId = grantCycleSourceId(input);
  const cycleGrant = await db.prepare("SELECT id FROM credit_ledger WHERE user_id = ? AND source_type = 'stripe_credit_grant' AND source_id = ?")
    .bind(userId, cycleSourceId)
    .first<{ id: string }>();
  if (cycleGrant) {
    const retryNow = Date.now();
    await upsertSubscription(db, userId, input.plan, "active", input.subscriptionId, input.customerId, retryNow);
    if (hasStripePaymentReference(input)) await upsertPayment(db, userId, input, retryNow);
    await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, userId, "processed", null, true);
    return { persisted: true, duplicate: true, account: await readD1Account(db, userId) };
  }

  const before = current?.creditsRemaining ?? DEFAULT_LIFETIME_CREDITS;
  const activeBuckets = await db.prepare("SELECT COALESCE(SUM(remaining), 0) AS remaining, COUNT(*) AS bucket_count FROM credit_buckets WHERE user_id = ? AND expires_at > ?")
    .bind(userId, now)
    .first<{ remaining: number | null; bucket_count: number }>();
  const bucketPaidRemaining = Number(activeBuckets?.remaining || 0);
  const priorBucket = await db.prepare("SELECT plan, period_start, expires_at FROM credit_buckets WHERE user_id = ? AND expires_at > ? ORDER BY updated_at DESC, created_at DESC LIMIT 1")
    .bind(userId, now)
    .first<{ plan: string; period_start: number; expires_at: number }>();
  const subscriptionPeriod = await db.prepare("SELECT current_period_start, current_period_end FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1")
    .bind(userId)
    .first<{ current_period_start: number | null; current_period_end: number | null }>();
  const bucketPlan = priorBucket && (priorBucket.plan === "starter" || priorBucket.plan === "creator" || priorBucket.plan === "studio")
    ? priorBucket.plan as BillingPlan
    : null;
  const priorPlan = input.previousPlan || bucketPlan;
  const inferredUpgrade = Boolean(priorPlan && BILLING_PLAN_ORDER[input.plan] > BILLING_PLAN_ORDER[priorPlan]);
  const isUpgrade = inferredUpgrade && (input.billingReason === "subscription_update" || Boolean(input.previousPlan));
  if (input.billingReason === "subscription_update" && !isUpgrade) {
    throw new Error("STRIPE_UPGRADE_PREVIOUS_PLAN_AMBIGUOUS");
  }
  const eventPeriodStart = Number(input.periodStart || 0);
  const eventPeriodEnd = Number(input.periodEnd || 0);
  if (!Number.isFinite(eventPeriodStart) || !Number.isFinite(eventPeriodEnd) || eventPeriodStart <= 0 || eventPeriodEnd <= eventPeriodStart) {
    throw new Error("STRIPE_BILLING_PERIOD_REQUIRED");
  }
  const periodDecision = stripeBillingPeriodDecision({
    incomingPeriodStart: eventPeriodStart,
    incomingPeriodEnd: eventPeriodEnd,
    currentPeriodStart: Number(subscriptionPeriod?.current_period_start || priorBucket?.period_start || 0),
    currentPeriodEnd: Math.max(Number(subscriptionPeriod?.current_period_end || 0), Number(priorBucket?.expires_at || 0)),
    hasActivePaidBucket: Number(activeBuckets?.bucket_count || 0) > 0,
    isUpgrade,
  });
  if (periodDecision !== "accept") {
    if (hasStripePaymentReference(input)) await upsertPayment(db, userId, input, now);
    await recordWebhookEvent(db, input.eventId, input.eventType, { ignored: periodDecision, raw: input.rawEvent || input }, userId, "processed", null, true);
    return { persisted: true, duplicate: true, account: await readD1Account(db, userId) };
  }
  const priorPlanCredits = priorPlan ? STRIPE_PLAN_CREDITS[priorPlan] : 0;
  const priorPaidRemaining = inferStripePriorPaidRemaining({
    before,
    bucketRemaining: bucketPaidRemaining,
    priorPlanCredits,
    hasActiveBucket: Number(activeBuckets?.bucket_count || 0) > 0,
  });
  // Paid credits expire at renewal. Preserve legacy/free balance, but replace
  // (never roll over) the previous paid-period remainder. A prorated upgrade
  // preserves the unused current-period balance and adds only the plan delta.
  const { after, ledgerDelta } = calculateStripeCreditReplacement({ before, priorPaidRemaining, priorPlanCredits, targetCredits: input.credits, isUpgrade });
  const bucketRemaining = isUpgrade ? priorPaidRemaining + ledgerDelta : input.credits;
  const periodStart = isUpgrade
    ? priorBucket?.period_start || Number(subscriptionPeriod?.current_period_start || 0) || eventPeriodStart
    : eventPeriodStart;
  const periodEnd = isUpgrade
    ? priorBucket?.expires_at || Number(subscriptionPeriod?.current_period_end || 0) || eventPeriodEnd
    : eventPeriodEnd;
  const bucketId = `bucket_${input.invoiceId || cycleSourceId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  const ledgerId = `stripe_credit_grant_${cycleSourceId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  await db.batch([
    db.prepare("UPDATE credit_buckets SET remaining = 0, expires_at = MIN(expires_at, ?), updated_at = ? WHERE user_id = ? AND expires_at > ? AND NOT EXISTS (SELECT 1 FROM credit_ledger WHERE id = ?)").bind(now, now, userId, now, ledgerId),
    db.prepare("INSERT OR IGNORE INTO credit_buckets (id, user_id, payment_id, subscription_id, plan, granted, remaining, period_start, expires_at, stripe_invoice_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(bucketId, userId, null, input.subscriptionId || null, input.plan, input.credits, bucketRemaining, periodStart, periodEnd, input.invoiceId, now, now),
    db.prepare("UPDATE users SET plan = ?, status = 'active', credits_remaining = ?, stripe_customer_id = COALESCE(?, stripe_customer_id), updated_at = ? WHERE id = ? AND NOT EXISTS (SELECT 1 FROM credit_ledger WHERE id = ?)")
      .bind(input.plan, after, input.customerId || null, now, userId, ledgerId),
    db.prepare("INSERT OR IGNORE INTO credit_ledger (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at) VALUES (?, ?, 'stripe_credit_grant', ?, ?, ?, ?, ?, ?)")
      .bind(ledgerId, userId, cycleSourceId, ledgerDelta, after, input.eventType, JSON.stringify({ eventId: input.eventId, invoiceId: input.invoiceId, billingReason: input.billingReason || null, isUpgrade, priorPlan, periodStart, periodEnd, targetCredits: input.credits, priorPaidRemaining }), now),
  ]);
  await upsertSubscription(db, userId, input.plan, "active", input.subscriptionId, input.customerId, now, periodStart, periodEnd);
  if (hasStripePaymentReference(input)) await upsertPayment(db, userId, input, now);
  await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, userId, "processed", null, true);
  return { persisted: true, duplicate: false, account: await readD1Account(db, userId) };
}

async function debitCreditForUserD1(db: D1Database, user: AuthUser, amount: number, sourceId?: string) {
  const account = await ensureD1BillingAccount(db, user);
  if (creditLockedStatuses.has(account.subscriptionStatus)) {
    return { persisted: true, creditsRemaining: 0, insufficient: true, code: "CREDITS_LOCKED_FOR_REFUND" };
  }
  if (account.creditsRemaining < amount) return { persisted: true, creditsRemaining: account.creditsRemaining, insufficient: true };
  const nextBalance = account.creditsRemaining - amount;
  const now = Date.now();
  const actualSourceId = sourceId || `generation_${crypto.randomUUID()}`;
  const ledgerId = `generation_debit_${actualSourceId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  try {
    const buckets = await db.prepare("SELECT id, remaining FROM credit_buckets WHERE user_id = ? AND remaining > 0 AND expires_at > ? ORDER BY expires_at ASC, created_at ASC, id ASC")
      .bind(user.id, now)
      .all<{ id: string; remaining: number }>();
    let paidToDebit = Math.min(amount, (buckets.results || []).reduce((sum, bucket) => sum + Number(bucket.remaining || 0), 0));
    const bucketDebits: D1PreparedStatement[] = [];
    for (const bucket of buckets.results || []) {
      if (paidToDebit <= 0) break;
      const debit = Math.min(paidToDebit, Number(bucket.remaining || 0));
      paidToDebit -= debit;
      bucketDebits.push(db.prepare("UPDATE credit_buckets SET remaining = remaining - ?, updated_at = ? WHERE id = ? AND remaining >= ? AND EXISTS (SELECT 1 FROM users WHERE id = ? AND credits_remaining >= ?) AND NOT EXISTS (SELECT 1 FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_debit' AND source_id = ?)")
        .bind(debit, now, bucket.id, debit, user.id, amount, user.id, actualSourceId));
    }
    const results = await db.batch([
      db.prepare("UPDATE users SET credits_remaining = credits_remaining - ?, updated_at = ? WHERE id = ? AND credits_remaining >= ? AND NOT EXISTS (SELECT 1 FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_debit' AND source_id = ?)")
        .bind(amount, now, user.id, amount, user.id, actualSourceId),
      ...bucketDebits,
      db.prepare(`INSERT INTO credit_ledger (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at)
        SELECT ?, id, 'generation_debit', ?, ?, credits_remaining, 'AI image generation', ?, ? FROM users WHERE id = ? AND updated_at = ?`)
        .bind(ledgerId, actualSourceId, -amount, JSON.stringify({ amount }), now, user.id, now),
    ]);
    const fresh = await readD1Account(db, user.id);
    if (!results[0]?.meta?.changes || !results[results.length - 1]?.meta?.changes) {
      return { persisted: true, creditsRemaining: fresh?.creditsRemaining ?? 0, insufficient: true };
    }
    return { persisted: true, creditsRemaining: fresh?.creditsRemaining ?? nextBalance, insufficient: false };
  } catch {
    const fresh = await readD1Account(db, user.id);
    return { persisted: false, creditsRemaining: fresh?.creditsRemaining ?? account.creditsRemaining, insufficient: true };
  }
}

async function updateSubscriptionStateD1(db: D1Database, input: SubscriptionStateInput) {
  const dedupeKey = webhookDedupeKey(input.eventId);
  const existing = await db.prepare("SELECT processed_status, related_user_id FROM webhook_events WHERE dedupe_key = ?").bind(dedupeKey).first<WebhookRow>();
  if (existing?.processed_status === "processed") return { persisted: true, duplicate: true, account: existing.related_user_id ? await readD1Account(db, existing.related_user_id) : null };

  const userId = await resolveD1UserId(db, input);
  if (!userId) {
    await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, null, "failed", "Missing user_id/email/customer mapping", true);
    return { persisted: false, reason: "Missing user_id/email/customer mapping" };
  }
  const current = await readD1Account(db, userId);
  const now = Date.now();
  let accountStatus = input.status;
  if (input.status === "canceled" && current?.subscriptionStatus === "refund_requested") {
    accountStatus = "refund_requested";
  }
  const pendingRefund = await db.prepare("SELECT id FROM refund_requests WHERE user_id = ? AND status IN ('submitted', 'pending', 'refund_requested') ORDER BY requested_at DESC LIMIT 1")
    .bind(userId)
    .first<{ id: string }>();
  if (pendingRefund?.id && input.status !== "refunded") {
    accountStatus = "refund_requested";
  }
  if (current?.subscriptionStatus === "refunded" && input.status !== "refunded") {
    const sameSubscription = Boolean(current.subscriptionId && input.subscriptionId && current.subscriptionId === input.subscriptionId);
    if (!input.subscriptionId || sameSubscription) {
      await recordWebhookEvent(db, input.eventId, input.eventType, { ignored: "stale_event_for_refunded_subscription", raw: input.rawEvent || input }, userId, "processed", null, true);
      return { persisted: true, duplicate: true, account: current };
    }
  }
  if (current) {
    await db.prepare("UPDATE users SET plan = COALESCE(?, plan), status = ?, stripe_customer_id = COALESCE(?, stripe_customer_id), updated_at = ? WHERE id = ?")
      .bind(input.plan || null, accountStatus, input.customerId || null, now, userId)
      .run();
  }
  await upsertSubscription(db, userId, input.plan || (current?.plan === "free" ? "starter" : current?.plan) || "starter", input.status, input.subscriptionId, input.customerId, now);
  await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, userId, "processed", null, true);
  return { persisted: true, account: await readD1Account(db, userId) };
}

async function submitRefundRequestD1(db: D1Database, user: AuthUser, reason?: string) {
  const account = await ensureD1BillingAccount(db, user);
  if (account.plan === "free") return { ok: false, reason: "No paid plan on this account" };
  if (account.subscriptionStatus === "refunded") return { ok: false, reason: "This account has already been refunded" };
  if (account.subscriptionStatus === "refund_requested" && account.lastRefundRequestId) {
    const cancellation = await scheduleSubscriptionCancellationForRefundD1(db, account, user.id);
    if (!cancellation.ok) return { ok: false, reason: cancellation.reason, code: cancellation.code, status: cancellation.status };
    return { ok: true, duplicate: true, requestId: account.lastRefundRequestId, account: { ...account, subscriptionStatus: "refund_requested" as const }, subscriptionCanceled: cancellation.scheduled };
  }

  const eligibility = await evaluateRefundEligibilityD1(db, user.id);
  if (!eligibility.eligible) return { ok: false, reason: eligibility.message || "This payment is not eligible for an automatic refund request", code: eligibility.code, eligibility };

  const now = Date.now();
  const requestId = `refund_${now}_${crypto.randomUUID()}`;
  const subscription = await db.prepare("SELECT id FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1").bind(user.id).first<{ id: string }>();
  const initialRefundPaymentId = eligibility.latestPaymentId || null;
  await db.prepare("INSERT INTO refund_requests (id, user_id, payment_id, subscription_id, status, reason, credits_at_request, amount_cents, currency, requested_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(requestId, user.id, initialRefundPaymentId, subscription?.id || null, "submitted", reason?.trim().slice(0, 1000) || null, account.creditsRemaining, eligibility.amountCents || null, eligibility.currency || "USD", now, JSON.stringify({ email: user.email, plan: account.plan, subscriptionStatus: account.subscriptionStatus, eligibility, refundPaymentId: initialRefundPaymentId }))
    .run();
  await db.prepare("UPDATE users SET status = 'refund_requested', updated_at = ? WHERE id = ?").bind(now, user.id).run();

  const cancellation = await scheduleSubscriptionCancellationForRefundD1(db, { ...account, subscriptionStatus: "refund_requested" }, user.id);
  const refundPaymentId = extractCancellationTransactionId(cancellation) || initialRefundPaymentId;
  await db.prepare("UPDATE refund_requests SET payment_id = COALESCE(?, payment_id), metadata_json = ? WHERE id = ?")
    .bind(refundPaymentId || null, JSON.stringify({ email: user.email, plan: account.plan, subscriptionStatus: account.subscriptionStatus, eligibility, refundPaymentId, subscriptionCancellation: cancellation }), requestId)
    .run();
  await insertCreditLedger(db, user.id, "refund_request", requestId, 0, account.creditsRemaining, "User requested refund; future subscription renewal cancellation attempted before manual/provider refund", { reason: reason?.trim().slice(0, 1000) || null, eligibility, subscriptionCancellation: cancellation });
  return { ok: true, duplicate: false, requestId, account: { ...account, subscriptionStatus: "refund_requested" as const, lastRefundRequestId: requestId, updatedAt: now }, subscriptionCanceled: cancellation.ok ? cancellation.scheduled : false, cancellationError: cancellation.ok ? undefined : cancellation.reason };
}

async function scheduleSubscriptionCancellationForRefundD1(db: D1Database, account: BillingAccount, userId: string) {
  const activeStatuses = new Set(["active", "trialing", "past_due", "paused", "refund_requested"]);
  const subscription = await db.prepare("SELECT id, stripe_subscription_id, stripe_customer_id, status FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1")
    .bind(userId)
    .first<SubscriptionRow>();
  const subscriptionId = account.subscriptionId || subscription?.stripe_subscription_id;
  const currentStatus = account.subscriptionStatus || subscription?.status;
  if (!subscriptionId || !activeStatuses.has(currentStatus || "")) return { ok: true as const, scheduled: false, reason: "No active Stripe subscription renewal to cancel" };

  const stripeResult = await cancelStripeSubscription(subscriptionId);
  if (!stripeResult.ok) {
    return {
      ok: false as const,
      scheduled: false,
      code: "STRIPE_SUBSCRIPTION_CANCEL_FAILED",
      status: stripeResult.status,
      reason: stripeResult.message || "Stripe subscription cancellation failed before refund request. Please use Manage billing or contact support.",
    };
  }

  const now = Date.now();
  await upsertSubscription(db, userId, account.plan === "free" ? "starter" : account.plan, "scheduled_cancel", subscriptionId, account.customerId || subscription?.stripe_customer_id, now);
  await insertCreditLedger(db, userId, "subscription_cancel_for_refund", `cancel_for_refund_${now}`, 0, account.creditsRemaining, "Future subscription renewal canceled before refund review", { stripe: stripeResult.payload, subscriptionId, cancelAtPeriodEnd: true });
  return { ok: true as const, scheduled: true, stripe: stripeResult.payload };
}

function extractCancellationTransactionId(cancellation: { stripe?: unknown }) {
  const payload = cancellation.stripe;
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const direct = stringRecordValue(record.last_transaction_id || record.lastTransactionId || record.transaction_id || record.transactionId || record.transaction);
  if (direct) return direct;
  const last = record.last_transaction || record.lastTransaction;
  if (last && typeof last === "object") {
    const lastRecord = last as Record<string, unknown>;
    return stringRecordValue(lastRecord.id || lastRecord.transaction_id || lastRecord.transactionId || lastRecord.transaction);
  }
  return null;
}

function stringRecordValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function evaluateRefundEligibilityD1(db: D1Database, userId: string): Promise<RefundEligibility> {
  const payment = await db.prepare("SELECT id, stripe_invoice_id, amount_cents, currency, paid_at, created_at FROM payments WHERE user_id = ? AND status = 'paid' ORDER BY COALESCE(paid_at, created_at) DESC LIMIT 1")
    .bind(userId)
    .first<{ id: string; stripe_invoice_id: string | null; amount_cents: number; currency: string; paid_at: number | null; created_at: number }>();
  const paymentAt = payment ? Number(payment.paid_at || payment.created_at) : 0;
  const bucket = payment ? await db.prepare(`SELECT granted, remaining, period_start, expires_at FROM credit_buckets
      WHERE user_id = ? AND (payment_id = ? OR stripe_invoice_id = ?) AND period_start <= ?
      ORDER BY period_start DESC LIMIT 1`)
    .bind(userId, payment.id, payment.stripe_invoice_id, Date.now())
    .first<{ granted: number; remaining: number; period_start: number; expires_at: number }>() : null;
  // Compatibility for subscriptions paid before bucket migration is scoped to
  // this target payment/current period, never the account's lifetime ledger.
  const legacy = !bucket && payment ? await db.prepare(`SELECT
      COALESCE(SUM(CASE WHEN source_type = 'stripe_credit_grant' AND delta > 0 THEN delta ELSE 0 END), 0) AS granted,
      COALESCE(SUM(CASE WHEN source_type = 'generation_debit' AND delta < 0 THEN -delta WHEN source_type = 'generation_refund' AND delta > 0 THEN delta ELSE 0 END), 0) AS used
      FROM credit_ledger WHERE user_id = ? AND created_at >= ?`)
    .bind(userId, paymentAt)
    .first<{ granted: number | null; used: number | null }>() : null;
  const paidGranted = bucket ? Number(bucket.granted) : Number(legacy?.granted || 0);
  const paidCreditsConsumed = bucket ? Math.max(0, Number(bucket.granted) - Number(bucket.remaining)) : Math.max(0, Number(legacy?.used || 0));
  const periodStart = bucket ? Number(bucket.period_start) : paymentAt;
  const base: RefundEligibility = {
    eligible: false,
    paidGranted,
    paidCreditsConsumed,
    paidCreditsUsagePercent: paidGranted > 0 ? Math.round((paidCreditsConsumed / paidGranted) * 10000) / 100 : 0,
    latestPaymentId: payment?.id,
    latestPaymentAt: payment ? Number(payment.paid_at || payment.created_at) : undefined,
    amountCents: payment ? Number(payment.amount_cents || 0) : undefined,
    currency: payment?.currency || "USD",
  };
  if (!payment) return { ...base, code: "NO_PAID_PAYMENT", message: "No paid payment record was found for this account." };
  if (!payment.amount_cents || Number(payment.amount_cents) <= 0) return { ...base, code: "PAYMENT_AMOUNT_UNVERIFIED", message: "Payment amount is not verified yet. Please contact support for manual review." };
  const ageDays = paymentAt > 0 ? (Date.now() - Math.max(paymentAt, periodStart)) / (1000 * 60 * 60 * 24) : Number.POSITIVE_INFINITY;
  if (ageDays > SELF_SERVICE_REFUND_WINDOW_DAYS) return { ...base, code: "REFUND_WINDOW_EXPIRED", message: "Refund requests are available within 7 days of payment." };
  if (paidGranted <= 0) return { ...base, code: "NO_PAID_CREDITS", message: "No paid credits were found for this billing period." };
  if (paidCreditsConsumed > paidGranted * SELF_SERVICE_REFUND_MAX_PAID_CREDIT_USAGE) {
    return { ...base, code: "PAID_CREDITS_OVER_20_PERCENT_USED", message: "Refund requests are available only when no more than 20% of paid credits have been used." };
  }
  return { ...base, eligible: true };
}

async function markRefundedAccountD1(db: D1Database, input: RefundStateInput) {
  const userId = await resolveD1UserId(db, input);
  if (!userId) {
    await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, null, "failed", "Missing user_id/email/customer mapping", true);
    return { persisted: false, reason: "Missing user_id/email/customer mapping" };
  }
  if (!input.refundId?.startsWith("re_")) {
    await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, userId, "failed", "Missing canonical Stripe refund ID", true);
    return { persisted: false, reason: "Missing canonical Stripe refund ID" };
  }

  const existingRevoke = await db.prepare("SELECT id FROM credit_ledger WHERE user_id = ? AND source_type = 'refund_paid_credit_revoke' AND source_id = ?")
    .bind(userId, input.refundId)
    .first<{ id: string }>();

  const account = await readD1Account(db, userId);
  if (!account) return { persisted: false, reason: "Billing account not found" };
  const refundRequest = await db.prepare("SELECT id, payment_id, subscription_id FROM refund_requests WHERE user_id = ? AND status IN ('submitted', 'pending', 'refund_requested', 'refunded') ORDER BY requested_at DESC LIMIT 1")
    .bind(userId)
    .first<{ id: string; payment_id: string | null; subscription_id: string | null }>();
  const now = Date.now();
  const freeBalance = await calculateFreeCreditRefundBalanceD1(db, userId);
  const preservedFreeCredits = Math.max(0, Math.min(DEFAULT_LIFETIME_CREDITS, account.creditsRemaining, freeBalance.freeCreditsRemaining));
  const revoked = Math.max(0, account.creditsRemaining - preservedFreeCredits);

  const ledgerId = `refund_paid_credit_revoke_${input.refundId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  const webhookId = `wh_${input.eventId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  await db.batch([
    db.prepare("UPDATE users SET plan = 'free', status = 'refunded', credits_remaining = ?, updated_at = ? WHERE id = ?").bind(preservedFreeCredits, now, userId),
    ...(refundRequest?.payment_id ? [db.prepare("UPDATE payments SET status = 'refunded', updated_at = ? WHERE id = ? AND user_id = ?").bind(now, refundRequest.payment_id, userId)] : []),
    ...(refundRequest?.id ? [db.prepare("UPDATE refund_requests SET status = 'refunded', stripe_refund_id = ?, amount_cents = COALESCE(?, amount_cents), currency = COALESCE(?, currency), resolved_at = ?, metadata_json = json_patch(COALESCE(metadata_json, '{}'), ?) WHERE id = ?").bind(input.refundId, input.amountCents ?? null, input.currency || null, now, JSON.stringify({ stripeRefundEventId: input.eventId, stripeRefundId: input.refundId, actualRefundAmountCents: input.amountCents ?? null }), refundRequest.id)] : []),
    db.prepare("UPDATE subscriptions SET status = 'refunded', canceled_at = COALESCE(canceled_at, ?), updated_at = ? WHERE user_id = ? AND status IN ('active', 'trialing', 'past_due', 'paused', 'scheduled_cancel', 'refund_requested')").bind(now, now, userId),
    db.prepare("INSERT OR IGNORE INTO credit_ledger (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at) VALUES (?, ?, 'refund_paid_credit_revoke', ?, ?, ?, ?, ?, ?)").bind(ledgerId, userId, input.refundId, -revoked, preservedFreeCredits, "Stripe refund confirmed; paid credits revoked and unused free signup credits preserved", JSON.stringify({ eventId: input.eventId, eventType: input.eventType, refundId: input.refundId, actualRefundAmountCents: input.amountCents ?? null, preservedFreeCredits, ...freeBalance }), now),
    db.prepare(`INSERT INTO webhook_events (id, provider, event_type, provider_event_id, dedupe_key, related_user_id, payload_json, signature_verified, processed_status, processed_at, error_message, created_at)
      VALUES (?, 'stripe', ?, ?, ?, ?, ?, 1, 'processed', ?, NULL, ?)
      ON CONFLICT(dedupe_key) DO UPDATE SET related_user_id = COALESCE(excluded.related_user_id, webhook_events.related_user_id), processed_status = 'processed', processed_at = excluded.processed_at, error_message = NULL`).bind(webhookId, input.eventType, input.eventId, webhookDedupeKey(input.eventId), userId, JSON.stringify(input.rawEvent || input), now, now),
  ]);
  return { persisted: true, duplicate: Boolean(existingRevoke), account: { ...account, plan: "free" as const, subscriptionStatus: "refunded" as const, creditsRemaining: preservedFreeCredits, updatedAt: now } };
}

async function calculateFreeCreditRefundBalanceD1(db: D1Database, userId: string): Promise<FreeCreditRefundBalance> {
  const row = await db.prepare(`SELECT
      COALESCE(SUM(CASE WHEN source_type = 'stripe_credit_grant' AND delta > 0 THEN delta ELSE 0 END), 0) AS paid_granted,
      COALESCE(SUM(CASE WHEN source_type IN ('free_signup', 'manual_free_signup_restore_after_refund') AND delta > 0 THEN delta ELSE 0 END), 0) AS free_granted,
      COALESCE(SUM(CASE WHEN source_type = 'generation_debit' AND delta < 0 THEN -delta ELSE 0 END), 0) AS generation_debited,
      COALESCE(SUM(CASE WHEN source_type = 'generation_refund' AND delta > 0 THEN delta ELSE 0 END), 0) AS generation_refunded
    FROM credit_ledger
    WHERE user_id = ?`)
    .bind(userId)
    .first<{ paid_granted: number | null; free_granted: number | null; generation_debited: number | null; generation_refunded: number | null }>();

  const paidGranted = Number(row?.paid_granted || 0);
  const freeGranted = Math.min(DEFAULT_LIFETIME_CREDITS, Number(row?.free_granted || 0));
  const generationDebited = Number(row?.generation_debited || 0);
  const generationRefunded = Number(row?.generation_refunded || 0);
  const netGenerationDebits = Math.max(0, generationDebited - generationRefunded);
  const freeCreditsConsumed = Math.min(freeGranted, netGenerationDebits);
  const paidCreditsConsumedFirst = Math.min(paidGranted, Math.max(0, netGenerationDebits - freeGranted));
  const freeCreditsRemaining = Math.max(0, freeGranted - freeCreditsConsumed);

  return {
    paidGranted,
    generationDebited,
    generationRefunded,
    paidCreditsConsumedFirst,
    freeCreditsConsumed,
    freeCreditsRemaining,
  };
}

async function resolveD1UserId(db: D1Database, input: {
  userId?: string | null;
  email?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  checkoutId?: string | null;
  transactionId?: string | null;
  invoiceId?: string | null;
}) {
  if (input.userId) return input.userId;
  if (input.email) {
    const row = await db.prepare("SELECT id FROM users WHERE email = ?").bind(input.email.trim().toLowerCase()).first<{ id: string }>();
    if (row?.id) return row.id;
  }
  if (input.customerId) {
    const row = await db.prepare("SELECT id FROM users WHERE stripe_customer_id = ?").bind(input.customerId).first<{ id: string }>();
    if (row?.id) return row.id;
  }
  if (input.subscriptionId) {
    const row = await db.prepare("SELECT user_id AS id FROM subscriptions WHERE id = ? OR stripe_subscription_id = ? ORDER BY updated_at DESC LIMIT 1")
      .bind(input.subscriptionId, input.subscriptionId)
      .first<{ id: string }>();
    if (row?.id) return row.id;
  }
  const paymentIds = [input.transactionId, input.checkoutId, input.invoiceId].filter((value): value is string => Boolean(value));
  for (const paymentId of paymentIds) {
    const row = await db.prepare("SELECT user_id AS id FROM payments WHERE id = ? OR stripe_transaction_id = ? OR stripe_checkout_id = ? OR stripe_invoice_id = ? ORDER BY updated_at DESC LIMIT 1")
      .bind(paymentId, paymentId, paymentId, paymentId)
      .first<{ id: string }>();
    if (row?.id) return row.id;
  }
  return null;
}

async function upsertSubscription(db: D1Database, userId: string, plan: BillingPlan, status: BillingAccount["subscriptionStatus"], subscriptionId?: string | null, customerId?: string | null, now = Date.now(), periodStart?: number | null, periodEnd?: number | null) {
  if (!subscriptionId && !customerId) return;
  const id = subscriptionId || `sub_${userId}_${customerId}`;
  await db.prepare(`INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_customer_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET stripe_subscription_id = excluded.stripe_subscription_id, stripe_customer_id = excluded.stripe_customer_id, plan = excluded.plan, status = excluded.status, current_period_start = COALESCE(excluded.current_period_start, subscriptions.current_period_start), current_period_end = COALESCE(excluded.current_period_end, subscriptions.current_period_end), updated_at = excluded.updated_at`)
    .bind(id, userId, subscriptionId || null, customerId || null, plan, status, periodStart || null, periodEnd || null, now, now)
    .run();
}

// Retained for compatibility with existing persisted upgrade payload parsing.
// Credits are no longer granted by the upgrade endpoint.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function upsertUpgradePayment(db: D1Database, userId: string, subscriptionId: string | null, plan: BillingPlan, sourceId: string, preview: ProratedUpgradePreview, stripePayload: unknown, now = Date.now()) {
  const payment = extractStripeUpgradePayment(stripePayload);
  const paymentId = payment.transactionId || payment.invoiceId || `subscription_upgrade_${sourceId}`;
  const amountCents = payment.amountCents ?? preview.estimatedProratedChargeCents;
  await db.prepare(`INSERT INTO payments (id, user_id, subscription_id, stripe_checkout_id, stripe_transaction_id, stripe_invoice_id, plan, status, currency, amount_cents, raw_event_id, paid_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = 'paid',
      plan = excluded.plan,
      subscription_id = COALESCE(excluded.subscription_id, payments.subscription_id),
      stripe_checkout_id = COALESCE(excluded.stripe_checkout_id, payments.stripe_checkout_id),
      stripe_transaction_id = COALESCE(excluded.stripe_transaction_id, payments.stripe_transaction_id),
      stripe_invoice_id = COALESCE(excluded.stripe_invoice_id, payments.stripe_invoice_id),
      currency = COALESCE(excluded.currency, payments.currency),
      amount_cents = CASE WHEN excluded.amount_cents > 0 THEN excluded.amount_cents ELSE payments.amount_cents END,
      raw_event_id = excluded.raw_event_id,
      paid_at = COALESCE(payments.paid_at, excluded.paid_at),
      updated_at = excluded.updated_at`)
    .bind(paymentId, userId, subscriptionId, payment.checkoutId || null, payment.transactionId || null, payment.invoiceId || null, plan, payment.currency || "USD", amountCents, `subscription_upgrade_${sourceId}`, now, now, now)
    .run();
}

function extractStripeUpgradePayment(payload: unknown): { transactionId?: string; invoiceId?: string; checkoutId?: string; amountCents?: number; currency?: string } {
  const matches: Record<string, unknown>[] = [];
  collectRecords(payload, matches, 0);
  const transactionId = firstString(matches, ["transaction_id", "transactionId", "last_transaction_id", "lastTransactionId", "payment_id", "paymentId", "order_id", "orderId"])
    || idFromNamedRecord(matches, ["transaction", "last_transaction", "payment", "order"]);
  const invoiceId = firstString(matches, ["invoice_id", "invoiceId"])
    || idFromNamedRecord(matches, ["invoice"]);
  const checkoutId = firstString(matches, ["checkout_id", "checkoutId"])
    || idFromNamedRecord(matches, ["checkout"]);
  const amountCents = firstAmountCents(matches, ["amount_cents", "amountCents", "total_cents", "totalCents", "amount_paid_cents", "amountPaidCents", "prorated_amount_cents", "proratedAmountCents"])
    ?? firstAmountDollars(matches, ["amount", "total", "total_amount", "totalAmount", "amount_paid", "amountPaid", "prorated_amount", "proratedAmount"]);
  const currency = (firstString(matches, ["currency", "currency_code", "currencyCode"]) || "USD").toUpperCase();
  return { transactionId: transactionId || undefined, invoiceId: invoiceId || undefined, checkoutId: checkoutId || undefined, amountCents, currency };
}

function collectRecords(value: unknown, output: Record<string, unknown>[], depth: number) {
  if (!value || typeof value !== "object" || depth > 4) return;
  if (Array.isArray(value)) {
    for (const item of value) collectRecords(item, output, depth + 1);
    return;
  }
  const record = value as Record<string, unknown>;
  output.push(record);
  for (const nested of Object.values(record)) collectRecords(nested, output, depth + 1);
}

function firstString(records: Record<string, unknown>[], keys: string[]) {
  for (const record of records) {
    for (const key of keys) {
      const value = stringRecordValue(record[key]);
      if (value) return value;
    }
  }
  return null;
}

function idFromNamedRecord(records: Record<string, unknown>[], names: string[]) {
  for (const record of records) {
    for (const name of names) {
      const camel = toCamelCase(name);
      const nested = record[name] || record[camel];
      if (nested && typeof nested === "object") {
        const nestedRecord = nested as Record<string, unknown>;
        const id = stringRecordValue(nestedRecord.id || nestedRecord[`${name}_id`] || nestedRecord[`${camel}Id`]);
        if (id) return id;
      }
    }
  }
  return null;
}

function firstAmountCents(records: Record<string, unknown>[], keys: string[]) {
  for (const record of records) {
    for (const key of keys) {
      const amount = numberRecordValue(record[key]);
      if (typeof amount === "number" && amount > 0) return Math.round(amount);
    }
  }
  return undefined;
}

function firstAmountDollars(records: Record<string, unknown>[], keys: string[]) {
  for (const record of records) {
    for (const key of keys) {
      const amount = numberRecordValue(record[key]);
      if (typeof amount === "number" && amount > 0) return amount > 1000 ? Math.round(amount) : Math.round(amount * 100);
    }
  }
  return undefined;
}

function numberRecordValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toCamelCase(value: string) {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function hasStripePaymentReference(input: CreditGrantInput) {
  return Boolean(input.transactionId || input.checkoutId || input.invoiceId);
}

async function upsertPayment(db: D1Database, userId: string, input: CreditGrantInput, now = Date.now()) {
  const paymentId = input.transactionId || input.checkoutId || input.invoiceId || `${input.eventId}_payment`;
  await db.prepare(`INSERT INTO payments (id, user_id, subscription_id, stripe_checkout_id, stripe_transaction_id, stripe_invoice_id, plan, status, currency, amount_cents, raw_event_id, paid_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = 'paid',
      plan = excluded.plan,
      subscription_id = COALESCE(excluded.subscription_id, payments.subscription_id),
      stripe_checkout_id = COALESCE(excluded.stripe_checkout_id, payments.stripe_checkout_id),
      stripe_transaction_id = COALESCE(excluded.stripe_transaction_id, payments.stripe_transaction_id),
      stripe_invoice_id = COALESCE(excluded.stripe_invoice_id, payments.stripe_invoice_id),
      currency = COALESCE(excluded.currency, payments.currency),
      amount_cents = CASE WHEN excluded.amount_cents > 0 THEN excluded.amount_cents ELSE payments.amount_cents END,
      raw_event_id = excluded.raw_event_id,
      paid_at = COALESCE(payments.paid_at, excluded.paid_at),
      updated_at = excluded.updated_at`)
    .bind(paymentId, userId, input.subscriptionId || null, input.checkoutId || null, input.transactionId || null, input.invoiceId || null, input.plan, input.currency || "USD", input.amountCents || 0, input.eventId, now, now, now)
    .run();
}

async function insertCreditLedger(db: D1Database, userId: string, sourceType: string, sourceId: string, delta: number, balanceAfter: number, reason: string, metadata?: unknown) {
  const id = `${sourceType}_${sourceId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  await db.prepare("INSERT OR IGNORE INTO credit_ledger (id, user_id, source_type, source_id, delta, balance_after, reason, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, userId, sourceType, sourceId, delta, balanceAfter, reason, metadata ? JSON.stringify(metadata) : null, Date.now())
    .run();
}

async function recordWebhookEvent(db: D1Database, eventId: string, eventType: string, payload: unknown, userId: string | null, status: "processed" | "failed" | "received", errorMessage: string | null, signatureVerified: boolean) {
  const now = Date.now();
  const id = `wh_${eventId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  await db.prepare(`INSERT INTO webhook_events (id, provider, event_type, provider_event_id, dedupe_key, related_user_id, payload_json, signature_verified, processed_status, processed_at, error_message, created_at)
    VALUES (?, 'stripe', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(dedupe_key) DO UPDATE SET related_user_id = COALESCE(excluded.related_user_id, webhook_events.related_user_id), processed_status = excluded.processed_status, processed_at = excluded.processed_at, error_message = excluded.error_message`)
    .bind(id, eventType, eventId, webhookDedupeKey(eventId), userId, JSON.stringify(payload), signatureVerified ? 1 : 0, status, status === "received" ? null : now, errorMessage, now)
    .run();
}

function grantCycleSourceId(input: CreditGrantInput) {
  return stripeCreditGrantSourceId(input);
}

function webhookDedupeKey(eventId: string) {
  return `stripe:${eventId}`;
}
