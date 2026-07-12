import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { accountForPublicUser, billingCheckoutAttemptSeed, markPendingCheckoutStatus, recentPendingCheckoutForUser, recordPendingCheckoutForUser } from "@/lib/backend/billing-store";
import {
  createStripeCheckoutSession,
  expireStripeCheckoutSession,
  retrieveStripeCheckoutSession,
  stripeMode,
  extractCheckoutUrl,
  isBillingPlan,
  missingStripeConfig,
  originFromRequest,
} from "@/lib/backend/stripe";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", error: "Sign in before starting checkout." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { plan?: unknown };
  const plan = typeof body.plan === "string" ? body.plan.toLowerCase() : "";
  if (!isBillingPlan(plan)) {
    return NextResponse.json({ ok: false, code: "INVALID_PLAN", error: "Plan must be starter, creator, or studio." }, { status: 400 });
  }

  const account = await accountForPublicUser(user);
  const endedPlanStatuses = new Set(["canceled", "expired", "refunded", "disputed"]);
  const hasBlockingPaidPlan = account.plan !== "free" && !endedPlanStatuses.has(account.subscriptionStatus);
  if (account.plan === plan && hasBlockingPaidPlan) {
    return NextResponse.json({
      ok: false,
      code: "CURRENT_PLAN",
      error: "You already have this plan on your account. Manage it from Account → Billing.",
      currentPlan: account.plan,
      subscriptionStatus: account.subscriptionStatus,
    }, { status: 409 });
  }

  if (hasBlockingPaidPlan) {
    return NextResponse.json({
      ok: false,
      code: "ACTIVE_PLAN_EXISTS",
      error: "You already have a paid plan on your account. Use Account → Billing before changing plans.",
      currentPlan: account.plan,
      subscriptionStatus: account.subscriptionStatus,
    }, { status: 409 });
  }

  let pendingToClose: { checkoutId: string; status: "expired" | "canceled" } | null = null;
  const pending = await recentPendingCheckoutForUser(user.id);
  if (pending) {
    const previous = await retrieveStripeCheckoutSession(pending.checkoutId);
    if (!previous.ok) {
      return NextResponse.json({
        ok: false,
        code: "CHECKOUT_STATUS_UNAVAILABLE",
        error: "We couldn’t check your previous checkout. Try again, or review your subscription in Account → Billing.",
        retryable: true,
        billingUrl: "/account/billing",
      }, { status: 503 });
    }

    const completed = previous.paymentStatus === "paid" || previous.paymentStatus === "no_payment_required" || previous.checkoutStatus === "complete";
    if (completed) {
      return NextResponse.json({
        ok: true,
        action: "already_paid",
        redirectUrl: "/account/billing?payment=confirmed",
        plan: pending.plan,
        mode: stripeMode(),
      });
    }

    if (previous.checkoutStatus === "open" && pending.plan === plan && previous.checkoutUrl) {
      return NextResponse.json({
        ok: true,
        action: "resumed",
        checkoutUrl: previous.checkoutUrl,
        redirectUrl: previous.checkoutUrl,
        plan,
        mode: stripeMode(),
      });
    }

    if (previous.checkoutStatus === "open" && pending.plan !== plan) {
      const expired = await expireStripeCheckoutSession(pending.checkoutId);
      if (!expired.ok) {
        return NextResponse.json({
          ok: false,
          code: "PREVIOUS_CHECKOUT_OPEN",
          error: "Your previous checkout is still open. Try again, or return to the previous plan before starting a new checkout.",
          retryable: true,
          billingUrl: "/account/billing",
        }, { status: 409 });
      }
      pendingToClose = { checkoutId: pending.checkoutId, status: "canceled" };
    } else if (previous.checkoutStatus === "expired") {
      pendingToClose = { checkoutId: pending.checkoutId, status: "expired" };
    } else if (previous.checkoutStatus !== "open") {
      pendingToClose = { checkoutId: pending.checkoutId, status: "canceled" };
    } else {
      return NextResponse.json({
        ok: false,
        code: "CHECKOUT_URL_UNAVAILABLE",
        error: "Your secure checkout is temporarily unavailable. Try again, or review Account → Billing.",
        retryable: true,
        billingUrl: "/account/billing",
      }, { status: 503 });
    }
  }

  const missing = missingStripeConfig();
  if (missing.length > 0) {
    return NextResponse.json({
      ok: false,
      code: "STRIPE_CONFIG_INCOMPLETE",
      error: "Stripe checkout is not fully configured.",
      missing,
    }, { status: 503 });
  }

  const origin = originFromRequest(request);
  const successUrl = `${origin}/checkout?status=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/pricing?checkout=cancelled&plan=${plan}`;
  const checkoutAttemptSeed = pendingToClose?.checkoutId || await billingCheckoutAttemptSeed(user.id);
  const idempotencyKey = `checkout:${user.id}:${checkoutAttemptSeed}`.replace(/[^a-zA-Z0-9:_-]/g, "_");
  const session = await createStripeCheckoutSession({
    plan,
    userId: user.id,
    email: user.email,
    successUrl,
    cancelUrl,
    idempotencyKey,
  });

  if (!session.ok) {
    return NextResponse.json({
      ok: false,
      code: "STRIPE_CHECKOUT_FAILED",
      error: session.message || "Stripe checkout creation failed.",
      status: session.status,
      mode: stripeMode(),
    }, { status: 502 });
  }

  const payload = session.payload;
  const checkoutUrl = extractCheckoutUrl(payload);
  if (!checkoutUrl) {
    return NextResponse.json({
      ok: false,
      code: "STRIPE_CHECKOUT_URL_MISSING",
      error: "Stripe checkout response did not include a checkout URL.",
      mode: stripeMode(),
    }, { status: 502 });
  }

  const checkoutId = extractCheckoutId(payload);
  if (!checkoutId) {
    return NextResponse.json({
      ok: false,
      code: "STRIPE_CHECKOUT_ID_MISSING",
      error: "Stripe checkout was created without a recoverable session ID. Try again or contact support.",
      retryable: true,
      billingUrl: "/account/billing",
    }, { status: 502 });
  }

  try {
    const stored = await recordPendingCheckoutForUser({ userId: user.id, plan, checkoutId });
    if (!stored.persisted) {
      return NextResponse.json({
        ok: false,
        code: "CHECKOUT_SAVE_FAILED",
        error: "Your secure checkout is ready, but we couldn’t save it safely. Try again to resume the same checkout.",
        retryable: true,
        billingUrl: "/account/billing",
      }, { status: 503 });
    }
  } catch {
    return NextResponse.json({
      ok: false,
      code: "CHECKOUT_SAVE_FAILED",
      error: "Your secure checkout is ready, but we couldn’t save it safely. Try again to resume the same checkout.",
      retryable: true,
      billingUrl: "/account/billing",
    }, { status: 503 });
  }

  if (pendingToClose) {
    await markPendingCheckoutStatus(pendingToClose.checkoutId, pendingToClose.status);
  }

  return NextResponse.json({ ok: true, action: "created", checkoutUrl, redirectUrl: checkoutUrl, plan, mode: stripeMode() });
}

function extractCheckoutId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  for (const key of ["id", "checkout_id", "checkoutId"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  for (const key of ["checkout", "data", "session"]) {
    const nested = extractCheckoutId(record[key]);
    if (nested) return nested;
  }
  return null;
}