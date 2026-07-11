export type StripeBillingIds = {
  subscriptionId: string | null;
  customerId: string | null;
  checkoutId: string | null;
  transactionId: string | null;
  invoiceId: string | null;
  refundId: string | null;
  amountCents: number | null;
  currency: string | null;
};

export function extractBillingIds(event: unknown): StripeBillingIds {
  const records: Record<string, unknown>[] = [];
  collectRecords(event, records, 0);
  const rootObject = event && typeof event === "object"
    ? ((event as Record<string, unknown>).data as Record<string, unknown> | undefined)?.object
    : null;
  const root = rootObject && typeof rootObject === "object" ? rootObject as Record<string, unknown> : null;
  const nestedRefunds = root && stringValue(root.object)?.toLowerCase() === "charge"
    ? ((((root.refunds as Record<string, unknown> | undefined)?.data) as unknown[]) || [])
        .filter((value): value is Record<string, unknown> => Boolean(value && typeof value === "object" && stringValue((value as Record<string, unknown>).object)?.toLowerCase() === "refund"))
        .sort((a, b) => Number(b.created || 0) - Number(a.created || 0))
    : [];
  const refund = root && stringValue(root.object)?.toLowerCase() === "refund"
    ? root
    : nestedRefunds[0] || null;
  const ordered = refund ? [refund, ...records.filter((record) => record !== refund)] : records;
  let subscriptionId: string | null = null;
  let customerId: string | null = null;
  let checkoutId: string | null = null;
  let transactionId: string | null = null;
  let invoiceId: string | null = null;
  let refundId: string | null = null;
  let amountCents: number | null = null;
  let productPriceCents: number | null = null;
  let currency: string | null = null;

  for (const record of ordered) {
    const objectType = stringValue(record.object)?.toLowerCase() || null;
    subscriptionId ||= stringValue(record.subscription_id || record.subscriptionId || record.subscription);
    customerId ||= stringValue(record.customer_id || record.customerId || record.customer);
    checkoutId ||= stringValue(record.checkout_id || record.checkoutId || record.checkout || record.checkout_session || record.checkoutSession);
    transactionId ||= stringValue(record.transaction_id || record.transactionId || record.last_transaction_id || record.lastTransactionId || record.transaction || record.payment_id || record.paymentId || record.payment_intent || record.paymentIntent || record.charge_id || record.chargeId || record.charge || record.balance_transaction || record.balanceTransaction);
    invoiceId ||= stringValue(record.invoice_id || record.invoiceId || record.invoice);
    refundId ||= stringValue(record.refund_id || record.refundId || record.refund);
    if (objectType === "subscription") subscriptionId ||= stringValue(record.id);
    if (objectType === "customer") customerId ||= stringValue(record.id);
    if (objectType === "checkout" || objectType === "checkout.session") checkoutId ||= stringValue(record.id);
    if (["order", "transaction", "payment", "payment_intent", "charge"].includes(objectType || "")) transactionId ||= stringValue(record.id);
    if (objectType === "invoice") invoiceId ||= stringValue(record.id);
    if (objectType === "refund") refundId ||= stringValue(record.id);
    if (amountCents === null && objectType !== "product") {
      amountCents = moneyCentsValue(record.amount_cents, "amount_cents") ?? moneyCentsValue(record.amountCents, "amountCents") ?? moneyCentsValue(record.amount_paid, "amount_paid") ?? moneyCentsValue(record.amountPaid, "amountPaid") ?? moneyCentsValue(record.amount_total, "amount_total") ?? moneyCentsValue(record.amountTotal, "amountTotal") ?? moneyCentsValue(record.amount_due, "amount_due") ?? moneyCentsValue(record.amountDue, "amountDue") ?? moneyCentsValue(record.total_amount, "total_amount") ?? moneyCentsValue(record.totalAmount, "totalAmount") ?? moneyCentsValue(record.total, "total") ?? moneyCentsValue(record.amount, "amount");
    } else if (objectType === "product" && productPriceCents === null) {
      productPriceCents = moneyCentsValue(record.price, "price");
    }
    currency ||= stringValue(record.currency);
  }
  return { subscriptionId, customerId, checkoutId, transactionId, invoiceId, refundId, amountCents: amountCents ?? productPriceCents, currency };
}

function collectRecords(value: unknown, output: Record<string, unknown>[], depth: number) {
  if (!value || typeof value !== "object" || depth > 9) return;
  if (Array.isArray(value)) {
    for (const item of value) collectRecords(item, output, depth + 1);
    return;
  }
  const record = value as Record<string, unknown>;
  output.push(record);
  for (const nested of Object.values(record)) collectRecords(nested, output, depth + 1);
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
