"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  email: string;
  name?: string;
  provider: "google" | "email";
  plan: string;
  creditsRemaining: number;
  creditsHeld?: number;
  subscriptionStatus?: string;
  selfServiceRefund?: {
    canRequest: boolean;
    code: string;
    message: string;
    refundWindowDays: number;
    daysSinceLatestPayment?: number;
    paidCreditsUsagePercent?: number;
  } | null;
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
  account?: Partial<User>;
  preview?: UpgradePreview;
};

type UpgradePreview = {
  currentPlan: "starter" | "creator" | "studio";
  targetPlan: "starter" | "creator" | "studio";
  creditsToGrant: number;
  nextCreditsBalance: number;
  estimatedProratedChargeCents: number;
  remainingDays: number;
};

const completedRefundStatuses = new Set(["refunded"]);
const pendingRefundStatuses = new Set(["refund_requested"]);
const canceledStatuses = new Set(["canceled", "scheduled_cancel", "expired"]);

function refundLabel(status?: string) {
  if (completedRefundStatuses.has(status || "")) return "Refund completed";
  if (pendingRefundStatuses.has(status || "")) return "Refund under review";
  return "Request refund review";
}

function refundButtonLabel(user: User | null) {
  if (!user) return "Request refund review";
  const refundStatus = user.selfServiceRefund;
  if (refundStatus && !refundStatus.canRequest) {
    if (refundStatus.code === "REFUND_WINDOW_EXPIRED") return "Refund window expired";
    if (refundStatus.code === "PAID_CREDITS_OVER_20_PERCENT_USED") return "Refund usage limit reached";
  }
  return refundLabel(user.subscriptionStatus);
}

function refundUnavailableMessage(user: User | null) {
  const refundStatus = user?.selfServiceRefund;
  if (!refundStatus || refundStatus.canRequest) return null;
  if (["NO_PAID_PLAN", "ALREADY_REFUNDED", "REFUND_ALREADY_PENDING"].includes(refundStatus.code)) return null;
  if (refundStatus.code === "REFUND_WINDOW_EXPIRED") {
    const days = refundStatus.daysSinceLatestPayment;
    return `Self-service refund is no longer available${typeof days === "number" ? ` because this payment is ${days} days old` : ""}. Refund requests are available within ${refundStatus.refundWindowDays} days of payment. You can still cancel future renewals.`;
  }
  return `${refundStatus.message} You can still cancel future renewals or contact support if there is a billing issue.`;
}

function cancelLabel(status?: string) {
  if (status === "refund_requested") return "Subscription canceled";
  if (status === "scheduled_cancel") return "Cancellation scheduled";
  if (status === "canceled" || status === "expired") return "Subscription canceled";
  return "Cancel subscription";
}

function planLabel(user: User | null, loading: boolean) {
  if (loading) return "Loading…";
  if (!user) return "Not signed in";
  if (pendingRefundStatuses.has(user.subscriptionStatus || "")) return `${user.plan} · refund pending`;
  return user.plan;
}

function statusLabel(status?: string) {
  if (!status) return "none";
  if (status === "refund_requested") return "Refund pending";
  if (status === "refunded") return "Refund completed";
  if (status === "canceled") return "Subscription canceled";
  if (status === "scheduled_cancel") return "Cancellation scheduled";
  return status;
}

function nextUpgradePlan(plan?: string) {
  if (plan === "starter") return "creator" as const;
  if (plan === "creator") return "studio" as const;
  return null;
}

function planTitle(plan?: string | null) {
  if (!plan) return "";
  return plan.slice(0, 1).toUpperCase() + plan.slice(1);
}

function usd(cents?: number) {
  if (typeof cents !== "number") return "";
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AccountBillingCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [portalSubmitting, setPortalSubmitting] = useState(false);
  const [upgradeSubmitting, setUpgradeSubmitting] = useState(false);
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.json() as Promise<AuthMeResponse>)
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const previewUserPlan = user?.plan;
  const previewUserStatus = user?.subscriptionStatus;
  const previewUserCredits = user?.creditsRemaining;

  useEffect(() => {
    const targetPlan = nextUpgradePlan(previewUserPlan);
    if (!previewUserPlan || !targetPlan || canceledStatuses.has(previewUserStatus || "") || pendingRefundStatuses.has(previewUserStatus || "") || completedRefundStatuses.has(previewUserStatus || "")) {
      setUpgradePreview(null);
      return;
    }
    fetch(`/api/billing/upgrade-subscription?plan=${targetPlan}&t=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.json() as Promise<ActionResponse>)
      .then((data) => setUpgradePreview(data.ok && data.preview ? data.preview : null))
      .catch(() => setUpgradePreview(null));
  }, [previewUserPlan, previewUserStatus, previewUserCredits]);

  const hasPaidPlan = Boolean(user && user.plan !== "free");
  const upgradeTargetPlan = nextUpgradePlan(user?.plan);
  const refundPending = pendingRefundStatuses.has(user?.subscriptionStatus || "");
  const refundCompleted = completedRefundStatuses.has(user?.subscriptionStatus || "");
  const subscriptionCanceled = canceledStatuses.has(user?.subscriptionStatus || "");
  const busy = refundSubmitting || cancelSubmitting || portalSubmitting || upgradeSubmitting;
  const refundStatus = user?.selfServiceRefund;
  const refundSelfServiceUnavailable = Boolean(
    hasPaidPlan &&
    refundStatus &&
    !refundStatus.canRequest &&
    !["NO_PAID_PLAN", "ALREADY_REFUNDED", "REFUND_ALREADY_PENDING"].includes(refundStatus.code)
  );
  const refundNotice = refundUnavailableMessage(user);
  const refundDisabled = loading || busy || !hasPaidPlan || refundCompleted || refundPending || refundSelfServiceUnavailable;
  const cancelDisabled = loading || busy || !hasPaidPlan || subscriptionCanceled || refundCompleted;
  const portalDisabled = loading || busy || !hasPaidPlan;
  const upgradeDisabled = loading || busy || !hasPaidPlan || !upgradeTargetPlan || subscriptionCanceled || refundCompleted || refundPending || !upgradePreview;

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
        ? "Your refund review is already pending. Paid credits remain temporarily unavailable while we confirm the refund status."
        : data.subscriptionCanceled
          ? "Refund review saved and future renewals were canceled. We will update your account after the refund is confirmed."
          : "Refund review saved. We will update your account after the refund is confirmed.";
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

  const upgradeSubscription = async () => {
    if (!upgradeTargetPlan || !upgradePreview) return;
    if (!confirm(`Upgrade to ${planTitle(upgradeTargetPlan)} now? Creem will charge the saved payment method immediately for the prorated price difference. No separate checkout page will open. We will top up your balance to ${upgradePreview.nextCreditsBalance} credits.`)) return;
    setUpgradeSubmitting(true);
    resetNotices();
    try {
      const response = await fetch("/api/billing/upgrade-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: upgradeTargetPlan }),
      });
      const data = await response.json().catch(() => null) as ActionResponse | null;
      if (!response.ok || !data?.ok) {
        setError(data?.message || "Upgrade could not be completed. Use Manage billing or contact support.");
        return;
      }
      if (data.account) {
        const updatedAccount = data.account;
        setUser((current) => current ? {
          ...current,
          plan: updatedAccount.plan || current.plan,
          creditsRemaining: typeof updatedAccount.creditsRemaining === "number" ? updatedAccount.creditsRemaining : current.creditsRemaining,
          creditsHeld: updatedAccount.creditsHeld,
          subscriptionStatus: updatedAccount.subscriptionStatus || current.subscriptionStatus,
        } : current);
      }
      if (data.preview) setUpgradePreview(data.preview);
      setMessage(`Plan upgraded to ${planTitle(upgradeTargetPlan)}. Added ${data.preview?.creditsToGrant ?? upgradePreview.creditsToGrant} credits and topped up your balance to ${data.preview?.nextCreditsBalance ?? data.account?.creditsRemaining ?? "updated"}.`);
    } catch {
      setError("Upgrade could not be completed. Please try again.");
    } finally {
      setUpgradeSubmitting(false);
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
      setMessage(data.duplicate ? "Subscription was already canceled." : "Subscription canceled. Future recurring billing will stop for this account.");
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
            Manage billing from your account. You can view payment details, cancel future renewals, or request a refund review. Self-service refund review is limited to 7 days after payment and 20% or less paid-credit usage. We update your account after the refund is confirmed.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button type="button" disabled={upgradeDisabled} onClick={upgradeSubscription} className="rsp-button-primary disabled:cursor-not-allowed disabled:opacity-55">
            {upgradeSubmitting ? "Upgrading…" : upgradeTargetPlan ? `Upgrade to ${planTitle(upgradeTargetPlan)}` : "Highest plan"}
          </button>
          <button type="button" disabled={portalDisabled} onClick={openCustomerPortal} className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text disabled:cursor-not-allowed disabled:opacity-55">
            {portalSubmitting ? "Opening…" : "Manage billing"}
          </button>
          <button type="button" disabled={cancelDisabled} onClick={cancelSubscription} className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text disabled:cursor-not-allowed disabled:opacity-55">
            {cancelSubmitting ? "Canceling…" : cancelLabel(user?.subscriptionStatus)}
          </button>
          <button type="button" disabled={refundDisabled} onClick={submitRefundRequest} className="rsp-button-primary disabled:cursor-not-allowed disabled:opacity-55">
            {refundSubmitting ? "Starting refund…" : refundButtonLabel(user)}
          </button>
        </div>
      </div>

      {message ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">{message}</div> : null}
      {error ? <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      {upgradePreview ? <div className="mt-5 border border-rsp-secondary/35 bg-white/80 p-4 text-sm font-semibold text-rsp-text">Upgrade preview: Creem charges the saved payment method immediately, with no separate checkout page. Estimated prorated charge: about {usd(upgradePreview.estimatedProratedChargeCents)} for the remaining {upgradePreview.remainingDays} days. We will add {upgradePreview.creditsToGrant} credits and top up your balance to {upgradePreview.nextCreditsBalance} credits.</div> : null}
      {refundNotice ? <div className="mt-5 border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800">{refundNotice}</div> : null}
      {refundPending ? <div className="mt-5 border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800">Refund review pending: paid credits are temporarily unavailable while we confirm the refund status. We will update your account once the review is complete.</div> : null}
      {refundCompleted ? <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 text-sm font-semibold text-rsp-secondary">Refund completed: paid-plan credits are no longer available.</div> : null}
      {subscriptionCanceled ? <div className="mt-5 border border-rsp-border bg-white/70 p-4 text-sm font-semibold text-rsp-text">Subscription status: recurring billing is no longer active for this account.</div> : null}

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Account</strong><br />
          <span className="break-words text-rsp-muted">{loading ? "Loading…" : user?.email || "Not signed in"}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Plan</strong><br />
          <span className="text-rsp-muted">{planLabel(user, loading)}</span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Credits</strong><br />
          <span className="text-rsp-muted">
            {loading
              ? "Loading…"
              : user
                ? refundPending && user.creditsHeld
                  ? `0 available · ${user.creditsHeld} held during refund review`
                  : `${user.creditsRemaining} remaining`
                : "Log in to claim"}
          </span>
        </div>
        <div className="border border-rsp-border bg-white/55 p-4">
          <strong>Status</strong><br />
          <span className="text-rsp-secondary">{loading ? "Loading…" : statusLabel(user?.subscriptionStatus)}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <article className="border border-rsp-border bg-rsp-surface p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Prorated upgrade</h3>
          <p className="mt-4 leading-7 text-rsp-muted">Upgrade now and Creem charges the saved payment method for the prorated price difference. Your credits are topped up to the target plan balance for this billing period, so Studio shows 700 credits after upgrade unless your current balance is already higher.</p>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Manage billing</h3>
          <p className="mt-4 leading-7 text-rsp-muted">Open the secure billing portal to view invoices, update payment details, and manage your subscription.</p>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Refund review</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-rsp-muted">
            <li>Click <strong className="text-rsp-text">Request refund review</strong> from the paid account.</li>
            <li>We check the 7-day refund window and the 20% paid-credit usage limit.</li>
            <li>Future renewals are canceled when possible.</li>
            <li>Once the refund is confirmed, paid-plan credits are removed from the account.</li>
          </ol>
        </article>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/pricing" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">View plans</Link>
        <Link href="/refund-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read refund policy</Link>
        <Link href="/content-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read AI content policy</Link>
      </div>

      <p className="mt-5 text-sm leading-6 text-rsp-muted">
        Support: <a className="text-rsp-secondary underline" href="mailto:support@aieditorrspediting.org">support@aieditorrspediting.org</a>. We respond to billing and refund requests within 3 business days. Credit card refunds generally appear in 5-10 business days after processing.
      </p>
    </section>
  );
}
