export type StripeBillingPlan = "starter" | "creator" | "studio";

type StripePriceIds = Partial<Record<StripeBillingPlan, string | undefined>>;

type CreditReplacementInput = {
  before: number;
  priorPaidRemaining: number;
  priorPlanCredits?: number;
  targetCredits: number;
  isUpgrade?: boolean;
};

type CreditGrantIdentity = {
  invoiceId?: string | null;
  subscriptionId?: string | null;
  customerId?: string | null;
  userId?: string | null;
  email?: string | null;
  plan: StripeBillingPlan;
};

const PLAN_ORDER: StripeBillingPlan[] = ["starter", "creator", "studio"];

export function resolveStripePlanFromPayload(payload: unknown, priceIds: StripePriceIds): StripeBillingPlan | null {
  const priceToPlan = buildPriceMap(priceIds);
  const records: Record<string, unknown>[] = [];
  collectRecords(payload, records, 0);
  const chargedPlans = uniqueLinePlans(records, priceToPlan, (amount) => amount > 0);

  // Proration invoices contain a negative line for the old plan and a positive
  // line for the new plan. Resolve from the positively charged target line so
  // payload traversal order cannot misclassify an upgrade as the old plan. An
  // invoice with multiple positive plan prices is ambiguous and must retry.
  if (chargedPlans.size === 1) return [...chargedPlans][0];
  if (chargedPlans.size > 1) return null;

  const isInvoice = records.some((record) => record.object === "invoice" || stringValue(record.billing_reason) !== null);
  if (isInvoice) return null;

  for (const record of records) {
    const plan = priceToPlan.get(directPriceId(record) || "");
    if (plan) return plan;
  }
  return null;
}

export function previousStripePlanFromPayload(payload: unknown, priceIds: StripePriceIds): StripeBillingPlan | null {
  const records: Record<string, unknown>[] = [];
  collectRecords(payload, records, 0);
  const creditedPlans = uniqueLinePlans(records, buildPriceMap(priceIds), (amount) => amount < 0);
  return creditedPlans.size === 1 ? [...creditedPlans][0] : null;
}

export function inferStripePriorPaidRemaining(input: { before: number; bucketRemaining: number; priorPlanCredits: number; hasActiveBucket: boolean }) {
  const bucketRemaining = Math.max(0, Math.round(input.bucketRemaining));
  if (input.hasActiveBucket) return bucketRemaining;
  return Math.min(Math.max(0, Math.round(input.before)), Math.max(0, Math.round(input.priorPlanCredits)));
}

export function calculateStripeCreditReplacement(input: CreditReplacementInput) {
  const before = Math.max(0, Math.round(input.before));
  const priorPaidRemaining = Math.max(0, Math.round(input.priorPaidRemaining));
  const priorPlanCredits = Math.max(0, Math.round(input.priorPlanCredits || 0));
  const targetCredits = Math.max(0, Math.round(input.targetCredits));
  if (input.isUpgrade) {
    const ledgerDelta = Math.max(0, targetCredits - priorPlanCredits);
    return { after: before + ledgerDelta, ledgerDelta };
  }
  const after = Math.max(0, before - priorPaidRemaining) + targetCredits;
  return { after, ledgerDelta: after - before };
}

export function stripeBillingReasonFromPayload(payload: unknown) {
  const records: Record<string, unknown>[] = [];
  collectRecords(payload, records, 0);
  for (const record of records) {
    const reason = stringValue(record.billing_reason || record.billingReason);
    if (reason) return reason.toLowerCase();
  }
  return null;
}

export function stripeCreditGrantSourceId(input: CreditGrantIdentity, now = new Date()) {
  const invoiceId = input.invoiceId?.trim();
  if (invoiceId) return `invoice:${invoiceId}`;
  const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return `${input.subscriptionId || input.customerId || input.userId || input.email || input.plan}:${input.plan}:${period}`;
}

function directPriceId(record: Record<string, unknown>) {
  const pricing = objectValue(record.pricing);
  const priceDetails = objectValue(pricing?.price_details);
  const price = objectValue(record.price);
  return stringValue(priceDetails?.price)
    || stringValue(record.price_id)
    || stringValue(record.priceId)
    || stringValue(record.price)
    || stringValue(price?.id);
}

function buildPriceMap(priceIds: StripePriceIds) {
  const priceToPlan = new Map<string, StripeBillingPlan>();
  for (const plan of PLAN_ORDER) {
    const priceId = priceIds[plan]?.trim();
    if (priceId) priceToPlan.set(priceId, plan);
  }
  return priceToPlan;
}

function uniqueLinePlans(
  records: Record<string, unknown>[],
  priceToPlan: Map<string, StripeBillingPlan>,
  acceptsAmount: (amount: number) => boolean,
) {
  const plans = new Set<StripeBillingPlan>();
  for (const record of records) {
    const amount = numericValue(record.amount);
    const plan = priceToPlan.get(directPriceId(record) || "");
    if (plan && amount !== null && acceptsAmount(amount)) plans.add(plan);
  }
  return plans;
}

function collectRecords(value: unknown, output: Record<string, unknown>[], depth: number) {
  if (!value || typeof value !== "object" || depth > 8) return;
  if (Array.isArray(value)) {
    for (const item of value) collectRecords(item, output, depth + 1);
    return;
  }
  const record = value as Record<string, unknown>;
  output.push(record);
  for (const nested of Object.values(record)) collectRecords(nested, output, depth + 1);
}

function objectValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numericValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
