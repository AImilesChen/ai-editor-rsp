-- Rename legacy Creem moderation audit columns to Stripe moderation audit columns.
-- This preserves existing audit rows while matching the Stripe-only runtime code.

ALTER TABLE moderation_events RENAME COLUMN creem_moderation_id TO stripe_moderation_id;
ALTER TABLE moderation_events RENAME COLUMN creem_status TO stripe_status;
