import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "aieditorrspediting.org";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");

  const isCanonicalHost = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;

  if (isCanonicalHost && (host === `www.${CANONICAL_HOST}` || proto === "http")) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self' https://checkout.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://api.stripe.com https://*.fal.ai https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com; frame-src https://js.stripe.com https://checkout.stripe.com; font-src 'self' data:");
  if (isCanonicalHost) response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  return response;
}

export const config = {
  matcher: "/:path*",
};
