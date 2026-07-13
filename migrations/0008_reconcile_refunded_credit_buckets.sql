-- Reconcile stale paid-credit buckets for accounts whose Stripe refund
-- already revoked the corresponding aggregate balance.
UPDATE credit_buckets
SET remaining = 0,
    expires_at = MIN(expires_at, CAST(strftime('%s', 'now') AS INTEGER) * 1000),
    updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE remaining > 0
  AND EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = credit_buckets.user_id
      AND users.status = 'refunded'
  );
