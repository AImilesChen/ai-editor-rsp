"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

type CopyStatus = "idle" | "copied" | "failed";

export default function CopyButton({ text, label = "Copy Prompt" }: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  }, [text]);

  const baseClasses =
    "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-none px-4 py-2 text-[13px] font-semibold transition-all duration-200";
  const toastMessage = status === "copied" ? "Prompt copied" : status === "failed" ? "Copy failed" : "";

  return (
    <span className="relative inline-flex">
      <button
        onClick={handleCopy}
        className={`${baseClasses} bg-brand-100 text-brand-500 hover:bg-brand-500 hover:text-white`}
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        {label}
      </button>
      <span
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold shadow-lg transition-all duration-200 ${
          status === "idle"
            ? "translate-y-1 opacity-0"
            : status === "copied"
              ? "translate-y-0 bg-success-bg text-success opacity-100"
              : "translate-y-0 bg-error-bg text-error opacity-100"
        }`}
      >
        {toastMessage}
      </span>
    </span>
  );
}
