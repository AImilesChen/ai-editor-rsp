"use client";

import { useState } from "react";

type CopyPromptButtonProps = {
  prompt: string;
  className?: string;
  label?: string;
};

export default function CopyPromptButton({ prompt, className = "", label = "Copy Prompt" }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyPrompt}
      className={`rounded-full border border-rsp-secondary/30 bg-rsp-secondary/10 px-4 py-2 text-sm font-bold text-rsp-secondary transition hover:border-rsp-secondary hover:bg-rsp-secondary hover:text-white ${className}`}
      aria-live="polite"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
