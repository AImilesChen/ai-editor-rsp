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

const billingStore = await readFile(new URL("../src/lib/backend/billing-store.ts", import.meta.url), "utf8");
assert.match(billingStore, /"refund_paid_credit_revoke", input\.refundId,/, "refund business ID must be the revoke idempotency key");
assert.match(billingStore, /current\?\.subscriptionStatus === "refunded" && \(!input\.subscriptionId \|\| sameLockedSubscription\)/, "late grant events must not reactivate a refunded subscription");
assert.match(billingStore, /ignored: "stale_event_for_refunded_subscription"/, "late subscription lifecycle events must be ignored");
console.log("stripe refund field extraction and terminal guards: PASS");
