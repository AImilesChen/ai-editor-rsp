-- Reconcile confirmed historical Stripe audit noise without changing balances,
-- subscriptions, refunds, or any currently valid Checkout Session.

-- Stripe Checkout Sessions cannot remain open beyond 24 hours. Historical
-- provider-invalid IDs are legacy placeholders and cannot be resumed.
UPDATE payments
SET status = CASE
      WHEN stripe_checkout_id LIKE 'cs_%' THEN 'expired'
      ELSE 'canceled'
    END,
    updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE status = 'checkout_pending'
  AND (
    created_at <= (CAST(strftime('%s', 'now') AS INTEGER) * 1000) - (24 * 60 * 60 * 1000)
    OR stripe_checkout_id IS NULL
    OR stripe_checkout_id NOT LIKE 'cs_%'
  );

-- Older webhook code treated charge-level refund summaries as canonical refund
-- events. Reconcile only summaries whose charge has a separate, successfully
-- processed canonical refund.created event. This is an audit-status repair only.
UPDATE webhook_events AS summary
SET processed_status = 'processed',
    processed_at = COALESCE(
      processed_at,
      CAST(strftime('%s', 'now') AS INTEGER) * 1000
    ),
    error_message = NULL
WHERE summary.provider = 'stripe'
  AND summary.event_type = 'refund.charge_summary'
  AND summary.processed_status = 'failed'
  AND summary.error_message = 'Missing canonical Stripe refund ID'
  AND json_valid(summary.payload_json)
  AND EXISTS (
    SELECT 1
    FROM webhook_events AS canonical
    WHERE canonical.provider = 'stripe'
      AND canonical.event_type = 'refund.created'
      AND canonical.processed_status = 'processed'
      AND json_valid(canonical.payload_json)
      AND json_extract(canonical.payload_json, '$.data.object.charge') =
          json_extract(summary.payload_json, '$.data.object.id')
  );
