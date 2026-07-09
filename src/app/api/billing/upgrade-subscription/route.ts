import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { isBillingPlan } from "@/lib/backend/stripe";
import { previewSubscriptionUpgradeForUser, upgradeSubscriptionForUser } from "@/lib/backend/billing-store";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Please log in before upgrading." }, { status: 401 });

  const targetPlan = request.nextUrl.searchParams.get("plan")?.toLowerCase();
  if (!isBillingPlan(targetPlan)) {
    return NextResponse.json({ ok: false, code: "INVALID_PLAN", message: "Plan must be starter, creator, or studio." }, { status: 400 });
  }

  const result = await previewSubscriptionUpgradeForUser(user, targetPlan);
  if (!result.ok) return NextResponse.json(result, { status: result.code === "SUBSCRIPTION_ID_MISSING" ? 409 : 400 });

  return NextResponse.json({ ok: true, preview: result.preview });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Please log in before upgrading." }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { plan?: unknown };
  const targetPlan = typeof body.plan === "string" ? body.plan.toLowerCase() : "";
  if (!isBillingPlan(targetPlan)) {
    return NextResponse.json({ ok: false, code: "INVALID_PLAN", message: "Plan must be starter, creator, or studio." }, { status: 400 });
  }

  const result = await upgradeSubscriptionForUser(user, targetPlan);
  if (!result.ok) {
    const status = result.code === "AUTH_REQUIRED" ? 401
      : result.code === "SUBSCRIPTION_ID_MISSING" || result.code === "TARGET_PLAN_NOT_HIGHER" || result.code === "NO_PAID_PLAN" ? 409
      : result.code === "STRIPE_UPGRADE_FAILED" ? 502
      : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json({ ok: true, duplicate: result.duplicate || false, account: result.account, preview: result.preview });
}
