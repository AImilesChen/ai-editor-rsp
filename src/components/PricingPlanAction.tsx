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

function isPaidPlan(plan?: string) {
  const value = normalize(plan);
  return Boolean(value && value !== "free");
}

function shouldTreatAsCurrentPaidPlan(planName: string, data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  if (userPlan !== normalize(planName) || !isPaidPlan(userPlan)) return false;
  if (refundPendingStatuses.has(status)) return false;
  // Avoid misleading paid users into starting a duplicate checkout when the account
  // already carries a paid plan but the subscription status is temporarily missing,
  // delayed, or not one of the active-like Creem states yet.
  return !endedPlanStatuses.has(status);
}

function hasAnyBlockingPaidPlan(data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  return isPaidPlan(userPlan) && !endedPlanStatuses.has(status) && !refundPendingStatuses.has(status);
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

export default function PricingPlanAction({ planName, cta, emphasis = "standard" }: { planName: string; cta: string; emphasis?: "free" | "standard" | "featured" }) {
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
  const hasPaidPlan = Boolean(signedIn && hasAnyBlockingPaidPlan(auth));
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
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-secondary">You are already subscribed to {planName}. Manage or cancel it from Account → Billing.</p>
      </div>
    );
  }

  if (refundPendingForPlan) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="w-full rounded-full border border-rsp-secondary bg-rsp-secondary/12 px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-secondary">
          Refund pending
        </Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-secondary">Your {planName} credits are temporarily unavailable while refund confirmation is pending. Check Account → Billing for status.</p>
      </div>
    );
  }

  if (hasRefundPending && !isFree) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="rsp-button-primary w-full text-center">Refund pending</Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-muted">A refund review is already in progress. Paid credits are temporarily unavailable, so new checkout is paused.</p>
      </div>
    );
  }

  if (hasPaidPlan && !isFree) {
    return (
      <div className="mt-7">
        <Link href="/account/billing" className="rsp-button-primary w-full text-center">Manage billing</Link>
        <p className="mt-3 text-xs font-semibold leading-5 text-rsp-muted">You already have an active plan. Use Account → Billing before changing plans so you do not start a second subscription by mistake.</p>
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

  return <Link href={href} className={actionClass}>{label}</Link>;
}
