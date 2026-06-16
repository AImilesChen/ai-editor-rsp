"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { promptCards } from "@/lib/site";

const styleChips = ["Editorial", "Portrait", "Fashion", "Product", "Abstract"];
const ratios = ["1:1", "4:5", "16:9", "3:4"];
const stylePreviewImages: Record<string, string> = {
  Editorial: "/images/generated/double-exposure-travel-rishikesh.webp",
  Portrait: "/images/generated/horror-girlfriend-ai-photo.webp",
  Fashion: "/images/generated/cinematic-movie-poster.webp",
  Product: "/images/generated/diwali-light-portrait.webp",
  Abstract: "/images/generated/lofi-girl-vibes.webp",
};

type GenerateConsoleProps = {
  headingLevel?: "h1" | "h2";
};

type FalResult = {
  ok?: boolean;
  data?: {
    status?: string;
    images?: Array<{ url?: string }>;
  };
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read uploaded image."));
    reader.readAsDataURL(file);
  });
}

export default function GenerateConsole({ headingLevel = "h1" }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const [prompt, setPrompt] = useState(promptCards[0].text);
  const [style, setStyle] = useState(styleChips[0]);
  const [ratio, setRatio] = useState(ratios[1]);
  const [state, setState] = useState<"idle" | "processing" | "ready" | "failed">("idle");
  const [creditsRemaining, setCreditsRemaining] = useState(3);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const preview = useMemo(() => {
    const index = Math.abs(prompt.length + style.length + ratio.length) % 3;
    return [
      "from-[#5B8CFF]/20 via-[#0B0F1A] to-[#B87333]/20",
      "from-[#B87333]/24 via-[#0B0F1A] to-[#6B2C2C]/20",
      "from-[#6B2C2C]/24 via-[#0B0F1A] to-[#5B8CFF]/16",
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
      const mode = attempt < 2 ? "" : "?mode=result";
      const response = await fetch(`/api/jobs/${encodeURIComponent(requestId)}${mode}`);
      const data = (await response.json()) as FalResult;
      if (!response.ok || !data.ok) continue;
      const imageUrl = data.data?.images?.[0]?.url;
      if (imageUrl) return imageUrl;
      if (data.data?.status === "FAILED") throw new Error("Image generation failed. Please adjust the prompt and try again.");
    }
    return null;
  };

  const runGenerate = async () => {
    const trimmedPrompt = prompt.trim();
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
        body: JSON.stringify({ prompt: trimmedPrompt, style, ratio, imageDataUrl: uploadedImage || undefined }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Generation request failed.");
      }
      setCreditsRemaining(data.creditsRemaining);
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

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_.8fr]">
      <div className="rsp-card h-full p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="rsp-chip mb-2">Creator console</p>
            <HeadingTag className="font-heading text-3xl font-normal tracking-[-0.03em] text-white md:text-4xl">Generate from your image</HeadingTag>
          </div>
          <div className="border border-[#B87333]/35 bg-[#B87333]/10 px-3 py-2 font-mono text-sm text-[#f6d0a8]">Credits: {creditsRemaining} remaining</div>
        </div>

        <label className="mb-4 flex cursor-pointer flex-col items-start gap-3 border border-dashed border-[#B87333]/45 bg-[#0B0F1A]/70 p-4 transition hover:border-[#D4A574]" htmlFor="upload-image">
          <span className="flex h-10 w-10 items-center justify-center border border-[#B87333]/45 bg-[#B87333]/10 text-xl text-[#f6d0a8]">↑</span>
          <span className="text-sm font-semibold text-white">{uploadedName ? "Uploaded photo" : "Upload photo"}</span>
          <span className="text-sm text-[#A7ABB8]">{uploadedName || "PNG, JPG, or WebP under 5 MB. Use your own image as the starting point."}</span>
          {uploadedImage && <img src={uploadedImage} alt="Uploaded source preview" className="mt-2 h-28 w-28 border border-white/10 object-cover" />}
        </label>
        <input id="upload-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="sr-only" />

        <label className="mb-2 block text-sm font-semibold text-white" htmlFor="prompt">Prompt</label>
        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[150px] w-full border border-white/10 bg-[#0B0F1A] p-4 font-mono text-sm text-[#F1EADF] outline-none ring-[#B87333]/35 focus:ring-4" />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Style</p>
            <div className="flex flex-wrap gap-2">
              {styleChips.map((chip) => (
                <button type="button" key={chip} onClick={() => setStyle(chip)} className={`border px-4 py-2 text-sm font-semibold ${style === chip ? "border-[#B87333] bg-[#B87333] text-[#110B02]" : "border-white/10 bg-white/[0.06] text-[#A7ABB8]"}`}>{chip}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Aspect ratio</p>
            <div className="flex flex-wrap gap-2">
              {ratios.map((item) => (
                <button type="button" key={item} onClick={() => setRatio(item)} className={`border px-4 py-2 text-sm font-semibold ${ratio === item ? "border-[#D4A574] bg-[#D4A574] text-[#110B02]" : "border-white/10 bg-white/[0.06] text-[#A7ABB8]"}`}>{item}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={runGenerate} disabled={state === "processing" || creditsRemaining <= 0} className="rsp-button-primary disabled:cursor-not-allowed disabled:opacity-60">{state === "processing" ? "Generating…" : uploadedImage ? "Generate from uploaded photo" : "Generate from prompt"}</button>
          {uploadedImage && <button type="button" onClick={() => { setUploadedImage(null); setUploadedName(null); setGeneratedImage(null); }} className="rsp-button-secondary">Remove photo</button>}
        </div>
        <p className="mt-3 text-sm text-[#A7ABB8]">You can generate from text only, or upload a photo first and use the prompt as the edit direction.</p>
      </div>

      <div className="rsp-card flex h-full flex-col overflow-hidden p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Output preview</p>
            <p className="mt-1 text-xs text-[#A7ABB8]">Result appears here after generation completes.</p>
          </div>
          <span className="border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#A7ABB8]">{ratio}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-white/10 bg-black/20 p-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A7ABB8]">Original</p>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-[#101522] to-[#0B0F1A]">
              {uploadedImage ? <img src={uploadedImage} alt="Uploaded original" className="h-full w-full object-cover" /> : <p className="px-4 text-center text-sm text-[#A7ABB8]">Upload a photo or generate directly from text.</p>}
            </div>
          </div>
          <div className="border border-white/10 bg-black/20 p-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A7ABB8]">Generated</p>
            <div className={`relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br ${preview}`}>
              {(generatedImage || (state === "idle" && !uploadedImage)) && <img src={generatedImage || previewImage} alt="Generated result preview" className="absolute inset-0 h-full w-full object-cover opacity-90" loading="lazy" />}
              <div className="absolute inset-0 bg-black/20" />
              {state === "processing" && <div className="relative z-10 border border-white/10 bg-black/50 px-5 py-3 text-center text-white backdrop-blur">Generating image…</div>}
              {state === "failed" && <div className="relative z-10 mx-4 max-w-[240px] border border-red-400/30 bg-red-500/10 p-4 text-center text-sm text-red-100 backdrop-blur">{error || "Generation failed. Please adjust the prompt and try again."}</div>}
              {state === "ready" && !generatedImage && <div className="relative z-10 mx-4 max-w-[240px] border border-[#D4A574]/40 bg-black/50 p-4 text-center text-sm text-[#F1EADF] backdrop-blur">Job submitted. Request {jobId?.slice(0, 10)}…</div>}
              {state === "idle" && uploadedImage && <div className="relative z-10 mx-4 max-w-[240px] border border-white/10 bg-black/50 p-4 text-center text-sm text-[#D7DAE8] backdrop-blur">Ready to generate from your image.</div>}
            </div>
          </div>
        </div>
        <div className="mt-4 border border-white/10 bg-white/[0.04] p-4 text-sm text-[#A7ABB8]"><strong className="text-white">Live generator:</strong> text generation and uploaded-photo generation submit to the image service, then poll the job result and render the generated image here.</div>
      </div>
    </div>
  );
}
