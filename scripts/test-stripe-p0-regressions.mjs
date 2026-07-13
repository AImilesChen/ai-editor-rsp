import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [checkout, webhook, billing, stripe, migration, pkg] = await Promise.all([
  read("src/app/api/billing/checkout/route.ts"),
  read("src/app/api/webhooks/stripe/route.ts"),
  read("src/lib/backend/billing-store.ts"),
  read("src/lib/backend/stripe.ts"),
  read("migrations/0005_stripe_p0_credit_buckets.sql").catch(() => ""),
  read("package.json"),
]);

assert.match(checkout, /if \(completed\)[\s\S]{0,450}action: "already_paid"/, "paid/complete checkout must never create another session");
assert.doesNotMatch(checkout, /completed && !hasBlockingPaidPlan[\s\S]{0,250}pendingToClose/, "local webhook lag must not turn a paid checkout into a second order");
assert.match(webhook, /WEBHOOK_PERSISTENCE_FAILED/);
assert.match(webhook, /status: 503/);
assert.match(billing, /BILLING_DB_REQUIRED_FOR_REFUND/);
assert.doesNotMatch(billing, /submitRefundRequestForUser[\s\S]{0,1600}refundRequestKey\(/, "refund policy must not fall back to KV");
assert.doesNotMatch(billing, /upgradeSubscriptionForUser[\s\S]{0,2500}subscription_upgrade_credit_delta/, "upgrade endpoint must not grant credits before invoice.paid");
assert.match(billing, /credit_buckets/);
assert.match(billing, /db\.batch\(\[/);
assert.match(billing, /latestPaymentAt/);
assert.match(billing, /periodStart/);
assert.match(migration, /CREATE TABLE IF NOT EXISTS credit_buckets/);
assert.match(migration, /expires_at/);
assert.match(stripe, /validateStripePrice/);
assert.match(stripe, /tax_behavior/);
assert.match(stripe, /recurring\.interval/);
assert.match(pkg, /test:stripe-p0/);
console.log("Stripe P0 regression checks: PASS");
