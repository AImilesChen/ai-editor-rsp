"use client";

import { useMemo, useState } from "react";
import { promptCards } from "@/lib/site";

const styleChips = ["Editorial", "Product", "Architecture", "Fashion", "Abstract"];
const ratios = ["1:1", "4:5", "16:9", "3:4"];

type GenerateConsoleProps = {
  headingLevel?: "h1" | "h2";
};

export default function GenerateConsole({ headingLevel = "h1" }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const [prompt, setPrompt] = useState(promptCards[0].text);
  const [style, setStyle] = useState(styleChips[0]);
  const [ratio, setRatio] = useState(ratios[1]);
  const [state, setState] = useState<"idle" | "processing" | "ready" | "failed">("idle");

  const preview = useMemo(() => {
    const index = Math.abs(prompt.length + style.length + ratio.length) % 3;
    return [
      "from-[#35D0BA]/30 via-[#11131A] to-[#F4B860]/20",
      "from-[#8EA4FF]/30 via-[#11131A] to-[#35D0BA]/20",
      "from-[#F4B860]/30 via-[#11131A] to-[#8EA4FF]/20",
    ][index];
  }, [prompt, style, ratio]);

  const runMock = () => {
    setState("processing");
    window.setTimeout(() => setState(prompt.trim().length < 20 ? "failed" : "ready"), 650);
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_.8fr]">
      <div className="rsp-card p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="rsp-chip mb-2">Mock console</p>
            <HeadingTag className="font-heading text-3xl font-bold text-white md:text-4xl">Generate Console</HeadingTag>
          </div>
          <div className="rounded-2xl border border-[#F4B860]/30 bg-[#F4B860]/10 px-3 py-2 text-sm text-[#F4B860]">Credits preview: 3 lifetime generations</div>
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
          <button onClick={runMock} className="rsp-button-primary">Generate image preview</button>
          <button onClick={() => setState("failed")} className="rsp-button-secondary">Preview failed state</button>
        </div>
        <p className="mt-3 text-sm text-[#A7ABB8]">Backend pending: fal.ai generation, login, credits, and Creem billing are mocked during this front-end stage.</p>
      </div>

      <div className="rsp-card overflow-hidden p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Output preview</p>
            <p className="mt-1 text-xs text-[#A7ABB8]">Aspect-aware frame for the selected mock result.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#A7ABB8]">{ratio}</span>
        </div>
        <div className="flex justify-center rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className={`flex aspect-[4/5] max-h-[420px] w-full max-w-[340px] items-center justify-center rounded-2xl bg-gradient-to-br ${preview}`}>
            {state === "processing" && <div className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-white">Generating mock preview…</div>}
            {state === "failed" && <div className="mx-4 max-w-[240px] rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-center text-sm text-red-100">Generation failed state: shorten unsafe inputs, retry later, or contact support.</div>}
            {(state === "idle" || state === "ready") && <div className="text-center"><div className="mx-auto mb-3 h-20 w-20 rounded-full bg-[#35D0BA]/30 blur-xl" /><p className="font-heading text-xl font-bold text-white">{state === "ready" ? "Mock result ready" : "Result preview"}</p><p className="mt-2 text-sm text-[#A7ABB8]">{style} · {ratio}</p></div>}
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-[#A7ABB8]"><strong className="text-white">Integration readiness:</strong> generated images, queue labels, and billing states will connect to fal.ai, login, credits, and Creem in the backend stage.</div>
      </div>
    </div>
  );
}
