-- Claim token prevents concurrent expiry reconciliation from applying the same bucket twice.
ALTER TABLE credit_buckets ADD COLUMN expiry_claim TEXT;

CREATE INDEX IF NOT EXISTS idx_credit_buckets_expiry_claim
  ON credit_buckets(user_id, expiry_claim);
