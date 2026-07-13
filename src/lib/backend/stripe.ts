import { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";
import { previousStripePlanFromPayload, resolveStripePlanFromPayload, stripeBillingPeriodFromPayload } from "@/lib/backend/stripe-plan";

export type BillingPlan = "starter" | "creator" | "studio";

export type StripePromptModerationResult = {
  ok: boolean;
  decision: "allow" | "flag" | "deny";
  mode: "local" | "remote" | "disabled";
  moderationId?: string | null;
  status?: number | string | null;
  requestUrl?: string | null;
  message?: string | null;
  payload?: unknown;
};

export const STRIPE_PLAN_CREDITS: Record<BillingPlan, number> = {
  starter: 100,
  creator: 240,
  studio: 500,
};

export const STRIPE_PLAN_PRICES_CENTS: Record<BillingPlan, number> = {
  starter: 799,
  creator: 1499,
  studio: 2999,
};

const encoder = new TextEncoder();

export function isBillingPlan(plan: unknown): plan is BillingPlan {
  return plan === "starter" || plan === "creator" || plan === "studio";
}

export function stripeApiBase() {
  return (process.env.STRIPE_API_BASE || "https://api.stripe.com/v1").replace(/\/+$/, "");
}

export function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || "";
  return key.startsWith("sk_live_") || key.startsWith("rk_live_") ? "live" : "test";
}

export function stripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || "";
}

export function stripePriceId(plan: BillingPlan) {
  let value: string | undefined;
  switch (plan) {
    case "starter":
      value = process.env.STRIPE_STARTER_PRICE_ID;
      break;
    case "creator":
      value = process.env.STRIPE_CREATOR_PRICE_ID;
      break;
    case "studio":
      value = process.env.STRIPE_STUDIO_PRICE_ID;
      break;
  }
  const priceId = value?.trim();
  return priceId?.startsWith("price_") ? priceId : undefined;
}

const LOCAL_BLOCK_PATTERNS = [
  /\b(nsfw|porn|porno|nude|naked|topless|erotic|explicit sex|genitals?|hentai|fetish)\b/i,
  /\b(minor|underage|child|children|teen|schoolgirl|schoolboy)\b/i,
  /\b(deepfake|face[- ]?swap|impersonat(e|ion)|celebrity|public figure|politician|president|famous actor|influencer)\b/i,
  /\b(fake passport|fake id|driver'?s license|official document|bank statement|certificate|counterfeit|forged)\b/i,
];

const LOCAL_FLAG_PATTERNS = [
  /\b(sexy|seductive|revealing|bikini|swimsuit|provocative|cleavage)\b/i,
  /\b(disney|pixar|marvel|pokemon|nintendo|star wars|nike logo|apple logo)\b/i,
];

export async function moderatePromptWithStripe(input: { prompt: string; externalId?: string; timeoutMs?: number }): Promise<StripePromptModerationResult> {
  const text = input.prompt.normalize("NFKC");
  if (LOCAL_BLOCK_PATTERNS.some((pattern) => pattern.test(text))) {
    return {
      ok: true,
      decision: "deny",
      mode: "local",
      moderationId: input.externalId || null,
      status: "local_block",
      message: "Blocked by local Stripe-readiness policy for unsafe, unauthorized, impersonation, document, or adult content.",
    };
  }
  if (LOCAL_FLAG_PATTERNS.some((pattern) => pattern.test(text))) {
    return {
      ok: true,
      decision: "flag",
      mode: "local",
      moderationId: input.externalId || null,
      status: "local_flag",
      message: "Flagged by local Stripe-readiness policy for review-only content risk.",
    };
  }

  const moderationUrl = process.env.STRIPE_CONTENT_MODERATION_URL || process.env.CONTENT_MODERATION_URL;
  const moderationKey = process.env.STRIPE_CONTENT_MODERATION_KEY || process.env.CONTENT_MODERATION_KEY;
  if (!moderationUrl) {
    return { ok: true, decision: "allow", mode: "local", moderationId: input.externalId || null, status: "local_allow" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs || 5000);
  try {
    const response = await fetch(moderationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(moderationKey ? { "Authorization": `Bearer ${moderationKey}` } : {}),
      },
      body: JSON.stringify({ prompt: input.prompt, external_id: input.externalId, policy: "stripe_ai_image_editor" }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return { ok: false, decision: "deny", mode: "remote", status: response.status, requestUrl: moderationUrl, message: "Remote moderation service rejected or failed.", payload };
    }
    const decisionValue = payload && typeof payload === "object" ? String((payload as Record<string, unknown>).decision || "allow").toLowerCase() : "allow";
    const decision = decisionValue === "deny" || decisionValue === "block" ? "deny" : decisionValue === "flag" || decisionValue === "review" ? "flag" : "allow";
    const id = payload && typeof payload === "object" && typeof (payload as Record<string, unknown>).id === "string" ? String((payload as Record<string, unknown>).id) : input.externalId || null;
    return { ok: true, decision, mode: "remote", moderationId: id, status: response.status, requestUrl: moderationUrl, payload };
  } catch (error) {
    return { ok: false, decision: "deny", mode: "remote", status: "network_error", requestUrl: moderationUrl, message: error instanceof Error ? error.message : "Remote moderation failed." };
  } finally {
    clearTimeout(timeout);
  }
}

export function stripeConfigStatus() {
  return {
    apiKey: Boolean(stripeSecretKey()),
    webhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    prices: {
      starter: Boolean(stripePriceId("starter")),
      creator: Boolean(stripePriceId("creator")),
      studio: Boolean(stripePriceId("studio")),
    },
    mode: stripeMode(),
  };
}

export function stripeReady() {
  const status = stripeConfigStatus();
  return Boolean(status.apiKey && status.webhookSecret && status.prices.starter && status.prices.creator && status.prices.studio);
}

export function missingStripeConfig() {
  const missing: string[] = [];
  const status = stripeConfigStatus();
  if (!status.apiKey) missing.push("STRIPE_SECRET_KEY");
  if (process.env.STRIPE_ENABLE_PAID_CHECKOUT !== "true") missing.push("STRIPE_ENABLE_PAID_CHECKOUT=true");
  if (!status.webhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!status.prices.starter) missing.push("STRIPE_STARTER_PRICE_ID");
  if (!status.prices.creator) missing.push("STRIPE_CREATOR_PRICE_ID");
  if (!status.prices.studio) missing.push("STRIPE_STUDIO_PRICE_ID");
  return missing;
}

export async function validateStripePrice(plan: BillingPlan) {
  // Keep test mode network-free; live checkout fails closed on catalog drift.
  if (stripeMode() !== "live") return { ok: true as const, skipped: true as const };
  const priceId = stripePriceId(plan);
  if (!priceId) return { ok: false as const, message: "Stripe Price is not configured." };
  const response = await stripeGetRequest(`/prices/${encodeURIComponent(priceId)}?expand[]=product`);
  if (!response.ok) return { ok: false as const, message: response.message || "Stripe Price validation failed." };
  const price = response.payload && typeof response.payload === "object" ? response.payload as Record<string, unknown> : {};
  const recurring = price.recurring && typeof price.recurring === "object" ? price.recurring as Record<string, unknown> : {};
  const valid = price.active === true
    && Number(price.unit_amount) === STRIPE_PLAN_PRICES_CENTS[plan]
    && String(price.currency || "").toLowerCase() === "usd"
    && recurring.interval === "month"
    && Number(recurring.interval_count || 1) === 1
    && price.tax_behavior === "inclusive";
  return valid ? { ok: true as const, skipped: false as const } : { ok: false as const, message: "Live Stripe Price must be active, USD, monthly, tax-inclusive, and match the configured plan amount." };
}

export async function createStripeCheckoutSession(input: {
  plan: BillingPlan;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey?: string;
}) {
  const priceId = stripePriceId(input.plan);
  if (!priceId) return { ok: false as const, status: 503, message: "Selected Stripe price is not configured." };
  const validation = await validateStripePrice(input.plan);
  if (!validation.ok) return { ok: false as const, status: 503, message: validation.message };
  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("success_url", input.successUrl);
  form.set("cancel_url", input.cancelUrl);
  form.set("client_reference_id", input.userId);
  form.set("customer_email", input.email);
  form.set("allow_promotion_codes", "true");
  form.set("metadata[user_id]", input.userId);
  form.set("metadata[email]", input.email);
  form.set("metadata[plan]", input.plan);
  form.set("subscription_data[metadata][user_id]", input.userId);
  form.set("subscription_data[metadata][email]", input.email);
  form.set("subscription_data[metadata][plan]", input.plan);
  return stripeFormRequest("/checkout/sessions", form, input.idempotencyKey);
}

export async function retrieveStripeCheckoutSession(checkoutId: string) {
  if (!checkoutId.startsWith("cs_")) {
    return { ok: false as const, status: 400, message: "Invalid Stripe checkout session ID.", payload: null };
  }
  const result = await stripeGetRequest(`/checkout/sessions/${encodeURIComponent(checkoutId)}`);
  if (!result.ok) return result;
  const record = result.payload && typeof result.payload === "object" ? result.payload as Record<string, unknown> : {};
  const status = typeof record.status === "string" ? record.status : null;
  const paymentStatus = typeof record.payment_status === "string" ? record.payment_status : null;
  const expiresAt = typeof record.expires_at === "number" ? record.expires_at : null;
  return {
    ok: true as const,
    status: result.status,
    checkoutStatus: status,
    paymentStatus,
    checkoutUrl: extractCheckoutUrl(result.payload),
    expiresAt,
    payload: result.payload,
  };
}

export async function expireStripeCheckoutSession(checkoutId: string) {
  if (!checkoutId.startsWith("cs_")) {
    return { ok: false as const, status: 400, message: "Invalid Stripe checkout session ID.", payload: null };
  }
  return stripeFormRequest(`/checkout/sessions/${encodeURIComponent(checkoutId)}/expire`, new URLSearchParams());
}

export async function createStripeCustomerPortal(customerId: string, returnUrl?: string) {
  const form = new URLSearchParams();
  form.set("customer", customerId);
  if (returnUrl) form.set("return_url", returnUrl);
  const result = await stripeFormRequest("/billing_portal/sessions", form);
  if (result.ok) return { ok: true as const, url: extractPortalUrl(result.payload), payload: result.payload };
  return { ok: false as const, status: result.status, message: result.message || "Stripe customer portal is unavailable." };
}

export async function cancelStripeSubscription(subscriptionId: string) {
  if (!subscriptionId.trim()) return { ok: false as const, status: 400, message: "Stripe subscription ID is required.", payload: null };
  const form = new URLSearchParams();
  form.set("cancel_at_period_end", "true");
  return stripeFormRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, form);
}

export async function upgradeStripeSubscription(subscriptionId: string, priceId: string): Promise<
  { ok: true; status: number; payload: unknown }
  | { ok: false; status: number; message: string; payload?: unknown }
> {
  if (!subscriptionId.trim()) return { ok: false, status: 400, message: "Stripe subscription ID is required.", payload: null };
  if (!priceId.trim()) return { ok: false, status: 503, message: "Target Stripe price is not configured.", payload: null };

  const encodedSubscriptionId = encodeURIComponent(subscriptionId);
  const subscription = await stripeGetRequest(`/subscriptions/${encodedSubscriptionId}?expand[]=items.data.price`);
  if (!subscription.ok) {
    return { ok: false, status: subscription.status, message: subscription.message || "Stripe subscription lookup failed.", payload: "payload" in subscription ? subscription.payload : null };
  }

  const itemId = extractSubscriptionItemId(subscription.payload);
  if (!itemId) {
    return { ok: false, status: 409, message: "Stripe subscription item ID is not available for this account yet.", payload: subscription.payload };
  }

  const form = new URLSearchParams();
  form.set("items[0][id]", itemId);
  form.set("items[0][price]", priceId);
  form.set("proration_behavior", "always_invoice");
  form.set("payment_behavior", "error_if_incomplete");
  form.set("metadata[plan]", planFromPriceId(priceId) || "studio");
  form.set("expand[0]", "latest_invoice.payment_intent");
  form.set("expand[1]", "items.data.price");

  return stripeFormRequest(`/subscriptions/${encodedSubscriptionId}`, form);
}

export type StripeRefundLookupResult = {
  ok: boolean;
  refunded: boolean;
  source?: string;
  resourceId?: string;
  status?: string | null;
  refundId?: string | null;
  payload?: unknown;
  error?: string;
};

export async function lookupStripeRefundStatus(input: { paymentId?: string | null; transactionId?: string | null; checkoutId?: string | null; invoiceId?: string | null; subscriptionId?: string | null }) {
  const ids = uniqueTruthy([input.transactionId, input.paymentId, input.invoiceId, input.checkoutId, input.subscriptionId]);
  const paths: Array<{ path: string; id: string }> = [];
  for (const id of ids) {
    const encoded = encodeURIComponent(id);
    if (id.startsWith("pi_")) paths.push({ path: `/payment_intents/${encoded}`, id });
    if (id.startsWith("ch_")) paths.push({ path: `/charges/${encoded}`, id });
    if (id.startsWith("in_")) paths.push({ path: `/invoices/${encoded}`, id });
    if (id.startsWith("cs_")) paths.push({ path: `/checkout/sessions/${encoded}`, id });
    if (id.startsWith("sub_")) paths.push({ path: `/subscriptions/${encoded}`, id });
  }
  let lastError: string | undefined;
  for (const candidate of paths) {
    const response = await stripeGetRequest(candidate.path);
    if (!response.ok) {
      lastError = `${candidate.path}: ${response.status || "error"} ${response.message || ""}`.trim();
      continue;
    }
    const status = extractRefundStatus(response.payload);
    if (status.refunded) return { ok: true, refunded: true, source: candidate.path, resourceId: candidate.id, status: status.status, refundId: status.refundId, payload: response.payload } satisfies StripeRefundLookupResult;
    if (status.status) lastError = `${candidate.path}: status=${status.status}`;
  }
  return { ok: Boolean(paths.length), refunded: false, error: lastError || (paths.length ? "No Stripe resource reported refunded." : "No Stripe resource id to inspect.") } satisfies StripeRefundLookupResult;
}

async function stripeFormRequest(path: string, form: URLSearchParams, idempotencyKey?: string) {
  const secret = stripeSecretKey();
  if (!secret) return { ok: false as const, status: 503, message: "STRIPE_SECRET_KEY is not configured." };
  const response = await fetch(`${stripeApiBase()}${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey.slice(0, 255) } : {}),
    },
    body: form.toString(),
  });
  return parseStripeResponse(response);
}

async function stripeGetRequest(path: string) {
  const secret = stripeSecretKey();
  if (!secret) return { ok: false as const, status: 503, message: "STRIPE_SECRET_KEY is not configured." };
  const response = await fetch(`${stripeApiBase()}${path}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${secret}` },
  });
  return parseStripeResponse(response);
}

async function parseStripeResponse(response: Response) {
  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 500) };
  }
  if (!response.ok) {
    const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    const error = record.error && typeof record.error === "object" ? record.error as Record<string, unknown> : record;
    const message = String(error.message || response.statusText || "Stripe request failed.");
    return { ok: false as const, status: response.status, message, payload };
  }
  return { ok: true as const, status: response.status, payload };
}

function extractRefundStatus(payload: unknown) {
  const statuses: string[] = [];
  const refundIds: string[] = [];
  let refunded = false;
  function visit(value: unknown, depth = 0) {
    if (!value || depth > 6) return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item, depth + 1);
      return;
    }
    if (typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (record.refunded === true) refunded = true;
    if (typeof record.amount_refunded === "number" && record.amount_refunded > 0) refunded = true;
    if (typeof record.status === "string") statuses.push(record.status.toLowerCase());
    if (typeof record.id === "string" && record.id.startsWith("re_")) refundIds.push(record.id);
    for (const nested of Object.values(record)) visit(nested, depth + 1);
  }
  visit(payload);
  const status = statuses.find(Boolean) || null;
  if (statuses.some((item) => ["refunded", "succeeded"].includes(item)) && refundIds.length > 0) refunded = true;
  return { refunded, status, refundId: refundIds[0] || null };
}

function uniqueTruthy(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

export function extractPortalUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const url = record.url;
  return typeof url === "string" && url.startsWith("https://") ? url : null;
}

export function extractCheckoutUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const value = record.url;
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com" ? url.toString() : null;
  } catch {
    return null;
  }
}

function extractSubscriptionItemId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const subscription = payload as Record<string, unknown>;
  const items = subscription.items && typeof subscription.items === "object" ? subscription.items as Record<string, unknown> : null;
  const data = Array.isArray(items?.data) ? items.data : [];
  const knownPriceIds = new Set((["starter", "creator", "studio"] as const).map((plan) => stripePriceId(plan)).filter((value): value is string => Boolean(value)));
  const candidates = data
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => {
      const price = item.price && typeof item.price === "object" ? item.price as Record<string, unknown> : null;
      const priceId = stringValue(item.price || item.price_id || item.priceId || price?.id);
      return { itemId: stringValue(item.id), priceId };
    })
    .filter((item) => Boolean(item.itemId));

  const matching = candidates.find((item) => item.priceId && knownPriceIds.has(item.priceId));
  return matching?.itemId || candidates[0]?.itemId || null;
}

export function planFromStripePayload(payload: unknown): BillingPlan | null {
  return resolveStripePlanFromPayload(payload, {
    starter: stripePriceId("starter"),
    creator: stripePriceId("creator"),
    studio: stripePriceId("studio"),
  });
}

export function previousPlanFromStripePayload(payload: unknown): BillingPlan | null {
  return previousStripePlanFromPayload(payload, {
    starter: stripePriceId("starter"),
    creator: stripePriceId("creator"),
    studio: stripePriceId("studio"),
  });
}

export function billingPeriodFromStripePayload(payload: unknown, plan: BillingPlan) {
  return stripeBillingPeriodFromPayload(payload, {
    starter: stripePriceId("starter"),
    creator: stripePriceId("creator"),
    studio: stripePriceId("studio"),
  }, plan);
}

function planFromPriceId(priceId: string | null) {
  if (!priceId) return null;
  for (const plan of ["starter", "creator", "studio"] as const) {
    if (stripePriceId(plan) === priceId) return plan;
  }
  return null;
}

export function extractStripeEventId(event: unknown, rawBody: string) {
  if (event && typeof event === "object") {
    const id = (event as Record<string, unknown>).id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return `evt_${hashString(rawBody)}`;
}

export function extractStripeEventType(event: unknown) {
  if (event && typeof event === "object") {
    const type = (event as Record<string, unknown>).type;
    if (typeof type === "string" && type.trim()) return normalizeStripeEventType(type.trim());
  }
  return "unknown";
}

function normalizeStripeEventType(type: string) {
  switch (type) {
    case "checkout.session.completed": return "checkout.completed";
    case "customer.subscription.created":
    case "customer.subscription.resumed": return "subscription.active";
    case "customer.subscription.updated": return "subscription.update";
    case "invoice.paid":
    case "invoice.payment_succeeded": return "subscription.paid";
    case "customer.subscription.deleted": return "subscription.canceled";
    case "customer.subscription.paused": return "subscription.paused";
    case "invoice.payment_failed": return "subscription.past_due";
    case "charge.refunded": return "refund.charge_summary";
    case "refund.created":
    case "refund.updated": return "refund.created";
    case "charge.dispute.created": return "dispute.created";
    default: return type;
  }
}

export async function verifyStripeSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
    const [key, ...rest] = part.split("=");
    return [key, rest.join("=")];
  }));
  const timestamp = parts.t;
  const signatures = signatureHeader.split(",").filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return false;
  const expected = await hmacHex(secret, `${timestamp}.${rawBody}`);
  return signatures.some((signature) => timingSafeEqual(signature, expected));
}

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function hashString(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  return (hash >>> 0).toString(16);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function originFromRequest(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "aieditorrspediting.org";
  return `${proto}://${host}`;
}
