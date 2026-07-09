import { NextRequest, NextResponse } from "next/server";
import { billingDb } from "@/lib/backend/cloudflare";
import { getAuthUser, isValidEmail, normalizeEmail } from "@/lib/backend/auth";
import { adminToken, isAdminEmail } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const REFUND_WINDOW_DAYS = 7;
const MAX_PAID_CREDIT_USAGE = 0.2;

function requestToken(request: NextRequest) {
  const auth = request.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return request.headers.get("x-admin-token") || "";
}

async function isAuthorized(request: NextRequest) {
  const expected = adminToken();
  const token = requestToken(request);
  if (expected && token && token === expected) return true;
  const user = await getAuthUser(request);
  return isAdminEmail(user?.email);
}

function unauthorized() {
  return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

function nowMs() {
  return Date.now();
}

function centsToMajor(cents?: number | null) {
  return typeof cents === "number" ? Math.round(cents) / 100 : 0;
}

type UserRow = {
  id: string;
  email: string;
  plan: string;
  status: string;
  credits_remaining: number;
  stripe_customer_id: string | null;
  created_at: number;
  updated_at: number;
};

type PaymentRow = {
  id: string;
  subscription_id: string | null;
  stripe_checkout_id: string | null;
  stripe_transaction_id: string | null;
  stripe_invoice_id: string | null;
  plan: string;
  status: string;
  currency: string;
  amount_cents: number;
  paid_at: number | null;
  created_at: number;
  updated_at: number;
};

type SubscriptionRow = {
  id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan: string;
  status: string;
  current_period_start: number | null;
  current_period_end: number | null;
  canceled_at: number | null;
  created_at: number;
  updated_at: number;
};

type RefundRow = {
  id: string;
  payment_id: string | null;
  subscription_id: string | null;
  status: string;
  credits_at_request: number;
  amount_cents: number | null;
  currency: string | null;
  requested_at: number;
  resolved_at: number | null;
};

type CountRow = { count: number };
type SumRow = { total: number | null };

async function scalarSum(db: D1Database, sql: string, ...binds: unknown[]) {
  const row = await db.prepare(sql).bind(...binds).first<SumRow>();
  return Number(row?.total || 0);
}

async function scalarCount(db: D1Database, sql: string, ...binds: unknown[]) {
  const row = await db.prepare(sql).bind(...binds).first<CountRow>();
  return Number(row?.count || 0);
}

function decide(input: {
  user: UserRow;
  payment: PaymentRow | null;
  paidCreditsGranted: number;
  paidCreditsUsed: number;
  usagePercent: number;
  daysSincePayment: number | null;
}) {
  const { user, payment, paidCreditsGranted, usagePercent, daysSincePayment } = input;
  if (user.status === "refunded" || payment?.status === "refunded") {
    return {
      eligible: false,
      code: "ALREADY_REFUNDED",
      label: "Already refunded",
      suggestedRefundCents: 0,
      reason: "This account or latest payment is already marked refunded.",
    };
  }
  if (!payment || payment.amount_cents <= 0 || paidCreditsGranted <= 0) {
    return {
      eligible: false,
      code: "NO_PAID_CYCLE",
      label: "Needs manual review",
      suggestedRefundCents: 0,
      reason: "No auditable paid credit grant/payment cycle was found.",
    };
  }
  if (daysSincePayment === null || daysSincePayment > REFUND_WINDOW_DAYS) {
    return {
      eligible: false,
      code: "REFUND_WINDOW_EXPIRED",
      label: "Outside refund window",
      suggestedRefundCents: 0,
      reason: `Self-service refunds are limited to ${REFUND_WINDOW_DAYS} days after payment.`,
    };
  }
  if (usagePercent > MAX_PAID_CREDIT_USAGE) {
    const unusedRatio = Math.max(0, 1 - usagePercent);
    return {
      eligible: false,
      code: "PAID_CREDITS_OVER_20_PERCENT_USED",
      label: "Manual review required",
      suggestedRefundCents: Math.floor(payment.amount_cents * unusedRatio),
      reason: "Paid credit usage is above the self-service threshold; review whether a partial goodwill refund is appropriate.",
    };
  }
  return {
    eligible: true,
    code: "ELIGIBLE_FULL_REFUND",
    label: "Eligible for full self-service refund",
    suggestedRefundCents: payment.amount_cents,
    reason: "Payment is within the refund window and paid credit usage is within policy.",
  };
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) return unauthorized();

  const email = request.nextUrl.searchParams.get("email") || "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, code: "EMAIL_REQUIRED", message: "Pass ?email=user@example.com" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const db = await billingDb();
  if (!db) {
    return NextResponse.json({ ok: false, code: "D1_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await db.prepare("SELECT * FROM users WHERE lower(email) = ? LIMIT 1").bind(normalizedEmail).first<UserRow>();
  if (!user) {
    return NextResponse.json({ ok: false, code: "USER_NOT_FOUND", email: normalizedEmail }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const payment = await db.prepare("SELECT * FROM payments WHERE user_id = ? AND status NOT IN ('checkout_pending') ORDER BY COALESCE(paid_at, created_at) DESC, updated_at DESC LIMIT 1")
    .bind(user.id)
    .first<PaymentRow>();
  const subscription = await db.prepare("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC, created_at DESC LIMIT 1")
    .bind(user.id)
    .first<SubscriptionRow>();
  const refund = await db.prepare("SELECT * FROM refund_requests WHERE user_id = ? ORDER BY requested_at DESC LIMIT 1")
    .bind(user.id)
    .first<RefundRow>();

  const periodStart = subscription?.current_period_start || payment?.paid_at || payment?.created_at || user.created_at;
  const periodEnd = subscription?.current_period_end || nowMs();
  const paidAt = payment?.paid_at || payment?.created_at || null;

  const [
    lifetimeFreeGranted,
    lifetimeGenerationUsed,
    generationUsedBeforePayment,
    periodGenerationUsed,
    periodPaidGranted,
    periodPaidRevoked,
    generationJobs,
    completedGenerationJobs,
  ] = await Promise.all([
    scalarSum(db, "SELECT SUM(delta) total FROM credit_ledger WHERE user_id = ? AND source_type IN ('signup_grant', 'kv_backfill') AND delta > 0", user.id),
    scalarSum(db, "SELECT SUM(-delta) total FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_debit' AND delta < 0", user.id),
    scalarSum(db, "SELECT SUM(-delta) total FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_debit' AND delta < 0 AND created_at < ?", user.id, paidAt || periodStart),
    scalarSum(db, "SELECT SUM(-delta) total FROM credit_ledger WHERE user_id = ? AND source_type = 'generation_debit' AND delta < 0 AND created_at >= ? AND created_at <= ?", user.id, periodStart, periodEnd),
    scalarSum(db, "SELECT SUM(delta) total FROM credit_ledger WHERE user_id = ? AND source_type = 'stripe_credit_grant' AND delta > 0 AND created_at >= ? AND created_at <= ?", user.id, periodStart, periodEnd),
    scalarSum(db, "SELECT SUM(-delta) total FROM credit_ledger WHERE user_id = ? AND source_type = 'refund_paid_credit_revoke' AND delta < 0 AND created_at >= ?", user.id, periodStart),
    scalarCount(db, "SELECT COUNT(*) count FROM generation_jobs WHERE user_id = ?", user.id),
    scalarCount(db, "SELECT COUNT(*) count FROM generation_jobs WHERE user_id = ? AND status = 'completed'", user.id),
  ]);

  const freeRemainingAtPayment = Math.max(0, lifetimeFreeGranted - generationUsedBeforePayment);
  const paidCreditsUsed = Math.max(0, periodGenerationUsed - freeRemainingAtPayment);
  const paidCreditsGranted = periodPaidGranted;
  const usagePercent = paidCreditsGranted > 0 ? paidCreditsUsed / paidCreditsGranted : 0;
  const daysSincePayment = paidAt ? Math.max(0, (nowMs() - paidAt) / (24 * 60 * 60 * 1000)) : null;
  const decision = decide({ user, payment, paidCreditsGranted, paidCreditsUsed, usagePercent, daysSincePayment });

  return NextResponse.json({
    ok: true,
    email: user.email,
    user: {
      id: user.id,
      plan: user.plan,
      status: user.status,
      creditsRemaining: user.credits_remaining,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
    currentSubscription: subscription ? {
      id: subscription.id,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      plan: subscription.plan,
      status: subscription.status,
      periodStart: subscription.current_period_start,
      periodEnd: subscription.current_period_end,
      canceledAt: subscription.canceled_at,
    } : null,
    latestPayment: payment ? {
      id: payment.id,
      status: payment.status,
      plan: payment.plan,
      amountCents: payment.amount_cents,
      amount: centsToMajor(payment.amount_cents),
      currency: payment.currency,
      paidAt,
      stripeCheckoutId: payment.stripe_checkout_id,
      stripeTransactionId: payment.stripe_transaction_id,
      stripeInvoiceId: payment.stripe_invoice_id,
    } : null,
    latestRefundRequest: refund ? {
      id: refund.id,
      status: refund.status,
      amountCents: refund.amount_cents,
      currency: refund.currency,
      requestedAt: refund.requested_at,
      resolvedAt: refund.resolved_at,
    } : null,
    usage: {
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd,
      lifetimeFreeCreditsGranted: lifetimeFreeGranted,
      lifetimeGenerationCreditsUsed: lifetimeGenerationUsed,
      freeCreditsRemainingAtPayment: freeRemainingAtPayment,
      periodGenerationCreditsUsed: periodGenerationUsed,
      paidCreditsGranted,
      paidCreditsUsed,
      paidCreditsRevoked: periodPaidRevoked,
      paidUsagePercent: Number((usagePercent * 100).toFixed(2)),
      generationJobs,
      completedGenerationJobs,
    },
    refundReview: {
      policy: {
        refundWindowDays: REFUND_WINDOW_DAYS,
        maxPaidCreditUsagePercent: MAX_PAID_CREDIT_USAGE * 100,
      },
      daysSincePayment: daysSincePayment === null ? null : Number(daysSincePayment.toFixed(2)),
      ...decision,
      suggestedRefundAmount: centsToMajor(decision.suggestedRefundCents),
      currency: payment?.currency || refund?.currency || "USD",
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
