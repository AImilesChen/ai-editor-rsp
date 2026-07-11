import { NextRequest, NextResponse } from "next/server";
import { getFalResult, getFalStatus } from "@/lib/backend/providers";
import { getAuthUser } from "@/lib/backend/auth";
import { refundCreditForUser } from "@/lib/backend/billing-store";
import { archiveGenerationResult, getOwnedGenerationByRequestId } from "@/lib/backend/generation-store";
import { getSession, recordSafetyStrike, setSessionCookie } from "@/lib/backend/session";
import { checkOutputSafety, logSafetyEvent } from "@/lib/backend/safety";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { requestId } = await context.params;
  if (!/^[a-zA-Z0-9_-]{6,200}$/.test(requestId)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: false, error: "Authentication required." }, { status: 401 });
  const owned = await getOwnedGenerationByRequestId(requestId, user.id);
  if (!owned.ok) return NextResponse.json({ ok: false, error: owned.unavailable ? "Generation store unavailable." : "Not found." }, { status: owned.unavailable ? 503 : 404 });
  const mode = request.nextUrl.searchParams.get("mode") || "status";
  const providerModel = owned.row.provider_model;
  const result = mode === "result" ? await getFalResult(requestId, providerModel) : await getFalStatus(requestId, providerModel);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error, raw: result.raw }, { status: result.status });
  }
  if (mode === "result") {
    const outputSafety = checkOutputSafety(result.raw);
    if (outputSafety.decision !== "allow") {
      const session = await getSession(request);
      const creditsToRefund = Math.max(0, owned.row.credits_charged || owned.row.credits_quoted || 0);
      const accountRefund = creditsToRefund > 0 ? await refundCreditForUser(user, creditsToRefund, owned.row.id) : null;
      const refundedSession = { ...recordSafetyStrike(session, outputSafety.severity), creditsRemaining: accountRefund?.creditsRemaining ?? session.creditsRemaining };
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
    const archive = await archiveGenerationResult({ requestId, user, raw: result.raw, provider: result.provider, model: result.model });
    return NextResponse.json({ ok: true, provider: result.provider, model: result.model, data: archive.data, archive: { archived: archive.archived, publicUrl: archive.publicUrl, reason: archive.reason } });
  }
  return NextResponse.json({ ok: true, provider: result.provider, model: result.model, data: result.raw });
}
