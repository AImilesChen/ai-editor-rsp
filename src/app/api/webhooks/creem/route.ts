import { NextRequest, NextResponse } from "next/server";
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

  // Current P0 integration intentionally does not grant credits from webhook yet
  // because the deployed Worker has no D1 binding. The endpoint verifies signed
  // Creem events and exposes deterministic event mapping; persistent entitlement
  // writes must be enabled when D1 tables are added.
  const entitlementAction = entitlementActionFor(eventType, plan, credits);

  return NextResponse.json({
    ok: true,
    received: true,
    verified: true,
    eventId,
    eventType,
    supported: BILLING_EVENTS.has(eventType),
    plan,
    entitlementAction,
    persisted: false,
    next: "Add D1 billing tables and idempotent credit_ledger writes before enabling production paid entitlements.",
  });
}

function entitlementActionFor(eventType: string, plan: string | null, credits: number) {
  if ((eventType === "subscription.active" || eventType === "subscription.paid") && plan) {
    return { type: "grant_monthly_credits", plan, credits };
  }
  if (eventType === "subscription.canceled" || eventType === "subscription.scheduled_cancel") {
    return { type: "mark_cancelled" };
  }
  if (eventType === "subscription.past_due" || eventType === "subscription.expired") {
    return { type: "restrict_paid_entitlements" };
  }
  if (eventType === "refund.created" || eventType === "dispute.created") {
    return { type: "review_or_revoke_credits" };
  }
  return { type: "record_only" };
}
