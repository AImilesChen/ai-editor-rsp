import { NextRequest, NextResponse } from "next/server";
import { submitFalGeneration } from "@/lib/backend/providers";
import { getSession, setSessionCookie } from "@/lib/backend/session";

type Body = {
  prompt?: string;
  style?: string;
  ratio?: string;
};

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (session.creditsRemaining <= 0) {
    const response = NextResponse.json({ ok: false, error: "No credits remaining.", code: "CREDITS_EXHAUSTED" }, { status: 402 });
    await setSessionCookie(response, session);
    return response;
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const result = await submitFalGeneration({ prompt: body.prompt || "", style: body.style, ratio: body.ratio });
  if (!result.ok) {
    const response = NextResponse.json({ ok: false, error: result.error, provider: result.provider || "fal.ai" }, { status: result.status });
    await setSessionCookie(response, session);
    return response;
  }

  const nextSession = { ...session, creditsRemaining: Math.max(0, session.creditsRemaining - 1) };
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
