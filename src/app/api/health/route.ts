import { NextRequest, NextResponse } from "next/server";
import { creemConfigured, falConfigured } from "@/lib/backend/providers";
import { getSession, setSessionCookie } from "@/lib/backend/session";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const response = NextResponse.json({
    ok: true,
    service: "ai-editor-rsp-backend",
    stage: "p0-lite",
    providers: {
      fal: falConfigured() ? "configured" : "missing",
      creem: creemConfigured() ? "configured" : "missing",
    },
    session: {
      plan: session.plan,
      creditsRemaining: session.creditsRemaining,
    },
  });
  await setSessionCookie(response, session);
  return response;
}
