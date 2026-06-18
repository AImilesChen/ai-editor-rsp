"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type LoginPanelProps = {
  error?: string;
};

const errorCopy: Record<string, string> = {
  oauth_state: "Google sign-in session expired. Please try again.",
  oauth_not_configured: "Google login is not configured yet.",
  oauth_token: "Google could not complete sign-in. Check OAuth redirect settings and try again.",
  oauth_profile: "Google account email could not be verified.",
  magic_invalid: "Magic link is invalid or expired. Request a new link.",
};

export default function LoginPanel({ error }: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const displayedError = useMemo(() => error ? errorCopy[error] || "Login failed. Please try again." : null, [error]);

  const requestMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);
    try {
      const response = await fetch("/api/auth/magic/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not send magic link.");
      setStatus("sent");
      setMessage(data.message || "Magic link sent. Check your inbox.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not send magic link.");
    }
  };

  return (
    <section className="rsp-card p-6 md:p-8" aria-label="Login form">
      <h2 className="font-heading text-3xl font-normal text-rsp-text">Log In</h2>
      {displayedError ? <div className="mt-4 border border-red-300 bg-red-50 p-3 text-sm text-red-700">{displayedError}</div> : null}
      <a href="/api/auth/google/start" className="mt-6 block w-full border border-rsp-border bg-white px-5 py-4 text-center font-semibold text-rsp-text no-underline transition hover:border-rsp-secondary">
        Continue with Google
      </a>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-rsp-muted"><span className="h-px flex-1 bg-rsp-border" />Or use email<span className="h-px flex-1 bg-rsp-border" /></div>
      <form onSubmit={requestMagicLink}>
        <label htmlFor="email" className="text-sm font-semibold text-rsp-text">Email</label>
        <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="mt-2 w-full border border-rsp-border bg-[#FBF7F0] px-4 py-3 text-rsp-text outline-none ring-rsp-secondary/30 focus:ring-4" />
        <button type="submit" disabled={status === "sending"} className="rsp-button-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60">{status === "sending" ? "Sending…" : "Send magic link"}</button>
      </form>
      {message ? <p className={`mt-4 text-sm leading-6 ${status === "error" ? "text-red-700" : "text-rsp-secondary"}`}>{message}</p> : <p className="mt-4 text-sm leading-6 text-rsp-muted">No password needed. Check your inbox for a secure link.</p>}
      <p className="mt-6 text-xs leading-5 text-rsp-muted">By continuing, you agree to our <Link className="text-rsp-secondary no-underline" href="/terms">Terms</Link> and <Link className="text-rsp-secondary no-underline" href="/privacy">Privacy Policy</Link>.</p>
    </section>
  );
}
