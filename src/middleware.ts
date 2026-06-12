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

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
