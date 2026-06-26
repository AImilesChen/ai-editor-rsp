import type { AuthUser } from "@/lib/backend/auth";
import { assetsBucket, billingDb } from "@/lib/backend/cloudflare";
import type { GenerationQuote } from "@/lib/generation-pricing";

const R2_BUCKET_NAME = "ai-editor-rsp-assets";

type FalImage = {
  url?: string;
  content_type?: string;
  width?: number;
  height?: number;
  file_name?: string;
};

type FalResultPayload = {
  images?: FalImage[];
  image?: FalImage;
  [key: string]: unknown;
};

export type CreateGenerationJobInput = {
  jobId: string;
  user: AuthUser;
  prompt: string;
  style?: string;
  ratio?: string;
  creditsQuoted?: number;
  pricing?: GenerationQuote;
};

export async function createGenerationJob(input: CreateGenerationJobInput) {
  const db = await billingDb();
  if (!db) return { persisted: false, reason: "No D1 DB binding" };
  const now = Date.now();
  await db.prepare(`INSERT INTO generation_jobs (id, user_id, status, prompt, quality_tier, image_size, credits_quoted, credits_charged, provider, safety_status, provider_metadata_json, created_at, updated_at)
    VALUES (?, ?, 'created', ?, 'standard', ?, ?, 0, 'fal.ai', 'prompt_allowed', ?, ?, ?)`)
    .bind(input.jobId, input.user.id, input.prompt, input.ratio || null, input.creditsQuoted || 1, JSON.stringify({ style: input.style || null, pricing: input.pricing || null }), now, now)
    .run();
  return { persisted: true };
}

export async function markGenerationSubmitted(input: { jobId: string; userId: string; provider: string; model?: string | null; requestId?: string | null; statusUrl?: string | null; responseUrl?: string | null; creditsCharged?: number; raw?: unknown }) {
  const db = await billingDb();
  if (!db) return { persisted: false, reason: "No D1 DB binding" };
  const now = Date.now();
  await db.prepare(`UPDATE generation_jobs
    SET status = 'submitted', provider = ?, provider_model = ?, provider_request_id = ?, provider_result_url = ?, credits_charged = ?, provider_metadata_json = ?, updated_at = ?
    WHERE id = ? AND user_id = ?`)
    .bind(input.provider, input.model || null, input.requestId || null, input.responseUrl || input.statusUrl || null, input.creditsCharged || 0, JSON.stringify({ statusUrl: input.statusUrl || null, responseUrl: input.responseUrl || null, raw: input.raw || null }), now, input.jobId, input.userId)
    .run();
  return { persisted: true };
}

export async function markGenerationFailed(input: { jobId: string; userId?: string; code?: string; message: string; raw?: unknown }) {
  const db = await billingDb();
  if (!db) return { persisted: false, reason: "No D1 DB binding" };
  const now = Date.now();
  await db.prepare(`UPDATE generation_jobs SET status = 'failed', error_code = ?, error_message = ?, provider_metadata_json = ?, updated_at = ?, completed_at = ? WHERE id = ?`)
    .bind(input.code || "GENERATION_FAILED", input.message, input.raw ? JSON.stringify(input.raw) : null, now, now, input.jobId)
    .run();
  return { persisted: true };
}

export async function getGenerationCreditChargeByRequestId(requestId: string) {
  const db = await billingDb();
  if (!db) return 1;
  const row = await db.prepare("SELECT credits_charged, credits_quoted FROM generation_jobs WHERE provider_request_id = ? ORDER BY created_at DESC LIMIT 1")
    .bind(requestId)
    .first<{ credits_charged: number; credits_quoted: number }>();
  return Math.max(1, row?.credits_charged || row?.credits_quoted || 1);
}

export async function getGenerationProviderModelByRequestId(requestId: string) {
  const db = await billingDb();
  if (!db) return null;
  const row = await db.prepare("SELECT provider_model FROM generation_jobs WHERE provider_request_id = ? ORDER BY created_at DESC LIMIT 1")
    .bind(requestId)
    .first<{ provider_model: string | null }>();
  return row?.provider_model || null;
}

export async function archiveGenerationResult(input: { requestId: string; user?: AuthUser | null; raw: unknown; provider: string; model: string }) {
  const db = await billingDb();
  const bucket = await assetsBucket();
  if (!db || !bucket) return { archived: false, reason: "Missing D1 DB or R2_ASSETS binding", data: input.raw };

  const job = await db.prepare("SELECT id, user_id, status FROM generation_jobs WHERE provider_request_id = ? ORDER BY created_at DESC LIMIT 1")
    .bind(input.requestId)
    .first<{ id: string; user_id: string; status: string }>();
  const userId = input.user?.id || job?.user_id;
  if (!job || !userId || (input.user && input.user.id !== job.user_id)) return { archived: false, reason: "Generation job not found for authenticated user", data: input.raw };

  const payload = normalizeFalPayload(input.raw);
  const sourceImage = firstFalImage(payload);
  if (!sourceImage?.url) {
    await db.prepare("UPDATE generation_jobs SET status = 'completed', provider_metadata_json = ?, updated_at = ?, completed_at = ? WHERE id = ?")
      .bind(JSON.stringify(input.raw), Date.now(), Date.now(), job.id)
      .run();
    return { archived: false, reason: "No image URL in provider result", data: input.raw };
  }

  const already = await db.prepare("SELECT public_asset_url FROM generation_jobs WHERE id = ? AND public_asset_url IS NOT NULL LIMIT 1")
    .bind(job.id)
    .first<{ public_asset_url: string }>();
  if (already?.public_asset_url) return { archived: true, publicUrl: already.public_asset_url, data: replaceFirstImageUrl(payload, already.public_asset_url) };

  const imageResponse = await fetch(sourceImage.url);
  if (!imageResponse.ok) {
    await db.prepare("UPDATE generation_jobs SET status = 'failed', error_code = 'R2_ARCHIVE_FETCH_FAILED', error_message = ?, updated_at = ? WHERE id = ?")
      .bind(`Could not fetch provider image: ${imageResponse.status}`, Date.now(), job.id)
      .run();
    return { archived: false, reason: `Could not fetch provider image: ${imageResponse.status}`, data: input.raw };
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  const contentType = imageResponse.headers.get("content-type") || sourceImage.content_type || "image/jpeg";
  const checksum = await sha256Hex(arrayBuffer);
  const ext = extensionForContentType(contentType);
  const assetId = `asset_${crypto.randomUUID()}`;
  const objectKey = `generations/${userId}/${job.id}/${assetId}.${ext}`;
  await bucket.put(objectKey, arrayBuffer, {
    httpMetadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
    customMetadata: { userId, generationJobId: job.id, provider: input.provider, providerRequestId: input.requestId, checksumSha256: checksum },
  });

  const publicUrl = `/api/assets/${assetId}`;
  const now = Date.now();
  await db.prepare(`INSERT INTO image_assets (id, user_id, generation_job_id, r2_bucket, r2_object_key, content_type, size_bytes, width, height, checksum_sha256, visibility, source_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'private', ?, ?)`)
    .bind(assetId, userId, job.id, R2_BUCKET_NAME, objectKey, contentType, arrayBuffer.byteLength, sourceImage.width || null, sourceImage.height || null, checksum, sourceImage.url, now)
    .run();
  await db.prepare(`UPDATE generation_jobs SET status = 'completed', r2_bucket = ?, r2_object_key = ?, public_asset_url = ?, provider_metadata_json = ?, updated_at = ?, completed_at = ? WHERE id = ?`)
    .bind(R2_BUCKET_NAME, objectKey, publicUrl, JSON.stringify(input.raw), now, now, job.id)
    .run();

  return { archived: true, assetId, publicUrl, r2ObjectKey: objectKey, data: replaceFirstImageUrl(payload, publicUrl) };
}

export async function getImageAssetForRequest(input: { assetId: string; user?: AuthUser | null }) {
  const db = await billingDb();
  const bucket = await assetsBucket();
  if (!db || !bucket) return null;
  const row = await db.prepare("SELECT id, user_id, r2_object_key, content_type FROM image_assets WHERE id = ? AND deleted_at IS NULL")
    .bind(input.assetId)
    .first<{ id: string; user_id: string; r2_object_key: string; content_type: string }>();
  if (!row) return null;
  // Current product displays generated images directly in the browser; keep the
  // object URL unguessable via asset UUID + private R2, but do not require a
  // signed cookie for the <img> tag. Ownership remains available for future gallery APIs.
  const object = await bucket.get(row.r2_object_key);
  if (!object) return null;
  return { object, contentType: row.content_type || object.httpMetadata?.contentType || "image/jpeg" };
}

function normalizeFalPayload(raw: unknown): FalResultPayload {
  return raw && typeof raw === "object" ? { ...(raw as FalResultPayload) } : {};
}

function firstFalImage(payload: FalResultPayload): FalImage | null {
  if (Array.isArray(payload.images) && payload.images.length > 0) return payload.images[0] || null;
  if (payload.image && typeof payload.image === "object") return payload.image;
  return null;
}

function replaceFirstImageUrl(payload: FalResultPayload, url: string) {
  const next: FalResultPayload = { ...payload };
  if (Array.isArray(payload.images) && payload.images.length > 0) {
    next.images = [{ ...payload.images[0], url }, ...payload.images.slice(1)];
  } else if (payload.image && typeof payload.image === "object") {
    next.image = { ...payload.image, url };
    next.images = [{ ...payload.image, url }];
  }
  return next;
}

async function sha256Hex(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function extensionForContentType(contentType: string) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}
