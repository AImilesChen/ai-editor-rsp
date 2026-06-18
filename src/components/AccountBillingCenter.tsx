"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/site";

type User = {
  email: string;
  name?: string;
  provider: "google" | "email";
  plan: string;
  creditsRemaining: number;
  subscriptionStatus?: string;
};

function buildRefundMailto(user: User | null) {
  const subject = "Refund request — AI Editor RSP";
  const body = [
    "Hi AI Editor RSP support,",
    "",
    "I would like to request a refund review.",
    "",
    `Account email: ${user?.email || ""}`,
    `Plan: ${user?.plan || ""}`,
    `Subscription status: ${user?.subscriptionStatus || ""}`,
    "Approximate purchase date:",
    "Reason for request:",
    "",
    "Please do not include card numbers, passwords, API keys, or sensitive identity documents in this email.",
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function AccountBillingCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const refundHref = useMemo(() => buildRefundMailto(user), [user]);
  const hasPaidPlan = Boolean(user && user.plan !== "free");

  return (
    <section id="refund" className="rsp-card mt-8 scroll-mt-28 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="eyebrow">Billing status</p>
          <h2 className="mt-3 font-heading text-3xl font-normal text-rsp-text">Plan, credits, and refund help</h2>
          <p className="mt-3 max-w-2xl leading-7 text-rsp-muted">
            Use this page to check your current plan and start a refund request. Refund requests are reviewed within the policy window: within 14 days of purchase and no more than 50% of the granted credits used.
          </p>
        </div>
        <a href={refundHref} className="rsp-button-primary shrink-0 text-center">
          Request refund by email
        </a>
      </div>

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
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Refund request path</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-rsp-muted">
            <li>Click <strong className="text-rsp-text">Request refund by email</strong>.</li>
            <li>Send the email from the account email used for payment.</li>
            <li>Include purchase date, plan, and request reason.</li>
            <li>Do not send card numbers, passwords, API keys, or ID documents.</li>
          </ol>
        </article>
        <article className="border border-rsp-border bg-white/55 p-5">
          <h3 className="font-heading text-2xl font-normal text-rsp-text">Plan actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pricing" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">View plans</Link>
            <Link href="/refund-policy" className="border border-rsp-border bg-white/70 px-4 py-3 text-sm font-semibold text-rsp-text no-underline">Read refund policy</Link>
            <a href={refundHref} className="border border-rsp-secondary bg-rsp-secondary/10 px-4 py-3 text-sm font-semibold text-rsp-secondary no-underline">Start refund request</a>
          </div>
          <p className="mt-4 text-sm leading-6 text-rsp-muted">
            {hasPaidPlan ? "Your paid plan is visible here. Cancellation and refund handling may also be subject to Creem/payment-provider terms." : "No paid plan is active for this account yet. Free credits have no cash value and are not refundable."}
          </p>
        </article>
      </div>
    </section>
  );
}
