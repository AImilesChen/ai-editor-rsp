import { NextRequest, NextResponse } from "next/server";
import { billingDb } from "@/lib/backend/cloudflare";
import { getAuthUser } from "@/lib/backend/auth";
import { adminToken, isAdminEmail } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CountRow = { count: number };

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

async function count(db: D1Database, sql: string, ...binds: unknown[]) {
  const row = await db.prepare(sql).bind(...binds).first<CountRow>();
  return Number(row?.count || 0);
}

const REFUND_WINDOW_DAYS = 7;
const MAX_PAID_CREDIT_USAGE = 0.2;

type RefundOverviewRow = Record<string, unknown>;

function refundDecision(row: RefundOverviewRow) {
  const userStatus = String(row.userStatus || "");
  const refundStatus = String(row.refundStatus || "");
  const paymentStatus = String(row.paymentStatus || "");
  const paymentAmountCents = Number(row.paymentAmountCents || 0);
  const paidCreditsGranted = Number(row.paidCreditsGranted || 0);
  const lifetimeFreeGranted = Number(row.lifetimeFreeCreditsGranted || 0);
  const generationUsedBeforePayment = Number(row.generationUsedBeforePayment || 0);
  const periodGenerationUsed = Number(row.periodGenerationCreditsUsed || row.generationCreditsUsed || 0);
  const freeRemainingAtPayment = Math.max(0, lifetimeFreeGranted - generationUsedBeforePayment);
  const paidCreditsUsed = Math.max(0, periodGenerationUsed - freeRemainingAtPayment);
  const usageRatio = paidCreditsGranted > 0 ? paidCreditsUsed / paidCreditsGranted : 0;
  const paidAt = Number(row.paidAt || 0);
  const requestedAt = Number(row.requestedAt || Date.now());
  const daysSincePayment = paidAt ? Math.max(0, (requestedAt - paidAt) / (24 * 60 * 60 * 1000)) : null;

  if (userStatus === "refunded" || refundStatus === "refunded" || paymentStatus === "refunded") {
    return {
      canRefund: false,
      refundDecisionCode: "ALREADY_REFUNDED",
      refundDecisionLabel: "Already refunded",
      suggestedRefundCents: 0,
      refundDecisionReason: "This payment or account is already marked refunded.",
      paidCreditsUsed,
      paidUsagePercent: Number((usageRatio * 100).toFixed(2)),
      daysSincePayment: daysSincePayment === null ? null : Number(daysSincePayment.toFixed(2)),
    };
  }

  if (paymentAmountCents <= 0 || paidCreditsGranted <= 0) {
    return {
      canRefund: false,
      refundDecisionCode: "NO_PAID_CYCLE",
      refundDecisionLabel: "Needs manual review",
      suggestedRefundCents: 0,
      refundDecisionReason: "No auditable paid payment or paid credit grant was found.",
      paidCreditsUsed,
      paidUsagePercent: Number((usageRatio * 100).toFixed(2)),
      daysSincePayment: daysSincePayment === null ? null : Number(daysSincePayment.toFixed(2)),
    };
  }

  if (daysSincePayment === null || daysSincePayment > REFUND_WINDOW_DAYS) {
    return {
      canRefund: false,
      refundDecisionCode: "REFUND_WINDOW_EXPIRED",
      refundDecisionLabel: "Cannot self-service refund",
      suggestedRefundCents: 0,
      refundDecisionReason: `Payment is outside the ${REFUND_WINDOW_DAYS}-day refund window.`,
      paidCreditsUsed,
      paidUsagePercent: Number((usageRatio * 100).toFixed(2)),
      daysSincePayment: daysSincePayment === null ? null : Number(daysSincePayment.toFixed(2)),
    };
  }

  if (usageRatio > MAX_PAID_CREDIT_USAGE) {
    const unusedRatio = Math.max(0, 1 - usageRatio);
    return {
      canRefund: false,
      refundDecisionCode: "PAID_CREDITS_OVER_20_PERCENT_USED",
      refundDecisionLabel: "Manual review required",
      suggestedRefundCents: Math.floor(paymentAmountCents * unusedRatio),
      refundDecisionReason: "Paid credit usage is above the self-service threshold; show the unused-credit amount as the maximum goodwill refund reference.",
      paidCreditsUsed,
      paidUsagePercent: Number((usageRatio * 100).toFixed(2)),
      daysSincePayment: Number(daysSincePayment.toFixed(2)),
    };
  }

  return {
    canRefund: true,
    refundDecisionCode: "ELIGIBLE_FULL_REFUND",
    refundDecisionLabel: "Can refund",
    suggestedRefundCents: paymentAmountCents,
    refundDecisionReason: "Within refund window and paid credit usage is within policy.",
    paidCreditsUsed,
    paidUsagePercent: Number((usageRatio * 100).toFixed(2)),
    daysSincePayment: Number(daysSincePayment.toFixed(2)),
  };
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) return unauthorized();

  const db = await billingDb();
  if (!db) {
    return NextResponse.json({ ok: false, code: "D1_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const [totalUsers, activeSubscribers, refundRequests, pendingRefunds, refundedUsers, canceledSubscriptions] = await Promise.all([
    count(db, "SELECT COUNT(*) count FROM users"),
    count(db, "SELECT COUNT(DISTINCT user_id) count FROM subscriptions WHERE status IN ('active', 'trialing', 'past_due', 'scheduled_cancel', 'paused')"),
    count(db, "SELECT COUNT(*) count FROM refund_requests"),
    count(db, "SELECT COUNT(*) count FROM refund_requests WHERE status IN ('submitted', 'pending', 'refund_requested')"),
    count(db, "SELECT COUNT(*) count FROM users WHERE status = 'refunded'"),
    count(db, "SELECT COUNT(*) count FROM subscriptions WHERE status IN ('canceled', 'scheduled_cancel', 'expired')"),
  ]);

  const subscribers = await db.prepare(`
    SELECT
      u.id userId,
      u.email,
      u.plan userPlan,
      u.status userStatus,
      u.credits_remaining creditsRemaining,
      s.id subscriptionId,
      s.stripe_subscription_id stripeSubscriptionId,
      s.plan subscriptionPlan,
      s.status subscriptionStatus,
      s.current_period_start periodStart,
      s.current_period_end periodEnd,
      s.updated_at updatedAt,
      p.id paymentId,
      p.stripe_transaction_id stripeTransactionId,
      p.status paymentStatus,
      p.amount_cents amountCents,
      p.currency,
      p.paid_at paidAt,
      CASE LOWER(s.plan)
        WHEN 'starter' THEN 100
        WHEN 'creator' THEN 240
        WHEN 'studio' THEN 500
        ELSE COALESCE((SELECT SUM(delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'stripe_credit_grant' AND delta > 0), 0)
      END paidCreditsGranted,
      COALESCE((SELECT SUM(-delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'generation_debit' AND delta < 0 AND created_at >= COALESCE(s.current_period_start, p.paid_at, s.created_at) AND created_at <= COALESCE(s.current_period_end, strftime('%s','now') * 1000)), 0) generationCreditsUsed,
      COALESCE((SELECT COUNT(*) FROM generation_jobs WHERE user_id = u.id AND created_at >= COALESCE(s.current_period_start, p.paid_at, s.created_at) AND created_at <= COALESCE(s.current_period_end, strftime('%s','now') * 1000)), 0) generationJobs
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN payments p ON p.subscription_id = s.id AND p.status NOT IN ('checkout_pending')
    WHERE s.status IN ('active', 'trialing', 'past_due', 'scheduled_cancel', 'paused')
    ORDER BY s.updated_at DESC, COALESCE(p.paid_at, p.created_at, 0) DESC, s.created_at DESC
    LIMIT 100
  `).all();

  const refunds = await db.prepare(`
    SELECT
      rr.id refundRequestId,
      rr.status refundStatus,
      rr.amount_cents refundAmountCents,
      rr.currency refundCurrency,
      rr.requested_at requestedAt,
      rr.resolved_at resolvedAt,
      u.id userId,
      u.email,
      u.plan userPlan,
      u.status userStatus,
      u.credits_remaining creditsRemaining,
      p.status paymentStatus,
      p.plan paymentPlan,
      p.amount_cents paymentAmountCents,
      p.currency paymentCurrency,
      p.paid_at paidAt,
      s.id subscriptionId,
      s.stripe_subscription_id stripeSubscriptionId,
      s.status subscriptionStatus,
      CASE LOWER(p.plan)
        WHEN 'starter' THEN 100
        WHEN 'creator' THEN 240
        WHEN 'studio' THEN 500
        ELSE COALESCE((SELECT SUM(delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'stripe_credit_grant' AND delta > 0 AND created_at >= COALESCE(p.paid_at, p.created_at) AND created_at <= rr.requested_at), 0)
      END paidCreditsGranted,
      COALESCE((SELECT SUM(delta) FROM credit_ledger WHERE user_id = u.id AND source_type IN ('signup_grant', 'kv_backfill') AND delta > 0), 0) lifetimeFreeCreditsGranted,
      COALESCE((SELECT SUM(-delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'generation_debit' AND delta < 0 AND created_at < COALESCE(p.paid_at, p.created_at, 0)), 0) generationUsedBeforePayment,
      COALESCE((SELECT SUM(-delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'generation_debit' AND delta < 0 AND created_at >= COALESCE(p.paid_at, p.created_at, 0) AND created_at <= rr.requested_at), 0) periodGenerationCreditsUsed,
      COALESCE((SELECT SUM(-delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'generation_debit' AND delta < 0 AND created_at >= COALESCE(p.paid_at, p.created_at, 0) AND created_at <= rr.requested_at), 0) generationCreditsUsed,
      COALESCE((SELECT COUNT(*) FROM generation_jobs WHERE user_id = u.id AND created_at >= COALESCE(p.paid_at, p.created_at, 0) AND created_at <= rr.requested_at), 0) generationJobs
    FROM refund_requests rr
    JOIN users u ON u.id = rr.user_id
    LEFT JOIN payments p ON p.id = rr.payment_id
    LEFT JOIN subscriptions s ON s.id = rr.subscription_id
    ORDER BY rr.requested_at DESC
    LIMIT 50
  `).all();

  const canceled = await db.prepare(`
    SELECT
      u.id userId,
      u.email,
      u.plan userPlan,
      u.status userStatus,
      u.credits_remaining creditsRemaining,
      s.id subscriptionId,
      s.stripe_subscription_id stripeSubscriptionId,
      s.plan subscriptionPlan,
      s.status subscriptionStatus,
      s.canceled_at canceledAt,
      s.current_period_end periodEnd,
      s.updated_at updatedAt,
      rr.status latestRefundStatus,
      rr.requested_at latestRefundRequestedAt
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN refund_requests rr ON rr.id = (
      SELECT id FROM refund_requests WHERE user_id = u.id ORDER BY requested_at DESC LIMIT 1
    )
    WHERE s.status IN ('canceled', 'scheduled_cancel', 'expired') OR u.status IN ('refund_requested', 'refunded')
    ORDER BY COALESCE(s.canceled_at, s.updated_at) DESC
    LIMIT 50
  `).all();

  const refundsWithDecision = (refunds.results || []).map((row) => {
    const decision = refundDecision(row as RefundOverviewRow);
    return {
      ...row,
      ...decision,
      generationCreditsUsed: decision.paidCreditsUsed,
    };
  });

  return NextResponse.json({
    ok: true,
    generatedAt: Date.now(),
    stats: { totalUsers, activeSubscribers, refundRequests, pendingRefunds, refundedUsers, canceledSubscriptions },
    subscribers: subscribers.results || [],
    refunds: refundsWithDecision,
    canceled: canceled.results || [],
  }, { headers: { "Cache-Control": "no-store" } });
}
