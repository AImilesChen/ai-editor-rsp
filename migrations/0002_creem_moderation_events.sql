-- Creem Moderation API audit trail for account review evidence.
-- Stores no raw prompts or secrets; prompt_hash links requests without retaining sensitive text.

CREATE TABLE IF NOT EXISTS moderation_events (
  id TEXT PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  decision TEXT NOT NULL,
  blocked INTEGER NOT NULL DEFAULT 0 CHECK (blocked IN (0, 1)),
  creem_moderation_id TEXT,
  creem_status INTEGER,
  credit_decision TEXT NOT NULL DEFAULT 'not_charged',
  model_called INTEGER NOT NULL DEFAULT 0 CHECK (model_called IN (0, 1)),
  generation_job_id TEXT,
  provider_request_id TEXT,
  error_message TEXT,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moderation_events_user_created_at ON moderation_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_events_decision_created_at ON moderation_events(decision, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_events_external_id ON moderation_events(external_id);
