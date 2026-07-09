import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { accountForPublicUser, hasRecentPendingCheckout, recordPendingCheckoutForUser } from "@/lib/backend/billing-store";
import {
  createStripeCheckoutSession,
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

  if (await hasRecentPendingCheckout(user.id)) {
    return NextResponse.json({
      ok: false,
      code: "CHECKOUT_ALREADY_STARTED",
      error: "A checkout was already started recently. If you completed payment, go to Account → Billing instead of starting a second checkout.",
      currentPlan: account.plan,
      subscriptionStatus: account.subscriptionStatus,
    }, { status: 409 });
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
  const session = await createStripeCheckoutSession({
    plan,
    userId: user.id,
    email: user.email,
    successUrl,
    cancelUrl,
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

  const checkoutId = extractCheckoutId(payload) || `checkout_${Date.now()}_${crypto.randomUUID()}`;
  await recordPendingCheckoutForUser({ userId: user.id, plan, checkoutId });

  return NextResponse.json({ ok: true, checkoutUrl, plan, mode: stripeMode() });
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