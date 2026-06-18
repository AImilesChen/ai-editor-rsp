import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { submitRefundRequestForUser } from "@/lib/backend/billing-store";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Please log in before requesting a refund." }, { status: 401 });

  let reason = "";
  try {
    const body = await request.json() as { reason?: string };
    reason = typeof body.reason === "string" ? body.reason : "";
  } catch {
    reason = "";
  }

  const result = await submitRefundRequestForUser(user, reason);
  if (!result.ok) {
    const status = result.reason === "No paid plan on this account" ? 400 : 503;
    return NextResponse.json({ ok: false, code: "REFUND_REQUEST_UNAVAILABLE", message: result.reason }, { status });
  }

  return NextResponse.json({
    ok: true,
    requestId: result.requestId,
    duplicate: result.duplicate,
    status: result.account?.subscriptionStatus,
    message: result.duplicate ? "Refund request already submitted." : "Refund request submitted.",
  });
}
