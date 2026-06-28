"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Generate" },
  { href: "/image-editor", label: "Image Editor" },
  { href: "/prompts", label: "Prompts" },
  { href: "/ai-headshot-generator", label: "AI Headshot" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ai-policy", label: "AI Policy" },
];

const promptCategoryLinks = [
  {
    label: "Professional",
    items: [
      { href: "/prompts/ai-headshot", label: "AI Headshot" },
      { href: "/prompts/linkedin-profile-photo", label: "LinkedIn Profile" },
    ],
  },
  {
    label: "Creator",
    items: [
      { href: "/prompts/cinematic-portrait", label: "Cinematic Portrait" },
      { href: "/prompts/fashion-editorial", label: "Fashion Editorial" },
    ],
  },
  {
    label: "Trend",
    items: [
      { href: "/prompts/90s-yearbook", label: "Yearbook Photo" },
      { href: "/prompts/anime-inspired-portrait", label: "Anime Avatar" },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/prompts/product-photography", label: "Product Photography" },
    ],
  },
];

type AuthMeResponse = {
  authenticated?: boolean;
  user?: { creditsRemaining?: number; isAdmin?: boolean };
};

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let canceled = false;
    const loadAccount = () => {
      fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
        .then((response) => response.json() as Promise<AuthMeResponse>)
        .then((authData) => {
          if (canceled) return;
          if (authData?.authenticated && authData.user) {
            setAuthenticated(true);
            setIsAdmin(Boolean(authData.user.isAdmin));
            if (typeof authData.user.creditsRemaining === "number") setCredits(authData.user.creditsRemaining);
            return;
          }
          setAuthenticated(false);
          setIsAdmin(false);
          setCredits(null);
        })
        .catch(() => undefined);
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

  const creditBadge = authenticated ? `Credits: ${credits ?? "…"}` : null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rsp-border bg-rsp-bg/92 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="AI Editor RSP home">
          <span className="grid h-9 w-9 place-items-center border border-rsp-secondary/50 bg-rsp-secondary/10 font-mono text-rsp-secondary">✦</span>
          <span className="font-heading text-2xl font-normal tracking-[-0.03em] text-rsp-text">AI Editor RSP</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return link.href === "/prompts" ? (
              <div key={link.href} className="group relative -my-4 py-4">
                <Link href={link.href} className={`inline-flex items-center gap-1 rounded-full px-2 py-2 text-sm font-semibold no-underline transition hover:bg-rsp-secondary/10 hover:text-rsp-text ${isActive ? "bg-rsp-secondary/10 text-rsp-secondary" : "text-rsp-muted"}`} aria-haspopup="true">
                  {link.label}
                  <span aria-hidden="true" className="text-[10px] leading-none">▾</span>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-[70] w-[760px] -translate-x-1/2 translate-y-2 rounded-2xl border border-rsp-border bg-rsp-panel p-4 opacity-0 shadow-[0_18px_50px_rgba(58,41,30,0.14)] transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid gap-3 md:grid-cols-4">
                    {promptCategoryLinks.map((category) => (
                      <div key={category.label} className="rounded-xl border border-rsp-border bg-white/55 p-3">
                        <Link href={`/prompts#style-${category.label.toLowerCase()}`} className="block rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rsp-secondary no-underline transition hover:bg-rsp-secondary/10">
                          {category.label}
                        </Link>
                        <div className="mt-2 flex flex-col gap-1">
                          {category.items.map((item) => (
                            <Link key={item.href} href={item.href} className="block rounded-lg px-2 py-2 text-sm font-semibold leading-5 text-rsp-text no-underline transition hover:bg-rsp-secondary/10 hover:text-rsp-secondary whitespace-nowrap">
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/prompts" className="mt-3 block rounded-xl bg-rsp-secondary/10 px-4 py-3 text-center text-sm font-bold text-rsp-secondary no-underline transition hover:bg-rsp-secondary hover:text-white">
                    All prompts
                  </Link>
                </div>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className={`rounded-full px-2 py-2 text-sm font-semibold no-underline transition hover:bg-rsp-secondary/10 hover:text-rsp-text ${isActive ? "bg-rsp-secondary/10 text-rsp-secondary" : "text-rsp-muted"}`}>
                {link.label}
              </Link>
            );
          })}
          {creditBadge ? (
            <span className="border border-rsp-secondary/35 bg-rsp-secondary/10 px-3 py-2 font-mono text-xs font-semibold text-rsp-secondary">
              {creditBadge}
            </span>
          ) : null}
          {authenticated ? (
            <div className="group relative">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 bg-rsp-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-rsp-on-primary no-underline transition hover:opacity-90"
                aria-haspopup="true"
              >
                Account
                <span aria-hidden="true" className="text-[10px] leading-none">▾</span>
              </Link>
              <div className="invisible absolute right-0 top-full z-[70] min-w-56 translate-y-3 border border-rsp-border bg-rsp-panel p-2 opacity-0 shadow-[0_18px_50px_rgba(58,41,30,0.14)] transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
                <Link href="/account" className="block px-4 py-3 text-sm font-semibold text-rsp-text no-underline transition hover:bg-rsp-secondary/10">
                  Account overview
                </Link>
                <Link href="/account/history" className="block px-4 py-3 text-sm font-semibold text-rsp-text no-underline transition hover:bg-rsp-secondary/10">
                  Generation history
                </Link>
                {isAdmin ? (
                  <Link href="/admin/refund-review" className="block px-4 py-3 text-sm font-semibold text-rsp-text no-underline transition hover:bg-rsp-secondary/10">
                    Admin refund review
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <Link href="/login" className="bg-rsp-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-rsp-on-primary no-underline transition hover:opacity-90">
              Log in
            </Link>
          )}
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
          {creditBadge ? (
            <div className="mt-8 border border-rsp-secondary/35 bg-rsp-secondary/10 px-4 py-3 font-mono text-sm font-semibold text-rsp-secondary">
              {creditBadge}
            </div>
          ) : null}
          <nav className="mt-8 flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="border border-rsp-border bg-rsp-panel px-5 py-4 font-heading text-2xl font-normal text-rsp-text no-underline">
                {link.label}
              </Link>
            ))}
            {authenticated ? (
              <div className="border border-rsp-border bg-rsp-panel px-5 py-4">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="block font-heading text-2xl font-normal text-rsp-text no-underline">
                  Account
                </Link>
                <div className="mt-4 border-t border-rsp-border pt-4">
                  <Link href="/account/history" onClick={() => setMobileOpen(false)} className="block font-mono text-xs font-bold uppercase tracking-[0.12em] text-rsp-secondary no-underline">
                    Generation history
                  </Link>
                  {isAdmin ? (
                    <Link href="/admin/refund-review" onClick={() => setMobileOpen(false)} className="mt-3 block font-mono text-xs font-bold uppercase tracking-[0.12em] text-rsp-secondary no-underline">
                      Admin refund review
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="bg-rsp-primary px-5 py-4 text-center font-bold text-rsp-on-primary no-underline">
                Log in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

