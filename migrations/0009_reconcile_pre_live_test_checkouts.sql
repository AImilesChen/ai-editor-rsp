-- Production cutover reconciliation: Test Checkout Sessions cannot be
-- retrieved after the Worker switches to a Live Stripe key. Retire only
-- pre-cutover Test Sessions that are still marked pending locally.
UPDATE payments
SET status = 'canceled',
    updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE status = 'checkout_pending'
  AND stripe_checkout_id LIKE 'cs_test_%'
  AND created_at <= 1783938000000;
