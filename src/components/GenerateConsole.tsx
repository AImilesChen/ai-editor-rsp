"use client";

import { useEffect, useMemo, useState } from "react";
import { promptCards } from "@/lib/site";

const styleChips = ["Editorial", "Product", "Architecture", "Fashion", "Abstract"];
const ratios = ["1:1", "4:5", "16:9", "3:4"];
const stylePreviewImages: Record<string, string> = {
  Editorial: "/images/generated/neon-shadows-portrait.webp",
  Product: "/images/generated/product-glow-shot.webp",
  Architecture: "/images/generated/architectural-dreamscape.webp",
  Fashion: "/images/generated/cinematic-movie-poster.webp",
  Abstract: "/images/generated/abstract-digital-poster.webp",
};

type GenerateConsoleProps = {
  headingLevel?: "h1" | "h2";
};

export default function GenerateConsole({ headingLevel = "h1" }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const [prompt, setPrompt] = useState(promptCards[0].text);
  const [style, setStyle] = useState(styleChips[0]);
  const [ratio, setRatio] = useState(ratios[1]);
  const [state, setState] = useState<"idle" | "processing" | "ready" | "failed">("idle");
  const [creditsRemaining, setCreditsRemaining] = useState(3);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const index = Math.abs(prompt.length + style.length + ratio.length) % 3;
    return [
      "from-[#35D0BA]/30 via-[#11131A] to-[#F4B860]/20",
      "from-[#8EA4FF]/30 via-[#11131A] to-[#35D0BA]/20",
      "from-[#F4B860]/30 via-[#11131A] to-[#8EA4FF]/20",
    ][index];
  }, [prompt, style, ratio]);
  const previewImage = stylePreviewImages[style] || stylePreviewImages.Editorial;

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.creditsRemaining === "number") setCreditsRemaining(data.creditsRemaining);
      })
      .catch(() => undefined);
  }, []);

  const runGenerate = async () => {
    setState("processing");
    setError(null);
    setJobId(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, ratio }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Generation request failed.");
      }
      setCreditsRemaining(data.creditsRemaining);
      setJobId(data.job?.requestId || null);
      setState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation request failed.");
      setState("failed");
    }
  };

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_.8fr]">
      <div className="rsp-card h-full p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="rsp-chip mb-2">fal.ai console</p>
            <HeadingTag className="font-heading text-3xl font-bold text-white md:text-4xl">Generate Console</HeadingTag>
          </div>
          <div className="rounded-2xl border border-[#F4B860]/30 bg-[#F4B860]/10 px-3 py-2 text-sm text-[#F4B860]">Credits: {creditsRemaining} lifetime generations</div>
        </div>
        <label className="mb-2 block text-sm font-semibold text-white" htmlFor="prompt">Prompt</label>
        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[150px] w-full rounded-2xl border border-white/10 bg-[#0C0E13] p-4 font-mono text-sm text-[#E2E5F3] outline-none ring-[#35D0BA]/40 focus:ring-4" />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Style</p>
            <div className="flex flex-wrap gap-2">
              {styleChips.map((chip) => (
                <button key={chip} onClick={() => setStyle(chip)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${style === chip ? "border-[#35D0BA] bg-[#35D0BA] text-[#07100E]" : "border-white/10 bg-white/[0.06] text-[#A7ABB8]"}`}>{chip}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Aspect ratio</p>
            <div className="flex flex-wrap gap-2">
              {ratios.map((item) => (
                <button key={item} onClick={() => setRatio(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${ratio === item ? "border-[#F4B860] bg-[#F4B860] text-[#110B02]" : "border-white/10 bg-white/[0.06] text-[#A7ABB8]"}`}>{item}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={runGenerate} disabled={state === "processing" || creditsRemaining <= 0} className="rsp-button-primary disabled:cursor-not-allowed disabled:opacity-60">{state === "processing" ? "Submitting…" : "Generate image preview"}</button>
          <button onClick={() => setState("failed")} className="rsp-button-secondary">Preview failed state</button>
        </div>
        <p className="mt-3 text-sm text-[#A7ABB8]">Backend connected: fal.ai requests run through a secure Worker API. Creem billing and login entitlement sync are staged for the next backend pass.</p>
      </div>

      <div className="rsp-card flex h-full flex-col overflow-hidden p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Output preview</p>
            <p className="mt-1 text-xs text-[#A7ABB8]">Aspect-aware frame using a real fal.ai sample case.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#A7ABB8]">{ratio}</span>
        </div>
        <div className="flex justify-center rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className={`relative flex aspect-[4/5] max-h-[300px] w-full max-w-[240px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br md:max-h-[320px] md:max-w-[256px] ${preview}`}>
            <img src={previewImage} alt={`${style} fal.ai generated sample preview`} className="absolute inset-0 h-full w-full object-cover opacity-75" loading="lazy" />
            <div className="absolute inset-0 bg-black/20" />
            {state === "processing" && <div className="relative z-10 rounded-full border border-white/10 bg-black/40 px-5 py-3 text-white backdrop-blur">Generating preview…</div>}
            {state === "failed" && <div className="relative z-10 mx-4 max-w-[240px] rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-center text-sm text-red-100 backdrop-blur">{error || "Generation failed state: shorten unsafe inputs, retry later, or contact support."}</div>}
            {(state === "idle" || state === "ready") && <div className="relative z-10 text-center"><div className="mx-auto mb-3 h-20 w-20 rounded-full bg-[#35D0BA]/30 blur-xl" /><p className="font-heading text-xl font-bold text-white">{state === "ready" ? "fal.ai job submitted" : "fal.ai sample preview"}</p><p className="mt-2 text-sm text-[#D7DAE8]">{jobId ? `Request ${jobId.slice(0, 10)}…` : `${style} · ${ratio}`}</p></div>}
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-[#A7ABB8]"><strong className="text-white">Integration readiness:</strong> fal.ai submit/session APIs are live; Creem checkout, webhook persistence, and login entitlement sync need confirmed product IDs and database access.</div>
      </div>
    </div>
  );
}
