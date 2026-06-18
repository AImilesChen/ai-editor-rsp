import { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";

export type BillingPlan = "starter" | "creator" | "studio";

export const CREEM_PLAN_CREDITS: Record<BillingPlan, number> = {
  starter: 120,
  creator: 300,
  studio: 700,
};

const encoder = new TextEncoder();

export function isBillingPlan(plan: unknown): plan is BillingPlan {
  return plan === "starter" || plan === "creator" || plan === "studio";
}

export function creemApiBase() {
  return (process.env.CREEM_API_BASE || "https://api.creem.io/v1").replace(/\/+$/, "");
}

export function creemMode() {
  return creemApiBase().includes("test-api") ? "test" : "live";
}

export function creemProductId(plan: BillingPlan) {
  switch (plan) {
    case "starter":
      return process.env.CREEM_STARTER_PRODUCT_ID;
    case "creator":
      return process.env.CREEM_CREATOR_PRODUCT_ID;
    case "studio":
      return process.env.CREEM_STUDIO_PRODUCT_ID;
  }
}

export function creemConfigStatus() {
  return {
    apiKey: Boolean(process.env.CREEM_API_KEY),
    webhookSecret: Boolean(process.env.CREEM_WEBHOOK_SECRET),
    products: {
      starter: Boolean(process.env.CREEM_STARTER_PRODUCT_ID),
      creator: Boolean(process.env.CREEM_CREATOR_PRODUCT_ID),
      studio: Boolean(process.env.CREEM_STUDIO_PRODUCT_ID),
    },
    mode: creemMode(),
  };
}

export function creemReady() {
  const status = creemConfigStatus();
  return Boolean(status.apiKey && status.webhookSecret && status.products.starter && status.products.creator && status.products.studio);
}

export function missingCreemConfig() {
  const missing: string[] = [];
  const status = creemConfigStatus();
  if (!status.apiKey) missing.push("CREEM_API_KEY");
  if (process.env.CREEM_ENABLE_PAID_CHECKOUT !== "true") missing.push("CREEM_ENABLE_PAID_CHECKOUT=true");
  if (!status.webhookSecret) missing.push("CREEM_WEBHOOK_SECRET");
  if (!status.products.starter) missing.push("CREEM_STARTER_PRODUCT_ID");
  if (!status.products.creator) missing.push("CREEM_CREATOR_PRODUCT_ID");
  if (!status.products.studio) missing.push("CREEM_STUDIO_PRODUCT_ID");
  return missing;
}

export async function createCreemCustomerPortal(customerId: string) {
  const body = { customer_id: customerId };
  const primary = await creemJsonRequest("/customer-portal", body);
  if (primary.ok) return { ok: true as const, url: extractPortalUrl(primary.payload), payload: primary.payload };

  // Older Creem docs/API indexes also mention /customers/billing. Try it as a compatibility fallback.
  const fallback = await creemJsonRequest("/customers/billing", body);
  if (fallback.ok) return { ok: true as const, url: extractPortalUrl(fallback.payload), payload: fallback.payload };

  return { ok: false as const, status: primary.status || fallback.status, message: primary.message || fallback.message || "Creem customer portal is unavailable." };
}

export async function cancelCreemSubscription(subscriptionId: string) {
  return creemJsonRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {});
}

async function creemJsonRequest(path: string, body: Record<string, unknown>) {
  if (!process.env.CREEM_API_KEY) return { ok: false as const, status: 503, message: "CREEM_API_KEY is not configured." };
  const response = await fetch(`${creemApiBase()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CREEM_API_KEY,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    const message = typeof payload === "object" && payload ? String((payload as Record<string, unknown>).message || (payload as Record<string, unknown>).error || response.statusText) : response.statusText;
    return { ok: false as const, status: response.status, message, payload };
  }
  return { ok: true as const, status: response.status, payload };
}

export function extractPortalUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const candidates = [
    record.customerPortalLink,
    record.customer_portal_link,
    record.portal_url,
    record.portalUrl,
    record.billing_url,
    record.billingUrl,
    record.url,
    record.link,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && /^https?:\/\//.test(value)) return value;
  }
  for (const key of ["data", "customer", "portal", "billing"]) {
    const url = extractPortalUrl(record[key]);
    if (url) return url;
  }
  return null;
}

export function originFromRequest(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}` || SITE_URL;
}

export function extractCheckoutUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const candidates = [record.checkout_url, record.checkoutUrl, record.url, record.payment_url, record.paymentUrl];
  for (const value of candidates) {
    if (typeof value === "string" && /^https?:\/\//.test(value)) return value;
  }
  const nested = [record.checkout, record.data, record.session];
  for (const item of nested) {
    const url = extractCheckoutUrl(item);
    if (url) return url;
  }
  return null;
}

export function extractCreemEventId(event: unknown, rawBody: string) {
  if (!event || typeof event !== "object") return `raw_${simpleHash(rawBody)}`;
  const record = event as Record<string, unknown>;
  for (const key of ["id", "event_id", "eventId"]) {
    const value = record[key];
    if (typeof value === "string" && value) return value;
  }
  const data = record.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    for (const key of ["id", "transaction_id", "subscription_id", "checkout_id"]) {
      const value = nested[key];
      if (typeof value === "string" && value) return `${record.type || "event"}_${value}`;
    }
  }
  return `raw_${simpleHash(rawBody)}`;
}

export function extractCreemEventType(event: unknown) {
  if (!event || typeof event !== "object") return "unknown";
  const record = event as Record<string, unknown>;
  const value = record.type || record.event_type || record.eventType;
  return typeof value === "string" && value ? value : "unknown";
}

export function planFromCreemPayload(event: unknown): BillingPlan | null {
  const candidates: unknown[] = [];
  function collect(value: unknown, depth = 0) {
    if (!value || typeof value !== "object" || depth > 3) return;
    const record = value as Record<string, unknown>;
    for (const key of ["plan", "product_name", "productName", "product_id", "productId", "metadata"]) candidates.push(record[key]);
    for (const key of ["data", "object", "checkout", "subscription", "transaction", "product", "metadata"]) collect(record[key], depth + 1);
  }
  collect(event);
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (typeof candidate === "object") {
      const metadataPlan = (candidate as Record<string, unknown>).plan;
      if (isBillingPlan(metadataPlan)) return metadataPlan;
      continue;
    }
    const text = String(candidate).toLowerCase();
    if (text.includes("starter") || text === process.env.CREEM_STARTER_PRODUCT_ID?.toLowerCase()) return "starter";
    if (text.includes("creator") || text === process.env.CREEM_CREATOR_PRODUCT_ID?.toLowerCase()) return "creator";
    if (text.includes("studio") || text === process.env.CREEM_STUDIO_PRODUCT_ID?.toLowerCase()) return "studio";
  }
  return null;
}

export async function verifyCreemSignature(rawBody: string, signatureHeader: string | null, secret = process.env.CREEM_WEBHOOK_SECRET || "") {
  if (!secret || !signatureHeader) return false;
  const expected = await hmacHex(rawBody, secret);
  const candidates = signatureHeader
    .split(",")
    .map((part) => part.trim())
    .flatMap((part) => {
      const eq = part.includes("=") ? part.split("=").slice(1).join("=") : part;
      return [part, eq, part.replace(/^sha256=/, "")];
    })
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  return candidates.some((candidate) => timingSafeEqualHex(candidate, expected));
}

async function hmacHex(message: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqualHex(a: string, b: string) {
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  if (!/^[a-f0-9]+$/.test(left) || left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return result === 0;
}

function simpleHash(input: string) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  return Math.abs(hash).toString(36);
}
