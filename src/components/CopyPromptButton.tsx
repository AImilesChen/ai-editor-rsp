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
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = prompt;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch {
      // The visible feedback still confirms the click even if clipboard permission is unavailable.
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
