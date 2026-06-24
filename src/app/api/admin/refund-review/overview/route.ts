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
      s.creem_subscription_id creemSubscriptionId,
      s.plan subscriptionPlan,
      s.status subscriptionStatus,
      s.current_period_start periodStart,
      s.current_period_end periodEnd,
      s.updated_at updatedAt,
      p.status paymentStatus,
      p.amount_cents amountCents,
      p.currency,
      p.paid_at paidAt,
      COALESCE((SELECT SUM(delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'creem_credit_grant' AND delta > 0), 0) paidCreditsGranted,
      COALESCE((SELECT SUM(-delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'generation_debit' AND delta < 0), 0) generationCreditsUsed,
      COALESCE((SELECT COUNT(*) FROM generation_jobs WHERE user_id = u.id), 0) generationJobs
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN payments p ON p.id = (
      SELECT id FROM payments WHERE user_id = u.id AND status NOT IN ('checkout_pending') ORDER BY COALESCE(paid_at, created_at) DESC, updated_at DESC LIMIT 1
    )
    WHERE s.status IN ('active', 'trialing', 'past_due', 'scheduled_cancel', 'paused')
    ORDER BY s.updated_at DESC, s.created_at DESC
    LIMIT 50
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
      s.status subscriptionStatus,
      COALESCE((SELECT SUM(delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'creem_credit_grant' AND delta > 0), 0) paidCreditsGranted,
      COALESCE((SELECT SUM(-delta) FROM credit_ledger WHERE user_id = u.id AND source_type = 'generation_debit' AND delta < 0), 0) generationCreditsUsed,
      COALESCE((SELECT COUNT(*) FROM generation_jobs WHERE user_id = u.id), 0) generationJobs
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
      s.creem_subscription_id creemSubscriptionId,
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

  return NextResponse.json({
    ok: true,
    generatedAt: Date.now(),
    stats: { totalUsers, activeSubscribers, refundRequests, pendingRefunds, refundedUsers, canceledSubscriptions },
    subscribers: subscribers.results || [],
    refunds: refunds.results || [],
    canceled: canceled.results || [],
  }, { headers: { "Cache-Control": "no-store" } });
}
