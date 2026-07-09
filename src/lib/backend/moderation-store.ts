import { billingDb } from "@/lib/backend/cloudflare";
import type { StripePromptModerationResult } from "@/lib/backend/stripe";

export type ModerationCreditDecision = "not_charged" | "charged" | "refunded" | "unchanged";

export async function recordModerationEvent(input: {
  externalId: string;
  userId?: string | null;
  endpoint: string;
  promptHash: string;
  moderation: StripePromptModerationResult;
  creditDecision?: ModerationCreditDecision;
  modelCalled?: boolean;
  generationJobId?: string | null;
  providerRequestId?: string | null;
}) {
  const db = await billingDb();
  const now = Date.now();
  const blocked = input.moderation.decision !== "allow";
  const metadata = {
    stripeMode: input.moderation.mode || null,
    requestUrl: input.moderation.requestUrl || null,
    payloadShape: sanitizeModerationPayloadShape(input.moderation.payload),
  };

  if (!db) {
    console.warn("ai_editor_rsp_moderation_event", JSON.stringify({
      externalId: input.externalId,
      userId: input.userId || null,
      endpoint: input.endpoint,
      promptHash: input.promptHash,
      decision: input.moderation.decision,
      blocked,
      stripeModerationId: input.moderation.moderationId || null,
      stripeStatus: input.moderation.status || null,
      creditDecision: input.creditDecision || "not_charged",
      modelCalled: Boolean(input.modelCalled),
      timestamp: new Date(now).toISOString(),
    }));
    return { persisted: false, reason: "No D1 DB binding" };
  }

  try {
    await db.prepare(`INSERT INTO moderation_events (
      id, external_id, user_id, endpoint, prompt_hash, decision, blocked, stripe_moderation_id,
      stripe_status, credit_decision, model_called, generation_job_id, provider_request_id,
      error_message, metadata_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(external_id) DO UPDATE SET
      decision = excluded.decision,
      blocked = excluded.blocked,
      stripe_moderation_id = excluded.stripe_moderation_id,
      stripe_status = excluded.stripe_status,
      credit_decision = excluded.credit_decision,
      model_called = excluded.model_called,
      generation_job_id = COALESCE(excluded.generation_job_id, moderation_events.generation_job_id),
      provider_request_id = COALESCE(excluded.provider_request_id, moderation_events.provider_request_id),
      error_message = excluded.error_message,
      metadata_json = excluded.metadata_json,
      updated_at = excluded.updated_at`)
      .bind(
        `mod_${crypto.randomUUID()}`,
        input.externalId,
        input.userId || null,
        input.endpoint,
        input.promptHash,
        input.moderation.decision,
        blocked ? 1 : 0,
        input.moderation.moderationId || null,
        input.moderation.status || null,
        input.creditDecision || "not_charged",
        input.modelCalled ? 1 : 0,
        input.generationJobId || null,
        input.providerRequestId || null,
        input.moderation.message || null,
        JSON.stringify(metadata),
        now,
        now,
      )
      .run();
    return { persisted: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to write moderation audit event.";
    console.warn("ai_editor_rsp_moderation_event_persist_failed", JSON.stringify({ externalId: input.externalId, decision: input.moderation.decision, message }));
    return { persisted: false, reason: message };
  }
}

export async function updateModerationEventOutcome(input: {
  externalId: string;
  creditDecision?: ModerationCreditDecision;
  modelCalled?: boolean;
  generationJobId?: string | null;
  providerRequestId?: string | null;
  errorMessage?: string | null;
}) {
  const db = await billingDb();
  if (!db) return { persisted: false, reason: "No D1 DB binding" };
  const now = Date.now();
  try {
    await db.prepare(`UPDATE moderation_events
      SET credit_decision = COALESCE(?, credit_decision),
          model_called = COALESCE(?, model_called),
          generation_job_id = COALESCE(?, generation_job_id),
          provider_request_id = COALESCE(?, provider_request_id),
          error_message = COALESCE(?, error_message),
          updated_at = ?
      WHERE external_id = ?`)
      .bind(
        input.creditDecision || null,
        typeof input.modelCalled === "boolean" ? (input.modelCalled ? 1 : 0) : null,
        input.generationJobId || null,
        input.providerRequestId || null,
        input.errorMessage || null,
        now,
        input.externalId,
      )
      .run();
    return { persisted: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update moderation audit event.";
    console.warn("ai_editor_rsp_moderation_event_update_failed", JSON.stringify({ externalId: input.externalId, message }));
    return { persisted: false, reason: message };
  }
}

function sanitizeModerationPayloadShape(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  return {
    keys: Object.keys(record).slice(0, 12),
    hasDecision: typeof record.decision === "string",
    hasId: typeof record.id === "string",
  };
}
