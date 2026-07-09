import { NextRequest, NextResponse } from "next/server";
import { reconcileAllPendingStripeRefunds } from "@/lib/backend/billing-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = request.headers.get("x-cron-secret") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 20;
  const result = await reconcileAllPendingStripeRefunds(Number.isFinite(limit) ? limit : 20);
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
