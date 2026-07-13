import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [jobs, assets, generation, billing, webhook, stripe, auth, session, site, middleware, footer] = await Promise.all([
  read("src/app/api/jobs/[requestId]/route.ts"),
  read("src/app/api/assets/[assetId]/route.ts"),
  read("src/app/api/generate/route.ts"),
  read("src/lib/backend/billing-store.ts"),
  read("src/app/api/webhooks/stripe/route.ts"),
  read("src/lib/backend/stripe.ts"),
  read("src/lib/backend/auth.ts"),
  read("src/lib/backend/session.ts"),
  read("src/lib/site.ts"),
  read("src/middleware.ts"),
  read("src/components/Footer.tsx"),
]);

assert.ok(jobs.indexOf("getAuthUser(request)") < jobs.indexOf("getFalResult("), "job auth must precede provider access");
assert.match(jobs, /getOwnedGenerationByRequestId\(requestId, user\.id\)/);
assert.match(jobs, /refundCreditForUser\(user, creditsToRefund, owned\.row\.id\)/);
assert.match(assets, /if \(!user\).*401/);
assert.match(generation, /validateImage\(body\.imageDataUrl, 5 \* 1024 \* 1024\)/);
assert.ok(generation.indexOf("debitCreditForUser(") < generation.indexOf("submitFalGeneration("), "credit reservation must precede provider submission");
assert.match(generation, /refundCreditForUser\(user, quote\.creditsCharged, jobId\)/);
assert.match(billing, /db\.batch\(\[/);
assert.match(billing, /NOT EXISTS \(SELECT 1 FROM credit_ledger WHERE user_id = \? AND source_type = 'generation_debit'/);
assert.match(billing, /source_type = 'generation_debit'.*source_id = \?/s);
assert.match(webhook, /eventType === "subscription\.paid"/);
assert.doesNotMatch(webhook, /eventType === "checkout\.completed" \|\|/);
assert.match(stripe, /case "customer\.subscription\.updated": return "subscription\.update";/, "Stripe subscription updates must reach the local state synchronizer");
assert.match(webhook, /eventType === "subscription\.update"/);
assert.match(webhook, /cancel_at_period_end/);
assert.doesNotMatch(stripe, /metadata as Record<string, unknown>\)\.plan/);
assert.doesNotMatch(stripe, /STRIPE_(STARTER|CREATOR|STUDIO)_PRODUCT_ID/, "Stripe Checkout and subscription updates must use recurring Price IDs, never Product IDs");
assert.match(auth, /NODE_ENV !== "production"/);
assert.match(session, /NODE_ENV !== "production"/);
assert.doesNotMatch(site, /Priority queue|Fastest queue/);
assert.match(middleware, /Strict-Transport-Security/);
assert.match(middleware, /Content-Security-Policy/);
assert.match(stripe, /form\.set\("cancel_at_period_end", "true"\)/, "customer cancellation must preserve access through the current billing period");
assert.doesNotMatch(stripe, /cancelStripeSubscription[\s\S]{0,300}stripeDeleteRequest/, "customer cancellation must not immediately delete the Stripe subscription");
assert.match(billing, /subscriptionStatus: "scheduled_cancel"/, "local billing state must distinguish scheduled cancellation from immediate termination");
assert.match(billing, /upsertSubscription\([\s\S]{0,180}"scheduled_cancel"/, "D1 subscription status must record scheduled cancellation");
assert.match(footer, /independently operated online service/);
assert.match(stripe, /export async function retrieveStripeCheckoutSession/);
assert.match(stripe, /\/checkout\/sessions\/\$\{encodeURIComponent\(checkoutId\)\}/);
assert.match(billing, /recentPendingCheckoutForUser/);
assert.match(billing, /markPendingCheckoutStatus/);
assert.match(webhook, /cancel_at_period_end/);
const checkoutRoute = await read("src/app/api/billing/checkout/route.ts");
const checkoutButton = await read("src/components/CheckoutStartButton.tsx");
const checkoutPage = await read("src/app/checkout/page.tsx");
assert.match(checkoutPage, /renews automatically/i, "checkout must disclose automatic monthly renewal before payment");
assert.match(checkoutPage, /include applicable taxes/i, "checkout must disclose tax-inclusive pricing before payment");
assert.match(checkoutPage, /do not roll over/i, "checkout must disclose paid-credit expiry before payment");
assert.match(checkoutPage, /\/terms/);
assert.match(checkoutPage, /\/privacy/);
assert.match(checkoutPage, /\/refund-policy/);
assert.match(checkoutRoute, /action: "resumed"/);
assert.match(checkoutRoute, /action: "already_paid"/);
assert.match(checkoutRoute, /if \(completed\)/, "a Stripe paid/complete Checkout must always block a second order despite webhook lag");
assert.match(checkoutRoute, /markPendingCheckoutStatus\(pending\.checkoutId, "paid"\)/);
assert.doesNotMatch(checkoutRoute, /completed && !hasBlockingPaidPlan/, "paid Checkout must not be canceled and replaced");
assert.match(checkoutRoute, /pendingToClose = \{ checkoutId: pending\.checkoutId, status: "expired" \}/);
assert.match(checkoutRoute, /idempotencyKey/);
assert.match(checkoutRoute, /if \(!stored\.persisted\)/);
assert.match(stripe, /"Idempotency-Key"/);
assert.match(stripe, /url\.hostname === "checkout\.stripe\.com"/);
assert.match(checkoutButton, /data\.redirectUrl \|\| data\.checkoutUrl/);
assert.doesNotMatch(checkoutRoute, /CHECKOUT_ALREADY_STARTED/);

console.log("payment compliance regression checks: PASS");
