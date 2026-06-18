"use client";

import { useState } from "react";

export default function CheckoutStartButton({ plan }: { plan: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json() as { ok?: boolean; checkoutUrl?: string; code?: string; error?: string; missing?: string[] };
      if (response.status === 401) {
        const next = encodeURIComponent(`/checkout?plan=${plan}`);
        window.location.href = `/login?next=${next}`;
        return;
      }
      if (!response.ok || !data.ok || !data.checkoutUrl) {
        const missing = data.missing?.length ? ` Missing: ${data.missing.join(", ")}.` : "";
        throw new Error(`${data.error || data.code || "Checkout is not available yet."}${missing}`);
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is not available yet.");
      setState("error");
    }
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={startCheckout} disabled={state === "loading"} className="rsp-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {state === "loading" ? "Opening secure checkout…" : "Continue to secure checkout"}
      </button>
      {error ? <p className="mt-3 text-sm leading-6 text-red-700">{error}</p> : null}
    </div>
  );
}
