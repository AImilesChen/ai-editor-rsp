import { NextRequest, NextResponse } from "next/server";
import { submitFalGeneration } from "@/lib/backend/providers";
import { getAuthUser } from "@/lib/backend/auth";
import { accountForPublicUser, debitCreditForUser } from "@/lib/backend/billing-store";
import { getSession, isSafetyLimited, recordSafetyStrike, setSessionCookie } from "@/lib/backend/session";
import { checkPromptSafety, logSafetyEvent, promptHash } from "@/lib/backend/safety";

type Body = {
  prompt?: string;
  style?: string;
  ratio?: string;
  imageDataUrl?: string;
};

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = await getAuthUser(request);
  const billingAccount = user ? await accountForPublicUser(user) : null;
  const availableCredits = billingAccount?.creditsRemaining ?? session.creditsRemaining;
  if (isSafetyLimited(session)) {
    const response = NextResponse.json({ ok: false, error: "Generation is temporarily limited because of repeated safety-rule violations. Please try again later.", code: "SAFETY_LIMITED" }, { status: 429 });
    await setSessionCookie(response, session);
    return response;
  }
  if (availableCredits <= 0) {
    const response = NextResponse.json({ ok: false, error: "No credits remaining.", code: "CREDITS_EXHAUSTED" }, { status: 402 });
    await setSessionCookie(response, session);
    return response;
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  if (body.imageDataUrl && !body.imageDataUrl.startsWith("data:image/")) {
    const response = NextResponse.json({ ok: false, error: "Uploaded image must be PNG, JPG, or WebP.", code: "INVALID_IMAGE" }, { status: 400 });
    await setSessionCookie(response, session);
    return response;
  }
  if (body.imageDataUrl && body.imageDataUrl.length > 7_000_000) {
    const response = NextResponse.json({ ok: false, error: "Uploaded image is too large. Use an image under 5 MB.", code: "IMAGE_TOO_LARGE" }, { status: 413 });
    await setSessionCookie(response, session);
    return response;
  }
  const prompt = body.prompt || "";
  const safety = checkPromptSafety(prompt);
  if (safety.decision !== "allow") {
    const nextSession = recordSafetyStrike(session, safety.severity);
    logSafetyEvent({
      sid: session.sid,
      promptHash: await promptHash(prompt),
      category: safety.categories,
      severity: safety.severity,
      decision: safety.decision,
      reason: safety.reason,
      creditDecision: "not_charged",
    });
    const response = NextResponse.json({
      ok: false,
      error: safety.message || "This prompt may violate our content safety rules. Please revise it and try again.",
      code: safety.decision === "block" ? "SAFETY_BLOCKED" : "SAFETY_REVIEW_REQUIRED",
      safety: { decision: safety.decision, categories: safety.categories, severity: safety.severity },
    }, { status: safety.decision === "block" ? 451 : 400 });
    await setSessionCookie(response, nextSession);
    return response;
  }

  const result = await submitFalGeneration({ prompt, style: body.style, ratio: body.ratio, imageDataUrl: body.imageDataUrl });
  if (!result.ok) {
    const response = NextResponse.json({ ok: false, error: result.error, provider: result.provider || "fal.ai" }, { status: result.status });
    await setSessionCookie(response, session);
    return response;
  }

  const nextCreditsRemaining = user ? (await debitCreditForUser(user, 1)).creditsRemaining : Math.max(0, session.creditsRemaining - 1);
  const nextSession = { ...session, creditsRemaining: Math.max(0, nextCreditsRemaining) };
  const response = NextResponse.json({
    ok: true,
    job: {
      provider: result.provider,
      model: result.model,
      requestId: result.requestId,
      statusUrl: result.statusUrl,
      responseUrl: result.responseUrl,
    },
    creditsRemaining: nextSession.creditsRemaining,
  });
  await setSessionCookie(response, nextSession);
  return response;
}
