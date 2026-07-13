import assert from "node:assert/strict";
import {
  calculateStripeCreditReplacement,
  inferStripePriorPaidRemaining,
  previousStripePlanFromPayload,
  resolveStripePlanFromPayload,
  stripeBillingReasonFromPayload,
  stripeCreditGrantSourceId,
} from "../src/lib/backend/stripe-plan.ts";

const priceIds = {
  starter: "price_starter",
  creator: "price_creator",
  studio: "price_studio",
};

const upgradeInvoice = {
  object: "invoice",
  id: "in_upgrade",
  lines: {
    data: [
      {
        object: "line_item",
        amount: -1499,
        description: "Unused Creator time",
        pricing: { price_details: { price: priceIds.creator } },
      },
      {
        object: "line_item",
        amount: 2999,
        description: "Remaining Studio time",
        pricing: { price_details: { price: priceIds.studio } },
      },
    ],
  },
};

assert.equal(
  resolveStripePlanFromPayload(upgradeInvoice, priceIds),
  "studio",
  "an upgrade invoice must resolve to the positively charged target plan, not the negatively credited old plan",
);

assert.equal(
  previousStripePlanFromPayload(upgradeInvoice, priceIds),
  "creator",
  "the negative proration line must identify the previous plan even when no legacy bucket exists",
);

assert.equal(
  resolveStripePlanFromPayload({ object: "invoice", lines: { data: [
    { amount: 799, pricing: { price_details: { price: priceIds.starter } } },
    { amount: 2999, pricing: { price_details: { price: priceIds.studio } } },
  ] } }, priceIds),
  null,
  "an ambiguous invoice with multiple positively charged plans must fail closed",
);

assert.equal(
  resolveStripePlanFromPayload(
    { ...upgradeInvoice, lines: { data: [...upgradeInvoice.lines.data].reverse() } },
    priceIds,
  ),
  "studio",
  "upgrade plan resolution must not depend on invoice line order",
);

assert.equal(
  resolveStripePlanFromPayload(
    { object: "subscription", items: { data: [{ price: { id: priceIds.studio } }] } },
    priceIds,
  ),
  "studio",
  "subscription events must still resolve the current item plan",
);

assert.deepEqual(
  calculateStripeCreditReplacement({ before: 240, priorPaidRemaining: 240, priorPlanCredits: 240, targetCredits: 500, isUpgrade: true }),
  { after: 500, ledgerDelta: 260 },
  "Creator to Studio upgrade must replace the paid bucket and ledger only the net +260 change",
);

assert.deepEqual(
  calculateStripeCreditReplacement({ before: 100, priorPaidRemaining: 100, priorPlanCredits: 240, targetCredits: 500, isUpgrade: true }),
  { after: 360, ledgerDelta: 260 },
  "upgrade must add the advertised plan delta even after some Creator credits were consumed",
);

assert.equal(
  inferStripePriorPaidRemaining({ before: 180, bucketRemaining: 0, priorPlanCredits: 240, hasActiveBucket: false }),
  180,
  "legacy paid accounts without buckets must carry their remaining Creator balance into the Studio period bucket",
);

assert.equal(
  stripeBillingReasonFromPayload({ ...upgradeInvoice, billing_reason: "subscription_update" }),
  "subscription_update",
  "the grant path must distinguish a prorated upgrade invoice from a renewal invoice",
);

assert.equal(
  stripeCreditGrantSourceId(
    { invoiceId: "in_upgrade", subscriptionId: "sub_123", plan: "studio" },
    new Date("2026-07-13T00:00:00Z"),
  ),
  "invoice:in_upgrade",
  "invoice id must be the primary idempotency authority",
);

console.log("Stripe upgrade credit behavior: PASS");
