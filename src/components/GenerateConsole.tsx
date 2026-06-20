"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useState } from "react";
import { promptCards } from "@/lib/site";
import { GENERATION_RATIOS, quoteGenerationCredits } from "@/lib/generation-pricing";

const editTasks = [
  { label: "Remove background", prompt: "Remove the background from the uploaded image, keep the subject edges clean and natural, and place the subject on a transparent or soft neutral backdrop." },
  { label: "Change background", prompt: "Keep the subject unchanged and replace only the background with a cozy lofi night-study room, warm lamp light, rain on the window, and soft film grain." },
  { label: "Replace object", prompt: "Replace the selected object with a premium desk lamp, matching the original perspective, lighting, shadows, and realistic texture." },
  { label: "Recolor item", prompt: "Recolor the selected item to deep emerald green while preserving fabric texture, highlights, shadows, and the rest of the image unchanged." },
  { label: "Enhance lighting", prompt: "Enhance the lighting with warm studio highlights, balanced shadows, natural skin or product tones, and a polished creator-ready finish." },
];

const textTasks = [
  { label: "Editorial portrait", prompt: promptCards[0]?.text || "A cinematic editorial portrait with soft rim light, textured backdrop, subtle film grain, expressive eyes, and high-end magazine color grading." },
  { label: "Lofi study", prompt: "A cozy lofi night-study desk scene with warm lamp light, rain outside the window, soft film grain, calm creator atmosphere, and editorial composition." },
  { label: "Product shot", prompt: "A premium product photography scene with clean background, warm studio lighting, realistic shadows, refined composition, and commercial-ready detail." },
  { label: "Social avatar", prompt: "A polished social avatar portrait with expressive eyes, soft background depth, natural skin tones, and high-end creator branding style." },
];

const previewImages: Record<string, string> = {
  "Remove background": "/images/generated/double-exposure-travel-rishikesh.webp",
  "Change background": "/images/generated/lofi-girl-vibes.webp",
  "Replace object": "/images/generated/cinematic-movie-poster.webp",
  "Recolor item": "/images/generated/diwali-light-portrait.webp",
  "Enhance lighting": "/images/generated/horror-girlfriend-ai-photo.webp",
  "Editorial portrait": "/images/generated/horror-girlfriend-ai-photo.webp",
  "Lofi study": "/images/generated/lofi-girl-vibes.webp",
  "Product shot": "/images/generated/diwali-light-portrait.webp",
  "Social avatar": "/images/generated/cinematic-movie-poster.webp",
};

type GenerateConsoleProps = {
  headingLevel?: "h1" | "h2";
  variant?: "full" | "hero";
};

const workflowSteps = ["Upload image", "Choose edit area", "Describe edit", "Generate / Preview / Download"];

type EditRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type EditScope = "whole" | "selected";

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

function readImageAspect(src: string) {
  return new Promise<number>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const width = image.naturalWidth || 1;
      const height = image.naturalHeight || 1;
      resolve(width / height);
    };
    image.onerror = () => resolve(4 / 3);
    image.src = src;
  });
}

export default function GenerateConsole({ headingLevel = "h1", variant = "full" }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const isHero = variant === "hero";
  const [mode, setMode] = useState<"edit" | "text">("edit");
  const [prompt, setPrompt] = useState("");
  const [task, setTask] = useState(editTasks[1].label);
  const [ratio, setRatio] = useState("auto");
  const [state, setState] = useState<"idle" | "processing" | "ready" | "failed">("idle");
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploadedAspect, setUploadedAspect] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDraggingCompare, setIsDraggingCompare] = useState(false);
  const [editScope, setEditScope] = useState<EditScope>("whole");
  const [editRegion, setEditRegion] = useState<EditRegion | null>(null);
  const [regionStart, setRegionStart] = useState<{ x: number; y: number } | null>(null);
  const [isSelectingRegion, setIsSelectingRegion] = useState(false);

  const activeTasks = mode === "edit" ? editTasks : textTasks;
  const imageForRequest = mode === "edit" ? uploadedImage : null;
  const currentQuote = useMemo(() => quoteGenerationCredits({ ratio, imageDataUrl: imageForRequest }), [ratio, imageForRequest]);
  const previewImage = previewImages[task] || "/images/generated/lofi-girl-vibes.webp";
  const editPreviewAspect = uploadedAspect ? Math.min(1.8, Math.max(0.56, uploadedAspect)) : (16 / 9);
  const promptPlaceholder = mode === "edit"
    ? "Example: remove the background, keep the product sharp, and add a soft beige studio backdrop."
    : "Example: create a cinematic product photo of a matte black coffee mug on a marble table, warm window light, realistic shadows.";
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
    setPrompt("");
    if (nextMode === "edit") setRatio("auto");
    if (nextMode === "text" && ratio === "auto") setRatio("4:5");
  };

  const applyTask = (item: { label: string; prompt: string }) => {
    setTask(item.label);
    setPrompt("");
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
      const aspect = await readImageAspect(dataUrl);
      setUploadedImage(dataUrl);
      setUploadedAspect(aspect);
      setUploadedName(file.name);
      if (mode === "edit") {
        setRatio("auto");
        setEditScope("selected");
      }
      setGeneratedImage(null);
      setEditRegion(mode === "edit" ? { x: 24, y: 24, width: 38, height: 34 } : null);
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
        body: JSON.stringify({
          prompt: trimmedPrompt,
          style: task,
          ratio,
          imageDataUrl: imageForRequest || undefined,
          editRegion: mode === "edit" && editScope === "selected" && editRegion ? editRegion : undefined,
        }),
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

  const pointFromRegionEvent = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
    };
  };

  const beginRegionSelect = (event: PointerEvent<HTMLDivElement>) => {
    if (!uploadedImage || editScope !== "selected") return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const start = pointFromRegionEvent(event);
    setRegionStart(start);
    setIsSelectingRegion(true);
    setEditRegion({ x: start.x, y: start.y, width: 1, height: 1 });
  };

  const updateRegionSelect = (event: PointerEvent<HTMLDivElement>) => {
    if (!isSelectingRegion || !regionStart) return;
    event.preventDefault();
    event.stopPropagation();
    const point = pointFromRegionEvent(event);
    setEditRegion({
      x: Math.min(regionStart.x, point.x),
      y: Math.min(regionStart.y, point.y),
      width: Math.max(1, Math.abs(point.x - regionStart.x)),
      height: Math.max(1, Math.abs(point.y - regionStart.y)),
    });
  };

  const endRegionSelect = (event: PointerEvent<HTMLDivElement>) => {
    if (!isSelectingRegion) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setIsSelectingRegion(false);
    setRegionStart(null);
  };

  const editGeneratedResult = () => {
    if (!generatedImage) return;
    setMode("edit");
    setUploadedImage(generatedImage);
    readImageAspect(generatedImage).then(setUploadedAspect);
    setUploadedName("Generated result");
    setGeneratedImage(null);
    setEditScope("whole");
    setEditRegion(null);
    setRatio("auto");
    setState("idle");
    setError(null);
  };

  const clearResult = () => {
    setGeneratedImage(null);
    setJobId(null);
    setState("idle");
    setError(null);
  };

  const removePhoto = () => {
    setUploadedImage(null);
    setUploadedName(null);
    setUploadedAspect(null);
    setGeneratedImage(null);
    setEditScope("whole");
    setEditRegion(null);
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
    <div className={`overflow-hidden border border-rsp-border bg-[#15110C] text-white shadow-[0_24px_80px_rgba(46,32,18,0.22)] ${isHero ? `grid items-start gap-0 xl:grid-cols-[320px_1fr] ${uploadedImage ? "max-h-[620px]" : ""}` : "grid items-start gap-0 lg:grid-cols-[430px_1fr]"}`}>
      <aside className={`border-r border-white/10 bg-[#1E1711] ${isHero ? `p-3 ${uploadedImage ? "max-h-[620px] overflow-y-auto" : ""}` : "p-4 md:p-5"}`}>
        <div className={`${isHero ? "mb-3" : "mb-4"} flex items-center justify-between gap-3`}>
          <div>
            <p className={`${isHero ? "sr-only" : "font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4A574]"}`}>AI Image Editor</p>
            <HeadingTag className={`${isHero ? "text-2xl" : "text-3xl"} mt-1 font-heading font-normal tracking-[-0.03em] text-white`}>{mode === "edit" ? "Edit uploaded image" : "Create from prompt"}</HeadingTag>
          </div>
          <div className="border border-[#D4A574]/35 bg-[#D4A574]/10 px-3 py-2 text-right font-mono text-[11px] text-[#F4DFC8]">
            {authenticated ? `${creditsRemaining} credits` : isHero ? "3 free" : "Log in for 3 credits"}
          </div>
        </div>

        <div className={`${isHero ? "mb-3" : "mb-4"} grid grid-cols-2 gap-2 text-[11px] font-bold text-white/68 md:grid-cols-4`}>
          {["Upload image", "Choose area", "Describe edit", "Preview / Download"].map((step, index) => (
            <div key={step} className="rounded-xl border border-white/10 bg-black/18 px-2 py-2"><span className="text-[#86EFAC]">Step {index + 1}</span><span className="mt-0.5 block">{step}</span></div>
          ))}
        </div>

        <div className={isHero ? "mb-3" : "mb-4"}>
          <p className={`${isHero ? "sr-only" : "mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70"}`}>Mode</p>
          <div className={`grid gap-2 ${isHero ? "grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1" : ""}`}>
            <button type="button" onClick={() => switchMode("edit")} className={`rounded-xl border ${isHero ? "p-3 text-center" : "p-3 text-left"} transition ${mode === "edit" ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>Edit uploaded image</span>{mode === "edit" && <span className="text-[#86EFAC]">✓</span>}</span>
              {!isHero && <span className="mt-1 block text-xs leading-5 text-white/58">Upload a reference, keep the subject and composition, then change only what you describe.</span>}
            </button>
            <button type="button" onClick={() => switchMode("text")} className={`rounded-xl border ${isHero ? "p-3 text-center" : "p-3 text-left"} transition ${mode === "text" ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>Create from prompt</span>{mode === "text" && <span className="text-[#86EFAC]">✓</span>}</span>
              {!isHero && <span className="mt-1 block text-xs leading-5 text-white/58">Generate a new image from text only. No uploaded reference or before/after comparison.</span>}
            </button>
          </div>
        </div>

        {mode === "edit" && (
          <>
            <label className={`${isHero ? "mb-3 flex items-center gap-3 p-3" : "mb-4 block p-4"} cursor-pointer rounded-2xl border border-dashed border-[#D4A574]/45 bg-[#2A2118] transition hover:border-[#D4A574]`} htmlFor="upload-image">
              <span className={`${isHero ? "h-9 w-9 shrink-0" : "mb-3 h-10 w-10"} flex items-center justify-center rounded-full border border-[#D4A574]/35 bg-[#D4A574]/10 text-lg text-[#F4DFC8]`}>↑</span>
              <span className="min-w-0">
                <span className={`${isHero ? "text-base" : "text-sm"} block font-semibold text-white`}>{uploadedName ? "Image uploaded" : "Upload image to start"}</span>
                <span className={`${isHero ? "leading-5" : "leading-5"} mt-1 block text-sm text-white/58`}>{uploadedName || (isHero ? "PNG/JPG/WebP · 5 MB" : "PNG, JPG, or WebP under 5 MB. Upload first, then choose whole image or draw a selected area.")}</span>
              </span>
              {uploadedImage && <span className="mt-3 flex h-24 w-24 items-center justify-center rounded-xl border border-white/10 bg-[#F3E8DA]/10 p-1"><img src={uploadedImage} alt="Uploaded source preview" className="max-h-full max-w-full object-contain" /></span>}
            </label>
            <input id="upload-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="sr-only" />
          </>
        )}

        {mode === "edit" && (uploadedImage || isHero) && (
          <div className={`${isHero ? "mb-3" : "mb-4"} rounded-2xl border border-white/10 bg-white/[0.035] p-3`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Edit area</p>
              <button type="button" onClick={() => { setEditScope("whole"); setEditRegion(null); }} className="text-xs font-semibold text-white/55 hover:text-white">Clear</button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setEditScope("whole")} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${editScope === "whole" ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-black/20 text-white/70 hover:border-white/25"}`}>Whole image</button>
              <button type="button" onClick={() => { setEditScope("selected"); if (uploadedImage && !editRegion) setEditRegion({ x: 24, y: 24, width: 38, height: 34 }); }} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${editScope === "selected" ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-black/20 text-white/70 hover:border-white/25"}`}>Selected area</button>
            </div>
            {!uploadedImage && <p className="text-xs leading-5 text-white/50">You can choose Selected area now. Upload an image next, then draw the redraw box.</p>}
            {uploadedImage && editScope === "selected" ? (
              <>
                <div
                  className="relative max-h-[220px] min-h-[150px] cursor-crosshair overflow-hidden rounded-xl border border-[#86EFAC]/45 bg-[#F3E8DA]/10"
                  style={{ aspectRatio: editPreviewAspect }}
                  onPointerDown={beginRegionSelect}
                  onPointerMove={updateRegionSelect}
                  onPointerUp={endRegionSelect}
                  onPointerCancel={endRegionSelect}
                >
                  <img src={uploadedImage} alt="Select edit area on uploaded image" className="h-full w-full object-contain" draggable={false} />
                  <div className="absolute inset-0 bg-black/28" />
                  {editRegion && (
                    <div className="absolute rounded-lg border-2 border-[#86EFAC] bg-[#86EFAC]/14 shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]" style={{ left: `${editRegion.x}%`, top: `${editRegion.y}%`, width: `${editRegion.width}%`, height: `${editRegion.height}%` }} />
                  )}
                </div>
                <p className="mt-2 text-xs leading-5 text-white/50">Drag on the image to select the area to redraw. Drag again to resize the rectangle.</p>
              </>
            ) : null}
          </div>
        )}

        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/70" htmlFor="prompt">Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={promptPlaceholder}
          className={`${isHero ? "min-h-[118px] p-3 text-sm leading-6" : "min-h-[176px] p-5 text-base leading-7"} w-full resize-none rounded-2xl border border-white/10 bg-[#100C08] text-white outline-none ring-[#86EFAC]/25 placeholder:text-white/35 focus:ring-4`}
        />

        <div className={`${isHero ? "mt-2 gap-1.5" : "mt-3 gap-2"} flex flex-wrap`}>
          {(isHero ? activeTasks.slice(0, 2) : activeTasks).map((item) => (
            <button type="button" key={item.label} onClick={() => applyTask(item)} className={`rounded-full border ${isHero ? "px-3 py-2" : "px-3 py-2"} text-sm font-semibold transition ${task === item.label ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-white/[0.04] text-white/68 hover:border-white/25"}`}>{item.label}</button>
          ))}
        </div>

        <div className={isHero ? "mt-4" : "mt-5"}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Ratio</p>
          <div className={`${isHero ? "grid-cols-4 gap-1.5" : "grid-cols-4 gap-2"} grid`}>
            {GENERATION_RATIOS.filter((item) => mode === "edit" || item.ratio !== "auto").map((item) => (
              <button type="button" key={item.ratio} onClick={() => setRatio(item.ratio)} className={`rounded-xl border px-2 ${isHero ? "py-1.5 text-xs" : "py-2 text-xs"} text-center font-semibold transition ${ratio === item.ratio ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25"}`}>
                <span className="block">{item.label}</span>
                {!isHero && <span className="mt-1 block font-mono text-[10px] opacity-75">{mode === "edit" ? item.imageCredits : item.textCredits} cr</span>}
              </button>
            ))}
          </div>
          {!isHero && <p className="mt-2 text-xs leading-5 text-white/50">Auto keeps the source feel for reference edits. Square and landscape sizes use more credits because the image API bills by rounded megapixels.</p>}
        </div>

        <div className={`${isHero ? "mt-4" : "mt-5"} flex flex-col gap-2`}>
          {authenticated ? (
            <button type="button" onClick={runGenerate} disabled={!canGenerate} className="rounded-full bg-[#86EFAC] px-5 py-3 text-base font-bold text-[#102014] transition hover:bg-[#A7F3D0] disabled:cursor-not-allowed disabled:opacity-45">
              {state === "processing" ? "Generating…" : needsUpload ? "Upload image to start" : mode === "edit" && editScope === "selected" ? `Redraw selected area (${currentQuote.creditsCharged} cr)` : mode === "edit" ? `Generate edit (${currentQuote.creditsCharged} cr)` : `Generate image (${currentQuote.creditsCharged} cr)`}
            </button>
          ) : (
            <a href="/login?next=/generate" className="rounded-full bg-[#86EFAC] px-5 py-3 text-center text-sm font-bold text-[#102014] no-underline transition hover:bg-[#A7F3D0]">Start editing free</a>
          )}
          {uploadedImage && <button type="button" onClick={removePhoto} className="rounded-full border border-white/12 px-5 py-3 text-sm font-bold text-white/75 transition hover:border-white/30">Remove photo</button>}
        </div>

        <p className={`${isHero ? "sr-only" : "mt-3 text-xs leading-5"} ${creditsRemaining < currentQuote.creditsCharged && authenticated ? "text-red-300" : "text-white/55"}`}>
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

      <section className={`relative bg-[radial-gradient(circle_at_50%_0%,rgba(134,239,172,0.16),transparent_30%),linear-gradient(180deg,#15110C_0%,#0B0907_100%)] ${isHero ? (uploadedImage ? "p-3 md:p-5" : "min-h-[500px] p-3 md:p-5") : "min-h-[520px] p-4 md:p-6"}`}>
        <div className={`${isHero ? "hidden" : "mb-5"} flex items-center justify-between gap-3 text-xs text-white/55`}>
          <span className="ml-auto">{mode === "edit" ? "Edit workflow" : "Prompt workflow"} · {currentQuote.sizeLabel}</span>
        </div>
        <div className={`${isHero ? "mb-3" : "mb-5"}`}>
          {isHero ? (
            <div>
              <p className="sr-only">Reference-first AI Editor</p>
              <h1 className="mt-1 max-w-4xl font-heading text-4xl font-normal leading-[0.98] tracking-[-0.05em] text-white md:text-6xl">
                Edit images with a simple prompt
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-6 text-white/70">Upload a photo, select the area you want to change, and let AI generate a clean edited result you can preview and download.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#86EFAC]">Step {index + 1}</span>
                    <p className="mt-1 text-sm font-bold text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#86EFAC]">AI Editor RSP</p>
              <h3 className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] text-[#86EFAC] md:text-5xl">AI Image Editor</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/68">Upload a photo, choose the whole image or a selected redraw area, describe the change, then preview and download the result.</p>
            </div>
          )}

        </div>

        <div className={`${isHero ? "mt-2" : "mt-6"} mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-black/35 p-2 md:p-3 shadow-2xl`}>
          {mode === "text" ? (
            <div className={`relative ${isHero ? "aspect-[16/7.5]" : "aspect-[16/10]"} overflow-hidden rounded-[22px] bg-[#241B13]`}>
              <img src={generatedImage || previewImage} alt="Generated image preview" className="h-full w-full object-cover brightness-105 contrast-105 saturate-110" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/12" />
              <span className="absolute left-4 top-4 rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white">{generatedImage ? "Generated" : "Prompt preview"}</span>
              {state === "processing" && <div className="absolute inset-0 flex items-center justify-center bg-black/35"><div className="rounded-2xl border border-white/15 bg-black/70 px-5 py-3 text-sm font-semibold text-white">Generating image…</div></div>}
              {state === "failed" && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-red-400/35 bg-red-950/70 p-4 text-center text-sm text-red-100">{error || "Generation failed. Please adjust the prompt and try again."}</div></div>}
              {state === "ready" && !generatedImage && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-white/15 bg-black/70 p-4 text-center text-sm text-white">Job submitted. Request {jobId?.slice(0, 10)}…</div></div>}
              {state === "idle" && !generatedImage && <div className={`${isHero ? "right-4 bottom-4 p-3 text-base leading-6" : "right-6 bottom-6 max-w-sm p-4 text-sm leading-6"} absolute rounded-2xl border border-white/10 bg-black/55 text-left text-white/78`}>Generate one image from the prompt. No before/after comparison is needed for text-only creation.</div>}
            </div>
          ) : uploadedImage ? (
            <div className={`relative flex ${isHero ? "min-h-[260px]" : "min-h-[320px]"} items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_center,rgba(134,239,172,0.12),rgba(36,27,19,0.92)_48%,rgba(10,15,12,0.98))] p-3 md:p-4`}>
              <div
                className={`${generatedImage ? "cursor-ew-resize touch-none select-none" : ""} relative max-h-[min(54vh,560px)] max-w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#F3E8DA]/10 shadow-[0_28px_80px_rgba(0,0,0,0.42)]`}
                style={{ aspectRatio: editPreviewAspect, height: editPreviewAspect < 1 ? "min(54vh,560px)" : "auto", width: editPreviewAspect >= 1 ? "100%" : "auto" }}
                role={generatedImage ? "slider" : undefined}
                aria-label={generatedImage ? "Drag to compare before and after edit" : undefined}
                aria-valuemin={generatedImage ? 12 : undefined}
                aria-valuemax={generatedImage ? 88 : undefined}
                aria-valuenow={generatedImage ? comparePosition : undefined}
                tabIndex={generatedImage ? 0 : undefined}
                onPointerDown={(event) => { if (generatedImage) startCompareDrag(event); }}
                onPointerMove={(event) => { if (generatedImage && isDraggingCompare) updateComparePosition(event); }}
                onPointerUp={(event) => { if (generatedImage) stopCompareDrag(event); }}
                onPointerCancel={(event) => { if (generatedImage) stopCompareDrag(event); }}
                onKeyDown={(event) => {
                  if (!generatedImage) return;
                  if (event.key === "ArrowLeft") setComparePosition((value) => Math.max(12, value - 4));
                  if (event.key === "ArrowRight") setComparePosition((value) => Math.min(88, value + 4));
                }}
              >
                <img src={uploadedImage} alt="Before uploaded image" className={`${editPreviewAspect >= 1 ? "relative" : "absolute inset-0"} h-full w-full object-contain brightness-95 saturate-95`} draggable={false} />
                {generatedImage && (
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}>
                    <img src={generatedImage} alt="After AI edited result" className="h-full w-full object-contain brightness-105 saturate-105" draggable={false} />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/6" />
                {generatedImage && <><span className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">Before</span><span className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">After</span><div className="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.55)]" style={{ left: `${comparePosition}%` }} /><div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl" style={{ left: `${comparePosition}%` }}>↔</div></>}
                {!generatedImage && editScope === "selected" && editRegion && (
                  <div className="pointer-events-none absolute rounded-lg border-2 border-[#86EFAC] bg-[#86EFAC]/10 shadow-[0_0_22px_rgba(134,239,172,0.32)]" style={{ left: `${editRegion.x}%`, top: `${editRegion.y}%`, width: `${editRegion.width}%`, height: `${editRegion.height}%` }} />
                )}
                {state === "processing" && <div className="absolute inset-0 flex items-center justify-center bg-black/35"><div className="rounded-2xl border border-white/15 bg-black/70 px-5 py-3 text-sm font-semibold text-white">Generating image…</div></div>}
                {state === "failed" && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-red-400/35 bg-red-950/70 p-4 text-center text-sm text-red-100">{error || "Generation failed. Please adjust the prompt and try again."}</div></div>}
                {state === "ready" && !generatedImage && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-white/15 bg-black/70 p-4 text-center text-sm text-white">Job submitted. Request {jobId?.slice(0, 10)}…</div></div>}
              </div>
            </div>
          ) : (
            <div
              className={`relative ${isHero ? "max-h-[62vh] min-h-[260px]" : "max-h-[72vh] min-h-[320px]"} cursor-ew-resize touch-none select-none overflow-hidden rounded-[22px] bg-[#241B13]`}
              style={{ aspectRatio: editPreviewAspect }}
              role="slider"
              aria-label="Drag to compare before and after demo"
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
              <img src={previewImage} alt="Before reference demo" className="absolute inset-0 h-full w-full object-contain opacity-80 saturate-90" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent" />
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}>
                <img src={previewImage} alt="After edited result demo" className="h-full w-full object-contain brightness-105 contrast-110 saturate-125" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/24 to-transparent" />
              </div>
              <span className="absolute left-4 top-4 rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white">Before · example</span>
              <span className="absolute right-4 top-4 rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white">After · AI edit</span>
              {state === "idle" && <div className={`${isHero ? "right-4 bottom-4 max-w-xs p-3 text-sm leading-5" : "right-6 bottom-6 max-w-sm p-4 text-sm leading-6"} absolute rounded-2xl border border-white/10 bg-black/55 text-left text-white/78`}>Demo preview. Upload your image, choose whole image or selected area, then generate to preview and download.</div>}
              <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.55)]" style={{ left: `${comparePosition}%` }} />
              <div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl" style={{ left: `${comparePosition}%` }}>↔</div>
            </div>
          )}
        </div>

        {generatedImage && (
          <div className={`${isHero ? "mt-3 p-3" : "mt-4 p-4"} mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/62 md:flex-row md:items-center md:justify-between`}>
          {!isHero && <p><strong className="text-white">Result ready:</strong> Preview the edited image, download it, open the full-size file, or keep editing from this result.</p>}
          <div className="flex flex-wrap gap-2">
            <a href={generatedImage} download={`ai-editor-rsp-${ratio.replace(":", "x")}.jpg`} className="rounded-full bg-[#86EFAC] px-4 py-2 text-xs font-bold text-[#102014] no-underline">Download image</a>
            <a href={generatedImage} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white no-underline">Open full size</a>
            <button type="button" onClick={editGeneratedResult} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition hover:border-white/35">Edit this result</button>
            <button type="button" onClick={clearResult} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 transition hover:border-white/35">{mode === "text" ? "Try another prompt" : "Start over"}</button>
          </div>
          </div>
        )}
      </section>
    </div>
  );
}


