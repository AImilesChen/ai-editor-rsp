import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [jobs, assets, generation, billing, webhook, stripe, auth, session, site, middleware] = await Promise.all([
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
assert.doesNotMatch(stripe, /metadata as Record<string, unknown>\)\.plan/);
assert.match(auth, /NODE_ENV !== "production"/);
assert.match(session, /NODE_ENV !== "production"/);
assert.doesNotMatch(site, /Priority queue|Fastest queue/);
assert.match(middleware, /Strict-Transport-Security/);
assert.match(middleware, /Content-Security-Policy/);

console.log("payment compliance regression checks: PASS");
