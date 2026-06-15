"use client";

import { useMemo, useState } from "react";
import { promptCards } from "@/lib/site";

const styleChips = ["Editorial", "Product", "Architecture", "Fashion", "Abstract"];
const ratios = ["1:1", "4:5", "16:9", "3:4"];

export default function GenerateConsole() {
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
    <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
      <div className="rsp-card p-5 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="rsp-chip mb-3">Mock console</p>
            <h1 className="font-heading text-3xl font-bold text-white md:text-5xl">Generate Console</h1>
          </div>
          <div className="rounded-2xl border border-[#F4B860]/30 bg-[#F4B860]/10 px-4 py-3 text-sm text-[#F4B860]">Credits preview: 3 free trials</div>
        </div>
        <label className="mb-2 block text-sm font-semibold text-white" htmlFor="prompt">Prompt</label>
        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[190px] w-full rounded-2xl border border-white/10 bg-[#0C0E13] p-4 font-mono text-sm text-[#E2E5F3] outline-none ring-[#35D0BA]/40 focus:ring-4" />

        <div className="mt-5 grid gap-5 md:grid-cols-2">
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={runMock} className="rsp-button-primary">Generate preview state</button>
          <button onClick={() => setState("failed")} className="rsp-button-secondary">Show failed state</button>
        </div>
        <p className="mt-4 text-sm text-[#A7ABB8]">Backend pending: fal.ai generation, login, credits, and Creem billing are intentionally mocked in this front-end stage.</p>
      </div>

      <div className="rsp-card overflow-hidden p-5 md:p-7">
        <div className={`mb-5 flex aspect-[4/5] items-center justify-center rounded-2xl bg-gradient-to-br ${preview}`}>
          {state === "processing" && <div className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-white">Generating mock preview…</div>}
          {state === "failed" && <div className="max-w-[260px] rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-center text-red-100">Generation failed state: shorten unsafe inputs, retry later, or contact support.</div>}
          {(state === "idle" || state === "ready") && <div className="text-center"><div className="mx-auto mb-4 h-24 w-24 rounded-full bg-[#35D0BA]/30 blur-xl" /><p className="font-heading text-2xl font-bold text-white">{state === "ready" ? "Mock result ready" : "Result preview"}</p><p className="mt-2 text-sm text-[#A7ABB8]">{style} · {ratio}</p></div>}
        </div>
        <div className="grid gap-3 text-sm text-[#A7ABB8]">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><strong className="text-white">Success toast:</strong> Generated images appear here after backend integration.</div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><strong className="text-white">Queue state:</strong> Free, Starter, Creator, and Studio queue labels are display-only.</div>
        </div>
      </div>
    </div>
  );
}
