import { NextRequest, NextResponse } from "next/server";
import { getFalResult, getFalStatus } from "@/lib/backend/providers";
import { getAuthUser } from "@/lib/backend/auth";
import { refundCreditForUser } from "@/lib/backend/billing-store";
import { archiveGenerationResult } from "@/lib/backend/generation-store";
import { getSession, recordSafetyStrike, refundCreditOnce, setSessionCookie } from "@/lib/backend/session";
import { checkOutputSafety, logSafetyEvent } from "@/lib/backend/safety";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { requestId } = await context.params;
  const mode = request.nextUrl.searchParams.get("mode") || "status";
  const result = mode === "result" ? await getFalResult(requestId) : await getFalStatus(requestId);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error, raw: result.raw }, { status: result.status });
  }
  if (mode === "result") {
    const outputSafety = checkOutputSafety(result.raw);
    if (outputSafety.decision !== "allow") {
      const session = await getSession(request);
      const user = await getAuthUser(request);
      const accountRefund = user ? await refundCreditForUser(user, 1, requestId) : null;
      const refundedSession = user
        ? { ...recordSafetyStrike(session, outputSafety.severity), creditsRemaining: accountRefund?.creditsRemaining ?? session.creditsRemaining }
        : refundCreditOnce(recordSafetyStrike(session, outputSafety.severity), requestId);
      logSafetyEvent({
        sid: session.sid,
        requestId,
        provider: result.provider,
        category: outputSafety.categories,
        severity: outputSafety.severity,
        decision: outputSafety.decision,
        reason: outputSafety.reason,
        creditDecision: "refunded",
      });
      const response = NextResponse.json({
        ok: false,
        error: outputSafety.message || "The generated output was blocked by our safety checks.",
        code: "OUTPUT_SAFETY_BLOCKED",
        creditsRemaining: refundedSession.creditsRemaining,
        safety: { decision: outputSafety.decision, categories: outputSafety.categories, severity: outputSafety.severity },
      }, { status: 451 });
      await setSessionCookie(response, refundedSession);
      return response;
    }
    const user = await getAuthUser(request);
    const archive = await archiveGenerationResult({ requestId, user, raw: result.raw, provider: result.provider, model: result.model });
    return NextResponse.json({ ok: true, provider: result.provider, model: result.model, data: archive.data, archive: { archived: archive.archived, publicUrl: archive.publicUrl, reason: archive.reason } });
  }
  return NextResponse.json({ ok: true, provider: result.provider, model: result.model, data: result.raw });
}
