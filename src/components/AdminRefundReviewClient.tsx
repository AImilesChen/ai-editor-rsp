"use client";

import { FormEvent, useState } from "react";

type ReviewResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  email?: string;
  user?: {
    plan: string;
    status: string;
    creditsRemaining: number;
  };
  currentSubscription?: {
    plan: string;
    status: string;
    periodStart?: number | null;
    periodEnd?: number | null;
  } | null;
  latestPayment?: {
    status: string;
    plan: string;
    amountCents: number;
    amount: number;
    currency: string;
    paidAt?: number | null;
  } | null;
  latestRefundRequest?: {
    status: string;
    amountCents?: number | null;
    currency?: string | null;
    requestedAt: number;
    resolvedAt?: number | null;
  } | null;
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
    policy: {
      refundWindowDays: number;
      maxPaidCreditUsagePercent: number;
    };
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

function formatDate(value?: number | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function money(amount?: number, currency = "USD") {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount || 0);
}

function statusTone(eligible?: boolean, code?: string) {
  if (eligible) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (code === "ALREADY_REFUNDED") return "border-stone-200 bg-stone-50 text-stone-700";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default function AdminRefundReviewClient() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponse | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/admin/refund-review?email=${encodeURIComponent(email)}`, {
        headers: { "x-admin-token": token },
        cache: "no-store",
      });
      const data = await response.json() as ReviewResponse;
      setResult(data);
    } catch {
      setResult({ ok: false, code: "REQUEST_FAILED", message: "Could not load refund review." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="rounded-[2rem] border border-rsp-border bg-white p-6 shadow-sm">
        <p className="eyebrow">Internal only</p>
        <h2 className="mt-3 font-heading text-3xl font-normal text-rsp-text">Refund review lookup</h2>
        <p className="mt-3 text-sm leading-6 text-rsp-muted">
          Enter a customer email. If you are signed in with an owner account, no token is needed; otherwise use the internal review token.
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
        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-rsp-muted">Internal token</label>
        <input
          className="mt-2 w-full rounded-2xl border border-rsp-border bg-rsp-cream px-4 py-3 text-sm outline-none focus:border-rsp-gold"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Optional token"
          type="password"
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
              <p className="mt-4 text-sm font-semibold">
                Suggested refund: {money(result.refundReview?.suggestedRefundAmount, result.refundReview?.currency)}
              </p>
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
