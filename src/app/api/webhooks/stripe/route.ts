import { NextRequest, NextResponse } from "next/server";
import { grantCreditsFromStripe, markRefundedAccount, recordStripeWebhookEvent, updateSubscriptionState } from "@/lib/backend/billing-store";
import { extractBillingIds as extractStripeBillingIds } from "@/lib/backend/stripe-webhook-fields";
import {
  STRIPE_PLAN_CREDITS,
  extractStripeEventId,
  extractStripeEventType,
  planFromStripePayload,
  previousPlanFromStripePayload,
  verifyStripeSignature,
} from "@/lib/backend/stripe";
import { stripeBillingReasonFromPayload } from "@/lib/backend/stripe-plan";

const BILLING_EVENTS = new Set([
  "checkout.completed",
  "subscription.active",
  "subscription.paid",
  "subscription.canceled",
  "subscription.scheduled_cancel",
  "subscription.past_due",
  "subscription.expired",
  "subscription.trialing",
  "subscription.paused",
  "subscription.update",
  "refund.created",
  "refund.charge_summary",
  "refund.succeeded",
  "refund.completed",
  "payment.refunded",
  "transaction.refunded",
  "order.refunded",
  "subscription.refunded",
  "dispute.created",
]);
const RECORD_ONLY_EVENTS = new Set(["checkout.completed", "subscription.active"]);

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || request.headers.get("x-stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "STRIPE_WEBHOOK_SECRET is not configured." }, { status: 503 });
  }

  const verified = await verifyStripeSignature(rawBody, signature);
  if (!verified) {
    return NextResponse.json({ ok: false, error: "Invalid Stripe webhook signature." }, { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON webhook payload." }, { status: 400 });
  }

  const eventId = extractStripeEventId(event, rawBody);
  const eventType = extractStripeEventType(event);
  const plan = planFromStripePayload(event);
  const credits = plan ? STRIPE_PLAN_CREDITS[plan] : 0;
  const identity = extractIdentity(event);
  const ids = extractBillingIds(event);
  let persistence: unknown = { persisted: false, reason: "record_only" };

  try {
    if (eventType === "subscription.paid" && (ids.amountCents || 0) > 0 && ids.invoiceId) {
    if (!plan) throw new Error("STRIPE_PAID_INVOICE_PLAN_AMBIGUOUS");
    persistence = await grantCreditsFromStripe({
      eventId,
      eventType,
      userId: identity.userId,
      email: identity.email,
      plan,
      credits,
      subscriptionId: ids.subscriptionId,
      customerId: ids.customerId,
      checkoutId: ids.checkoutId,
      transactionId: ids.transactionId,
      invoiceId: ids.invoiceId,
      amountCents: ids.amountCents,
      currency: ids.currency,
      billingReason: stripeBillingReasonFromPayload(event),
      previousPlan: previousPlanFromStripePayload(event),
      rawEvent: event,
    });
  } else if (eventType === "subscription.canceled") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "canceled", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.scheduled_cancel") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "scheduled_cancel", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.update") {
    const status = extractSubscriptionUpdateStatus(event);
    if (status) persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status, plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.past_due") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "past_due", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.expired") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "expired", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.trialing") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "trialing", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.paused") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "paused", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "refund.charge_summary" && !ids.refundId?.startsWith("re_")) {
    persistence = await recordStripeWebhookEvent({ eventId, eventType, rawEvent: event, userId: identity.userId });
  } else if (isRefundEvent(eventType)) {
    persistence = await markRefundedAccount({
      eventId,
      eventType,
      userId: identity.userId,
      email: identity.email,
      plan,
      subscriptionId: ids.subscriptionId,
      customerId: ids.customerId,
      checkoutId: ids.checkoutId,
      transactionId: ids.transactionId,
      invoiceId: ids.invoiceId,
      refundId: ids.refundId,
      amountCents: ids.amountCents,
      currency: ids.currency,
      rawEvent: event,
    });
  } else if (eventType === "dispute.created") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "disputed", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (RECORD_ONLY_EVENTS.has(eventType)) {
    persistence = await recordStripeWebhookEvent({ eventId, eventType, rawEvent: event, userId: identity.userId });
  }
  } catch (error) {
    return NextResponse.json({ ok: false, code: "WEBHOOK_PERSISTENCE_FAILED", retryable: true, eventId, eventType, error: error instanceof Error ? error.message : "Billing persistence failed." }, { status: 503 });
  }

  const persistenceResult = persistence && typeof persistence === "object" ? persistence as { persisted?: boolean; reason?: string } : null;
  if (BILLING_EVENTS.has(eventType) && persistenceResult?.persisted !== true) {
    return NextResponse.json({ ok: false, code: "WEBHOOK_PERSISTENCE_FAILED", retryable: true, eventId, eventType, reason: persistenceResult?.reason || "Billing event was not durably persisted." }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    received: true,
    verified: true,
    eventId,
    eventType,
    supported: BILLING_EVENTS.has(eventType),
    plan,
    credits,
    identityFound: Boolean(identity.userId || identity.email),
    billingIdsFound: ids,
    persistence,
  });
}

function extractSubscriptionUpdateStatus(event: unknown): "active" | "trialing" | "scheduled_cancel" | "past_due" | "paused" | "canceled" | "expired" | null {
  if (!event || typeof event !== "object") return null;
  const data = (event as Record<string, unknown>).data;
  if (!data || typeof data !== "object") return null;
  const object = (data as Record<string, unknown>).object;
  if (!object || typeof object !== "object") return null;
  const subscription = object as Record<string, unknown>;
  if (subscription.cancel_at_period_end === true) return "scheduled_cancel";
  const status = stringValue(subscription.status)?.toLowerCase();
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "paused") return "paused";
  if (status === "canceled") return "canceled";
  if (status === "incomplete_expired") return "expired";
  return null;
}

function isRefundEvent(eventType: string) {
  const value = eventType.trim().toLowerCase();
  return value === "refund.created"
    || value === "refund.succeeded"
    || value === "refund.completed"
    || value === "payment.refunded"
    || value === "transaction.refunded"
    || value === "order.refunded"
    || value === "subscription.refunded"
    || (value.includes("refund") && !value.includes("request"));
}

function extractIdentity(event: unknown) {
  const candidates: unknown[] = [];
  collectFields(event, ["metadata", "customer", "user", "data", "object", "checkout", "subscription", "parent", "subscription_details", "payment_intent", "charge"], candidates);
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const record = candidate as Record<string, unknown>;
    const userId = stringValue(record.user_id || record.userId || record.user);
    const email = stringValue(record.email || record.customer_email || record.customerEmail);
    if (userId || email) return { userId, email };
    const metadata = record.metadata;
    if (metadata && typeof metadata === "object") {
      const meta = metadata as Record<string, unknown>;
      const metaUserId = stringValue(meta.user_id || meta.userId || meta.user);
      const metaEmail = stringValue(meta.email || meta.customer_email || meta.customerEmail);
      if (metaUserId || metaEmail) return { userId: metaUserId, email: metaEmail };
    }
  }
  return { userId: null, email: null };
}

function extractBillingIds(event: unknown) {
  return extractStripeBillingIds(event);
}

function collectFields(value: unknown, keys: string[], out: unknown[], depth = 0) {
  if (!value || typeof value !== "object" || depth > 7) return;
  out.push(value);
  if (Array.isArray(value)) {
    for (const item of value) collectFields(item, keys, out, depth + 1);
    return;
  }
  const record = value as Record<string, unknown>;
  for (const key of keys) collectFields(record[key], keys, out, depth + 1);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
