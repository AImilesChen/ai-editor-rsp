import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { AuthUser } from "@/lib/backend/auth";
import { DEFAULT_LIFETIME_CREDITS } from "@/lib/backend/session";
import type { BillingPlan } from "@/lib/backend/creem";
import { cancelCreemSubscription } from "@/lib/backend/creem";

export type BillingAccount = {
  userId: string;
  email?: string;
  plan: "free" | BillingPlan;
  creditsRemaining: number;
  subscriptionStatus: "none" | "active" | "trialing" | "paused" | "scheduled_cancel" | "canceled" | "past_due" | "expired" | "refund_requested" | "refunded" | "disputed";
  subscriptionId?: string;
  customerId?: string;
  lastCreemEventId?: string;
  lastRefundRequestId?: string;
  updatedAt: number;
  createdAt: number;
};

export type RefundRequest = {
  requestId: string;
  userId: string;
  email?: string;
  plan: BillingAccount["plan"];
  subscriptionStatus: BillingAccount["subscriptionStatus"];
  creditsRemaining: number;
  subscriptionId?: string;
  customerId?: string;
  reason?: string;
  status: "submitted";
  createdAt: number;
};

export type CreditGrantInput = {
  eventId: string;
  eventType: string;
  userId?: string | null;
  email?: string | null;
  plan: BillingPlan;
  credits: number;
  subscriptionId?: string | null;
  customerId?: string | null;
  rawEvent?: unknown;
};

type KV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number; metadata?: unknown }): Promise<void>;
};

type BillingEnv = { BILLING_KV?: KV };

export async function billingKv(): Promise<KV | null> {
  try {
    const context = await getCloudflareContext({ async: true });
    return ((context.env as BillingEnv).BILLING_KV as KV | undefined) || null;
  } catch {
    return null;
  }
}

export async function billingStoreStatus() {
  return { kv: Boolean(await billingKv()) };
}

export async function ensureBillingAccount(user: AuthUser): Promise<BillingAccount | null> {
  const kv = await billingKv();
  if (!kv) return null;
  const existing = await readAccountByUserId(user.id, kv);
  if (existing) {
    if (existing.email !== user.email) {
      const updated = { ...existing, email: user.email, updatedAt: Date.now() };
      await writeAccount(updated, kv);
      await kv.put(emailKey(user.email), user.id);
      return updated;
    }
    return existing;
  }
  const created: BillingAccount = {
    userId: user.id,
    email: user.email,
    plan: user.plan || "free",
    creditsRemaining: typeof user.creditsRemaining === "number" ? user.creditsRemaining : DEFAULT_LIFETIME_CREDITS,
    subscriptionStatus: "none",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await writeAccount(created, kv);
  await kv.put(emailKey(user.email), user.id);
  return created;
}

export async function accountForPublicUser(user: AuthUser) {
  const account = await ensureBillingAccount(user);
  return account || {
    userId: user.id,
    email: user.email,
    plan: user.plan,
    creditsRemaining: user.creditsRemaining,
    subscriptionStatus: "none" as const,
  };
}

export async function grantCreditsFromCreem(input: CreditGrantInput) {
  const kv = await billingKv();
  if (!kv) return { persisted: false, duplicate: false, reason: "BILLING_KV missing" };
  if (!input.eventId || !input.plan || input.credits <= 0) return { persisted: false, duplicate: false, reason: "Missing grant fields" };

  const eventKeyName = eventKey(input.eventId);
  const existingEvent = await kv.get(eventKeyName);
  if (existingEvent) return { persisted: true, duplicate: true, account: null };

  const userId = input.userId || (input.email ? await kv.get(emailKey(input.email)) : null);
  if (!userId) {
    await kv.put(eventKeyName, JSON.stringify({ ...eventRecord(input), persisted: false, reason: "Missing user_id/email mapping" }));
    return { persisted: false, duplicate: false, reason: "Missing user_id/email mapping" };
  }

  const current = await readAccountByUserId(userId, kv);
  const cycleKeyName = grantCycleKey(userId, input.subscriptionId || input.customerId || input.plan);
  const existingCycleGrant = await kv.get(cycleKeyName);
  if (existingCycleGrant) {
    await kv.put(eventKeyName, JSON.stringify({ ...eventRecord(input), persisted: true, duplicateGrant: true, accountUserId: userId, at: Date.now() }));
    return { persisted: true, duplicate: true, account: current };
  }

  const now = Date.now();
  const account: BillingAccount = {
    userId,
    email: input.email || current?.email,
    plan: input.plan,
    creditsRemaining: (current?.creditsRemaining ?? DEFAULT_LIFETIME_CREDITS) + input.credits,
    subscriptionStatus: "active",
    subscriptionId: input.subscriptionId || current?.subscriptionId,
    customerId: input.customerId || current?.customerId,
    lastCreemEventId: input.eventId,
    createdAt: current?.createdAt || now,
    updatedAt: now,
  };

  await writeAccount(account, kv);
  if (account.email) await kv.put(emailKey(account.email), userId);
  await kv.put(eventKeyName, JSON.stringify({ ...eventRecord(input), persisted: true, accountUserId: userId, creditsGranted: input.credits, at: now }));
  await kv.put(cycleKeyName, JSON.stringify({ eventId: input.eventId, userId, plan: input.plan, credits: input.credits, at: now }), { expirationTtl: 60 * 60 * 24 * 40 });
  await kv.put(ledgerKey(userId, input.eventId), JSON.stringify({ type: "credit_grant", ...eventRecord(input), credits: input.credits, balanceAfter: account.creditsRemaining, at: now }));
  return { persisted: true, duplicate: false, account };
}

export async function debitCreditForUser(user: AuthUser, amount = 1) {
  const kv = await billingKv();
  if (!kv) return { persisted: false, creditsRemaining: user.creditsRemaining, insufficient: user.creditsRemaining < amount };
  const account = (await ensureBillingAccount(user)) || null;
  const currentCredits = account?.creditsRemaining ?? user.creditsRemaining;
  if (currentCredits < amount) return { persisted: true, creditsRemaining: currentCredits, insufficient: true };
  const now = Date.now();
  const next: BillingAccount = {
    userId: user.id,
    email: account?.email || user.email,
    plan: account?.plan || user.plan || "free",
    creditsRemaining: currentCredits - amount,
    subscriptionStatus: account?.subscriptionStatus || "none",
    subscriptionId: account?.subscriptionId,
    customerId: account?.customerId,
    lastCreemEventId: account?.lastCreemEventId,
    createdAt: account?.createdAt || now,
    updatedAt: now,
  };
  await writeAccount(next, kv);
  await kv.put(ledgerKey(user.id, `debit_${crypto.randomUUID()}`), JSON.stringify({ type: "credit_debit", userId: user.id, amount, balanceAfter: next.creditsRemaining, at: now }));
  return { persisted: true, creditsRemaining: next.creditsRemaining, insufficient: false };
}

export async function updateSubscriptionState(input: {
  eventId: string;
  eventType: string;
  userId?: string | null;
  email?: string | null;
  status: BillingAccount["subscriptionStatus"];
  plan?: BillingPlan | null;
  subscriptionId?: string | null;
  customerId?: string | null;
}) {
  const kv = await billingKv();
  if (!kv) return { persisted: false, reason: "BILLING_KV missing" };
  const userId = input.userId || (input.email ? await kv.get(emailKey(input.email)) : null);
  if (!userId) {
    await kv.put(eventKey(input.eventId), JSON.stringify({ ...input, persisted: false, reason: "Missing user_id/email mapping" }));
    return { persisted: false, reason: "Missing user_id/email mapping" };
  }
  const current = await readAccountByUserId(userId, kv);
  const now = Date.now();
  const account: BillingAccount = {
    userId,
    email: input.email || current?.email,
    plan: input.plan || current?.plan || "free",
    creditsRemaining: current?.creditsRemaining ?? DEFAULT_LIFETIME_CREDITS,
    subscriptionStatus: input.status,
    subscriptionId: input.subscriptionId || current?.subscriptionId,
    customerId: input.customerId || current?.customerId,
    lastCreemEventId: input.eventId,
    createdAt: current?.createdAt || now,
    updatedAt: now,
  };
  await writeAccount(account, kv);
  if (account.email) await kv.put(emailKey(account.email), userId);
  await kv.put(eventKey(input.eventId), JSON.stringify({ ...input, persisted: true, accountUserId: userId, at: now }));
  return { persisted: true, account };
}

export async function submitRefundRequestForUser(user: AuthUser, reason?: string) {
  const kv = await billingKv();
  if (!kv) return { ok: false, reason: "BILLING_KV missing" };
  const account = await ensureBillingAccount(user);
  if (!account) return { ok: false, reason: "Account not found" };
  if (account.plan === "free") return { ok: false, reason: "No paid plan on this account" };
  if (account.subscriptionStatus === "refund_requested" && account.lastRefundRequestId) {
    return { ok: true, duplicate: true, requestId: account.lastRefundRequestId, account };
  }
  const now = Date.now();
  const requestId = `refund_${now}_${crypto.randomUUID()}`;
  const request: RefundRequest = {
    requestId,
    userId: account.userId,
    email: account.email || user.email,
    plan: account.plan,
    subscriptionStatus: account.subscriptionStatus,
    creditsRemaining: account.creditsRemaining,
    subscriptionId: account.subscriptionId,
    customerId: account.customerId,
    reason: reason?.trim().slice(0, 1000) || undefined,
    status: "submitted",
    createdAt: now,
  };
  const updated: BillingAccount = {
    ...account,
    subscriptionStatus: "refund_requested",
    lastRefundRequestId: requestId,
    updatedAt: now,
  };
  await writeAccount(updated, kv);
  if (updated.email) await kv.put(emailKey(updated.email), updated.userId);
  await kv.put(refundRequestKey(updated.userId, requestId), JSON.stringify(request));
  await kv.put(ledgerKey(updated.userId, requestId), JSON.stringify({ type: "refund_request", ...request, at: now }));
  return { ok: true, duplicate: false, requestId, account: updated };
}

export async function submitSubscriptionCancellationForUser(user: AuthUser) {
  const kv = await billingKv();
  if (!kv) return { ok: false, reason: "BILLING_KV missing" };
  const account = await ensureBillingAccount(user);
  if (!account) return { ok: false, reason: "Account not found" };
  if (account.plan === "free") return { ok: false, reason: "No paid subscription on this account" };
  if (account.subscriptionStatus === "canceled" || account.subscriptionStatus === "scheduled_cancel") return { ok: true, duplicate: true, account };
  if (!account.subscriptionId) return { ok: false, reason: "Creem subscription ID is not available for this account" };

  const creemResult = await cancelCreemSubscription(account.subscriptionId);
  if (!creemResult.ok) return { ok: false, reason: creemResult.message || "Creem subscription cancellation failed", status: creemResult.status };

  const now = Date.now();
  const updated: BillingAccount = {
    ...account,
    subscriptionStatus: "canceled",
    updatedAt: now,
  };
  await writeAccount(updated, kv);
  if (updated.email) await kv.put(emailKey(updated.email), updated.userId);
  const cancellationId = `cancel_${now}_${crypto.randomUUID()}`;
  await kv.put(ledgerKey(updated.userId, cancellationId), JSON.stringify({ type: "subscription_cancel", userId: updated.userId, email: updated.email, subscriptionId: updated.subscriptionId, creem: creemResult.payload, at: now }));
  return { ok: true, duplicate: false, account: updated, creem: creemResult.payload };
}

export async function markRefundedAccount(input: {
  eventId: string;
  eventType: string;
  userId?: string | null;
  email?: string | null;
  plan?: BillingPlan | null;
  subscriptionId?: string | null;
  customerId?: string | null;
}) {
  const result = await updateSubscriptionState({ ...input, status: "refunded" });
  if (!result.persisted || !result.account) return result;
  const kv = await billingKv();
  if (!kv) return result;
  const account: BillingAccount = {
    ...result.account,
    creditsRemaining: 0,
    updatedAt: Date.now(),
  };
  await writeAccount(account, kv);
  await kv.put(ledgerKey(account.userId, `${input.eventId}_credit_revoke`), JSON.stringify({ type: "refund_credit_revoke", eventId: input.eventId, eventType: input.eventType, userId: account.userId, balanceAfter: 0, at: account.updatedAt }));
  return { ...result, account };
}

async function readAccountByUserId(userId: string, kv: KV): Promise<BillingAccount | null> {
  const raw = await kv.get(accountKey(userId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as BillingAccount;
    if (!parsed.userId || typeof parsed.creditsRemaining !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeAccount(account: BillingAccount, kv: KV) {
  await kv.put(accountKey(account.userId), JSON.stringify(account));
}

function accountKey(userId: string) {
  return `billing:account:${userId}`;
}

function emailKey(email: string) {
  return `billing:email:${email.trim().toLowerCase()}`;
}

function eventKey(eventId: string) {
  return `billing:event:${eventId}`;
}

function grantCycleKey(userId: string, seed: string) {
  const date = new Date();
  const period = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return `billing:grant:${userId}:${seed}:${period}`;
}

function ledgerKey(userId: string, eventId: string) {
  return `billing:ledger:${userId}:${eventId}`;
}

function refundRequestKey(userId: string, requestId: string) {
  return `billing:refund:${userId}:${requestId}`;
}

function eventRecord(input: CreditGrantInput) {
  return {
    eventId: input.eventId,
    eventType: input.eventType,
    userId: input.userId || null,
    email: input.email || null,
    plan: input.plan,
    credits: input.credits,
    subscriptionId: input.subscriptionId || null,
    customerId: input.customerId || null,
  };
}
