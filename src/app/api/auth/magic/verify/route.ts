import { NextRequest, NextResponse } from "next/server";
import { createAuthUser, decodeSignedPayload, safeRedirectPath, setAuthCookie, siteOrigin } from "@/lib/backend/auth";

type MagicPayload = {
  email?: string;
  provider?: string;
  nonce?: string;
  next?: string;
};

export async function GET(request: NextRequest) {
  const origin = siteOrigin(request);
  const token = request.nextUrl.searchParams.get("token");
  const payload = await decodeSignedPayload<MagicPayload>(token);
  if (!payload?.email || payload.provider !== "email") {
    return NextResponse.redirect(`${origin}/login?error=magic_invalid`, 302);
  }
  const user = createAuthUser({ email: payload.email, provider: "email" });
  const nextPath = safeRedirectPath(payload.next);
  const redirectUrl = new URL(nextPath, origin);
  redirectUrl.searchParams.set("auth", "success");
  const response = NextResponse.redirect(redirectUrl.toString(), 302);
  await setAuthCookie(response, user);
  return response;
}
