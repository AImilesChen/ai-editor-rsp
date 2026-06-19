import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie } from "@/lib/backend/session";
import { getAuthUser } from "@/lib/backend/auth";
import { accountForPublicUser } from "@/lib/backend/billing-store";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({
      ok: true,
      authenticated: false,
      plan: "free",
      creditsRemaining: 0,
      creditLabel: "Log in to claim 3 one-time free credits",
      loginRequired: true,
    });
  }

  const account = await accountForPublicUser(user);
  const session = await getSession(request);
  const response = NextResponse.json({
    ok: true,
    authenticated: true,
    plan: account.plan,
    creditsRemaining: account.creditsRemaining,
    creditLabel: `${account.creditsRemaining} generation credit${account.creditsRemaining === 1 ? "" : "s"}`,
    loginRequired: false,
  });
  await setSessionCookie(response, session);
  return response;
}
