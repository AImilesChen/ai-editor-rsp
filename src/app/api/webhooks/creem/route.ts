import { NextRequest, NextResponse } from "next/server";
import { grantCreditsFromCreem, markRefundedAccount, updateSubscriptionState } from "@/lib/backend/billing-store";
import {
  CREEM_PLAN_CREDITS,
  extractCreemEventId,
  extractCreemEventType,
  planFromCreemPayload,
  verifyCreemSignature,
} from "@/lib/backend/creem";

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
  "dispute.created",
]);

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("creem-signature") || request.headers.get("x-creem-signature");

  if (!process.env.CREEM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "CREEM_WEBHOOK_SECRET is not configured." }, { status: 503 });
  }

  const verified = await verifyCreemSignature(rawBody, signature);
  if (!verified) {
    return NextResponse.json({ ok: false, error: "Invalid Creem webhook signature." }, { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON webhook payload." }, { status: 400 });
  }

  const eventId = extractCreemEventId(event, rawBody);
  const eventType = extractCreemEventType(event);
  const plan = planFromCreemPayload(event);
  const credits = plan ? CREEM_PLAN_CREDITS[plan] : 0;
  const identity = extractIdentity(event);
  const ids = extractBillingIds(event);
  let persistence: unknown = { persisted: false, reason: "record_only" };

  if (plan && credits > 0 && (eventType === "checkout.completed" || eventType === "subscription.active" || eventType === "subscription.paid")) {
    persistence = await grantCreditsFromCreem({
      eventId,
      eventType,
      userId: identity.userId,
      email: identity.email,
      plan,
      credits,
      subscriptionId: ids.subscriptionId,
      customerId: ids.customerId,
    });
  } else if (eventType === "subscription.canceled") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "canceled", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.scheduled_cancel") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "scheduled_cancel", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.past_due") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "past_due", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.expired") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "expired", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.trialing") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "trialing", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "subscription.paused") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "paused", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "refund.created") {
    persistence = await markRefundedAccount({ eventId, eventType, userId: identity.userId, email: identity.email, plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
  } else if (eventType === "dispute.created") {
    persistence = await updateSubscriptionState({ eventId, eventType, userId: identity.userId, email: identity.email, status: "disputed", plan, subscriptionId: ids.subscriptionId, customerId: ids.customerId });
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

function extractIdentity(event: unknown) {
  const candidates: unknown[] = [];
  collectFields(event, ["metadata", "customer", "user", "data", "object", "checkout", "subscription"], candidates);
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
  const candidates: unknown[] = [];
  collectFields(event, ["data", "object", "checkout", "subscription", "customer", "transaction"], candidates);
  let subscriptionId: string | null = null;
  let customerId: string | null = null;
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const record = candidate as Record<string, unknown>;
    subscriptionId ||= stringValue(record.subscription_id || record.subscriptionId || record.subscription);
    customerId ||= stringValue(record.customer_id || record.customerId || record.customer);
  }
  return { subscriptionId, customerId };
}

function collectFields(value: unknown, keys: string[], out: unknown[], depth = 0) {
  if (!value || typeof value !== "object" || depth > 5) return;
  out.push(value);
  const record = value as Record<string, unknown>;
  for (const key of keys) collectFields(record[key], keys, out, depth + 1);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
