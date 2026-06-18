-- AI Editor RSP production persistence schema
-- D1 database: ai_editor_rsp
-- Purpose: billing ledger, Creem webhook idempotency, generation jobs, R2 image archive, refund/audit trail.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  credits_remaining INTEGER NOT NULL DEFAULT 0 CHECK (credits_remaining >= 0),
  creem_customer_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_creem_customer_id ON users(creem_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creem_subscription_id TEXT UNIQUE,
  creem_customer_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start INTEGER,
  current_period_end INTEGER,
  canceled_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creem_customer_id ON subscriptions(creem_customer_id);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id TEXT REFERENCES subscriptions(id) ON DELETE SET NULL,
  creem_checkout_id TEXT,
  creem_transaction_id TEXT UNIQUE,
  creem_invoice_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount_cents INTEGER NOT NULL DEFAULT 0 CHECK (amount_cents >= 0),
  raw_event_id TEXT,
  paid_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_creem_checkout_id ON payments(creem_checkout_id);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  reason TEXT,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id_created_at ON credit_ledger(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_source ON credit_ledger(source_type, source_id);

CREATE TABLE IF NOT EXISTS generation_jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  quality_tier TEXT NOT NULL DEFAULT 'standard',
  image_size TEXT,
  credits_quoted INTEGER NOT NULL DEFAULT 1 CHECK (credits_quoted >= 0),
  credits_charged INTEGER NOT NULL DEFAULT 0 CHECK (credits_charged >= 0),
  provider TEXT NOT NULL DEFAULT 'fal',
  provider_model TEXT,
  provider_request_id TEXT,
  provider_result_url TEXT,
  r2_bucket TEXT,
  r2_object_key TEXT,
  public_asset_url TEXT,
  error_code TEXT,
  error_message TEXT,
  safety_status TEXT,
  safety_metadata_json TEXT,
  provider_metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id_created_at ON generation_jobs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_provider_request_id ON generation_jobs(provider_request_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_r2_object_key ON generation_jobs(r2_object_key);

CREATE TABLE IF NOT EXISTS image_assets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generation_job_id TEXT REFERENCES generation_jobs(id) ON DELETE SET NULL,
  r2_bucket TEXT NOT NULL,
  r2_object_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL DEFAULT 'image/png',
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  checksum_sha256 TEXT,
  visibility TEXT NOT NULL DEFAULT 'private',
  source_url TEXT,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_image_assets_user_id_created_at ON image_assets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_image_assets_generation_job_id ON image_assets(generation_job_id);

CREATE TABLE IF NOT EXISTS refund_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT REFERENCES payments(id) ON DELETE SET NULL,
  subscription_id TEXT REFERENCES subscriptions(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  reason TEXT,
  credits_at_request INTEGER NOT NULL DEFAULT 0,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  creem_refund_id TEXT UNIQUE,
  requested_at INTEGER NOT NULL,
  resolved_at INTEGER,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id_requested_at ON refund_requests(user_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_creem_refund_id ON refund_requests(creem_refund_id);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  dedupe_key TEXT NOT NULL UNIQUE,
  related_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  related_subscription_id TEXT,
  related_payment_id TEXT,
  payload_json TEXT NOT NULL,
  signature_verified INTEGER NOT NULL DEFAULT 0 CHECK (signature_verified IN (0, 1)),
  processed_status TEXT NOT NULL DEFAULT 'received',
  processed_at INTEGER,
  error_message TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_type_created_at ON webhook_events(provider, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_event_id ON webhook_events(provider_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_related_user_id ON webhook_events(related_user_id);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  reason TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target ON admin_audit_logs(target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor_created_at ON admin_audit_logs(actor, created_at DESC);
