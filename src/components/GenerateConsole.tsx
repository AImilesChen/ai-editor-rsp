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
  variant?: "full" | "hero";
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

export default function GenerateConsole({ headingLevel = "h1", variant = "full" }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const isHero = variant === "hero";
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
      "from-[#F4DFC8] via-[#FBF7F0] to-[#D4A574]/30",
      "from-[#E8C19A]/35 via-[#FBF7F0] to-[#6B2C2C]/12",
      "from-[#E6D4C2] via-[#FBF7F0] to-[#2E4057]/12",
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
      const data = await response.json() as FalResult & { error?: string; creditsRemaining?: number };
      if (!response.ok || !data.ok) {
        if (typeof data.creditsRemaining === "number") setCreditsRemaining(data.creditsRemaining);
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
    <div className={isHero ? "grid gap-4" : "grid items-stretch gap-6 lg:grid-cols-[1.05fr_.8fr]"}>
      <div className={`rsp-card h-full ${isHero ? "p-4 md:p-5" : "p-5 md:p-6"}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="rsp-chip mb-2">Creator console</p>
            <HeadingTag className={`font-heading font-normal tracking-[-0.03em] text-rsp-text ${isHero ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}`}>Generate from your image</HeadingTag>
          </div>
          <div className="border border-[#B87333]/35 bg-[#B87333]/10 px-3 py-2 font-mono text-sm text-rsp-secondary">Credits: {creditsRemaining} remaining</div>
        </div>

        <label className="mb-4 flex cursor-pointer flex-col items-start gap-3 border border-dashed border-[#B87333]/45 bg-[#F7F2EA]/80 p-4 transition hover:border-[#D4A574]" htmlFor="upload-image">
          <span className="flex h-10 w-10 items-center justify-center border border-[#B87333]/45 bg-[#B87333]/10 text-xl text-rsp-secondary">↑</span>
          <span className="text-sm font-semibold text-rsp-text">{uploadedName ? "Uploaded photo" : "Upload photo"}</span>
          <span className="text-sm text-rsp-muted">{uploadedName || "PNG, JPG, or WebP under 5 MB. Use your own image as the starting point."}</span>
          {uploadedImage && <img src={uploadedImage} alt="Uploaded source preview" className="mt-2 h-28 w-28 border border-rsp-border object-cover" />}
        </label>
        <input id="upload-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="sr-only" />

        <label className="mb-2 block text-sm font-semibold text-rsp-text" htmlFor="prompt">Prompt</label>
        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`${isHero ? "min-h-[92px]" : "min-h-[150px]"} w-full border border-rsp-border bg-[#FBF7F0] p-4 font-mono text-sm text-rsp-text outline-none ring-[#B87333]/35 focus:ring-4`} />

        {!isHero && <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-rsp-text">Style</p>
            <div className="flex flex-wrap gap-2">
              {styleChips.map((chip) => (
                <button type="button" key={chip} onClick={() => setStyle(chip)} className={`border px-4 py-2 text-sm font-semibold ${style === chip ? "border-[#B87333] bg-[#B87333] text-[#110B02]" : "border-rsp-border bg-white/55 text-rsp-muted"}`}>{chip}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-rsp-text">Aspect ratio</p>
            <div className="flex flex-wrap gap-2">
              {ratios.map((item) => (
                <button type="button" key={item} onClick={() => setRatio(item)} className={`border px-4 py-2 text-sm font-semibold ${ratio === item ? "border-[#D4A574] bg-[#D4A574] text-[#110B02]" : "border-rsp-border bg-white/55 text-rsp-muted"}`}>{item}</button>
              ))}
            </div>
          </div>
        </div>}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={runGenerate} disabled={state === "processing" || creditsRemaining <= 0} className="rsp-button-primary disabled:cursor-not-allowed disabled:opacity-60">{state === "processing" ? "Generating…" : uploadedImage ? "Generate from uploaded photo" : "Generate from prompt"}</button>
          {uploadedImage && <button type="button" onClick={() => { setUploadedImage(null); setUploadedName(null); setGeneratedImage(null); }} className="rsp-button-secondary">Remove photo</button>}
        </div>
        <p className="mt-3 text-sm text-rsp-muted">{creditsRemaining <= 0 ? "Your credits are used up. Get more to continue." : "You can generate from text only, or upload a photo first and use the prompt as the edit direction."}</p>
        <p className="mt-2 text-xs leading-5 text-rsp-muted">Safety checks block sexual, violent, deceptive, deepfake, minor-related, extremist, and rights-infringing requests before generation. Blocked safety requests do not use credits.</p>
      </div>

      <div className={`rsp-card flex h-full flex-col overflow-hidden ${isHero ? "p-4 md:p-5" : "p-5 md:p-6"}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-rsp-text">Output preview</p>
            <p className="mt-1 text-xs text-rsp-muted">Result appears here after generation completes.</p>
          </div>
          <span className="border border-rsp-border bg-white/55 px-3 py-1 text-xs font-semibold text-rsp-muted">{ratio}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-rsp-border bg-[#EFE7DC]/55 p-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-rsp-muted">Original</p>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-[#F3E8DA] to-[#FBF7F0]">
              {uploadedImage ? <img src={uploadedImage} alt="Uploaded original" className="h-full w-full object-cover" /> : <p className="px-4 text-center text-sm text-rsp-muted">Upload a photo or generate directly from text.</p>}
            </div>
          </div>
          <div className="border border-rsp-border bg-[#EFE7DC]/55 p-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-rsp-muted">Generated</p>
            <div className={`relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br ${preview}`}>
              {(generatedImage || (state === "idle" && !uploadedImage)) && <img src={generatedImage || previewImage} alt="Generated result preview" className="absolute inset-0 h-full w-full object-cover opacity-90" loading="lazy" />}
              <div className="absolute inset-0 bg-[#EFE7DC]/55" />
              {state === "processing" && <div className="relative z-10 border border-rsp-border bg-white/75 px-5 py-3 text-center text-rsp-text backdrop-blur">Generating image…</div>}
              {state === "failed" && <div className="relative z-10 mx-4 max-w-[240px] border border-red-400/40 bg-red-50 p-4 text-center text-sm text-red-700 backdrop-blur">{error || "Generation failed. Please adjust the prompt and try again."}</div>}
              {state === "ready" && !generatedImage && <div className="relative z-10 mx-4 max-w-[240px] border border-[#D4A574]/40 bg-white/75 p-4 text-center text-sm text-rsp-text backdrop-blur">Job submitted. Request {jobId?.slice(0, 10)}…</div>}
              {state === "idle" && uploadedImage && <div className="relative z-10 mx-4 max-w-[240px] border border-rsp-border bg-white/75 p-4 text-center text-sm text-rsp-muted backdrop-blur">Ready to generate from your image.</div>}
            </div>
          </div>
        </div>
        <div className="mt-4 border border-rsp-border bg-white/60 p-4 text-sm text-rsp-muted"><strong className="text-rsp-text">Live generator:</strong> text generation and uploaded-photo generation submit to the image service, then poll the job result and render the generated image here.</div>
      </div>
    </div>
  );
}
