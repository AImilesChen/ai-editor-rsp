import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { billingDb } from "@/lib/backend/cloudflare";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GenerationHistoryRow = {
  id: string;
  status: string;
  prompt: string;
  imageSize: string | null;
  creditsQuoted: number;
  creditsCharged: number;
  publicAssetUrl: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
};

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED", error: "Please log in to view generation history." }, { status: 401, headers: noStoreHeaders() });
  }

  const db = await billingDb();
  if (!db) {
    return NextResponse.json({ ok: false, code: "DB_UNAVAILABLE", error: "Generation history is temporarily unavailable." }, { status: 503, headers: noStoreHeaders() });
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit") || 30);
  const limit = Math.max(1, Math.min(60, Number.isFinite(limitParam) ? Math.floor(limitParam) : 30));

  const rows = await db.prepare(`SELECT
      id,
      status,
      prompt,
      image_size AS imageSize,
      credits_quoted AS creditsQuoted,
      credits_charged AS creditsCharged,
      public_asset_url AS publicAssetUrl,
      error_code AS errorCode,
      error_message AS errorMessage,
      created_at AS createdAt,
      updated_at AS updatedAt,
      completed_at AS completedAt
    FROM generation_jobs
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?`)
    .bind(user.id, limit)
    .all<GenerationHistoryRow>();

  return NextResponse.json({ ok: true, items: rows.results || [] }, { headers: noStoreHeaders() });
}

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };
}
