"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/prompts", label: "Prompts" },
    { href: "/templates", label: "Templates" },
    { href: "/effects", label: "Effects" },
    { href: "/about-rsp-editing", label: "About" },
  ];

  return (
    <header className="bg-brand-900 sticky top-0 z-[800]">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading text-[22px] font-bold text-white no-underline">
            RSP<span className="text-brand-400">Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-300 text-[15px] font-medium no-underline transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/prompts"
              className="bg-brand-500 text-white px-[18px] py-2 rounded-full text-sm font-semibold no-underline transition-colors hover:bg-brand-400"
            >
              Browse Prompts
            </Link>
          </nav>

          <button
            className="md:hidden bg-transparent border-none text-white cursor-pointer p-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-brand-900/95 z-[900] flex flex-col items-center justify-center gap-8 md:hidden">
          <button
            className="absolute top-5 right-6 bg-transparent border-none text-white cursor-pointer"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white font-heading text-2xl font-semibold no-underline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/faq"
            onClick={() => setMobileOpen(false)}
            className="text-white font-heading text-2xl font-semibold no-underline"
          >
            FAQ
          </Link>
        </div>
      )}
    </header>
  );
}
