"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/generate", label: "Generate" },
  { href: "/prompts", label: "Prompts" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ai-policy", label: "AI Policy" },
];

type AuthMeResponse = {
  authenticated?: boolean;
  user?: { creditsRemaining?: number };
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json() as Promise<AuthMeResponse>)
      .then((authData) => {
        if (authData?.authenticated && authData.user) {
          setAuthenticated(true);
          if (typeof authData.user.creditsRemaining === "number") setCredits(authData.user.creditsRemaining);
          return;
        }
        setAuthenticated(false);
        setCredits(null);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const onCreditsUpdated = (event: Event) => {
      const creditsRemaining = (event as CustomEvent<{ creditsRemaining?: number }>).detail?.creditsRemaining;
      if (typeof creditsRemaining === "number") {
        setAuthenticated(true);
        setCredits(creditsRemaining);
      }
    };
    window.addEventListener("rsp:credits-updated", onCreditsUpdated);
    return () => window.removeEventListener("rsp:credits-updated", onCreditsUpdated);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const creditBadge = authenticated ? `Credits: ${credits ?? "…"}` : "Log in to claim 3 credits";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rsp-border bg-rsp-bg/92 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="AI Editor RSP home">
          <span className="grid h-9 w-9 place-items-center border border-rsp-secondary/50 bg-rsp-secondary/10 font-mono text-rsp-secondary">✦</span>
          <span className="font-heading text-2xl font-normal tracking-[-0.03em] text-rsp-text">AI Editor RSP</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-rsp-muted no-underline transition hover:text-rsp-text">
              {link.label}
            </Link>
          ))}
          <span className="border border-rsp-secondary/35 bg-rsp-secondary/10 px-3 py-2 font-mono text-xs font-semibold text-rsp-secondary">
            {creditBadge}
          </span>
          <Link href={authenticated ? "/account" : "/login"} className="bg-rsp-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-rsp-on-primary no-underline transition hover:opacity-90">
            {authenticated ? "Account" : "Log in"}
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-rsp-border bg-white/50 text-rsp-text md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-rsp-bg px-6 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl font-normal text-rsp-text">AI Editor RSP</span>
            <button type="button" aria-label="Close navigation menu" className="min-h-[44px] min-w-[44px] border border-rsp-border bg-white/50 text-2xl text-rsp-text" onClick={() => setMobileOpen(false)}>
              ×
            </button>
          </div>
          <div className="mt-8 border border-rsp-secondary/35 bg-rsp-secondary/10 px-4 py-3 font-mono text-sm font-semibold text-rsp-secondary">
            {creditBadge}
          </div>
          <nav className="mt-8 flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="border border-rsp-border bg-rsp-panel px-5 py-4 font-heading text-2xl font-normal text-rsp-text no-underline">
                {link.label}
              </Link>
            ))}
            <Link href={authenticated ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="bg-rsp-primary px-5 py-4 text-center font-bold text-rsp-on-primary no-underline">
              {authenticated ? "Account" : "Log in"}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
