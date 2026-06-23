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

export default function AccountOverview() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    const loadAccount = () => {
      fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
        .then((response) => response.json() as Promise<AuthMeResponse>)
        .then((data) => {
          if (!canceled && data.authenticated && data.user) setUser(data.user);
        })
        .finally(() => {
          if (!canceled) setLoading(false);
        });
    };
    loadAccount();
    const onFocus = () => loadAccount();
    const onVisibilityChange = () => {
      if (!document.hidden) loadAccount();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      canceled = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (loading) {
    return <section className="rsp-card p-8 text-rsp-muted">Loading account…</section>;
  }

  if (!user) {
    return (
      <section className="rsp-card p-8 text-center">
        <h2 className="font-heading text-3xl font-normal text-rsp-text">Please log in</h2>
        <p className="mt-3 text-rsp-muted">Sign in to manage credits, generation history, and billing.</p>
        <Link href="/login" className="rsp-button-primary mt-6">Log in</Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <aside className="rsp-card p-5">
        <p className="text-sm font-semibold text-rsp-muted">Signed in as</p>
        <h2 className="mt-2 break-words font-heading text-3xl font-normal text-rsp-text">{user.name || user.email}</h2>
        <p className="mt-2 break-words text-sm text-rsp-muted">{user.email}</p>
        <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 font-mono text-sm font-semibold text-rsp-secondary">Credits: {user.creditsRemaining} remaining</div>
        <div className="mt-3 border border-rsp-border bg-white/55 p-3 text-sm text-rsp-muted">Plan: {user.plan}</div>
        <div className="mt-3 border border-rsp-border bg-white/55 p-3 text-sm text-rsp-muted">Subscription: {user.subscriptionStatus || "none"}</div>
        <div className="mt-3 border border-rsp-border bg-white/55 p-3 text-sm text-rsp-muted">Sign-in method: {user.provider === "google" ? "Google" : "Email magic link"}</div>
        <nav className="mt-6 grid gap-2">
          <Link className="choice-active no-underline" href="/account">Overview</Link>
          <Link className="choice no-underline" href="/account/history">Generation History</Link>
          <Link className="choice no-underline" href="/account/billing">Billing</Link>
          <Link className="choice no-underline" href="/account/billing#refund">Request refund</Link>
        </nav>
        <button type="button" onClick={logout} className="mt-6 w-full border border-rsp-border bg-white/60 px-4 py-3 text-sm font-semibold text-rsp-text">Log out</button>
      </aside>
      <section className="rsp-card p-5 md:p-7">
        <h2 className="font-heading text-3xl font-normal text-rsp-text">Recent generations</h2>
        <div className="mt-5 grid gap-3">
          {[
            ["Today", "No generations yet. Try your first generation.", "Empty"],
            ["Credits", `${user.creditsRemaining} credits available`, "Active"],
            ["Billing", user.subscriptionStatus === "active" ? `${user.plan} subscription active` : "No active paid subscription yet.", user.subscriptionStatus || "none"],
          ].map(([date, text, status]) => <div key={date} className="grid gap-2 border border-rsp-border bg-white/55 p-4 md:grid-cols-[120px_1fr_120px]"><span className="font-mono text-xs uppercase tracking-[0.16em] text-rsp-muted">{date}</span><span className="text-rsp-text">{text}</span><span className="text-sm font-semibold text-rsp-secondary">{status}</span></div>)}
        </div>
      </section>
    </div>
  );
}
