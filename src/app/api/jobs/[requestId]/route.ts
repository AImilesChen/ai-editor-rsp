import { NextRequest, NextResponse } from "next/server";
import { getFalResult, getFalStatus } from "@/lib/backend/providers";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { requestId } = await context.params;
  const mode = request.nextUrl.searchParams.get("mode") || "status";
  const result = mode === "result" ? await getFalResult(requestId) : await getFalStatus(requestId);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error, raw: result.raw }, { status: result.status });
  }
  return NextResponse.json({ ok: true, provider: result.provider, model: result.model, data: result.raw });
}
