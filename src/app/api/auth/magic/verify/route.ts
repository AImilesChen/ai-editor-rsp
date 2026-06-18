import { NextRequest, NextResponse } from "next/server";
import { createAuthUser, decodeSignedPayload, setAuthCookie, siteOrigin } from "@/lib/backend/auth";

type MagicPayload = {
  email?: string;
  provider?: string;
  nonce?: string;
};

export async function GET(request: NextRequest) {
  const origin = siteOrigin(request);
  const token = request.nextUrl.searchParams.get("token");
  const payload = await decodeSignedPayload<MagicPayload>(token);
  if (!payload?.email || payload.provider !== "email") {
    return NextResponse.redirect(`${origin}/login?error=magic_invalid`, 302);
  }
  const user = createAuthUser({ email: payload.email, provider: "email" });
  const response = NextResponse.redirect(`${origin}/account?auth=success`, 302);
  await setAuthCookie(response, user);
  return response;
}
