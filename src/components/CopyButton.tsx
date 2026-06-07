"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy Prompt" }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [text]);

  const baseClasses =
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all duration-200 min-h-[44px]";

  if (status === "copied") {
    return (
      <button className={`${baseClasses} bg-success-bg text-success`} disabled>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Copied!
      </button>
    );
  }

  if (status === "failed") {
    return (
      <button className={`${baseClasses} bg-error-bg text-error`} disabled>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Copy failed
      </button>
    );
  }

  return (
    <button onClick={handleCopy} className={`${baseClasses} bg-brand-100 text-brand-500 hover:bg-brand-500 hover:text-white`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
      {label}
    </button>
  );
}
