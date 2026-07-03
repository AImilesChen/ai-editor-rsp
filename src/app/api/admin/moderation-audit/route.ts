import { NextRequest, NextResponse } from "next/server";
import { adminToken, isAdminEmail } from "@/lib/backend/admin";
import { getAuthUser } from "@/lib/backend/auth";
import { billingDb } from "@/lib/backend/cloudflare";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function requestToken(request: NextRequest) {
  const auth = request.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return request.headers.get("x-admin-token") || "";
}

async function isAuthorized(request: NextRequest) {
  const expected = adminToken();
  const token = requestToken(request);
  if (expected && token && token === expected) return true;
  const user = await getAuthUser(request);
  return isAdminEmail(user?.email);
}

function unauthorized() {
  return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) return unauthorized();
  const db = await billingDb();
  if (!db) return NextResponse.json({ ok: false, code: "DB_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const limitParam = Number(request.nextUrl.searchParams.get("limit") || 20);
  const limit = Math.max(1, Math.min(50, Number.isFinite(limitParam) ? limitParam : 20));
  const rows = await db.prepare(`SELECT
      external_id AS externalId,
      user_id AS userId,
      endpoint,
      prompt_hash AS promptHash,
      decision,
      blocked,
      creem_moderation_id AS creemModerationId,
      creem_status AS creemStatus,
      credit_decision AS creditDecision,
      model_called AS modelCalled,
      generation_job_id AS generationJobId,
      provider_request_id AS providerRequestId,
      error_message AS errorMessage,
      metadata_json AS metadataJson,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM moderation_events
    ORDER BY created_at DESC
    LIMIT ?`)
    .bind(limit)
    .all<Record<string, unknown>>();

  return NextResponse.json({
    ok: true,
    items: (rows.results || []).map((row) => ({
      ...row,
      blocked: Boolean(row.blocked),
      modelCalled: Boolean(row.modelCalled),
      metadata: parseJson(row.metadataJson),
      metadataJson: undefined,
    })),
  }, { headers: { "Cache-Control": "no-store" } });
}

function parseJson(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
