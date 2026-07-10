import { NextRequest, NextResponse } from "next/server";
import { grantCreditsFromStripe, markRefundedAccount, updateSubscriptionState } from "@/lib/backend/billing-store";
import {
  STRIPE_PLAN_CREDITS,
  extractStripeEventId,
  extractStripeEventType,
  planFromStripePayload,
  verifyStripeSignature,
} from "@/lib/backend/stripe";

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
  "refund.succeeded",
  "refund.completed",
  "payment.refunded",
  "transaction.refunded",
  "order.refunded",
  "subscription.refunded",
  "dispute.created",
]);

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

  if (plan && credits > 0 && (eventType === "checkout.completed" || eventType === "subscription.active" || eventType === "subscription.paid")) {
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
      rawEvent: event,
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
      rawEvent: event,
    });
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
  const candidates: unknown[] = [];
  collectFields(event, ["data", "object", "checkout", "subscription", "customer", "transaction", "last_transaction", "lastTransaction", "invoice", "payment", "payment_intent", "charge", "refund", "order", "product", "items", "lines", "parent", "subscription_details"], candidates);
  let subscriptionId: string | null = null;
  let customerId: string | null = null;
  let checkoutId: string | null = null;
  let transactionId: string | null = null;
  let invoiceId: string | null = null;
  let refundId: string | null = null;
  let amountCents: number | null = null;
  let productPriceCents: number | null = null;
  let currency: string | null = null;
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const record = candidate as Record<string, unknown>;
    const objectType = stringValue(record.object)?.toLowerCase() || null;
    subscriptionId ||= stringValue(record.subscription_id || record.subscriptionId || record.subscription);
    customerId ||= stringValue(record.customer_id || record.customerId || record.customer);
    checkoutId ||= stringValue(record.checkout_id || record.checkoutId || record.checkout || record.checkout_session || record.checkoutSession);
    transactionId ||= stringValue(
      record.transaction_id
      || record.transactionId
      || record.last_transaction_id
      || record.lastTransactionId
      || record.transaction
      || record.payment_id
      || record.paymentId
      || record.payment_intent
      || record.paymentIntent
      || record.charge_id
      || record.chargeId
      || record.charge
      || record.balance_transaction
      || record.balanceTransaction
    );
    invoiceId ||= stringValue(record.invoice_id || record.invoiceId || record.invoice);
    refundId ||= stringValue(record.refund_id || record.refundId || record.refund);
    if (objectType === "subscription") subscriptionId ||= stringValue(record.id);
    if (objectType === "customer") customerId ||= stringValue(record.id);
    if (objectType === "checkout" || objectType === "checkout.session") checkoutId ||= stringValue(record.id);
    if (objectType === "order" || objectType === "transaction" || objectType === "payment" || objectType === "payment_intent" || objectType === "charge") transactionId ||= stringValue(record.id);
    if (objectType === "invoice") invoiceId ||= stringValue(record.id);
    if (objectType === "refund") refundId ||= stringValue(record.id);
    if (objectType !== "product") {
      amountCents ||= moneyCentsValue(record.amount_cents, "amount_cents")
        || moneyCentsValue(record.amountCents, "amountCents")
        || moneyCentsValue(record.amount_paid, "amount_paid")
        || moneyCentsValue(record.amountPaid, "amountPaid")
        || moneyCentsValue(record.amount_total, "amount_total")
        || moneyCentsValue(record.amountTotal, "amountTotal")
        || moneyCentsValue(record.amount_due, "amount_due")
        || moneyCentsValue(record.amountDue, "amountDue")
        || moneyCentsValue(record.total_amount, "total_amount")
        || moneyCentsValue(record.totalAmount, "totalAmount")
        || moneyCentsValue(record.total, "total")
        || moneyCentsValue(record.amount, "amount");
    } else {
      productPriceCents ||= moneyCentsValue(record.price, "price");
    }
    currency ||= stringValue(record.currency);
  }
  return { subscriptionId, customerId, checkoutId, transactionId, invoiceId, refundId, amountCents: amountCents ?? productPriceCents, currency };
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

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Math.round(Number(value));
  return null;
}

function moneyCentsValue(value: unknown, fieldName: string) {
  const raw = numberValue(value);
  if (raw === null) return null;
  const text = typeof value === "string" ? value.trim() : String(value);
  const isExplicitCents = /cents?|amount_(total|paid|due)|amount(total|paid|due)|total_amount|totalAmount|price|amount/i.test(fieldName);
  if (isExplicitCents && !text.includes(".")) return raw;
  if (Math.abs(Number(text)) > 0 && Math.abs(Number(text)) < 100 && text.includes(".")) return Math.round(Number(text) * 100);
  return raw;
}
