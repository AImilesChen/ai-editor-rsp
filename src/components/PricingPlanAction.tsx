"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AuthResponse = {
  ok?: boolean;
  authenticated?: boolean;
  user?: {
    plan?: string;
    subscriptionStatus?: string;
  } | null;
};

const endedPlanStatuses = new Set(["canceled", "expired", "refunded", "disputed"]);
const refundPendingStatuses = new Set(["refund_requested"]);

function normalize(value?: string) {
  return (value || "").trim().toLowerCase();
}

const planRanks: Record<string, number> = {
  free: 0,
  starter: 1,
  creator: 2,
  studio: 3,
};

function isPaidPlan(plan?: string) {
  const value = normalize(plan);
  return Boolean(value && value !== "free");
}

function getPlanRank(plan?: string) {
  return planRanks[normalize(plan)] ?? -1;
}

function getPlanLabel(plan?: string | null) {
  const value = normalize(plan || undefined);
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "your current plan";
}

function getBlockingPaidPlan(data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  if (!isPaidPlan(userPlan) || endedPlanStatuses.has(status) || refundPendingStatuses.has(status)) return null;
  return userPlan;
}

function shouldTreatAsCurrentPaidPlan(planName: string, data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  if (userPlan !== normalize(planName) || !isPaidPlan(userPlan)) return false;
  if (refundPendingStatuses.has(status)) return false;
  // Avoid misleading paid users into starting a duplicate checkout when the account
  // already carries a paid plan but the subscription status is temporarily missing,
  // delayed, or not one of the active-like Stripe states yet.
  return !endedPlanStatuses.has(status);
}

function hasRefundPendingForPlan(planName: string, data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  return userPlan === normalize(planName) && isPaidPlan(userPlan) && refundPendingStatuses.has(status);
}

function hasAnyRefundPending(data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  return isPaidPlan(userPlan) && refundPendingStatuses.has(status);
}

export default function PricingPlanAction({ planName, cta, emphasis = "standard", compact = false, isSelected = true, selectionEnabled = false }: { planName: string; cta: string; emphasis?: "free" | "standard" | "featured"; compact?: boolean; isSelected?: boolean; selectionEnabled?: boolean }) {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let canceled = false;
    const loadAuth = () => {
      fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
        .then((response) => response.json() as Promise<AuthResponse>)
        .then((data) => {
          if (!canceled) setAuth(data);
        })
        .catch(() => {
          if (!canceled) setAuth(null);
        })
        .finally(() => {
          if (!canceled) setLoaded(true);
        });
    };
    loadAuth();
    const onFocus = () => loadAuth();
    const onVisibilityChange = () => {
      if (!document.hidden) loadAuth();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      canceled = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const planSlug = normalize(planName);
  const isFree = planSlug === "free";
  const currentPlan = useMemo(() => shouldTreatAsCurrentPaidPlan(planName, auth), [auth, planName]);
  const signedIn = Boolean(auth?.authenticated);
  const activePaidPlan = signedIn ? getBlockingPaidPlan(auth) : null;
  const activePaidPlanLabel = getPlanLabel(activePaidPlan);
  const hasPaidPlan = Boolean(activePaidPlan);
  const currentRank = getPlanRank(activePaidPlan || undefined);
  const targetRank = getPlanRank(planName);
  const isUpgradeTarget = Boolean(hasPaidPlan && targetRank > currentRank);
  const isLowerOrFreeTarget = Boolean(hasPaidPlan && targetRank < currentRank);
  const refundPendingForPlan = Boolean(signedIn && hasRefundPendingForPlan(planName, auth));
  const hasRefundPending = Boolean(signedIn && hasAnyRefundPending(auth));

  if (!loaded) {
    return (
      <div className="mt-7">
        <button type="button" disabled className="w-full cursor-wait rounded-full border border-rsp-border bg-rsp-surface px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-rsp-muted">
          Checking plan…
        </button>
      </div>
    );
  }

  if (currentPlan) {
    return (
      <div className="mt-7">
        <button type="button" disabled className="w-full cursor-default rounded-full border border-rsp-secondary bg-rsp-secondary/12 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-rsp-secondary">
          Current plan
        </button>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-secondary">{compact ? "Manage this plan from Account → Billing." : `You are already subscribed to ${planName}. Manage or cancel it from Account → Billing.`}</p>
      </div>
    );
  }

  if (refundPendingForPlan) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="w-full rounded-full border border-rsp-secondary bg-rsp-secondary/12 px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-secondary">
          Refund pending
        </Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-secondary">{compact ? "Check refund status in Account → Billing." : `Your ${planName} credits are temporarily unavailable while refund confirmation is pending. Check Account → Billing for status.`}</p>
      </div>
    );
  }

  if (hasRefundPending && !isFree) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="rsp-button-primary w-full text-center">Refund pending</Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-muted">{compact ? "New checkout is paused during refund review." : "A refund review is already in progress. Paid credits are temporarily unavailable, so new checkout is paused."}</p>
      </div>
    );
  }

  if (hasPaidPlan && isFree) {
    return (
      <div className="mt-7">
        <button type="button" disabled className="w-full cursor-default rounded-full border border-rsp-border bg-white/70 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-rsp-muted">
          Included
        </button>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-muted">{compact ? "Your paid plan already includes credits." : "Free starter credits are replaced by your active paid plan."}</p>
      </div>
    );
  }

  if (hasPaidPlan && isUpgradeTarget) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="rsp-button-primary w-full text-center">Upgrade to {planName}</Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-secondary">{compact ? "Upgrade safely from Account → Billing." : `You are on ${activePaidPlanLabel}. Open Account → Billing to upgrade to ${planName} safely and avoid duplicate subscriptions.`}</p>
      </div>
    );
  }

  if (hasPaidPlan && isLowerOrFreeTarget) {
    return (
      <div className="mt-7">
        <button type="button" disabled className="w-full cursor-not-allowed rounded-full border border-rsp-border bg-white/70 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-rsp-muted">
          {isFree ? "Included" : "Downgrade in Billing"}
        </button>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-muted">{compact ? "Lower plans are managed from Billing." : `Switching down from ${activePaidPlanLabel} is handled from Account → Billing so credits and billing periods stay clear.`}</p>
      </div>
    );
  }

  if (hasPaidPlan && !isFree) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="rsp-button-primary w-full text-center">Change plan in Billing</Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-muted">{compact ? "Switch safely from Account → Billing." : `You currently have another active plan. Open Account → Billing to change to ${planName} safely without starting a second subscription.`}</p>
      </div>
    );
  }

  const href = isFree ? "/generate" : `/checkout?plan=${planSlug}`;
  const label = !loaded ? cta : cta;
  const actionClass =
    emphasis === "featured"
      ? "mt-7 w-full rounded-full bg-rsp-primary px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-on-primary shadow-[0_14px_28px_rgba(184,107,32,0.28)] transition hover:-translate-y-0.5 hover:opacity-95"
      : emphasis === "free"
        ? "mt-7 w-full rounded-full border border-rsp-primary/45 bg-white px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-primary transition hover:bg-[#fff3de]"
        : "mt-7 w-full rounded-full border border-rsp-primary/35 bg-[#fff7eb] px-6 py-3.5 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-primary transition hover:bg-[#f3e4cd]";

  if (selectionEnabled && !isSelected && !hasPaidPlan && !hasRefundPending) {
    return <Link href={href} className={actionClass}>{cta}</Link>;
  }

  return <Link href={href} className={actionClass}>{label}</Link>;
}
