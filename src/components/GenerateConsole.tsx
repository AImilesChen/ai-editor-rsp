"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useState } from "react";
import { promptCards } from "@/lib/site";
import { GENERATION_RATIOS, quoteGenerationCredits } from "@/lib/generation-pricing";

const editTasks = [
  { label: "Keep subject", prompt: "Keep the main subject recognizable, preserve the pose and composition, then change the background into a warm cinematic studio scene." },
  { label: "Change background", prompt: "Keep the subject unchanged and replace only the background with a cozy lofi night-study room, warm lamp light, rain on the window, soft grain." },
  { label: "Style transform", prompt: "Keep the subject and composition, transform the image into a polished editorial illustration with soft light, refined colors, and creator-ready atmosphere." },
  { label: "Product clean-up", prompt: "Keep the product shape and details accurate, clean up the background, improve lighting, remove clutter, and make it ready for a premium product listing." },
  { label: "Portrait edit", prompt: "Keep the person's identity and facial features natural, improve lighting and styling, and create a premium portrait edit without changing who they are." },
  { label: "Remove object", prompt: "Remove the distracting object while keeping the rest of the image natural, consistent, and realistic." },
];

const textTasks = [
  { label: "Editorial portrait", prompt: promptCards[0]?.text || "A cinematic editorial portrait with soft rim light, textured backdrop, subtle film grain, expressive eyes, and high-end magazine color grading." },
  { label: "Lofi study", prompt: "A cozy lofi night-study desk scene with warm lamp light, rain outside the window, soft film grain, calm creator atmosphere, and editorial composition." },
  { label: "Product shot", prompt: "A premium product photography scene with clean background, warm studio lighting, realistic shadows, refined composition, and commercial-ready detail." },
  { label: "Social avatar", prompt: "A polished social avatar portrait with expressive eyes, soft background depth, natural skin tones, and high-end creator branding style." },
];

const previewImages: Record<string, string> = {
  "Keep subject": "/images/generated/double-exposure-travel-rishikesh.webp",
  "Change background": "/images/generated/lofi-girl-vibes.webp",
  "Style transform": "/images/generated/cinematic-movie-poster.webp",
  "Product clean-up": "/images/generated/diwali-light-portrait.webp",
  "Portrait edit": "/images/generated/horror-girlfriend-ai-photo.webp",
  "Remove object": "/images/generated/double-exposure-travel-rishikesh.webp",
  "Editorial portrait": "/images/generated/horror-girlfriend-ai-photo.webp",
  "Lofi study": "/images/generated/lofi-girl-vibes.webp",
  "Product shot": "/images/generated/diwali-light-portrait.webp",
  "Social avatar": "/images/generated/cinematic-movie-poster.webp",
};

type GenerateConsoleProps = {
  headingLevel?: "h1" | "h2";
  variant?: "full" | "hero";
};

type FalResult = {
  ok?: boolean;
  data?: {
    status?: string;
    images?: Array<{ url?: string }>;
  };
};

type SessionResponse = {
  authenticated?: boolean;
  creditsRemaining?: number;
  loginRequired?: boolean;
};

type GenerateResponse = FalResult & {
  error?: string;
  creditsRemaining?: number;
  creditsCharged?: number;
  creditsRequired?: number;
  pricing?: { creditsCharged?: number };
  job?: { requestId?: string };
};

function publishCreditBalance(creditsRemaining: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("rsp:credits-updated", { detail: { creditsRemaining } }));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read uploaded image."));
    reader.readAsDataURL(file);
  });
}

export default function GenerateConsole({ headingLevel = "h1", variant = "full" }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const isHero = variant === "hero";
  const [mode, setMode] = useState<"edit" | "text">("edit");
  const [prompt, setPrompt] = useState(editTasks[1].prompt);
  const [task, setTask] = useState(editTasks[1].label);
  const [ratio, setRatio] = useState("auto");
  const [state, setState] = useState<"idle" | "processing" | "ready" | "failed">("idle");
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDraggingCompare, setIsDraggingCompare] = useState(false);

  const activeTasks = mode === "edit" ? editTasks : textTasks;
  const imageForRequest = mode === "edit" ? uploadedImage : null;
  const currentQuote = useMemo(() => quoteGenerationCredits({ ratio, imageDataUrl: imageForRequest }), [ratio, imageForRequest]);
  const previewImage = previewImages[task] || "/images/generated/lofi-girl-vibes.webp";
  const needsUpload = mode === "edit" && !uploadedImage;
  const canGenerate = Boolean(authenticated) && !needsUpload && state !== "processing" && creditsRemaining >= currentQuote.creditsCharged;

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json() as Promise<SessionResponse>)
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (typeof data.creditsRemaining === "number") setCreditsRemaining(data.creditsRemaining);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const switchMode = (nextMode: "edit" | "text") => {
    setMode(nextMode);
    setGeneratedImage(null);
    setError(null);
    setState("idle");
    const firstTask = nextMode === "edit" ? editTasks[1] : textTasks[0];
    setTask(firstTask.label);
    setPrompt(firstTask.prompt);
    if (nextMode === "edit") setRatio("auto");
    if (nextMode === "text" && ratio === "auto") setRatio("4:5");
  };

  const applyTask = (item: { label: string; prompt: string }) => {
    setTask(item.label);
    setPrompt(item.prompt);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a PNG, JPG, or WebP image.");
      setState("failed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image under 5 MB.");
      setState("failed");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedImage(dataUrl);
      setUploadedName(file.name);
      setMode("edit");
      setRatio("auto");
      setGeneratedImage(null);
      setError(null);
      setState("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read uploaded image.");
      setState("failed");
    }
  };

  const pollJobResult = async (requestId: string) => {
    for (let attempt = 0; attempt < 18; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, attempt < 2 ? 1800 : 3000));
      const resultMode = attempt < 2 ? "" : "?mode=result";
      const response = await fetch(`/api/jobs/${encodeURIComponent(requestId)}${resultMode}`);
      const data = await response.json() as FalResult & { error?: string; creditsRemaining?: number };
      if (!response.ok || !data.ok) {
        if (typeof data.creditsRemaining === "number") {
          setCreditsRemaining(data.creditsRemaining);
          publishCreditBalance(data.creditsRemaining);
        }
        if (response.status === 451) throw new Error(data.error || "The generated output was blocked by our safety checks. Your credit was returned.");
        continue;
      }
      const imageUrl = data.data?.images?.[0]?.url;
      if (imageUrl) return imageUrl;
      if (data.data?.status === "FAILED") throw new Error("Image generation failed. Please adjust the prompt and try again.");
    }
    return null;
  };

  const runGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!authenticated) {
      window.location.href = "/login?next=/generate";
      return;
    }
    if (needsUpload) {
      setError("Upload a reference image first, or switch to Create from text.");
      setState("failed");
      return;
    }
    if (trimmedPrompt.length < 20) {
      setError("Prompt must be at least 20 characters.");
      setState("failed");
      return;
    }
    setState("processing");
    setError(null);
    setJobId(null);
    setGeneratedImage(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedPrompt, style: task, ratio, imageDataUrl: imageForRequest || undefined }),
      });
      const data = await response.json() as GenerateResponse;
      if (!response.ok || !data.ok) {
        if (response.status === 401) {
          window.location.href = "/login?next=/generate";
          return;
        }
        throw new Error(data.error || "Generation request failed.");
      }
      if (typeof data.creditsRemaining === "number") {
        setCreditsRemaining(data.creditsRemaining);
        publishCreditBalance(data.creditsRemaining);
      }
      const requestId = data.job?.requestId || null;
      setJobId(requestId);
      if (requestId) {
        const imageUrl = await pollJobResult(requestId);
        if (imageUrl) setGeneratedImage(imageUrl);
      }
      setState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation request failed.");
      setState("failed");
    }
  };

  const removePhoto = () => {
    setUploadedImage(null);
    setUploadedName(null);
    setGeneratedImage(null);
    if (mode === "edit") setState("idle");
  };

  const updateComparePosition = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setComparePosition(Math.min(88, Math.max(12, Math.round(next))));
  };

  const startCompareDrag = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingCompare(true);
    updateComparePosition(event);
  };

  const stopCompareDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDraggingCompare(false);
  };

  return (
    <div className={`overflow-hidden border border-rsp-border bg-[#15110C] text-white shadow-[0_24px_80px_rgba(46,32,18,0.22)] ${isHero ? "grid gap-0 xl:grid-cols-[350px_1fr]" : "grid gap-0 lg:grid-cols-[430px_1fr]"}`}>
      <aside className={`border-r border-white/10 bg-[#1E1711] ${isHero ? "p-3 md:p-4" : "p-4 md:p-5"}`}>
        <div className={`${isHero ? "mb-3" : "mb-4"} flex items-center justify-between gap-3`}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4A574]">AI Image Editor</p>
            <HeadingTag className={`${isHero ? "text-xl" : "text-3xl"} mt-1 font-heading font-normal tracking-[-0.03em] text-white`}>Edit with a reference</HeadingTag>
          </div>
          <div className="border border-[#D4A574]/35 bg-[#D4A574]/10 px-3 py-2 text-right font-mono text-[11px] text-[#F4DFC8]">
            {authenticated ? `${creditsRemaining} credits` : "Log in for 3 credits"}
          </div>
        </div>

        <div className={isHero ? "mb-3" : "mb-4"}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Mode</p>
          <div className={`grid gap-2 ${isHero ? "grid-cols-2" : ""}`}>
            <button type="button" onClick={() => switchMode("edit")} className={`rounded-xl border ${isHero ? "p-2.5" : "p-3"} text-left transition ${mode === "edit" ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>Reference Edit</span>{mode === "edit" && <span className="text-[#86EFAC]">✓</span>}</span>
              <span className={`${isHero ? "mt-1 line-clamp-2 leading-4" : "mt-1 leading-5"} block text-xs text-white/58`}>Best for keeping the uploaded subject, pose, composition, and visual identity.</span>
            </button>
            <button type="button" onClick={() => switchMode("text")} className={`rounded-xl border ${isHero ? "p-2.5" : "p-3"} text-left transition ${mode === "text" ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>Create from Text</span>{mode === "text" && <span className="text-[#86EFAC]">✓</span>}</span>
              <span className={`${isHero ? "mt-1 line-clamp-2 leading-4" : "mt-1 leading-5"} block text-xs text-white/58`}>Best for creating a new image from a prompt without using a reference photo.</span>
            </button>
          </div>
        </div>

        <label className={`${isHero ? "mb-3 flex items-center gap-3 p-3" : "mb-4 block p-4"} cursor-pointer rounded-2xl border border-dashed border-[#D4A574]/45 bg-[#2A2118] transition hover:border-[#D4A574]`} htmlFor="upload-image">
          <span className={`${isHero ? "h-9 w-9 shrink-0" : "mb-3 h-10 w-10"} flex items-center justify-center rounded-full border border-[#D4A574]/35 bg-[#D4A574]/10 text-lg text-[#F4DFC8]`}>↑</span>
          <span className="min-w-0">
          <span className="block text-sm font-semibold text-white">{uploadedName ? "Reference image uploaded" : "Upload reference image"}</span>
          <span className={`${isHero ? "line-clamp-2 leading-4" : "leading-5"} mt-1 block text-xs text-white/58`}>{uploadedName || "PNG, JPG, or WebP under 5 MB. Upload when you want the edit to keep subject and composition."}</span>
          </span>
          {uploadedImage && <img src={uploadedImage} alt="Uploaded source preview" className="mt-3 h-24 w-24 rounded-xl border border-white/10 object-cover" />}
        </label>
        <input id="upload-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="sr-only" />

        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/70" htmlFor="prompt">Enter Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={mode === "edit" ? "Describe what to change. Example: keep the kitten, turn the background into a cozy lofi study room." : "Describe the new image you want to create."}
          className={`${isHero ? "min-h-[98px] p-3 leading-5" : "min-h-[140px] p-4 leading-6"} w-full rounded-2xl border border-white/10 bg-[#100C08] text-sm text-white outline-none ring-[#86EFAC]/25 placeholder:text-white/35 focus:ring-4`}
        />

        <div className={`${isHero ? "mt-2 gap-1.5" : "mt-3 gap-2"} flex flex-wrap`}>
          {activeTasks.map((item) => (
            <button type="button" key={item.label} onClick={() => applyTask(item)} className={`rounded-full border ${isHero ? "px-2.5 py-1.5" : "px-3 py-2"} text-xs font-semibold transition ${task === item.label ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-white/[0.04] text-white/68 hover:border-white/25"}`}>{item.label}</button>
          ))}
        </div>

        <div className={isHero ? "mt-4" : "mt-5"}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Aspect Ratio</p>
          <div className={`${isHero ? "grid-cols-5" : "grid-cols-4"} grid gap-2`}>
            {GENERATION_RATIOS.filter((item) => mode === "edit" || item.ratio !== "auto").map((item) => (
              <button type="button" key={item.ratio} onClick={() => setRatio(item.ratio)} className={`rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${ratio === item.ratio ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25"}`}>
                <span className="block">{item.label}</span>
                <span className="mt-1 block font-mono text-[10px] opacity-75">{mode === "edit" ? item.imageCredits : item.textCredits} cr</span>
              </button>
            ))}
          </div>
          {!isHero && <p className="mt-2 text-xs leading-5 text-white/50">Auto keeps the source feel for reference edits. Square and landscape sizes use more credits because the image API bills by rounded megapixels.</p>}
        </div>

        <div className={`${isHero ? "mt-4" : "mt-5"} flex flex-col gap-2`}>
          {authenticated ? (
            <button type="button" onClick={runGenerate} disabled={!canGenerate} className="rounded-full bg-[#86EFAC] px-5 py-3 text-sm font-bold text-[#102014] transition hover:bg-[#A7F3D0] disabled:cursor-not-allowed disabled:opacity-45">
              {state === "processing" ? "Generating…" : mode === "edit" ? `Transform reference image (${currentQuote.creditsCharged} credits)` : `Generate from prompt (${currentQuote.creditsCharged} credits)`}
            </button>
          ) : (
            <a href="/login?next=/generate" className="rounded-full bg-[#86EFAC] px-5 py-3 text-center text-sm font-bold text-[#102014] no-underline transition hover:bg-[#A7F3D0]">Log in to generate</a>
          )}
          {uploadedImage && <button type="button" onClick={removePhoto} className="rounded-full border border-white/12 px-5 py-3 text-sm font-bold text-white/75 transition hover:border-white/30">Remove photo</button>}
        </div>

        <p className={`mt-3 text-xs leading-5 ${creditsRemaining < currentQuote.creditsCharged && authenticated ? "text-red-300" : "text-white/55"}`}>
          {!authenticated
            ? "Sign in first. New accounts get 3 one-time free credits; credits do not reset after logout or clearing cookies."
            : needsUpload
              ? "Upload a reference image first, or switch to Create from Text."
              : creditsRemaining < currentQuote.creditsCharged
                ? `This request needs ${currentQuote.creditsCharged} credits. You have ${creditsRemaining} credits.`
                : mode === "edit"
                  ? `Reference edit uses ${currentQuote.creditsCharged} credits. The uploaded image is treated as the visual anchor.`
                  : `Text-to-image uses ${currentQuote.creditsCharged} credits for the selected size.`}
        </p>
      </aside>

      <section className={`relative bg-[radial-gradient(circle_at_50%_0%,rgba(134,239,172,0.16),transparent_30%),linear-gradient(180deg,#15110C_0%,#0B0907_100%)] ${isHero ? "min-h-[500px] p-4 md:p-5" : "min-h-[520px] p-4 md:p-6"}`}>
        <div className={`${isHero ? "mb-3" : "mb-5"} flex items-center justify-between gap-3 text-xs text-white/55`}>
          <span>Display History →</span>
          <span>{mode === "edit" ? "Reference Edit" : "Text to Image"} · {currentQuote.sizeLabel}</span>
        </div>
        <div className={`${isHero ? "mb-4 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end" : "mb-5"}`}>
          {isHero ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#86EFAC]">Reference-first AI Image Editor</p>
              <h1 className="mt-2 max-w-3xl font-heading text-3xl font-normal leading-[1.02] tracking-[-0.04em] text-white md:text-4xl">
                Upload a reference. <span className="italic text-[#86EFAC]">Edit it with a prompt.</span>
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/68">Keep the subject clear, describe the change, then compare the reference with the edited result in one workspace.</p>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#86EFAC]">AI Editor RSP</p>
              <h3 className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] text-[#86EFAC] md:text-5xl">AI Image Editor</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/68">Edit reference images with text, or create new visuals from prompts. Keep the source image clear when you need consistency.</p>
            </div>
          )}
          {isHero && (
            <div className="grid min-w-[250px] gap-2 text-xs text-white/72 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2"><span className="font-mono text-[#86EFAC]">01</span> Upload reference image</div>
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2"><span className="font-mono text-[#86EFAC]">02</span> Add a short prompt</div>
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2"><span className="font-mono text-[#86EFAC]">03</span> Generate on this page</div>
            </div>
          )}
        </div>

        <div className={`${isHero ? "mt-4" : "mt-6"} mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-black/35 p-3 shadow-2xl`}>
          <div
            className={`relative ${isHero ? "aspect-[16/8.6]" : "aspect-[16/10]"} cursor-ew-resize touch-none select-none overflow-hidden rounded-[22px] bg-[#241B13]`}
            role="slider"
            aria-label="Drag to compare before and after preview"
            aria-valuemin={12}
            aria-valuemax={88}
            aria-valuenow={comparePosition}
            tabIndex={0}
            onPointerDown={startCompareDrag}
            onPointerMove={(event) => { if (isDraggingCompare) updateComparePosition(event); }}
            onPointerUp={stopCompareDrag}
            onPointerCancel={stopCompareDrag}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") setComparePosition((value) => Math.max(12, value - 4));
              if (event.key === "ArrowRight") setComparePosition((value) => Math.min(88, value + 4));
            }}
          >
            <img src={uploadedImage || previewImage} alt="Before reference preview" className="absolute inset-0 h-full w-full object-cover opacity-70 blur-[1.5px] saturate-75" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent" />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}>
              <img src={generatedImage || previewImage} alt="After edited result preview" className="h-full w-full object-cover brightness-105 contrast-110 saturate-125" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/24 to-transparent" />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">Before / Reference</span>
            <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">After / Edited Result</span>
            {state === "processing" && <div className="absolute inset-0 flex items-center justify-center bg-black/35"><div className="rounded-2xl border border-white/15 bg-black/70 px-5 py-3 text-sm font-semibold text-white">Generating image…</div></div>}
            {state === "failed" && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-red-400/35 bg-red-950/70 p-4 text-center text-sm text-red-100">{error || "Generation failed. Please adjust the prompt and try again."}</div></div>}
            {state === "ready" && !generatedImage && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-white/15 bg-black/70 p-4 text-center text-sm text-white">Job submitted. Request {jobId?.slice(0, 10)}…</div></div>}
            {state === "idle" && !generatedImage && <div className={`${isHero ? "right-4 bottom-4 max-w-[340px] p-3 leading-5" : "right-6 bottom-6 max-w-sm p-4 leading-6"} absolute rounded-2xl border border-white/10 bg-black/55 text-left text-sm text-white/72`}>{mode === "edit" ? "Drag the handle to compare before and after. Upload a reference image, describe the edit, and the result appears here." : "Drag to compare preview styles. Write a prompt and generate a new image."}</div>}
            <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.55)]" style={{ left: `${comparePosition}%` }} />
            <div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl" style={{ left: `${comparePosition}%` }}>↔</div>
          </div>
        </div>

        <div className={`${isHero ? "mt-3 p-3" : "mt-4 p-4"} mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/62 md:flex-row md:items-center md:justify-between`}>
          <p><strong className="text-white">Live generator:</strong> {mode === "edit" ? "Reference Edit keeps the uploaded image as the visual anchor, then applies your prompt." : "Text-to-image creates a new visual from the prompt without a reference image."}</p>
          {generatedImage ? (
            <div className="flex flex-wrap gap-2">
              <a href={generatedImage} download={`ai-editor-rsp-${ratio.replace(":", "x")}.jpg`} className="rounded-full bg-[#86EFAC] px-4 py-2 text-xs font-bold text-[#102014] no-underline">Download image</a>
              <a href={generatedImage} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white no-underline">Open full size</a>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
