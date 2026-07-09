-- Rename legacy Creem billing columns to Stripe billing columns after moving to Stripe-only checkout.
-- Keep existing user/subscription/payment/refund rows while changing the schema used by runtime code.

ALTER TABLE users RENAME COLUMN creem_customer_id TO stripe_customer_id;
ALTER TABLE subscriptions RENAME COLUMN creem_subscription_id TO stripe_subscription_id;
ALTER TABLE subscriptions RENAME COLUMN creem_customer_id TO stripe_customer_id;
ALTER TABLE payments RENAME COLUMN creem_checkout_id TO stripe_checkout_id;
ALTER TABLE payments RENAME COLUMN creem_transaction_id TO stripe_transaction_id;
ALTER TABLE payments RENAME COLUMN creem_invoice_id TO stripe_invoice_id;
ALTER TABLE refund_requests RENAME COLUMN creem_refund_id TO stripe_refund_id;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_checkout_id ON payments(stripe_checkout_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_stripe_refund_id ON refund_requests(stripe_refund_id);
