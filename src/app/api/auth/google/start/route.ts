import { NextRequest, NextResponse } from "next/server";
import { OAUTH_NEXT_COOKIE, OAUTH_STATE_COOKIE, safeRedirectPath, siteOrigin } from "@/lib/backend/auth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "GOOGLE_CLIENT_ID is not configured." }, { status: 503 });
  }

  const origin = siteOrigin(request);
  const state = crypto.randomUUID();
  const nextPath = safeRedirectPath(request.nextUrl.searchParams.get("next"));
  const redirectUri = `${origin}/api/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(url.toString(), 302);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  response.cookies.set(OAUTH_NEXT_COOKIE, nextPath, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
