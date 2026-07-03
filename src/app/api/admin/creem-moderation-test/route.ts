import { NextRequest, NextResponse } from "next/server";
import { adminToken, isAdminEmail } from "@/lib/backend/admin";
import { getAuthUser } from "@/lib/backend/auth";
import { moderatePromptWithCreem } from "@/lib/backend/creem";

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

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) return unauthorized();
  const body = await request.json().catch(() => ({})) as { prompt?: string };
  const prompt = typeof body.prompt === "string" && body.prompt.trim().length >= 3
    ? body.prompt.trim()
    : "A clean product photo of a ceramic coffee mug on a wooden desk, natural morning light.";
  const externalId = `admin_creem_smoke_${crypto.randomUUID()}`;
  const result = await moderatePromptWithCreem({ prompt, externalId, timeoutMs: 8000 });

  return NextResponse.json({
    ok: result.ok,
    decision: result.decision,
    status: result.status || null,
    moderationId: result.moderationId || null,
    externalId,
    requestUrl: result.requestUrl || null,
    mode: result.mode || null,
    failClosed: result.decision !== "allow",
    message: result.message || null,
  }, { status: result.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
