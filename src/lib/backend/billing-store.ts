import type { AuthUser } from "@/lib/backend/auth";
import { DEFAULT_LIFETIME_CREDITS } from "@/lib/backend/session";
import type { BillingPlan } from "@/lib/backend/creem";
import { cancelCreemSubscription, lookupCreemRefundStatus } from "@/lib/backend/creem";
import { billingDb, billingKv } from "@/lib/backend/cloudflare";

export type BillingAccount = {
  userId: string;
  email?: string;
  plan: "free" | BillingPlan;
  creditsRemaining: number;
  creditsHeld?: number;
  subscriptionStatus: "none" | "active" | "trialing" | "paused" | "scheduled_cancel" | "canceled" | "past_due" | "expired" | "refund_requested" | "refunded" | "disputed";
  subscriptionId?: string;
  customerId?: string;
  lastCreemEventId?: string;
  lastRefundRequestId?: string;
  updatedAt: number;
  createdAt: number;
};

const creditLockedStatuses = new Set<BillingAccount["subscriptionStatus"]>(["refund_requested", "refunded", "disputed"]);
const SELF_SERVICE_REFUND_WINDOW_DAYS = 7;
const SELF_SERVICE_REFUND_MAX_PAID_CREDIT_USAGE = 0.2;

function publicBillingAccount(account: BillingAccount): BillingAccount {
  if (account.subscriptionStatus === "refunded") {
    return {
      ...account,
      plan: "free",
      creditsHeld: undefined,
      creditsRemaining: 0,
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
};

type KV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number; metadata?: unknown }): Promise<void>;
};

type UserRow = {
  id: string;
  email: string;
  plan: BillingAccount["plan"];
  status: BillingAccount["subscriptionStatus"];
  credits_remaining: number;
  creem_customer_id: string | null;
  created_at: number;
  updated_at: number;
};

type SubscriptionRow = {
  id: string;
  creem_subscription_id: string | null;
  creem_customer_id: string | null;
  status: BillingAccount["subscriptionStatus"];
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
  if (db) return ensureD1BillingAccount(db, user);

  const kv = await billingKv();
  if (!kv) return null;
  const existing = await readAccountByUserId(user.id, kv);
  if (existing) {
    if (existing.email !== user.email) {
      const updated = { ...existing, email: user.email, updatedAt: Date.now() };
      await writeAccount(updated, kv);
      await kv.put(emailKey(user.email), user.id);
      return updated;
    }
    return existing;
  }
  const created: BillingAccount = {
    userId: user.id,
    email: user.email,
    plan: user.plan || "free",
    creditsRemaining: typeof user.creditsRemaining === "number" ? user.creditsRemaining : DEFAULT_LIFETIME_CREDITS,
    subscriptionStatus: "none",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await writeAccount(created, kv);
  await kv.put(emailKey(user.email), user.id);
  return created;
}

export async function accountForPublicUser(user: AuthUser) {
  const account = await ensureBillingAccount(user);
  const pendingRefund = await pendingRefundRequestForUser(user.id);
  if (account?.subscriptionStatus === "refund_requested" || pendingRefund) {
    const reconciled = await reconcilePendingCreemRefund(user.id);
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

export async function hasRecentPendingCheckout(userId: string, windowMs = 30 * 60 * 1000) {
  const db = await billingDb();
  if (!db) return false;
  const since = Date.now() - windowMs;
  const row = await db.prepare(`SELECT pending.id
    FROM payments pending
    WHERE pending.user_id = ?
      AND pending.status = 'checkout_pending'
      AND pending.created_at >= ?
      AND NOT EXISTS (
        SELECT 1
        FROM payments completed
        WHERE completed.user_id = pending.user_id
          AND completed.id != pending.id
          AND completed.creem_checkout_id = pending.creem_checkout_id
          AND completed.status IN ('paid', 'refunded', 'canceled', 'expired', 'disputed')
      )
    ORDER BY pending.created_at DESC
    LIMIT 1`)
    .bind(userId, since)
    .first<{ id: string }>();
  return Boolean(row?.id);
}

export async function recordPendingCheckoutForUser(input: { userId: string; plan: BillingPlan; checkoutId: string; amountCents?: number | null; currency?: string | null }) {
  const db = await billingDb();
  if (!db || !input.checkoutId) return { persisted: false };
  const now = Date.now();
  await db.prepare(`INSERT INTO payments (id, user_id, subscription_id, creem_checkout_id, creem_transaction_id, creem_invoice_id, plan, status, currency, amount_cents, raw_event_id, paid_at, created_at, updated_at)
    VALUES (?, ?, NULL, ?, NULL, NULL, ?, 'checkout_pending', ?, ?, ?, NULL, ?, ?)
    ON CONFLICT(id) DO UPDATE SET status = payments.status, updated_at = excluded.updated_at`)
    .bind(input.checkoutId, input.userId, input.checkoutId, input.plan, input.currency || "USD", input.amountCents || 0, `checkout_started_${input.checkoutId}`, now, now)
    .run();
  return { persisted: true };
}

export async function reconcilePendingCreemRefund(userId: string) {
  const db = await billingDb();
  if (!db || !process.env.CREEM_API_KEY) return null;
  const pending = await db.prepare(`SELECT
      rr.id AS refund_request_id,
      rr.payment_id AS refund_payment_id,
      rr.subscription_id AS refund_subscription_id,
      p.id AS payment_id,
      p.creem_transaction_id,
      p.creem_checkout_id,
      p.creem_invoice_id,
      p.subscription_id AS payment_subscription_id
    FROM refund_requests rr
    LEFT JOIN payments p ON p.user_id = rr.user_id AND (p.id = rr.payment_id OR p.creem_transaction_id = rr.payment_id OR p.subscription_id = rr.subscription_id)
    WHERE rr.user_id = ? AND rr.status IN ('submitted', 'pending', 'refund_requested')
    ORDER BY rr.requested_at DESC, p.created_at DESC
    LIMIT 1`)
    .bind(userId)
    .first<{ refund_request_id: string; refund_payment_id: string | null; refund_subscription_id: string | null; payment_id: string | null; creem_transaction_id: string | null; creem_checkout_id: string | null; creem_invoice_id: string | null; payment_subscription_id: string | null }>();
  if (!pending?.refund_request_id) return null;

  const lookup = await lookupCreemRefundStatus({
    paymentId: pending.refund_payment_id || pending.payment_id,
    transactionId: pending.creem_transaction_id || pending.refund_payment_id,
    checkoutId: pending.creem_checkout_id,
    invoiceId: pending.creem_invoice_id,
    subscriptionId: pending.refund_subscription_id || pending.payment_subscription_id,
  });
  if (!lookup.refunded) return null;

  const eventId = `creem_reconcile_refund_${Date.now()}_${pending.refund_request_id}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180);
  const result = await markRefundedAccountD1(db, {
    eventId,
    eventType: "refund.created",
    userId,
    subscriptionId: pending.refund_subscription_id || pending.payment_subscription_id,
    transactionId: pending.creem_transaction_id || pending.refund_payment_id || pending.payment_id,
    checkoutId: pending.creem_checkout_id,
    invoiceId: pending.creem_invoice_id,
    refundId: lookup.refundId || eventId,
    rawEvent: { source: "creem_api_reconciliation", lookup: { source: lookup.source, resourceId: lookup.resourceId, status: lookup.status, refundId: lookup.refundId } },
  });
  if (result.persisted) {
    await recordWebhookEvent(db, eventId, "creem.reconcile_refund", { source: "creem_api_reconciliation", lookup: { source: lookup.source, resourceId: lookup.resourceId, status: lookup.status, refundId: lookup.refundId } }, userId, "processed", null, true);
  }
  return result.account || null;
}

export async function reconcileAllPendingCreemRefunds(limit = 20) {
  const db = await billingDb();
  if (!db || !process.env.CREEM_API_KEY) return { ok: false, reason: "missing_db_or_creem_api_key", checked: 0, reconciled: 0 };
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
      const result = await reconcilePendingCreemRefund(row.user_id);
      if (result?.subscriptionStatus === "refunded") reconciled += 1;
    } catch (error) {
      errors.push({ userId: row.user_id, message: error instanceof Error ? error.message : String(error) });
    }
  }
  return { ok: true, checked, reconciled, errors };
}

export async function grantCreditsFromCreem(input: CreditGrantInput) {
  const db = await billingDb();
  if (db) return grantCreditsFromCreemD1(db, input);

  const kv = await billingKv();
  if (!kv) return { persisted: false, duplicate: false, reason: "No D1 DB or BILLING_KV binding" };
  if (!input.eventId || !input.plan || input.credits <= 0) return { persisted: false, duplicate: false, reason: "Missing grant fields" };

  const eventKeyName = eventKey(input.eventId);
  const existingEvent = await kv.get(eventKeyName);
  if (existingEvent) return { persisted: true, duplicate: true, account: null };

  const userId = input.userId || (input.email ? await kv.get(emailKey(input.email)) : null);
  if (!userId) {
    await kv.put(eventKeyName, JSON.stringify({ ...eventRecord(input), persisted: false, reason: "Missing user_id/email mapping" }));
    return { persisted: false, duplicate: false, reason: "Missing user_id/email mapping" };
  }

  const current = await readAccountByUserId(userId, kv);
  const cycleKeyName = grantCycleKey(userId, input.subscriptionId || input.customerId || input.plan);
  const existingCycleGrant = await kv.get(cycleKeyName);
  if (existingCycleGrant) {
    await kv.put(eventKeyName, JSON.stringify({ ...eventRecord(input), persisted: true, duplicateGrant: true, accountUserId: userId, at: Date.now() }));
    return { persisted: true, duplicate: true, account: current };
  }

  const now = Date.now();
  const account: BillingAccount = {
    userId,
    email: input.email || current?.email,
    plan: input.plan,
    creditsRemaining: (current?.creditsRemaining ?? DEFAULT_LIFETIME_CREDITS) + input.credits,
    subscriptionStatus: "active",
    subscriptionId: input.subscriptionId || current?.subscriptionId,
    customerId: input.customerId || current?.customerId,
    lastCreemEventId: input.eventId,
    createdAt: current?.createdAt || now,
    updatedAt: now,
  };

  await writeAccount(account, kv);
  if (account.email) await kv.put(emailKey(account.email), userId);
  await kv.put(eventKeyName, JSON.stringify({ ...eventRecord(input), persisted: true, accountUserId: userId, creditsGranted: input.credits, at: now }));
  await kv.put(cycleKeyName, JSON.stringify({ eventId: input.eventId, userId, plan: input.plan, credits: input.credits, at: now }), { expirationTtl: 60 * 60 * 24 * 40 });
  await kv.put(ledgerKey(userId, input.eventId), JSON.stringify({ type: "credit_grant", ...eventRecord(input), credits: input.credits, balanceAfter: account.creditsRemaining, at: now }));
  return { persisted: true, duplicate: false, account };
}

export async function debitCreditForUser(user: AuthUser, amount = 1, sourceId?: string) {
  const db = await billingDb();
  if (db) return debitCreditForUserD1(db, user, amount, sourceId);

  const kv = await billingKv();
  if (!kv) return { persisted: false, creditsRemaining: user.creditsRemaining, insufficient: user.creditsRemaining < amount };
  const account = (await ensureBillingAccount(user)) || null;
  if (account && creditLockedStatuses.has(account.subscriptionStatus)) {
    return { persisted: true, creditsRemaining: 0, insufficient: true, code: "CREDITS_LOCKED_FOR_REFUND" };
  }
  const currentCredits = account?.creditsRemaining ?? user.creditsRemaining;
  if (currentCredits < amount) return { persisted: true, creditsRemaining: currentCredits, insufficient: true };
  const now = Date.now();
  const next: BillingAccount = {
    userId: user.id,
    email: account?.email || user.email,
    plan: account?.plan || user.plan || "free",
    creditsRemaining: currentCredits - amount,
    subscriptionStatus: account?.subscriptionStatus || "none",
    subscriptionId: account?.subscriptionId,
    customerId: account?.customerId,
    lastCreemEventId: account?.lastCreemEventId,
    createdAt: account?.createdAt || now,
    updatedAt: now,
  };
  await writeAccount(next, kv);
  await kv.put(ledgerKey(user.id, sourceId || `debit_${crypto.randomUUID()}`), JSON.stringify({ type: "credit_debit", userId: user.id, amount, balanceAfter: next.creditsRemaining, at: now }));
  return { persisted: true, creditsRemaining: next.creditsRemaining, insufficient: false };
}

export async function refundCreditForUser(user: AuthUser, amount = 1, sourceId?: string) {
  const db = await billingDb();
  if (db) {
    const account = await ensureD1BillingAccount(db, user);
    const nextBalance = account.creditsRemaining + amount;
    const now = Date.now();
    const actualSourceId = sourceId || `refund_${crypto.randomUUID()}`;
    await db.prepare("UPDATE users SET credits_remaining = ?, updated_at = ? WHERE id = ?")
      .bind(nextBalance, now, user.id)
      .run();
    await insertCreditLedger(db, user.id, "generation_refund", actualSourceId, amount, nextBalance, "Generation safety refund", { amount })
    return { persisted: true, creditsRemaining: nextBalance };
  }

  const kv = await billingKv();
  if (!kv) return { persisted: false, creditsRemaining: user.creditsRemaining + amount };
  const account = (await ensureBillingAccount(user)) || null;
  const now = Date.now();
  const next: BillingAccount = {
    userId: user.id,
    email: account?.email || user.email,
    plan: account?.plan || user.plan || "free",
    creditsRemaining: (account?.creditsRemaining ?? user.creditsRemaining) + amount,
    subscriptionStatus: account?.subscriptionStatus || "none",
    subscriptionId: account?.subscriptionId,
    customerId: account?.customerId,
    lastCreemEventId: account?.lastCreemEventId,
    createdAt: account?.createdAt || now,
    updatedAt: now,
  };
  await writeAccount(next, kv);
  await kv.put(ledgerKey(user.id, sourceId || `refund_${crypto.randomUUID()}`), JSON.stringify({ type: "generation_refund", userId: user.id, amount, balanceAfter: next.creditsRemaining, at: now }));
  return { persisted: true, creditsRemaining: next.creditsRemaining };
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

  const kv = await billingKv();
  if (!kv) return { persisted: false, reason: "No D1 DB or BILLING_KV binding" };
  const userId = input.userId || (input.email ? await kv.get(emailKey(input.email)) : null);
  if (!userId) {
    await kv.put(eventKey(input.eventId), JSON.stringify({ ...input, persisted: false, reason: "Missing user_id/email mapping" }));
    return { persisted: false, reason: "Missing user_id/email mapping" };
  }
  const current = await readAccountByUserId(userId, kv);
  const now = Date.now();
  const account: BillingAccount = {
    userId,
    email: input.email || current?.email,
    plan: input.plan || current?.plan || "free",
    creditsRemaining: current?.creditsRemaining ?? DEFAULT_LIFETIME_CREDITS,
    subscriptionStatus: input.status,
    subscriptionId: input.subscriptionId || current?.subscriptionId,
    customerId: input.customerId || current?.customerId,
    lastCreemEventId: input.eventId,
    createdAt: current?.createdAt || now,
    updatedAt: now,
  };
  await writeAccount(account, kv);
  if (account.email) await kv.put(emailKey(account.email), userId);
  await kv.put(eventKey(input.eventId), JSON.stringify({ ...input, persisted: true, accountUserId: userId, at: now }));
  return { persisted: true, account };
}

export async function submitRefundRequestForUser(user: AuthUser, reason?: string) {
  const db = await billingDb();
  if (db) return submitRefundRequestD1(db, user, reason);

  const kv = await billingKv();
  if (!kv) return { ok: false, reason: "No D1 DB or BILLING_KV binding" };
  const account = await ensureBillingAccount(user);
  if (!account) return { ok: false, reason: "Account not found" };
  if (account.plan === "free") return { ok: false, reason: "No paid plan on this account" };
  if (account.subscriptionStatus === "refund_requested" && account.lastRefundRequestId) {
    return { ok: true, duplicate: true, requestId: account.lastRefundRequestId, account };
  }
  const now = Date.now();
  const requestId = `refund_${now}_${crypto.randomUUID()}`;
  const request: RefundRequest = {
    requestId,
    userId: account.userId,
    email: account.email || user.email,
    plan: account.plan,
    subscriptionStatus: account.subscriptionStatus,
    creditsRemaining: account.creditsRemaining,
    subscriptionId: account.subscriptionId,
    customerId: account.customerId,
    reason: reason?.trim().slice(0, 1000) || undefined,
    status: "submitted",
    createdAt: now,
  };
  const updated: BillingAccount = { ...account, subscriptionStatus: "refund_requested", lastRefundRequestId: requestId, updatedAt: now };
  await writeAccount(updated, kv);
  if (updated.email) await kv.put(emailKey(updated.email), updated.userId);
  await kv.put(refundRequestKey(updated.userId, requestId), JSON.stringify(request));
  await kv.put(ledgerKey(updated.userId, requestId), JSON.stringify({ type: "refund_request", ...request, at: now }));
  return { ok: true, duplicate: false, requestId, account: updated };
}

export async function submitSubscriptionCancellationForUser(user: AuthUser) {
  const account = await ensureBillingAccount(user);
  if (!account) return { ok: false, reason: "Account not found" };
  if (account.plan === "free") return { ok: false, reason: "No paid subscription on this account" };
  if (account.subscriptionStatus === "canceled" || account.subscriptionStatus === "scheduled_cancel") return { ok: true, duplicate: true, account };
  if (!account.subscriptionId) return { ok: false, reason: "Creem subscription ID is not available for this account" };

  const creemResult = await cancelCreemSubscription(account.subscriptionId);
  if (!creemResult.ok) return { ok: false, reason: creemResult.message || "Creem subscription cancellation failed", status: creemResult.status };

  const now = Date.now();
  const updated: BillingAccount = { ...account, subscriptionStatus: "canceled", updatedAt: now };
  const db = await billingDb();
  if (db) {
    await upsertUserFromAccount(db, updated);
    await upsertSubscription(db, updated.userId, updated.plan === "free" ? "starter" : updated.plan, "canceled", updated.subscriptionId, updated.customerId, now);
    await insertCreditLedger(db, updated.userId, "subscription_cancel", `cancel_${now}`, 0, updated.creditsRemaining, "subscription_cancel", { creem: creemResult.payload });
  } else {
    const kv = await billingKv();
    if (!kv) return { ok: false, reason: "No D1 DB or BILLING_KV binding" };
    await writeAccount(updated, kv);
    if (updated.email) await kv.put(emailKey(updated.email), updated.userId);
    const cancellationId = `cancel_${now}_${crypto.randomUUID()}`;
    await kv.put(ledgerKey(updated.userId, cancellationId), JSON.stringify({ type: "subscription_cancel", userId: updated.userId, email: updated.email, subscriptionId: updated.subscriptionId, creem: creemResult.payload, at: now }));
  }
  return { ok: true, duplicate: false, account: updated, creem: creemResult.payload };
}

export async function markRefundedAccount(input: RefundStateInput) {
  const db = await billingDb();
  if (db) return markRefundedAccountD1(db, input);

  const result = await updateSubscriptionState({ ...input, status: "refunded" });
  if (!result.persisted || !result.account) return result;
  const kv = await billingKv();
  if (!kv) return result;
  const preservedFreeCredits = Math.max(0, Math.min(DEFAULT_LIFETIME_CREDITS, result.account.creditsRemaining));
  const account: BillingAccount = { ...result.account, creditsRemaining: preservedFreeCredits, updatedAt: Date.now() };
  await writeAccount(account, kv);
  await kv.put(ledgerKey(account.userId, `${input.eventId}_credit_revoke`), JSON.stringify({ type: "refund_paid_credit_revoke", eventId: input.eventId, eventType: input.eventType, userId: account.userId, preservedFreeCredits, balanceAfter: preservedFreeCredits, at: account.updatedAt }));
  return { ...result, account };
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
    return { ...existing, userId: user.id, email, updatedAt: now };
  }
  return existing;
}

async function readD1Account(db: D1Database, userId?: string | null, email?: string | null): Promise<BillingAccount | null> {
  let row: UserRow | null = null;
  if (userId) row = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first<UserRow>();
  if (!row && email) row = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email.trim().toLowerCase()).first<UserRow>();
  if (!row) return null;
  const sub = await db.prepare("SELECT id, creem_subscription_id, creem_customer_id, status FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1")
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
    subscriptionId: sub?.creem_subscription_id || undefined,
    customerId: row.creem_customer_id || sub?.creem_customer_id || undefined,
    lastRefundRequestId: refund?.id,
    createdAt: Number(row.created_at || Date.now()),
    updatedAt: Number(row.updated_at || Date.now()),
  };
}

async function grantCreditsFromCreemD1(db: D1Database, input: CreditGrantInput) {
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

  const current = await readD1Account(db, userId);
  const sameLockedSubscription = Boolean(current?.subscriptionId && input.subscriptionId && current.subscriptionId === input.subscriptionId);
  if (current?.subscriptionStatus === "refund_requested" || current?.subscriptionStatus === "disputed" || (current?.subscriptionStatus === "refunded" && sameLockedSubscription)) {
    await recordWebhookEvent(db, input.eventId, input.eventType, { ignored: "account_locked_for_refund", raw: input.rawEvent || input }, userId, "processed", null, true);
    return { persisted: true, duplicate: true, account: current };
  }
  const email = input.email?.trim().toLowerCase() || current?.email || `${userId}@unknown.local`;
  const now = Date.now();
  if (!current) {
    await db.prepare("INSERT INTO users (id, email, plan, status, credits_remaining, creem_customer_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(userId, email, input.plan, "active", DEFAULT_LIFETIME_CREDITS, input.customerId || null, now, now)
      .run();
  }

  const cycleSourceId = grantCycleSourceId(input);
  const cycleGrant = await db.prepare("SELECT id FROM credit_ledger WHERE user_id = ? AND source_type = 'creem_credit_grant' AND source_id = ?")
    .bind(userId, cycleSourceId)
    .first<{ id: string }>();
  if (cycleGrant) {
    await recordWebhookEvent(db, input.eventId, input.eventType, input.rawEvent || input, userId, "processed", null, true);
    return { persisted: true, duplicate: true, account: await readD1Account(db, userId) };
  }

  const before = current?.creditsRemaining ?? DEFAULT_LIFETIME_CREDITS;
  const after = before + input.credits;
  await db.prepare("UPDATE users SET plan = ?, status = 'active', credits_remaining = ?, creem_customer_id = COALESCE(?, creem_customer_id), updated_at = ? WHERE id = ?")
    .bind(input.plan, after, input.customerId || null, now, userId)
    .run();
  await upsertSubscription(db, userId, input.plan, "active", input.subscriptionId, input.customerId, now);
  await upsertPayment(db, userId, input, now);
  await insertCreditLedger(db, userId, "creem_credit_grant", cycleSourceId, input.credits, after, input.eventType, { eventId: input.eventId, plan: input.plan, subscriptionId: input.subscriptionId, customerId: input.customerId });
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
  await db.prepare("UPDATE users SET credits_remaining = ?, updated_at = ? WHERE id = ? AND credits_remaining >= ?")
    .bind(nextBalance, now, user.id, amount)
    .run();
  await insertCreditLedger(db, user.id, "generation_debit", actualSourceId, -amount, nextBalance, "AI image generation", { amount });
  return { persisted: true, creditsRemaining: nextBalance, insufficient: false };
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
    if (sameSubscription) accountStatus = "refunded";
  }
  if (current) {
    await db.prepare("UPDATE users SET plan = COALESCE(?, plan), status = ?, creem_customer_id = COALESCE(?, creem_customer_id), updated_at = ? WHERE id = ?")
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
    const cancellation = await cancelActiveSubscriptionForRefundD1(db, account, user.id);
    if (!cancellation.ok) return { ok: false, reason: cancellation.reason, code: cancellation.code, status: cancellation.status };
    return { ok: true, duplicate: true, requestId: account.lastRefundRequestId, account: { ...account, subscriptionStatus: "refund_requested" as const }, subscriptionCanceled: cancellation.canceled };
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

  const cancellation = await cancelActiveSubscriptionForRefundD1(db, { ...account, subscriptionStatus: "refund_requested" }, user.id);
  const refundPaymentId = extractCancellationTransactionId(cancellation) || initialRefundPaymentId;
  await db.prepare("UPDATE refund_requests SET payment_id = COALESCE(?, payment_id), metadata_json = ? WHERE id = ?")
    .bind(refundPaymentId || null, JSON.stringify({ email: user.email, plan: account.plan, subscriptionStatus: account.subscriptionStatus, eligibility, refundPaymentId, subscriptionCancellation: cancellation }), requestId)
    .run();
  await insertCreditLedger(db, user.id, "refund_request", requestId, 0, account.creditsRemaining, "User requested refund; active subscription cancellation attempted before manual/provider refund", { reason: reason?.trim().slice(0, 1000) || null, eligibility, subscriptionCancellation: cancellation });
  return { ok: true, duplicate: false, requestId, account: { ...account, subscriptionStatus: "refund_requested" as const, lastRefundRequestId: requestId, updatedAt: now }, subscriptionCanceled: cancellation.ok ? cancellation.canceled : false, cancellationError: cancellation.ok ? undefined : cancellation.reason };
}

async function cancelActiveSubscriptionForRefundD1(db: D1Database, account: BillingAccount, userId: string) {
  const activeStatuses = new Set(["active", "trialing", "past_due", "paused", "refund_requested"]);
  const subscription = await db.prepare("SELECT id, creem_subscription_id, creem_customer_id, status FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1")
    .bind(userId)
    .first<SubscriptionRow>();
  const subscriptionId = account.subscriptionId || subscription?.creem_subscription_id;
  const currentStatus = account.subscriptionStatus || subscription?.status;
  if (!subscriptionId || !activeStatuses.has(currentStatus || "")) return { ok: true as const, canceled: false, reason: "No active Creem subscription to cancel" };

  const creemResult = await cancelCreemSubscription(subscriptionId);
  if (!creemResult.ok) {
    return {
      ok: false as const,
      canceled: false,
      code: "CREEM_SUBSCRIPTION_CANCEL_FAILED",
      status: creemResult.status,
      reason: creemResult.message || "Creem subscription cancellation failed before refund request. Please use Manage billing or contact support.",
    };
  }

  const now = Date.now();
  await upsertSubscription(db, userId, account.plan === "free" ? "starter" : account.plan, "canceled", subscriptionId, account.customerId || subscription?.creem_customer_id, now);
  await insertCreditLedger(db, userId, "subscription_cancel_for_refund", `cancel_for_refund_${now}`, 0, account.creditsRemaining, "Active subscription canceled before refund request", { creem: creemResult.payload, subscriptionId });
  return { ok: true as const, canceled: true, creem: creemResult.payload };
}

function extractCancellationTransactionId(cancellation: { creem?: unknown }) {
  const payload = cancellation.creem;
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
  const balance = await calculateFreeCreditRefundBalanceD1(db, userId);
  const payment = await db.prepare("SELECT id, amount_cents, currency, paid_at, created_at FROM payments WHERE user_id = ? AND status = 'paid' ORDER BY COALESCE(paid_at, created_at) DESC LIMIT 1")
    .bind(userId)
    .first<{ id: string; amount_cents: number; currency: string; paid_at: number | null; created_at: number }>();
  const base: RefundEligibility = {
    eligible: false,
    paidGranted: balance.paidGranted,
    paidCreditsConsumed: balance.paidCreditsConsumedFirst,
    paidCreditsUsagePercent: balance.paidGranted > 0 ? Math.round((balance.paidCreditsConsumedFirst / balance.paidGranted) * 10000) / 100 : 0,
    latestPaymentId: payment?.id,
    latestPaymentAt: payment ? Number(payment.paid_at || payment.created_at) : undefined,
    amountCents: payment ? Number(payment.amount_cents || 0) : undefined,
    currency: payment?.currency || "USD",
  };
  if (!payment) return { ...base, code: "NO_PAID_PAYMENT", message: "No paid payment record was found for this account." };
  if (!payment.amount_cents || Number(payment.amount_cents) <= 0) return { ...base, code: "PAYMENT_AMOUNT_UNVERIFIED", message: "Payment amount is not verified yet. Please contact support for manual review." };
  const paymentAt = Number(payment.paid_at || payment.created_at || 0);
  const ageDays = paymentAt > 0 ? (Date.now() - paymentAt) / (1000 * 60 * 60 * 24) : Number.POSITIVE_INFINITY;
  if (ageDays > SELF_SERVICE_REFUND_WINDOW_DAYS) return { ...base, code: "REFUND_WINDOW_EXPIRED", message: "Self-service refund requests are available within 7 days of payment." };
  if (balance.paidGranted <= 0) return { ...base, code: "NO_PAID_CREDITS", message: "No paid credits were found for this billing period." };
  if (balance.paidCreditsConsumedFirst > balance.paidGranted * SELF_SERVICE_REFUND_MAX_PAID_CREDIT_USAGE) {
    return { ...base, code: "PAID_CREDITS_OVER_20_PERCENT_USED", message: "Self-service refund requests are available only when no more than 20% of paid credits have been used." };
  }
  return { ...base, eligible: true };
}

async function markRefundedAccountD1(db: D1Database, input: RefundStateInput) {
  const state = await updateSubscriptionStateD1(db, { ...input, status: "refunded" });
  if (!state.persisted || !state.account) return state;
  const account = state.account;
  const now = Date.now();
  const freeBalance = await calculateFreeCreditRefundBalanceD1(db, account.userId);
  const preservedFreeCredits = Math.max(0, Math.min(DEFAULT_LIFETIME_CREDITS, account.creditsRemaining, freeBalance.freeCreditsRemaining));
  const revoked = Math.max(0, account.creditsRemaining - preservedFreeCredits);
  await db.prepare("UPDATE users SET plan = 'free', status = 'refunded', credits_remaining = ?, updated_at = ? WHERE id = ?").bind(preservedFreeCredits, now, account.userId).run();
  await db.prepare("UPDATE payments SET status = 'refunded', updated_at = ? WHERE user_id = ? AND status = 'paid'").bind(now, account.userId).run();
  await db.prepare("UPDATE refund_requests SET status = 'refunded', creem_refund_id = COALESCE(?, creem_refund_id), resolved_at = ?, metadata_json = COALESCE(metadata_json, ?) WHERE user_id = ? AND status IN ('submitted', 'pending', 'refund_requested')")
    .bind(input.refundId || null, now, JSON.stringify({ eventId: input.eventId }), account.userId)
    .run();
  await insertCreditLedger(db, account.userId, "refund_paid_credit_revoke", input.eventId, -revoked, preservedFreeCredits, "Creem refund confirmed; paid credits revoked and unused free signup credits preserved", { eventType: input.eventType, refundId: input.refundId, preservedFreeCredits, ...freeBalance });
  return { ...state, account: { ...account, subscriptionStatus: "refunded" as const, creditsRemaining: preservedFreeCredits, updatedAt: now } };
}

async function calculateFreeCreditRefundBalanceD1(db: D1Database, userId: string): Promise<FreeCreditRefundBalance> {
  const row = await db.prepare(`SELECT
      COALESCE(SUM(CASE WHEN source_type = 'creem_credit_grant' AND delta > 0 THEN delta ELSE 0 END), 0) AS paid_granted,
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
    const row = await db.prepare("SELECT id FROM users WHERE creem_customer_id = ?").bind(input.customerId).first<{ id: string }>();
    if (row?.id) return row.id;
  }
  if (input.subscriptionId) {
    const row = await db.prepare("SELECT user_id AS id FROM subscriptions WHERE id = ? OR creem_subscription_id = ? ORDER BY updated_at DESC LIMIT 1")
      .bind(input.subscriptionId, input.subscriptionId)
      .first<{ id: string }>();
    if (row?.id) return row.id;
  }
  const paymentIds = [input.transactionId, input.checkoutId, input.invoiceId].filter((value): value is string => Boolean(value));
  for (const paymentId of paymentIds) {
    const row = await db.prepare("SELECT user_id AS id FROM payments WHERE id = ? OR creem_transaction_id = ? OR creem_checkout_id = ? OR creem_invoice_id = ? ORDER BY updated_at DESC LIMIT 1")
      .bind(paymentId, paymentId, paymentId, paymentId)
      .first<{ id: string }>();
    if (row?.id) return row.id;
  }
  return null;
}

async function upsertUserFromAccount(db: D1Database, account: BillingAccount) {
  await db.prepare("UPDATE users SET email = COALESCE(?, email), plan = ?, status = ?, credits_remaining = ?, creem_customer_id = COALESCE(?, creem_customer_id), updated_at = ? WHERE id = ?")
    .bind(account.email || null, account.plan, account.subscriptionStatus, account.creditsRemaining, account.customerId || null, account.updatedAt, account.userId)
    .run();
}

async function upsertSubscription(db: D1Database, userId: string, plan: BillingPlan, status: BillingAccount["subscriptionStatus"], subscriptionId?: string | null, customerId?: string | null, now = Date.now()) {
  if (!subscriptionId && !customerId) return;
  const id = subscriptionId || `sub_${userId}_${customerId}`;
  await db.prepare(`INSERT INTO subscriptions (id, user_id, creem_subscription_id, creem_customer_id, plan, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET creem_subscription_id = excluded.creem_subscription_id, creem_customer_id = excluded.creem_customer_id, plan = excluded.plan, status = excluded.status, updated_at = excluded.updated_at`)
    .bind(id, userId, subscriptionId || null, customerId || null, plan, status, now, now)
    .run();
}

async function upsertPayment(db: D1Database, userId: string, input: CreditGrantInput, now = Date.now()) {
  const paymentId = input.transactionId || input.checkoutId || `${input.eventId}_payment`;
  await db.prepare(`INSERT INTO payments (id, user_id, subscription_id, creem_checkout_id, creem_transaction_id, creem_invoice_id, plan, status, currency, amount_cents, raw_event_id, paid_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = 'paid',
      subscription_id = COALESCE(excluded.subscription_id, payments.subscription_id),
      creem_checkout_id = COALESCE(excluded.creem_checkout_id, payments.creem_checkout_id),
      creem_transaction_id = COALESCE(excluded.creem_transaction_id, payments.creem_transaction_id),
      creem_invoice_id = COALESCE(excluded.creem_invoice_id, payments.creem_invoice_id),
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
    VALUES (?, 'creem', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(dedupe_key) DO UPDATE SET related_user_id = COALESCE(excluded.related_user_id, webhook_events.related_user_id), processed_status = excluded.processed_status, processed_at = excluded.processed_at, error_message = excluded.error_message`)
    .bind(id, eventType, eventId, webhookDedupeKey(eventId), userId, JSON.stringify(payload), signatureVerified ? 1 : 0, status, status === "received" ? null : now, errorMessage, now)
    .run();
}

function grantCycleSourceId(input: CreditGrantInput) {
  const date = new Date();
  const period = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return `${input.subscriptionId || input.customerId || input.userId || input.email || input.plan}:${input.plan}:${period}`;
}

function webhookDedupeKey(eventId: string) {
  return `creem:${eventId}`;
}

async function readAccountByUserId(userId: string, kv: KV): Promise<BillingAccount | null> {
  const raw = await kv.get(accountKey(userId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as BillingAccount;
    if (!parsed.userId || typeof parsed.creditsRemaining !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeAccount(account: BillingAccount, kv: KV) {
  await kv.put(accountKey(account.userId), JSON.stringify(account));
}

function accountKey(userId: string) {
  return `billing:account:${userId}`;
}

function emailKey(email: string) {
  return `billing:email:${email.trim().toLowerCase()}`;
}

function eventKey(eventId: string) {
  return `billing:event:${eventId}`;
}

function grantCycleKey(userId: string, seed: string) {
  const date = new Date();
  const period = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return `billing:grant:${userId}:${seed}:${period}`;
}

function ledgerKey(userId: string, eventId: string) {
  return `billing:ledger:${userId}:${eventId}`;
}

function refundRequestKey(userId: string, requestId: string) {
  return `billing:refund:${userId}:${requestId}`;
}

function eventRecord(input: CreditGrantInput) {
  return {
    eventId: input.eventId,
    eventType: input.eventType,
    userId: input.userId || null,
    email: input.email || null,
    plan: input.plan,
    credits: input.credits,
    subscriptionId: input.subscriptionId || null,
    customerId: input.customerId || null,
  };
}
