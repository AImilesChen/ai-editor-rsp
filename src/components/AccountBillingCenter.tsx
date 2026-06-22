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

type AuthMeResponse = {
  authenticated?: boolean;
  user?: User;
};

type ActionResponse = {
  ok?: boolean;
  message?: string;
  duplicate?: boolean;
  status?: string;
  url?: string;
  subscriptionCanceled?: boolean;
};

const completedRefundStatuses = new Set(["refunded"]);
const pendingRefundStatuses = new Set(["refund_requested"]);
const canceledStatuses = new Set(["canceled", "scheduled_cancel", "expired"]);

function refundLabel(status?: string) {
  if (completedRefundStatuses.has(status || "")) return "Refund completed";
  if (pendingRefundStatuses.has(status || "")) return "Retry refund prep";
  return "Request refund review";
}

function cancelLabel(status?: string) {
  if (status === "scheduled_cancel") return "Cancellation scheduled";
  if (status === "canceled" || status === "expired") return "Subscription canceled";
  return "Cancel subscription";
}

export default function AccountBillingCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [portalSubmitting, setPortalSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json() as Promise<AuthMeResponse>)
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasPaidPlan = Boolean(user && user.plan !== "free");
  const refundPending = pendingRefundStatuses.has(user?.subscriptionStatus || "");
  const refundCompleted = completedRefundStatuses.has(user?.subscriptionStatus || "");
  const subscriptionCanceled = canceledStatuses.has(user?.subscriptionStatus || "");
  const busy = refundSubmitting || cancelSubmitting || portalSubmitting;
  const refundDisabled = loading || busy || !hasPaidPlan || refundCompleted;
  const cancelDisabled = loading || busy || !hasPaidPlan || subscriptionCanceled || refundCompleted;
  const portalDisabled = loading || busy || !hasPaidPlan;

  const resetNotices = () => {
    setMessage(null);
    setError(null);
  };

  const submitRefundRequest = async () => {
    setRefundSubmitting(true);
    resetNotices();
    try {
      const response = await fetch("/api/billing/refund-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer clicked the account refund button." }),
      });
      const data = await response.json().catch(() => null) as ActionResponse | null;
      if (!response.ok || !data?.ok) {
        setError(data?.message || "Refund could not be started. Please check your account status.");
        return;
      }
      const nextMessage = data.duplicate
        ? "Refund review is already pending. If a paid subscription is still active, the product will try to cancel it before provider/manual refund handling."
        : data.subscriptionCanceled
          ? "Refund review saved and the active subscription was canceled first. Cash refund still requires Creem dashboard/provider confirmation."
          : "Refund review saved. Cash refund still requires Creem dashboard/provider confirmation.";
      setMessage(nextMessage);
      setUser((current) => current ? { ...current, subscriptionStatus: data.status || "refund_requested" } : current);
    } catch {
      setError("Refund could not be started. Please try again.");
    } finally {
      setRefundSubmitting(false);
    }
  };

  const openCustomerPortal = async () => {
    setPortalSubmitting(true);
    resetNotices();
    try {
      const response = await fetch("/api/billing/customer-portal", { method: "POST" });
      const data = await response.json().catch(() => null) as ActionResponse | null;
      if (!response.ok || !data?.ok || !data?.url) {
        setError(data?.message || "Billing portal is not available for this account yet.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Billing portal could not be opened. Please try again.");
    } finally {
      setPortalSubmitting(false);
    }
  };

  const cancelSubscription = async () => {
    if (!confirm("Cancel this subscription now? Future recurring billing will stop.")) return;
    setCancelSubmitting(true);
    resetNotices();
    try {
      const response = await fetch("/api/billing/cancel-subscription", { method: "POST" });
      const data = await response.json().catch(() => null) as ActionResponse | null;
      if (!response.ok || !data?.ok) {
        setError(data?.message || "Subscription could not be canceled. Use Manage billing or contact support.");
        return;
      }
      setMessage(data.duplicate ? "Subscription was already canceled." : "Subscription canceled. The account status has been updated and Creem webhooks will keep it in sync.");
      setUser((current) => current ? { ...current, subscriptionStatus: data.status || "canceled" } : current);
    } catch {
      setError("Subscription could not be canceled. Please try again.");
    } finally {
      setCancelSubmitting(false);
    }
  };

  return (
    <section id="refund" className="rsp-card mt-8 scroll-mt-28 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="eyebrow">Billing status</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-rsp-text">Plan, credits, and subscription actions</h2>
          <p className="mt-3 max-w-2xl leading-7 text-rsp-muted">
            Manage billing from the signed-in account. You can open the Creem billing portal, cancel recurring billing from the product, or request a refund review. Refund completion is shown only after Creem/payment-provider confirmation.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button type="button" disabled={portalDisabled} onClick={openCustomerPortal} className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text disabled:cursor-not-allowed disabled:opacity-55">
            {portalSubmitting ? "Opening…" : "Manage billing"}
          </button>
          <button type="button" disabled={cancelDisabled} onClick={cancelSubscription} className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text disabled:cursor-not-allowed disabled:opacity-55">
            {cancelSubmitting ? "Canceling…" : cancelLabel(user?.subscriptionStatus)}
          </button>
          <button type="button" disabled={refundDisabled} onClick={submitRefundRequest} className="rsp-button-primary disabled:cursor-not-allowed disabled:opacity-55">
            {refundSubmitting ? "Starting refund…" : refundLabel(user?.subscriptionStatus)}
          </button>
        </div>
      </div>

      {message ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">{message}</div> : null}
      {error ? <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      {refundPending ? <div className="mt-5 border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800">Refund review pending: the request has been saved. Cash refund is not completed until Creem confirms it in the dashboard/provider flow. If refund processing fails in Creem, click Retry refund prep to cancel an active subscription again, then retry the paid transaction refund in Creem.</div> : null}
      {refundCompleted ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">Refund completed: Creem has confirmed the refund. Paid credits are no longer available.</div> : null}
      {subscriptionCanceled ? <div className="mt-5 border border-rsp-border bg-white/70 p-4 text-sm font-semibold text-rsp-text">Subscription status: recurring billing is no longer active for this account.</div> : null}

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Account</strong><br />
          <span className="break-words text-rsp-muted">{loading ? "Loading…" : user?.email || "Not signed in"}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Plan</strong><br />
          <span className="text-rsp-muted">{loading ? "Loading…" : user?.plan || "Not signed in"}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Credits</strong><br />
          <span className="text-rsp-muted">{loading ? "Loading…" : user ? `${user.creditsRemaining} remaining` : "Log in to claim"}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Status</strong><br />
          <span className="text-rsp-secondary">{loading ? "Loading…" : user?.subscriptionStatus || "none"}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <article className="border border-rsp-border bg-rsp-surface p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Manage billing</h3>
          <p className="mt-4 leading-7 text-rsp-muted">Open Creem&apos;s secure Customer Portal to update payment methods, inspect billing details, and manage your subscription directly with the merchant-of-record provider.</p>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Cancel subscription</h3>
          <p className="mt-4 leading-7 text-rsp-muted">Canceling stops future recurring billing. The product calls Creem&apos;s subscription cancellation API when your account has a Creem subscription ID.</p>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Refund lifecycle</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-rsp-muted">
            <li>Click <strong className="text-rsp-text">Request refund review</strong> from the paid account.</li>
            <li>The site validates eligibility, cancels an active Creem subscription when possible, and records the action as <strong className="text-rsp-text">refund_requested</strong>.</li>
            <li>Creem confirms the cash refund with <strong className="text-rsp-text">refund.created</strong> or a verified dashboard action.</li>
            <li>The account changes to <strong className="text-rsp-text">refunded</strong> and paid credits are removed.</li>
          </ol>
        </article>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/pricing" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">View plans</Link>
        <Link href="/refund-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read refund policy</Link>
        <Link href="/content-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read AI content policy</Link>
      </div>

      <p className="mt-5 text-sm leading-6 text-rsp-muted">
        Support: <a className="text-rsp-secondary underline" href="mailto:support@aieditorrspediting.org">support@aieditorrspediting.org</a>. We respond to billing and refund requests within 3 business days. Credit card refunds generally appear in 5-10 business days after Creem processes them.
      </p>
    </section>
  );
}
