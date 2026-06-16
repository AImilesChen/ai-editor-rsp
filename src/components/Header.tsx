"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/generate", label: "Generate" },
  { href: "/prompts", label: "Prompts" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ai-policy", label: "AI Policy" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-rsp-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="AI Editor RSP home">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-rsp-primary/40 bg-rsp-primary/15 text-rsp-primary shadow-[0_0_30px_rgba(71,220,198,0.20)]">✦</span>
          <span className="font-heading text-2xl font-bold tracking-tight text-rsp-primary">AI Editor RSP</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-rsp-muted no-underline transition hover:text-rsp-text">
              {link.label}
            </Link>
          ))}
          <Link href="/generate" className="rounded-full bg-rsp-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-rsp-on-primary no-underline transition hover:opacity-90">
            Try Generator
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 text-rsp-text md:hidden"
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
            <span className="font-heading text-2xl font-bold text-rsp-primary">AI Editor RSP</span>
            <button type="button" aria-label="Close navigation menu" className="min-h-[44px] min-w-[44px] rounded-lg border border-white/10 text-2xl text-rsp-text" onClick={() => setMobileOpen(false)}>
              ×
            </button>
          </div>
          <nav className="mt-12 flex flex-col gap-6">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 bg-rsp-panel px-5 py-4 font-heading text-2xl font-semibold text-rsp-text no-underline">
                {link.label}
              </Link>
            ))}
            <Link href="/generate" onClick={() => setMobileOpen(false)} className="rounded-full bg-rsp-primary px-5 py-4 text-center font-bold text-rsp-on-primary no-underline">
              Try Generator
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
