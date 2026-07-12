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
  const refundResult = result as {
    ok?: boolean;
    reason?: string;
    code?: string;
    status?: number;
    requestId?: string;
    duplicate?: boolean;
    account?: { subscriptionStatus?: string };
    subscriptionCanceled?: boolean;
  };
  if (!refundResult.ok) {
    const clientErrorReasons = new Set([
      "No paid plan on this account",
      "This account has already been refunded",
      "Refund requests are available within 7 days of payment.",
      "Refund requests are available only when no more than 20% of paid credits have been used.",
    ]);
    const status = clientErrorReasons.has(refundResult.reason || "") || refundResult.code ? 400 : 503;
    return NextResponse.json({ ok: false, code: refundResult.code || "REFUND_REQUEST_UNAVAILABLE", message: refundResult.reason }, { status });
  }

  return NextResponse.json({
    ok: true,
    requestId: refundResult.requestId,
    duplicate: refundResult.duplicate,
    status: refundResult.account?.subscriptionStatus,
    subscriptionCanceled: refundResult.subscriptionCanceled,
    message: refundResult.duplicate ? "Refund request already submitted." : refundResult.subscriptionCanceled ? "Refund request submitted. Future renewal canceled before provider refund handling." : "Refund request submitted.",
  });
}
