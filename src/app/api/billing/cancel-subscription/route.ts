import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { submitSubscriptionCancellationForUser } from "@/lib/backend/billing-store";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Please log in before canceling a subscription." }, { status: 401 });

  const result = await submitSubscriptionCancellationForUser(user);
  if (!result.ok) {
    const status = result.reason === "No paid subscription on this account" ? 400 : result.reason?.includes("subscription ID") ? 409 : result.status || 503;
    return NextResponse.json({ ok: false, code: "CANCEL_SUBSCRIPTION_UNAVAILABLE", message: result.reason }, { status });
  }

  return NextResponse.json({
    ok: true,
    duplicate: result.duplicate,
    status: result.account?.subscriptionStatus,
    message: result.duplicate ? "Subscription is already canceled." : "Subscription canceled successfully.",
  });
}
