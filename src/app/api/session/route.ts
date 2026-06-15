import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie } from "@/lib/backend/session";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const response = NextResponse.json({
    ok: true,
    plan: session.plan,
    creditsRemaining: session.creditsRemaining,
    creditLabel: `${session.creditsRemaining} lifetime generation${session.creditsRemaining === 1 ? "" : "s"}`,
  });
  await setSessionCookie(response, session);
  return response;
}
