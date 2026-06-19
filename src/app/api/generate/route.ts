import { NextRequest, NextResponse } from "next/server";
import { submitFalGeneration } from "@/lib/backend/providers";
import { getAuthUser } from "@/lib/backend/auth";
import { accountForPublicUser, debitCreditForUser } from "@/lib/backend/billing-store";
import { getSession, isSafetyLimited, recordSafetyStrike, setSessionCookie } from "@/lib/backend/session";
import { checkPromptSafety, logSafetyEvent, promptHash } from "@/lib/backend/safety";
import { createGenerationJob, markGenerationFailed, markGenerationSubmitted } from "@/lib/backend/generation-store";
import { quoteGenerationCredits } from "@/lib/generation-pricing";

type Body = {
  prompt?: string;
  style?: string;
  ratio?: string;
  imageDataUrl?: string;
};

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({
      ok: false,
      error: "Please log in to claim your one-time free credits and generate images.",
      code: "LOGIN_REQUIRED",
    }, { status: 401 });
  }

  const session = await getSession(request);
  const billingAccount = await accountForPublicUser(user);
  const availableCredits = billingAccount?.creditsRemaining ?? session.creditsRemaining;
  const body = (await request.json().catch(() => ({}))) as Body;
  if (isSafetyLimited(session)) {
    const response = NextResponse.json({ ok: false, error: "Generation is temporarily limited because of repeated safety-rule violations. Please try again later.", code: "SAFETY_LIMITED" }, { status: 429 });
    await setSessionCookie(response, session);
    return response;
  }
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
  const quote = quoteGenerationCredits({ ratio: body.ratio, imageDataUrl: body.imageDataUrl });
  if (availableCredits < quote.creditsCharged) {
    const response = NextResponse.json({
      ok: false,
      error: `This request needs ${quote.creditsCharged} credits. You have ${availableCredits} remaining.`,
      code: "CREDITS_EXHAUSTED",
      creditsRequired: quote.creditsCharged,
      creditsRemaining: availableCredits,
      pricing: quote,
    }, { status: 402 });
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

  const jobId = `gen_${Date.now()}_${crypto.randomUUID()}`;
  if (user) await createGenerationJob({ jobId, user, prompt, style: body.style, ratio: quote.ratio, creditsQuoted: quote.creditsCharged, pricing: quote });

  const result = await submitFalGeneration({ prompt, style: body.style, ratio: quote.ratio, imageDataUrl: body.imageDataUrl });
  if (!result.ok) {
    if (user) await markGenerationFailed({ jobId, userId: user.id, code: "PROVIDER_SUBMIT_FAILED", message: result.error, raw: result });
    const response = NextResponse.json({ ok: false, error: result.error, provider: result.provider || "fal.ai" }, { status: result.status });
    await setSessionCookie(response, session);
    return response;
  }

  const debit = user ? await debitCreditForUser(user, quote.creditsCharged, jobId) : { creditsRemaining: Math.max(0, session.creditsRemaining - quote.creditsCharged), insufficient: false };
  if (debit.insufficient) {
    if (user) await markGenerationFailed({ jobId, userId: user.id, code: "CREDITS_EXHAUSTED", message: "No credits remaining after provider submission." });
    const response = NextResponse.json({ ok: false, error: "No credits remaining.", code: "CREDITS_EXHAUSTED" }, { status: 402 });
    await setSessionCookie(response, session);
    return response;
  }
  if (user) {
    await markGenerationSubmitted({
      jobId,
      userId: user.id,
      provider: result.provider,
      model: result.model,
      requestId: result.requestId,
      statusUrl: result.statusUrl,
      responseUrl: result.responseUrl,
      creditsCharged: quote.creditsCharged,
      raw: result.raw,
    });
  }

  const nextCreditsRemaining = debit.creditsRemaining;
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
    creditsCharged: quote.creditsCharged,
    pricing: quote,
  });
  await setSessionCookie(response, nextSession);
  return response;
}
