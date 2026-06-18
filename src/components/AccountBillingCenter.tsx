"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  email: string;
  name?: string;
  provider: "google" | "email";
  plan: string;
  creditsRemaining: number;
  subscriptionStatus?: string;
};

const completedRefundStatuses = new Set(["refunded"]);
const pendingRefundStatuses = new Set(["refund_requested"]);

function refundLabel(status?: string) {
  if (completedRefundStatuses.has(status || "")) return "Refund completed";
  if (pendingRefundStatuses.has(status || "")) return "Refund pending";
  return "Refund now";
}

export default function AccountBillingCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refundMessage, setRefundMessage] = useState<string | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasPaidPlan = Boolean(user && user.plan !== "free");
  const refundPending = pendingRefundStatuses.has(user?.subscriptionStatus || "");
  const refundCompleted = completedRefundStatuses.has(user?.subscriptionStatus || "");
  const refundDisabled = loading || submitting || !hasPaidPlan || refundPending || refundCompleted;

  const submitRefundRequest = async () => {
    setSubmitting(true);
    setRefundMessage(null);
    setRefundError(null);
    try {
      const response = await fetch("/api/billing/refund-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer clicked the account refund button." }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setRefundError(data?.message || "Refund could not be started. Please check your account status.");
        return;
      }
      setRefundMessage(data.duplicate ? "Refund is already pending with the payment provider." : "Refund started. Your account is now marked as refund pending until Creem confirms the refund.");
      setUser((current) => current ? { ...current, subscriptionStatus: data.status || "refund_requested" } : current);
    } catch {
      setRefundError("Refund could not be started. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="refund" className="rsp-card mt-8 scroll-mt-28 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="eyebrow">Billing status</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-rsp-text">Plan, credits, and refund status</h2>
          <p className="mt-3 max-w-2xl leading-7 text-rsp-muted">
            Use this page to start a refund from the signed-in account. The account changes to refund pending immediately, and the refund is completed only after Creem/payment-provider confirmation.
          </p>
        </div>
        <button
          type="button"
          disabled={refundDisabled}
          onClick={submitRefundRequest}
          className="rsp-button-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {submitting ? "Starting refund…" : refundLabel(user?.subscriptionStatus)}
        </button>
      </div>

      {refundMessage ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">{refundMessage}</div> : null}
      {refundError ? <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{refundError}</div> : null}
      {refundPending ? <div className="mt-5 border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800">Refund pending: the request has been saved, but the cash refund is not completed yet. Completion requires Creem/payment-provider confirmation.</div> : null}
      {refundCompleted ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">Refund completed: Creem has confirmed the refund.</div> : null}

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Account</strong><br />
          <span className="break-words text-rsp-muted">{loading ? "Loading…" : user?.email || "Not signed in"}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Plan</strong><br />
          <span className="text-rsp-muted">{loading ? "Loading…" : user?.plan || "free"}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Credits</strong><br />
          <span className="text-rsp-muted">{loading ? "Loading…" : `${user?.creditsRemaining ?? 3} remaining`}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Status</strong><br />
          <span className="text-rsp-secondary">{loading ? "Loading…" : user?.subscriptionStatus || "none"}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="border border-rsp-border bg-rsp-surface p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Refund lifecycle</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-rsp-muted">
            <li>Click <strong className="text-rsp-text">Refund now</strong> from the paid account.</li>
            <li>The site records the refund action and marks the account as <strong className="text-rsp-text">refund_requested</strong>.</li>
            <li>Creem/payment-provider confirmation changes the status to <strong className="text-rsp-text">refunded</strong>.</li>
            <li>Credits and subscription access are then adjusted by the refund webhook.</li>
          </ol>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Plan actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pricing" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">View plans</Link>
            <Link href="/refund-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read refund policy</Link>
            <button
              type="button"
              disabled={refundDisabled}
              onClick={submitRefundRequest}
              className="border border-rsp-secondary bg-rsp-secondary/10 px-4 py-3 text-sm font-semibold text-rsp-secondary disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? "Starting refund…" : refundLabel(user?.subscriptionStatus)}
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-rsp-muted">
            {hasPaidPlan ? "The button starts the refund flow from this account. If the status is refund_pending/refund_requested, the refund is not finished yet." : "No paid plan is active for this account yet. Free credits have no cash value and are not refundable."}
          </p>
        </article>
      </div>
    </section>
  );
}
