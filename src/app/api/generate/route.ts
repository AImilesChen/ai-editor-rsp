import { NextRequest, NextResponse } from "next/server";
import { submitFalGeneration } from "@/lib/backend/providers";
import { getAuthUser } from "@/lib/backend/auth";
import { accountForPublicUser, debitCreditForUser } from "@/lib/backend/billing-store";
import { getSession, isSafetyLimited, recordSafetyStrike, setSessionCookie } from "@/lib/backend/session";
import { checkPromptSafety, logSafetyEvent, promptHash, rewritePromptForSoftSafety } from "@/lib/backend/safety";
import { createGenerationJob, markGenerationFailed, markGenerationSubmitted } from "@/lib/backend/generation-store";
import { quoteGenerationCredits } from "@/lib/generation-pricing";

type Body = {
  prompt?: string;
  style?: string;
  ratio?: string;
  imageDataUrl?: string;
  editRegion?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
};

function isSupportedImageReference(value: string) {
  return value.startsWith("data:image/") || value.startsWith("https://");
}

function normalizeEditRegion(region: Body["editRegion"]) {
  if (!region) return undefined;
  const values = [region.x, region.y, region.width, region.height];
  if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) return undefined;
  const x = Math.min(100, Math.max(0, Number(region.x)));
  const y = Math.min(100, Math.max(0, Number(region.y)));
  const width = Math.min(100 - x, Math.max(1, Number(region.width)));
  const height = Math.min(100 - y, Math.max(1, Number(region.height)));
  return { x, y, width, height };
}

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
  if (body.imageDataUrl && !isSupportedImageReference(body.imageDataUrl)) {
    const response = NextResponse.json({ ok: false, error: "Uploaded image must be PNG, JPG, WebP, or a secure generated image URL.", code: "INVALID_IMAGE" }, { status: 400 });
    await setSessionCookie(response, session);
    return response;
  }
  if (body.imageDataUrl && body.imageDataUrl.length > 7_000_000) {
    const response = NextResponse.json({ ok: false, error: "Uploaded image is too large. Use an image under 5 MB.", code: "IMAGE_TOO_LARGE" }, { status: 413 });
    await setSessionCookie(response, session);
    return response;
  }
  const quote = quoteGenerationCredits({ ratio: body.ratio, imageDataUrl: body.imageDataUrl });
  if (["refund_requested", "refunded", "disputed"].includes(billingAccount.subscriptionStatus)) {
    const response = NextResponse.json({
      ok: false,
      error: "Credits are locked while your refund is being reviewed. Please wait for Creem refund confirmation or contact support.",
      code: "CREDITS_LOCKED_FOR_REFUND",
      creditsRemaining: 0,
      pricing: quote,
    }, { status: 403 });
    await setSessionCookie(response, { ...session, creditsRemaining: 0 });
    return response;
  }
  const editRegion = normalizeEditRegion(body.editRegion);
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
  if (safety.decision === "block") {
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
      code: "SAFETY_BLOCKED",
      safety: { decision: safety.decision, categories: safety.categories, severity: safety.severity },
    }, { status: 451 });
    await setSessionCookie(response, nextSession);
    return response;
  }
  if (safety.decision === "review") {
    logSafetyEvent({
      sid: session.sid,
      promptHash: await promptHash(prompt),
      category: safety.categories,
      severity: safety.severity,
      decision: safety.decision,
      reason: safety.reason,
      creditDecision: "unchanged",
    });
  }
  const generationPrompt = rewritePromptForSoftSafety(prompt, safety);

  const jobId = `gen_${Date.now()}_${crypto.randomUUID()}`;
  if (user) await createGenerationJob({ jobId, user, prompt: generationPrompt, style: body.style, ratio: quote.ratio, creditsQuoted: quote.creditsCharged, pricing: quote });

  const result = await submitFalGeneration({ prompt: generationPrompt, style: body.style, ratio: quote.ratio, imageDataUrl: body.imageDataUrl, editRegion });
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
