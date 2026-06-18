import { NextRequest, NextResponse } from "next/server";
import { createAuthUser, OAUTH_STATE_COOKIE, setAuthCookie, siteOrigin } from "@/lib/backend/auth";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export async function GET(request: NextRequest) {
  const origin = siteOrigin(request);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${origin}/login?error=oauth_state`, 302);
  }
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/login?error=oauth_not_configured`, 302);
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json().catch(() => ({})) as GoogleTokenResponse;
  if (!tokenResponse.ok || !tokenData.access_token) {
    console.warn("google_oauth_token_failed", JSON.stringify({ status: tokenResponse.status, error: tokenData.error }));
    return NextResponse.redirect(`${origin}/login?error=oauth_token`, 302);
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userInfo = await userResponse.json().catch(() => ({})) as GoogleUserInfo;
  if (!userResponse.ok || !userInfo.email || userInfo.email_verified === false) {
    return NextResponse.redirect(`${origin}/login?error=oauth_profile`, 302);
  }

  const user = createAuthUser({ email: userInfo.email, name: userInfo.name, picture: userInfo.picture, provider: "google" });
  const response = NextResponse.redirect(`${origin}/account?auth=success`, 302);
  response.cookies.set(OAUTH_STATE_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  await setAuthCookie(response, user);
  return response;
}
