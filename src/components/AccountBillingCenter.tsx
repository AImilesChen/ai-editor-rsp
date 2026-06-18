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
  const refundAlreadyRequested = user?.subscriptionStatus === "refund_requested";

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
        setRefundError(data?.message || "Refund request could not be submitted. Please check your account status.");
        return;
      }
      setRefundMessage(data.duplicate ? "Refund request already submitted. No email is required." : "Refund request submitted. No email is required.");
      setUser((current) => current ? { ...current, subscriptionStatus: "refund_requested" } : current);
    } catch {
      setRefundError("Refund request could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="refund" className="rsp-card mt-8 scroll-mt-28 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="eyebrow">Billing status</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-rsp-text">Plan, credits, and direct refund request</h2>
          <p className="mt-3 max-w-2xl leading-7 text-rsp-muted">
            Use this page to check your current plan and submit a refund request directly from your account. No email step is required. Refund requests are reviewed within the policy window: within 14 days of purchase and no more than 50% of the granted credits used.
          </p>
        </div>
        <button
          type="button"
          disabled={loading || submitting || !hasPaidPlan || refundAlreadyRequested}
          onClick={submitRefundRequest}
          className="rsp-button-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {submitting ? "Submitting…" : refundAlreadyRequested ? "Refund requested" : "Request refund now"}
        </button>
      </div>

      {refundMessage ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">{refundMessage}</div> : null}
      {refundError ? <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{refundError}</div> : null}

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
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Direct refund path</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-rsp-muted">
            <li>Log in with the account email used for payment.</li>
            <li>Click <strong className="text-rsp-text">Request refund now</strong>.</li>
            <li>The request is saved to your billing account automatically.</li>
            <li>Your account status changes to <strong className="text-rsp-text">refund_requested</strong>.</li>
          </ol>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Plan actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pricing" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">View plans</Link>
            <Link href="/refund-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read refund policy</Link>
            <button
              type="button"
              disabled={loading || submitting || !hasPaidPlan || refundAlreadyRequested}
              onClick={submitRefundRequest}
              className="border border-rsp-secondary bg-rsp-secondary/10 px-4 py-3 text-sm font-semibold text-rsp-secondary disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? "Submitting…" : refundAlreadyRequested ? "Refund requested" : "Start refund request"}
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-rsp-muted">
            {hasPaidPlan ? "Your paid plan is visible here. Refund handling may also be subject to Creem/payment-provider terms after the in-app request is submitted." : "No paid plan is active for this account yet. Free credits have no cash value and are not refundable."}
          </p>
        </article>
      </div>
    </section>
  );
}
