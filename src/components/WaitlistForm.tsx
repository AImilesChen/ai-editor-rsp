"use client";

import { FormEvent, useMemo, useState } from "react";

type WaitlistState = "default" | "focus" | "loading" | "success" | "invalid" | "joined" | "failed" | "disabled";

const STORAGE_KEY = "rsp-hub-waitlist-email";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitlistState>("default");

  const helper = useMemo(() => {
    switch (state) {
      case "focus":
        return "Use the email where you want new content alerts.";
      case "loading":
        return "Saving your request...";
      case "success":
        return "You are on the list. We will notify you when new drops arrive.";
      case "invalid":
        return "Please enter a valid email address.";
      case "joined":
        return "This email is already on the local interest list for this browser.";
      case "failed":
        return "Network issue simulated. Please try again in a moment.";
      case "disabled":
        return "Waitlist is temporarily disabled while we finalize the email provider.";
      default:
        return "We only send updates about new content and features. Opt out anytime.";
    }
  }, [state]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "disabled") return;

    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setState("invalid");
      return;
    }

    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === normalized) {
      setState("joined");
      return;
    }

    setState("loading");
    window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
        setState("success");
      } catch {
        setState("failed");
      }
    }, 550);
  }

  const isBusy = state === "loading";
  const isDisabled = state === "disabled" || isBusy;

  return (
    <div className="rounded-2xl border border-neutral-300 bg-white/90 p-5 shadow-lg md:p-7">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <label htmlFor="waitlist-email" className="block text-sm font-semibold text-neutral-900">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onFocus={() => setState((current) => (current === "default" ? "focus" : current))}
          onChange={(event) => {
            setEmail(event.target.value);
            if (["invalid", "failed", "joined"].includes(state)) setState("focus");
          }}
          placeholder="your@email.com"
          disabled={isDisabled}
          aria-invalid={state === "invalid"}
          className="min-h-[48px] w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 text-base outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="min-h-[48px] w-full rounded-full bg-brand-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBusy ? "Joining..." : "Join Waitlist"}
        </button>
        <p
          className={`text-sm ${state === "success" ? "text-success" : state === "invalid" || state === "failed" ? "text-error" : "text-neutral-500"}`}
          aria-live="polite"
        >
          {helper}
        </p>
      </form>
    </div>
  );
}
