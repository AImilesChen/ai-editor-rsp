-- Stripe P0: non-rollover paid-credit periods and payment-scoped refund accounting.
CREATE TABLE IF NOT EXISTS credit_buckets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT REFERENCES payments(id) ON DELETE SET NULL,
  subscription_id TEXT,
  plan TEXT NOT NULL,
  granted INTEGER NOT NULL CHECK (granted >= 0),
  remaining INTEGER NOT NULL CHECK (remaining >= 0),
  period_start INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  stripe_invoice_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, stripe_invoice_id)
);
CREATE INDEX IF NOT EXISTS idx_credit_buckets_user_expiry ON credit_buckets(user_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_buckets_payment ON credit_buckets(payment_id);
