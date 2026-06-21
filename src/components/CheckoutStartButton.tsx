"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CheckoutResponse = { ok?: boolean; checkoutUrl?: string; code?: string; error?: string; missing?: string[] };
type AuthResponse = {
  authenticated?: boolean;
  user?: { plan?: string; subscriptionStatus?: string } | null;
};

const endedPlanStatuses = new Set(["canceled", "expired", "refunded", "disputed"]);

function normalize(value?: string) {
  return (value || "").trim().toLowerCase();
}

export default function CheckoutStartButton({ plan }: { plan: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    let canceled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json() as Promise<AuthResponse>)
      .then((data) => {
        if (!canceled) setAuth(data);
      })
      .catch(() => {
        if (!canceled) setAuth(null);
      })
      .finally(() => {
        if (!canceled) setAuthLoaded(true);
      });
    return () => {
      canceled = true;
    };
  }, []);

  const signedIn = Boolean(auth?.authenticated);
  const userPlan = normalize(auth?.user?.plan);
  const subscriptionStatus = normalize(auth?.user?.subscriptionStatus);
  const hasBlockingPaidPlan = signedIn && userPlan && userPlan !== "free" && !endedPlanStatuses.has(subscriptionStatus);
  const hasCurrentPlan = Boolean(hasBlockingPaidPlan && userPlan === normalize(plan));
  const hasAnotherActivePlan = Boolean(hasBlockingPaidPlan && userPlan !== normalize(plan));

  async function startCheckout() {
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json() as CheckoutResponse;
      if (response.status === 401) {
        const next = encodeURIComponent(`/checkout?plan=${plan}`);
        window.location.href = `/login?next=${next}`;
        return;
      }
      if (response.status === 409) {
        throw new Error(data.error || "You already have an active subscription. Manage it from Account → Billing.");
      }
      if (!response.ok || !data.ok || !data.checkoutUrl) {
        const missing = data.missing?.length ? ` Missing: ${data.missing.join(", ")}.` : "";
        throw new Error(`${data.error || data.code || "Checkout is not available yet."}${missing}`);
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is not available yet.");
      setState("error");
    }
  }

  if (!authLoaded) {
    return (
      <div className="mt-6">
        <button type="button" disabled className="w-full cursor-wait rounded-full border border-rsp-border bg-rsp-surface px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-rsp-muted">
          Checking plan…
        </button>
      </div>
    );
  }

  if (hasCurrentPlan) {
    return (
      <div className="mt-6">
        <button type="button" disabled className="w-full cursor-default rounded-full border border-rsp-secondary bg-rsp-secondary/12 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-rsp-secondary">
          Current plan
        </button>
        <p className="mt-3 text-sm leading-6 text-rsp-secondary">You are already subscribed to this plan. Manage or cancel it from Account → Billing.</p>
        <Link href="/account/billing" className="mt-3 inline-block text-sm font-semibold text-rsp-secondary underline">Go to billing</Link>
      </div>
    );
  }

  if (hasAnotherActivePlan) {
    return (
      <div className="mt-6">
        <Link href="/account/billing" className="rsp-button-primary w-full text-center">Manage billing</Link>
        <p className="mt-3 text-sm leading-6 text-rsp-muted">You already have an active subscription. Use Account → Billing before changing plans.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={startCheckout} disabled={state === "loading"} className="rsp-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {state === "loading" ? "Opening secure checkout…" : "Continue to secure checkout"}
      </button>
      {error ? <p className="mt-3 text-sm leading-6 text-red-700">{error}</p> : null}
    </div>
  );
}
