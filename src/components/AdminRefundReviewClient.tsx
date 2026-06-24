"use client";

import { FormEvent, useEffect, useState } from "react";

type ReviewResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  email?: string;
  user?: { plan: string; status: string; creditsRemaining: number };
  currentSubscription?: { plan: string; status: string; periodStart?: number | null; periodEnd?: number | null } | null;
  latestPayment?: { status: string; plan: string; amountCents: number; amount: number; currency: string; paidAt?: number | null } | null;
  latestRefundRequest?: { status: string; amountCents?: number | null; currency?: string | null; requestedAt: number; resolvedAt?: number | null } | null;
  usage?: {
    lifetimeFreeCreditsGranted: number;
    lifetimeGenerationCreditsUsed: number;
    freeCreditsRemainingAtPayment: number;
    periodGenerationCreditsUsed: number;
    paidCreditsGranted: number;
    paidCreditsUsed: number;
    paidCreditsRevoked: number;
    paidUsagePercent: number;
    generationJobs: number;
    completedGenerationJobs: number;
  };
  refundReview?: {
    policy: { refundWindowDays: number; maxPaidCreditUsagePercent: number };
    daysSincePayment?: number | null;
    eligible: boolean;
    code: string;
    label: string;
    reason: string;
    suggestedRefundCents: number;
    suggestedRefundAmount: number;
    currency: string;
  };
};

type OverviewRow = Record<string, string | number | null | undefined>;

type OverviewResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  generatedAt?: number;
  stats?: {
    totalUsers: number;
    activeSubscribers: number;
    refundRequests: number;
    pendingRefunds: number;
    refundedUsers: number;
    canceledSubscriptions: number;
  };
  subscribers?: OverviewRow[];
  refunds?: OverviewRow[];
  canceled?: OverviewRow[];
};

function formatDate(value?: number | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function money(amount?: number, currency = "USD") {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount || 0);
}

function moneyCents(cents?: number | null, currency = "USD") {
  return money(typeof cents === "number" ? cents / 100 : 0, currency);
}

function statusTone(eligible?: boolean, code?: string) {
  if (eligible) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (code === "ALREADY_REFUNDED") return "border-stone-200 bg-stone-50 text-stone-700";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function text(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function calcUsagePercent(row: OverviewRow) {
  const granted = Number(row.paidCreditsGranted || 0);
  const used = Number(row.generationCreditsUsed || 0);
  if (!granted) return "0%";
  return `${Math.min(100, Math.round((used / granted) * 1000) / 10)}%`;
}

function rowTime(row: OverviewRow, fields: string[]) {
  return Math.max(...fields.map((field) => Number(row[field] || 0)), 0);
}

function compactOverviewRows(rows: OverviewRow[], kind: "subscribers" | "refunds" | "canceled") {
  const groups = new Map<string, OverviewRow[]>();
  rows.forEach((row) => {
    const key = String(row.email || row.userId || "unknown").toLowerCase();
    groups.set(key, [...(groups.get(key) || []), row]);
  });

  const timeFields = kind === "refunds"
    ? ["requestedAt", "paidAt"]
    : kind === "canceled"
      ? ["latestRefundRequestedAt", "canceledAt", "periodEnd"]
      : ["periodEnd", "paidAt"];

  return Array.from(groups.values()).map((group) => {
    const sorted = [...group].sort((a, b) => rowTime(b, timeFields) - rowTime(a, timeFields));
    const latest = { ...sorted[0] };
    const count = group.length;
    const totalRefundCents = group.reduce((sum, row) => sum + Number(row.refundAmountCents || row.paymentAmountCents || 0), 0);
    const totalPaymentCents = group.reduce((sum, row) => sum + Number(row.paymentAmountCents || row.amountCents || 0), 0);
    const uniquePlans = Array.from(new Set(group.map((row) => String(row.subscriptionPlan || row.paymentPlan || row.userPlan || "")).filter(Boolean)));
    const uniqueStatuses = Array.from(new Set(group.map((row) => String(row.subscriptionStatus || row.refundStatus || row.paymentStatus || row.userStatus || "")).filter(Boolean)));

    latest._recordCount = count;
    latest._totalRefundCents = totalRefundCents;
    latest._totalPaymentCents = totalPaymentCents;
    latest._plansSummary = uniquePlans.slice(0, 3).join(" / ");
    latest._statusesSummary = uniqueStatuses.slice(0, 3).join(" / ");
    return latest;
  }).sort((a, b) => rowTime(b, timeFields) - rowTime(a, timeFields));
}

function countLabel(row: OverviewRow, singular: string, plural: string) {
  const count = Number(row._recordCount || 1);
  return `${count} ${count === 1 ? singular : plural}`;
}

export default function AdminRefundReviewClient({ adminEmail }: { adminEmail?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);

  async function loadOverview() {
    setOverviewLoading(true);
    try {
      const response = await fetch("/api/admin/refund-review/overview", { cache: "no-store" });
      const data = await response.json() as OverviewResponse;
      setOverview(data);
    } catch {
      setOverview({ ok: false, code: "REQUEST_FAILED", message: "Could not load admin overview." });
    } finally {
      setOverviewLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/admin/refund-review?email=${encodeURIComponent(email)}`, { cache: "no-store" });
      const data = await response.json() as ReviewResponse;
      setResult(data);
    } catch {
      setResult({ ok: false, code: "REQUEST_FAILED", message: "Could not load refund review." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-[2rem] border border-rsp-border bg-white p-6 shadow-sm">
          <p className="eyebrow">Internal only</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-rsp-text">Refund review lookup</h2>
          <p className="mt-3 text-sm leading-6 text-rsp-muted">
            Admin-only access. Signed in as {adminEmail ? <strong className="text-rsp-text">{adminEmail}</strong> : "an authorized admin"}.
          </p>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-rsp-muted">Customer email</label>
          <input
            className="mt-2 w-full rounded-2xl border border-rsp-border bg-rsp-cream px-4 py-3 text-sm outline-none focus:border-rsp-gold"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="customer@example.com"
            type="email"
            required
          />
          <button disabled={loading} className="mt-6 w-full rounded-full bg-rsp-brown px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60">
            {loading ? "Checking..." : "Review refund"}
          </button>
        </form>

        <div className="rounded-[2rem] border border-rsp-border bg-white p-6 shadow-sm">
          {!result ? (
            <div className="flex h-full min-h-72 items-center justify-center text-center text-sm text-rsp-muted">
              Search a customer to see payment, credit usage, and refund recommendation.
            </div>
          ) : !result.ok ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              <p className="font-semibold">{result.code || "Error"}</p>
              <p className="mt-2">{result.message || "Unable to load this review."}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className={`rounded-2xl border p-5 ${statusTone(result.refundReview?.eligible, result.refundReview?.code)}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Recommendation</p>
                <h3 className="mt-2 font-heading text-3xl font-normal">{result.refundReview?.label}</h3>
                <p className="mt-2 text-sm">{result.refundReview?.reason}</p>
                <p className="mt-4 text-sm font-semibold">Suggested refund: {money(result.refundReview?.suggestedRefundAmount, result.refundReview?.currency)}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Plan / status" value={`${result.user?.plan || "—"} / ${result.user?.status || "—"}`} />
                <Metric label="Credits left" value={String(result.user?.creditsRemaining ?? "—")} />
                <Metric label="Days since payment" value={String(result.refundReview?.daysSincePayment ?? "—")} />
              </div>

              <div className="rounded-2xl border border-rsp-border p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rsp-muted">Credit usage</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Metric label="Paid credits granted" value={String(result.usage?.paidCreditsGranted ?? 0)} />
                  <Metric label="Paid credits used" value={String(result.usage?.paidCreditsUsed ?? 0)} />
                  <Metric label="Paid usage" value={`${result.usage?.paidUsagePercent ?? 0}%`} />
                  <Metric label="Generation jobs" value={`${result.usage?.completedGenerationJobs ?? 0}/${result.usage?.generationJobs ?? 0}`} />
                  <Metric label="Free credits at payment" value={String(result.usage?.freeCreditsRemainingAtPayment ?? 0)} />
                  <Metric label="Lifetime used" value={String(result.usage?.lifetimeGenerationCreditsUsed ?? 0)} />
                </div>
              </div>

              <div className="rounded-2xl border border-rsp-border p-5 text-sm text-rsp-muted">
                <p className="font-semibold text-rsp-text">Payment</p>
                <p className="mt-2">{result.latestPayment?.plan || "—"} · {result.latestPayment?.status || "—"} · {money(result.latestPayment?.amount, result.latestPayment?.currency)}</p>
                <p>Paid at: {formatDate(result.latestPayment?.paidAt)}</p>
                <p className="mt-4 font-semibold text-rsp-text">Subscription</p>
                <p className="mt-2">{result.currentSubscription?.plan || "—"} · {result.currentSubscription?.status || "—"}</p>
                <p>Period: {formatDate(result.currentSubscription?.periodStart)} → {formatDate(result.currentSubscription?.periodEnd)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-rsp-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Operations overview</p>
            <h2 className="mt-2 font-heading text-3xl font-normal text-rsp-text">Billing and refund queue</h2>
            <p className="mt-2 text-sm text-rsp-muted">See subscribers, refund requests, canceled subscriptions, and refunded accounts without opening Creem first.</p>
          </div>
          <button onClick={loadOverview} disabled={overviewLoading} className="rounded-full border border-rsp-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-rsp-text disabled:opacity-60">
            {overviewLoading ? "Refreshing" : "Refresh"}
          </button>
        </div>

        {overviewLoading && !overview ? (
          <div className="mt-6 rounded-2xl border border-rsp-border bg-rsp-cream p-6 text-sm text-rsp-muted">Loading overview…</div>
        ) : overview && !overview.ok ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <p className="font-semibold">{overview.code || "Error"}</p>
            <p className="mt-2">{overview.message || "Unable to load overview."}</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <Metric label="Users" value={String(overview?.stats?.totalUsers ?? 0)} />
              <Metric label="Active subscribers" value={String(overview?.stats?.activeSubscribers ?? 0)} />
              <Metric label="Refund requests" value={String(overview?.stats?.refundRequests ?? 0)} />
              <Metric label="Pending refunds" value={String(overview?.stats?.pendingRefunds ?? 0)} />
              <Metric label="Refunded users" value={String(overview?.stats?.refundedUsers ?? 0)} />
              <Metric label="Canceled subs" value={String(overview?.stats?.canceledSubscriptions ?? 0)} />
            </div>

            <OverviewList title="Active subscribers" rows={overview?.subscribers || []} empty="No active subscribers found." kind="subscribers" />
            <OverviewList title="Refund requests" rows={overview?.refunds || []} empty="No refund requests found." kind="refunds" />
            <OverviewList title="Canceled / refunded watchlist" rows={overview?.canceled || []} empty="No canceled or refunded subscriptions found." kind="canceled" />
          </>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-rsp-border bg-rsp-cream p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rsp-muted">{label}</p>
      <p className="mt-2 font-heading text-2xl font-normal text-rsp-text">{value}</p>
    </div>
  );
}

function OverviewList({ title, rows, empty, kind }: { title: string; rows: OverviewRow[]; empty: string; kind: "subscribers" | "refunds" | "canceled" }) {
  const compactRows = compactOverviewRows(rows, kind);
  const shownLabel = rows.length === compactRows.length
    ? `${compactRows.length} shown`
    : `${compactRows.length} users · ${rows.length} records`;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-rsp-border">
      <div className="flex items-center justify-between border-b border-rsp-border bg-rsp-cream px-5 py-4">
        <h3 className="font-heading text-2xl font-normal text-rsp-text">{title}</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rsp-muted">{shownLabel}</span>
      </div>
      {compactRows.length === 0 ? (
        <div className="p-5 text-sm text-rsp-muted">{empty}</div>
      ) : (
        <div className="divide-y divide-rsp-border">
          {compactRows.map((row, index) => (
            <div key={`${kind}-${text(row.email || row.userId)}-${index}`} className="grid gap-4 p-5 text-sm md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
              <div>
                <p className="font-semibold text-rsp-text">{text(row.email)}</p>
                <p className="mt-1 text-rsp-muted">User: {text(row.userPlan)} / {text(row.userStatus)} · Credits: {text(row.creditsRemaining)}</p>
                {Number(row._recordCount || 1) > 1 ? (
                  <p className="mt-2 inline-flex rounded-full border border-rsp-border bg-rsp-cream px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-rsp-muted">
                    Merged {countLabel(row, "record", "records")}
                  </p>
                ) : null}
              </div>
              {kind === "refunds" ? (
                <>
                  <Block
                    label="Refund"
                    value={`${text(row.refundStatus)} · Latest ${moneyCents(Number(row.refundAmountCents || row.paymentAmountCents || 0), String(row.refundCurrency || row.paymentCurrency || "USD"))}`}
                    sub={`${countLabel(row, "request", "requests")} · Total ${moneyCents(Number(row._totalRefundCents || row.refundAmountCents || row.paymentAmountCents || 0), String(row.refundCurrency || row.paymentCurrency || "USD"))} · Latest ${formatDate(Number(row.requestedAt || 0))}`}
                  />
                  <Block label="Latest payment" value={`${text(row.paymentPlan)} · ${text(row.paymentStatus)}`} sub={`${moneyCents(Number(row.paymentAmountCents || 0), String(row.paymentCurrency || "USD"))} · ${formatDate(Number(row.paidAt || 0))}`} />
                  <Block label="Usage" value={`${text(row.paidCreditsGranted)} granted · ${text(row.generationCreditsUsed)} used`} sub={`${calcUsagePercent(row)} · ${text(row.generationJobs)} jobs`} />
                </>
              ) : kind === "canceled" ? (
                <>
                  <Block label="Subscription" value={`${text(row._plansSummary || row.subscriptionPlan)} · ${text(row._statusesSummary || row.subscriptionStatus)}`} sub={countLabel(row, "subscription", "subscriptions")} />
                  <Block label="Timing" value={`Latest canceled: ${formatDate(Number(row.canceledAt || 0))}`} sub={`Latest period end: ${formatDate(Number(row.periodEnd || 0))}`} />
                  <Block label="Refund request" value={text(row.latestRefundStatus)} sub={`Latest ${formatDate(Number(row.latestRefundRequestedAt || 0))}`} />
                </>
              ) : (
                <>
                  <Block label="Subscription" value={`${text(row._plansSummary || row.subscriptionPlan)} · ${text(row._statusesSummary || row.subscriptionStatus)}`} sub={`${countLabel(row, "subscription", "subscriptions")} · Period end: ${formatDate(Number(row.periodEnd || 0))}`} />
                  <Block label="Latest payment" value={`${text(row.paymentStatus)} · ${moneyCents(Number(row.amountCents || 0), String(row.currency || "USD"))}`} sub={formatDate(Number(row.paidAt || 0))} />
                  <Block label="Usage" value={`${text(row.paidCreditsGranted)} granted · ${text(row.generationCreditsUsed)} used`} sub={`${calcUsagePercent(row)} · ${text(row.generationJobs)} jobs`} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Block({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rsp-muted">{label}</p>
      <p className="mt-1 font-medium text-rsp-text">{value}</p>
      {sub ? <p className="mt-1 text-xs text-rsp-muted">{sub}</p> : null}
    </div>
  );
}
