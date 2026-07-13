import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [checkout, webhook, billing, stripe, migration, reconciliationMigration, expiryClaimMigration, pkg] = await Promise.all([
  read("src/app/api/billing/checkout/route.ts"),
  read("src/app/api/webhooks/stripe/route.ts"),
  read("src/lib/backend/billing-store.ts"),
  read("src/lib/backend/stripe.ts"),
  read("migrations/0005_stripe_p0_credit_buckets.sql").catch(() => ""),
  read("migrations/0006_reconcile_stripe_p1_audit.sql").catch(() => ""),
  read("migrations/0007_credit_bucket_expiry_claim.sql").catch(() => ""),
  read("package.json"),
]);

assert.match(checkout, /if \(completed\)[\s\S]{0,450}action: "already_paid"/, "paid/complete checkout must never create another session");
assert.doesNotMatch(checkout, /completed && !hasBlockingPaidPlan[\s\S]{0,250}pendingToClose/, "local webhook lag must not turn a paid checkout into a second order");
assert.match(webhook, /WEBHOOK_PERSISTENCE_FAILED/);
assert.match(webhook, /eventType === "refund\.charge_summary"[\s\S]{0,220}recordStripeWebhookEvent/, "charge summary events without canonical refund IDs must be recorded without mutating refund state");
assert.match(webhook, /status: 503/);
assert.match(billing, /STALE_STRIPE_CHECKOUT_MAX_AGE_MS/);
assert.match(billing, /status = CASE[\s\S]{0,500}checkout_pending/, "stale and invalid pending checkouts must be reconciled before selecting a resumable session");
assert.match(billing, /BILLING_DB_REQUIRED_FOR_REFUND/);
assert.doesNotMatch(billing, /submitRefundRequestForUser[\s\S]{0,1600}refundRequestKey\(/, "refund policy must not fall back to KV");
assert.doesNotMatch(billing, /upgradeSubscriptionForUser[\s\S]{0,2500}subscription_upgrade_credit_delta/, "upgrade endpoint must not grant credits before invoice.paid");
assert.match(billing, /credit_buckets/);
assert.match(billing, /db\.batch\(\[/);
assert.match(billing, /UPDATE credit_buckets SET remaining = 0[\s\S]{0,300}NOT EXISTS \(SELECT 1 FROM credit_ledger WHERE id = \?\)/, "concurrent duplicate grants must not clear the winning invoice bucket");
assert.match(billing, /latestPaymentAt/);
assert.match(billing, /periodStart/);
assert.match(billing, /reconcileExpiredPaidCreditBucketsD1/, "account reads and debits must reconcile expired paid buckets before exposing aggregate credits");
assert.match(billing, /STRIPE_BILLING_PERIOD_REQUIRED/, "paid credit grants without a real Stripe period must retry instead of inventing 30 days");
assert.match(billing, /stripeBillingPeriodDecision/, "grant path must reject stale or duplicate billing periods before replacing buckets");
assert.match(billing, /expiry_claim/, "expired bucket reconciliation must claim a bucket before changing aggregate balance");
assert.match(expiryClaimMigration, /ADD COLUMN expiry_claim TEXT/, "expiry claims require a tracked D1 schema migration");
assert.match(stripe, /rk_live_/, "restricted live Stripe keys must be recognized as live mode");
assert.doesNotMatch(billing, /export async function debitCreditForUser[\s\S]{0,1800}billingKv\(/, "credit debits must fail closed when D1 is unavailable");
assert.doesNotMatch(billing, /export async function refundCreditForUser[\s\S]{0,2600}billingKv\(/, "generation refunds must fail closed when D1 is unavailable");
assert.doesNotMatch(billing, /export async function updateSubscriptionState[\s\S]{0,1800}billingKv\(/, "subscription webhooks must never fall back to KV");
assert.doesNotMatch(billing, /export async function markRefundedAccount[\s\S]{0,900}billingKv\(/, "refund webhooks must never fall back to KV");
assert.match(billing, /export async function submitSubscriptionCancellationForUser[\s\S]{0,240}const db = await billingDb\(\)[\s\S]{0,180}if \(!db\)/, "cancellation must require D1 before calling Stripe");
assert.doesNotMatch(billing, /export async function submitSubscriptionCancellationForUser[\s\S]{0,2200}billingKv\(/, "cancellation state must never fall back to KV");
assert.match(billing, /export async function submitSubscriptionCancellationForUser[\s\S]{0,2600}await db\.batch\(/, "Stripe cancellation state and ledger must persist atomically in D1");
assert.match(webhook, /stripeEventMatchesConfiguredMode/);
assert.match(webhook, /STRIPE_EVENT_MODE_MISMATCH/);
assert.match(migration, /CREATE TABLE IF NOT EXISTS credit_buckets/);
assert.match(migration, /expires_at/);
assert.match(reconciliationMigration, /refund\.charge_summary/);
assert.match(reconciliationMigration, /json_extract\(canonical\.payload_json, '\$\.data\.object\.charge'\)/);
assert.match(reconciliationMigration, /checkout_pending/);
assert.match(reconciliationMigration, /24 \* 60 \* 60 \* 1000/);
assert.match(stripe, /validateStripePrice/);
assert.match(stripe, /tax_behavior/);
assert.match(stripe, /recurring\.interval/);
assert.match(pkg, /test:stripe-p0/);
console.log("Stripe P0 regression checks: PASS");
