import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extractBillingIds } from "../src/lib/backend/stripe-webhook-fields.ts";

const partialRefund = {
  type: "refund.created",
  data: { object: { object: "refund", id: "re_partial", amount: 423, currency: "usd", payment_intent: "pi_1" } },
};
const chargeRefunded = {
  type: "charge.refunded",
  data: { object: { object: "charge", id: "ch_1", amount: 799, currency: "usd", refunds: { data: [
    { object: "refund", id: "re_old", amount: 100, currency: "usd", created: 100 },
    { object: "refund", id: "re_partial", amount: 423, currency: "usd", created: 200 },
  ] } } },
};

assert.deepEqual(extractBillingIds(partialRefund), {
  subscriptionId: null,
  customerId: null,
  checkoutId: null,
  transactionId: "pi_1",
  invoiceId: null,
  refundId: "re_partial",
  amountCents: 423,
  currency: "usd",
});
const chargeIds = extractBillingIds(chargeRefunded);
assert.equal(chargeIds.refundId, "re_partial");
assert.equal(chargeIds.amountCents, 423, "nested refund amount must win over charge total");
assert.equal(extractBillingIds({ type: "charge.refunded", data: { object: { object: "charge", id: "ch_only", refunds: { data: [] } } } }).refundId, null,
  "a charge summary must not manufacture a canonical refund ID");

const billingStore = await readFile(new URL("../src/lib/backend/billing-store.ts", import.meta.url), "utf8");
const webhookRoute = await readFile(new URL("../src/app/api/webhooks/stripe/route.ts", import.meta.url), "utf8");
assert.match(billingStore, /'refund_paid_credit_revoke', \?,/, "refund ledger write must retain the revoke source type and canonical source ID binding");
assert.match(billingStore, /markRefundedAccountD1[\s\S]*?await db\.batch\(\[/, "all refund state writes must use one atomic D1 batch");
assert.match(billingStore, /D1 billing database is required for atomic Stripe credit grants/);
const grantFunction = billingStore.slice(billingStore.indexOf("export async function grantCreditsFromStripe"), billingStore.indexOf("export async function recordStripeWebhookEvent"));
assert.doesNotMatch(grantFunction, /billingKv\(/, "Stripe grants must never fall back to non-atomic KV");
assert.match(billingStore, /subscriptionStatus === "refunded"[\s\S]{0,180}creditsRemaining: account\.creditsRemaining/, "public refunded accounts must expose preserved free credits");
assert.match(webhookRoute, /refund\.charge_summary[\s\S]*?recordStripeWebhookEvent/, "charge summaries without a canonical refund must be durably recorded only");
assert.match(webhookRoute, /RECORD_ONLY_EVENTS\.has\(eventType\)[\s\S]*?recordStripeWebhookEvent/, "non-grant lifecycle events must be durably acknowledged");
assert.match(billingStore, /current\?\.subscriptionStatus === "refunded" && \(!input\.subscriptionId \|\| sameLockedSubscription\)/, "late grant events must not reactivate a refunded subscription");
assert.match(billingStore, /ignored: "stale_event_for_refunded_subscription"/, "late subscription lifecycle events must be ignored");
console.log("stripe refund field extraction and terminal guards: PASS");
