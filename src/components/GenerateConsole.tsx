"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useState } from "react";
import { promptCards as builderPromptCards } from "@/lib/site";
import { promptCards as libraryPromptCards } from "@/lib/rsp-content";
import { GENERATION_RATIOS, quoteGenerationCredits } from "@/lib/generation-pricing";

const editTasks = [
  { label: "Professional headshot", prompt: "Turn the uploaded photo into a realistic professional LinkedIn headshot. Preserve the same person's face, identity, age, facial structure, and natural expression. Reframe to a shoulders-up business portrait with the face and upper torso as the main subject. Dress the person in a clean navy blazer and light shirt unless the user requests another professional outfit. Use a plain neutral grey studio background, natural skin texture, soft studio lighting, eye-level camera angle, sharp facial details, polished corporate portrait style, professional and trustworthy. Remove outdoor scenery, crossbody bags, hats, sunglasses, and casual streetwear styling." },
  { label: "Remove people", prompt: "Remove unwanted people and keep the background natural." },
  { label: "Remove objects", prompt: "Remove unwanted objects and fill the area naturally." },
  { label: "Clean background clutter", prompt: "Clean up background distractions and keep the main subject unchanged." },
  { label: "Remove text or marks", prompt: "Remove the unwanted text or mark and reconstruct the background naturally." },
  { label: "Remove background", prompt: "Remove the background from the uploaded image, keep the subject edges clean and natural, and place the subject on a transparent or soft neutral backdrop." },
  { label: "Change background", prompt: "Keep the subject unchanged and replace only the background with a cozy lofi night-study room, warm lamp light, rain on the window, and soft film grain." },
  { label: "Replace object", prompt: "Replace the selected object with a premium desk lamp, matching the original perspective, lighting, shadows, and realistic texture." },
  { label: "Recolor item", prompt: "Recolor the selected item to deep emerald green while preserving fabric texture, highlights, shadows, and the rest of the image unchanged." },
  { label: "Enhance lighting", prompt: "Enhance the lighting with warm studio highlights, balanced shadows, natural skin or product tones, and a polished creator-ready finish." },
];

const textTasks = [
  { label: "Portrait", prompt: builderPromptCards[0]?.text || "A cinematic editorial portrait with soft rim light, textured backdrop, subtle film grain, expressive eyes, and high-end magazine color grading." },
  { label: "Product photo", prompt: "A premium product photography scene with clean background, warm studio lighting, realistic shadows, refined composition, and commercial-ready detail." },
  { label: "Social post", prompt: "A scroll-stopping social media visual with strong composition, bold focal point, clean negative space for text, and polished creator branding." },
  { label: "Study room", prompt: "A cozy lofi night-study desk scene with warm lamp light, rain outside the window, soft film grain, calm creator atmosphere, and editorial composition." },
  { label: "Anime", prompt: "A detailed anime illustration with expressive character design, atmospheric background, refined color palette, and cinematic composition." },
  { label: "Logo poster", prompt: "A modern logo poster concept with clear brand mark, premium layout, strong contrast, clean typography space, and minimal visual clutter." },
  { label: "Lifestyle scene", prompt: "A realistic lifestyle scene with natural human activity, beautiful environment, authentic details, and commercial editorial polish." },
];

const styleOptions = ["Photorealistic", "Cinematic", "Anime", "3D Render", "Editorial", "Product Render", "Watercolor", "Pixel Art", "Minimalist", "Vintage Film", "Fantasy Art"];
const lightingOptions = ["Golden hour", "Soft studio light", "Neon light", "Dramatic shadow", "Natural window light", "Studio flash", "Low key", "Backlit", "Moody candlelight"];
const shotOptions = ["Close-up", "Half body", "Wide shot", "Full body", "Overhead", "Flat lay", "Product macro", "Environmental shot", "Portrait crop"];
const compactPresetCount = 3;
type PromptModifierKind = "style" | "lighting" | "shot";

const previewImages: Record<string, string> = {
  "Professional headshot": "/images/prompt-cases/examples/ai-headshot-linkedin-corporate-headshot.webp",
  "Remove people": "/images/generated/double-exposure-travel-rishikesh.webp",
  "Remove objects": "/images/generated/cinematic-movie-poster.webp",
  "Clean background clutter": "/images/generated/lofi-girl-vibes.webp",
  "Remove text or marks": "/images/generated/diwali-light-portrait.webp",
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

const editorCleanupDemoBefore = "/images/image-editor-cases/premium-remove-people-before.webp";
const editorCleanupDemoAfter = "/images/image-editor-cases/premium-remove-people-after.webp";

type GenerateConsoleProps = {
  headingLevel?: "h1" | "h2";
  variant?: "full" | "hero";
  defaultMode?: "edit" | "text";
  lockedMode?: "edit" | "text";
  defaultPreset?: "headshot";
  compactPromptBuilder?: boolean;
  previewHeadingLevel?: "h1" | "h2" | "h3";
  hidePreviewIntro?: boolean;
  loginReturnPath?: string;
  hidePromptLibraryLink?: boolean;
  editorOnly?: boolean;
};

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

function createHeadshotReferenceCrop(src: string) {
  return new Promise<string>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const sourceWidth = image.naturalWidth || 1;
      const sourceHeight = image.naturalHeight || 1;
      const targetAspect = 3 / 4;
      const isPortraitOrSquare = sourceHeight >= sourceWidth * 0.95;
      const cropHeight = isPortraitOrSquare ? Math.round(sourceHeight * 0.68) : Math.round(sourceHeight * 0.9);
      const cropWidth = Math.min(sourceWidth, Math.round(cropHeight * targetAspect));
      const cropX = Math.round((sourceWidth - cropWidth) / 2);
      const cropY = isPortraitOrSquare ? 0 : Math.round(sourceHeight * 0.03);
      const canvas = document.createElement("canvas");
      canvas.width = 768;
      canvas.height = 1024;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(src);
        return;
      }
      context.fillStyle = "#d8d8d8";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    image.onerror = () => resolve(src);
    image.src = src;
  });
}

function composeTextPrompt(basePrompt: string, style?: string | null, lighting?: string | null, shot?: string | null) {
  const parts = [basePrompt.trim()];
  if (style) parts.push(`Style: ${style}.`);
  if (lighting) parts.push(`Lighting: ${lighting}.`);
  if (shot) parts.push(`Shot: ${shot}.`);
  return parts.filter(Boolean).join(" ");
}

function stripBuilderNotes(prompt: string) {
  return prompt
    .replace(/\s*Style:\s*[^.]+\./gi, "")
    .replace(/\s*Lighting:\s*[^.]+\./gi, "")
    .replace(/\s*Shot:\s*[^.]+\./gi, "")
    .trim();
}

function aspectFromRatio(ratio?: string) {
  switch (ratio) {
    case "1:1":
      return 1;
    case "3:4":
    case "4:5":
      return 3 / 4;
    case "4:3":
    case "5:4":
      return 4 / 3;
    case "9:16":
      return 9 / 16;
    case "16:9":
      return 16 / 9;
    default:
      return null;
  }
}

export default function GenerateConsole({ headingLevel = "h1", variant = "full", defaultMode = "edit", lockedMode, defaultPreset, compactPromptBuilder = false, previewHeadingLevel = "h1", hidePreviewIntro = false, loginReturnPath, hidePromptLibraryLink = false, editorOnly = false }: GenerateConsoleProps) {
  const HeadingTag = headingLevel;
  const PreviewHeadingTag = previewHeadingLevel;
  const isHero = variant === "hero";
  const initialMode = lockedMode || defaultMode;
  const isHeadshotOnly = lockedMode === "edit" && defaultPreset === "headshot";
  const defaultHeadshotTask = defaultPreset === "headshot" ? editTasks[0] : null;
  const defaultEditorTask = editorOnly ? editTasks[1] : null;
  const [mode, setMode] = useState<"edit" | "text">(initialMode);
  const editLoginPath = loginReturnPath || "/reference-edit";
  const [prompt, setPrompt] = useState(defaultEditorTask?.prompt || "");
  const [task, setTask] = useState<string | null>(defaultHeadshotTask?.label || defaultEditorTask?.label || null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
  const [selectedShot, setSelectedShot] = useState<string | null>(null);
  const [ratio, setRatio] = useState(initialMode === "text" ? "" : defaultPreset === "headshot" ? "3:4" : "auto");
  const [state, setState] = useState<"idle" | "processing" | "ready" | "failed">("idle");
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [headshotReferenceImage, setHeadshotReferenceImage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploadedAspect, setUploadedAspect] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDraggingCompare, setIsDraggingCompare] = useState(false);
  const [editScope, setEditScope] = useState<EditScope>("whole");
  const [editRegion, setEditRegion] = useState<EditRegion | null>(null);
  const [regionStart, setRegionStart] = useState<{ x: number; y: number } | null>(null);
  const [isSelectingRegion, setIsSelectingRegion] = useState(false);
  const [showMoreHeadshotRatios, setShowMoreHeadshotRatios] = useState(false);
  const [expandedLookGroups, setExpandedLookGroups] = useState<Record<PromptModifierKind, boolean>>({ style: false, lighting: false, shot: false });

  const editorOnlyTasks = editTasks.filter((item) => ["Remove people", "Remove objects", "Clean background clutter", "Remove text or marks"].includes(item.label));
  const activeTasks = mode === "edit" ? (editorOnly ? editorOnlyTasks : editTasks) : textTasks;
  const headshotPrompt = editTasks[0].prompt;
  const isHeadshotMode = mode === "edit" && task === "Professional headshot";
  const imageForRequest = mode === "edit" ? (isHeadshotMode ? headshotReferenceImage || uploadedImage : uploadedImage) : null;
  const imageForQuote = isHeadshotMode ? imageForRequest || "data:image/png;base64," : imageForRequest;
  const currentQuote = useMemo(() => quoteGenerationCredits({ ratio, imageDataUrl: imageForQuote, style: task }), [ratio, imageForQuote, task]);
  const previewImage = task ? previewImages[task] || "/images/generated/lofi-girl-vibes.webp" : "/images/generated/lofi-girl-vibes.webp";
  const editPreviewAspect = isHeadshotMode ? aspectFromRatio(currentQuote.ratio) || (3 / 4) : uploadedAspect ? Math.min(1.8, Math.max(0.56, uploadedAspect)) : (16 / 9);
  const promptPlaceholder = isHeadshotMode
    ? "Optional: add outfit, background, or lighting details. Leave blank to use the default professional headshot prompt."
    : mode === "edit"
      ? "Example: remove the background, keep the product sharp, and add a soft beige studio backdrop."
      : "Describe the image you want to create, or start from a ready prompt below.";
  const userPrompt = prompt.trim();
  const headshotIdentityGuard = "Keep the exact same person from the uploaded photo. Preserve face identity, facial structure, age, skin tone, hairstyle, expression, and recognizable natural details. The submitted reference is pre-cropped toward the face and upper torso for headshot quality. Generate a tight shoulders-up professional headshot with the face large and centered; do not preserve full-body pose, outdoor background, crossbody bag, hands, or lower body.";
  const effectivePrompt = isHeadshotMode
    ? userPrompt
      ? `${headshotIdentityGuard} ${headshotPrompt} User requested details: ${userPrompt}. Apply the requested professional outfit, background, lighting, and framing exactly where possible while keeping the uploaded person's identity consistent. If the source is outdoor or full-body, replace the scene with the requested studio background and crop/reframe into a business headshot.`
      : `${headshotIdentityGuard} ${headshotPrompt}`
    : prompt;
  const needsUpload = mode === "edit" && !uploadedImage;
  const canGenerate = Boolean(authenticated) && !needsUpload && effectivePrompt.trim().length >= 20 && state !== "processing" && creditsRemaining >= currentQuote.creditsCharged;
  const visiblePromptTasks = isHero && compactPromptBuilder ? activeTasks.slice(0, 5) : activeTasks;
  const compactOptionGroups = [
    { kind: "style" as const, label: "Style", options: styleOptions, value: selectedStyle, setter: setSelectedStyle, moreLabel: "styles" },
    { kind: "lighting" as const, label: "Lighting", options: lightingOptions, value: selectedLighting, setter: setSelectedLighting, moreLabel: "lighting" },
    { kind: "shot" as const, label: "Shot", options: shotOptions, value: selectedShot, setter: setSelectedShot, moreLabel: "shots" },
  ].map((group) => {
    const primaryOptions = group.options.slice(0, compactPresetCount);
    const overflowOptions = group.options.slice(compactPresetCount);
    const selectedOverflow = group.value && overflowOptions.includes(group.value) ? group.value : null;
    const displayedOptions = expandedLookGroups[group.kind]
      ? group.options
      : selectedOverflow
        ? [...primaryOptions, selectedOverflow]
        : primaryOptions;
    return { ...group, primaryOptions, overflowOptions, displayedOptions, selectedOverflow };
  });
  const visibleRatios = isHeadshotMode
    ? GENERATION_RATIOS.filter((item) => item.ratio !== "auto")
    : isHero && compactPromptBuilder
      ? GENERATION_RATIOS.filter((item) => item.ratio !== "auto")
      : GENERATION_RATIOS.filter((item) => mode === "edit" || item.ratio !== "auto");
  const primaryHeadshotRatios = visibleRatios.filter((item) => ["3:4", "1:1", "4:5"].includes(item.ratio));
  const advancedHeadshotRatios = visibleRatios.filter((item) => !["3:4", "1:1", "4:5"].includes(item.ratio));
  const displayedEditRatios = isHeadshotMode ? primaryHeadshotRatios : visibleRatios;
  const showHeadshotSteps = mode === "edit" && isHeadshotMode;
  const showEditAreaControls = mode === "edit" && !isHeadshotMode && Boolean(uploadedImage);

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json() as Promise<SessionResponse>)
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (typeof data.creditsRemaining === "number") setCreditsRemaining(data.creditsRemaining);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const promptParam = searchParams.get("prompt");
    const presetParam = searchParams.get("preset");
    if (!promptParam && presetParam !== "headshot") return;
    const matchedPrompt = promptParam ? libraryPromptCards.find((item) => item.slug === promptParam) : null;

    if (lockedMode === "edit") {
      const headshotTask = editTasks[0];
      setMode("edit");
      if (isHeadshotOnly || presetParam === "headshot") {
        setTask(headshotTask.label);
        setPrompt("");
        setRatio("3:4");
        setEditScope("whole");
        setEditRegion(null);
        return;
      }
      setTask(matchedPrompt?.title || headshotTask.label);
      setPrompt(matchedPrompt?.prompt || promptParam || "");
      setRatio("3:4");
      return;
    }

    setMode("text");
    if (matchedPrompt) {
      setTask(matchedPrompt.title);
      setPrompt(matchedPrompt.prompt);
      setRatio(matchedPrompt.ratio || "4:5");
      return;
    }
    setTask(null);
    setPrompt(promptParam || "");
    setRatio("4:5");
  }, [lockedMode, isHeadshotOnly]);

  const switchMode = (nextMode: "edit" | "text") => {
    if (lockedMode && nextMode !== lockedMode) return;
    setMode(nextMode);
    setGeneratedImage(null);
    setError(null);
    setState("idle");
    setTask(null);
    setPrompt("");
    setSelectedStyle(null);
    setSelectedLighting(null);
    setSelectedShot(null);
    if (nextMode === "edit") setRatio("auto");
    if (nextMode === "text") setRatio("");
  };

  const applyTask = (item: { label: string; prompt: string }) => {
    if (isHeadshotOnly && item.label !== "Professional headshot") return;
    setTask(item.label);
    setPrompt(item.label === "Professional headshot" ? "" : composeTextPrompt(item.prompt, selectedStyle, selectedLighting, selectedShot));
    if (mode === "edit" && item.label === "Professional headshot") {
      setRatio("3:4");
      setEditScope("whole");
      setEditRegion(null);
    }
  };

  const clearPromptChoices = () => {
    if (isHeadshotOnly) {
      setTask(editTasks[0].label);
      setPrompt("");
      setRatio("3:4");
      setEditScope("whole");
      setEditRegion(null);
      return;
    }
    setTask(null);
    setSelectedStyle(null);
    setSelectedLighting(null);
    setSelectedShot(null);
    if (mode === "text") setRatio("");
    setPrompt("");
  };

  const applyPromptModifier = (kind: "style" | "lighting" | "shot", option: string, currentValue: string | null, setter: (value: string | null) => void) => {
    const nextValue = currentValue === option ? null : option;
    setter(nextValue);
    if (mode !== "text") return;
    const baseTask = task ? textTasks.find((item) => item.label === task)?.prompt || stripBuilderNotes(prompt) : stripBuilderNotes(prompt);
    const nextStyle = kind === "style" ? nextValue : selectedStyle;
    const nextLighting = kind === "lighting" ? nextValue : selectedLighting;
    const nextShot = kind === "shot" ? nextValue : selectedShot;
    if (baseTask || nextStyle || nextLighting || nextShot) setPrompt(composeTextPrompt(baseTask, nextStyle, nextLighting, nextShot));
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
      const croppedHeadshotReference = await createHeadshotReferenceCrop(dataUrl);
      setUploadedImage(dataUrl);
      setHeadshotReferenceImage(croppedHeadshotReference);
      setUploadedAspect(aspect);
      setUploadedName(file.name);
      if (mode === "edit") {
        setRatio(task === "Professional headshot" ? "3:4" : "auto");
        setEditScope("whole");
      }
      setGeneratedImage(null);
      setEditRegion(null);
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
    const trimmedPrompt = effectivePrompt.trim();
    if (!authenticated) {
      window.location.href = mode === "edit" ? `/login?next=${encodeURIComponent(editLoginPath)}` : "/login?next=/generate";
      return;
    }
    if (needsUpload) {
      setError(lockedMode === "edit" ? "Upload a photo first to start editing." : "Upload a reference image first, or switch to Create from Text.");
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
          window.location.href = mode === "edit" ? `/login?next=${encodeURIComponent(editLoginPath)}` : "/login?next=/generate";
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
    setHeadshotReferenceImage(null);
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
    setHeadshotReferenceImage(null);
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
    <div className={`min-w-0 overflow-hidden rounded-[34px] border border-rsp-border bg-[#15110C] text-white shadow-[0_24px_80px_rgba(46,32,18,0.22)] ${isHero ? "grid items-start gap-0 xl:grid-cols-[430px_minmax(0,1fr)]" : "grid items-start gap-0 lg:grid-cols-[460px_minmax(0,1fr)]"}`}>
      <aside className={`border-r border-white/10 bg-[#1E1711] ${isHero ? "p-4 xl:max-h-none" : "p-4 md:p-5"}`}>
        <div className={`${isHero ? "mb-3" : "mb-4"} flex items-center justify-between gap-3`}>
          <div>
            <p className={`${isHero ? "sr-only" : "font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4A574]"}`}>{editorOnly ? "STEP 1 · UPLOAD" : "AI Image Editor"}</p>
            <HeadingTag className={`${isHero ? "text-2xl" : "text-3xl"} mt-1 font-heading font-normal tracking-[-0.03em] text-white`}>{isHero ? (mode === "edit" ? (task === "Professional headshot" ? "Create a professional headshot" : "Upload and edit your photo") : "Choose or write a prompt") : editorOnly ? "Start with your photo" : mode === "edit" ? "Edit uploaded image" : "Create from prompt"}</HeadingTag>
          </div>
          <div className="border border-[#D4A574]/35 bg-[#D4A574]/10 px-3 py-2 text-right font-mono text-[11px] leading-4 text-[#F4DFC8]">
            {authenticated ? `${creditsRemaining} credits` : isHero ? <><span className="block">3 free credits</span><span className="block text-[9px] text-[#F4DFC8]/70">after login</span></> : "Log in for 3 credits"}
          </div>
        </div>

        {!lockedMode && <div className={`${isHero ? "mb-3" : "mb-4"}`}>
          <p className={`${isHero ? "sr-only" : "mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70"}`}>Mode</p>
          <div className={`grid gap-2 ${isHero ? "grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1" : ""}`}>
            <button type="button" onClick={() => switchMode("edit")} className={`rounded-xl border ${isHero ? "px-3 py-2 text-center" : "p-3 text-left"} transition ${mode === "edit" ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>{isHero ? "Edit image" : "Edit uploaded image"}</span>{mode === "edit" && <span className="text-[#86EFAC]">✓</span>}</span>
              {!isHero && <span className="mt-1 block text-xs leading-5 text-white/58">Upload a reference, keep the subject and composition, then change only what you describe.</span>}
            </button>
            <button type="button" onClick={() => switchMode("text")} className={`rounded-xl border ${isHero ? "px-3 py-2 text-center" : "p-3 text-left"} transition ${mode === "text" ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-white/[0.04] hover:border-white/20"}`}>
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>{isHero ? "Use prompt" : "Create from prompt"}</span>{mode === "text" && <span className="text-[#86EFAC]">✓</span>}</span>
              {!isHero && <span className="mt-1 block text-xs leading-5 text-white/58">Generate a new image from text only. No uploaded reference or before/after comparison.</span>}
            </button>
          </div>
        </div>}

        {isHeadshotOnly && (
          <div className="mb-3 rounded-2xl border border-[#86EFAC]/20 bg-[#102014]/35 p-3 text-xs leading-5 text-[#C8FADC]">
            <p className="font-semibold uppercase tracking-[0.16em]">Professional headshot only</p>
            <p className="mt-1 text-white/58">Upload a face photo, keep 3:4 portrait framing, and generate a business-ready profile image.</p>
          </div>
        )}

        {mode === "edit" && isHero && lockedMode === "edit" && !isHeadshotOnly && (
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.035] p-2.5">
            <p className={`${uploadedImage ? "sr-only" : "mb-2"} text-xs font-semibold uppercase tracking-[0.16em] text-white/70`}>Choose a simple mode</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => applyTask(editTasks[0])} className={`rounded-xl border ${uploadedImage ? "px-3 py-2" : "p-3"} text-left transition ${task === editTasks[0].label ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-black/20 hover:border-white/25"}`}>
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>Professional Headshot</span>{task === editTasks[0].label && <span className="text-[#86EFAC]">✓</span>}</span>
                {!uploadedImage && <span className="mt-1 block text-xs leading-5 text-white/58">For LinkedIn, resume, and business profile photos.</span>}
              </button>
              <button type="button" onClick={clearPromptChoices} className={`rounded-xl border ${uploadedImage ? "px-3 py-2" : "p-3"} text-left transition ${!task && !prompt ? "border-[#86EFAC] bg-[#1F3325]" : "border-white/10 bg-black/20 hover:border-white/25"}`}>
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white"><span>Custom Edit</span>{!task && !prompt && <span className="text-[#86EFAC]">✓</span>}</span>
                {!uploadedImage && <span className="mt-1 block text-xs leading-5 text-white/58">Describe your own background, outfit, lighting, or cleanup edit.</span>}
              </button>
            </div>
          </div>
        )}

        {mode === "edit" && (
          <>
            <label className={`${isHero ? "mb-3 flex items-center gap-3 p-3" : "mb-4 block p-4"} cursor-pointer rounded-2xl border border-dashed border-[#D4A574]/45 bg-[#2A2118] transition hover:border-[#D4A574]`} htmlFor="upload-image">
              <span className={`${isHero ? "h-9 w-9 shrink-0" : "mb-3 h-10 w-10"} flex items-center justify-center rounded-full border border-[#D4A574]/35 bg-[#D4A574]/10 text-lg text-[#F4DFC8]`}>↑</span>
              <span className="min-w-0">
                <span className={`${isHero ? "text-base" : "text-base"} block font-semibold text-white`}>{uploadedName ? "Photo uploaded" : "Upload photo to edit"}</span>
                <span className={`${isHero ? "leading-5" : "leading-5"} mt-1 block text-sm text-white/58`}>{uploadedName || (isHero ? "Drag or browse · PNG/JPG/WebP · 5 MB" : "Remove people, objects, text, or background distractions. PNG/JPG/WebP under 5 MB.")}</span>
              </span>
              {uploadedImage && <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#F3E8DA]/10 p-1"><img src={uploadedImage} alt="Uploaded source preview" className="max-h-full max-w-full object-contain" /></span>}
            </label>
            <input id="upload-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="sr-only" />
          </>
        )}

        {mode === "edit" && (!editorOnly || Boolean(uploadedImage)) && (
          <div className={`${isHero ? "mb-3" : "mb-4"} rounded-2xl border border-white/10 bg-white/[0.035] p-2.5`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white/78">Image size</p>
              {isHeadshotMode && <span className="text-xs font-semibold text-white/48">{currentQuote.sizeLabel}</span>}
            </div>
            <div className={`grid ${isHero ? "grid-cols-4 gap-1.5" : "grid-cols-4 gap-2"}`}>
              {displayedEditRatios.map((item) => {
                const isRecommendedHeadshotRatio = isHeadshotMode && item.ratio === "3:4";
                return (
                  <button type="button" key={item.ratio} onClick={() => setRatio(item.ratio)} className={`rounded-xl border px-2 ${isHero ? "py-2" : "py-2.5"} text-center transition ${ratio === item.ratio ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-white/[0.04] text-white/72 hover:border-white/25 hover:text-white"}`}>
                    <span className="block text-base font-black leading-none tracking-[-0.01em]">{item.label}</span>
                    {isRecommendedHeadshotRatio && <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.08em] opacity-75">Best</span>}
                  </button>
                );
              })}
              {isHeadshotMode && (
                <button type="button" onClick={() => setShowMoreHeadshotRatios((value) => !value)} className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-2 text-center text-xs font-bold text-white/58 transition hover:border-white/25 hover:text-white">
                  {showMoreHeadshotRatios ? "Less" : "More"}
                </button>
              )}
            </div>
            {isHeadshotMode && showMoreHeadshotRatios && (
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {advancedHeadshotRatios.map((item) => (
                  <button type="button" key={item.ratio} onClick={() => setRatio(item.ratio)} className={`rounded-lg border px-2 py-1.5 text-center text-xs font-bold transition ${ratio === item.ratio ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-black/12 text-white/58 hover:border-white/25 hover:text-white"}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
            {!isHeadshotMode && !isHero && (
              <p className="mt-2 text-xs leading-5 text-white/50">Auto keeps the source feel. Square and landscape sizes may use more credits.</p>
            )}
          </div>
        )}

        {showEditAreaControls && (
          <div className={`${isHero ? "mb-3" : "mb-4"} rounded-2xl border border-white/10 bg-white/[0.035] p-3`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Choose edit area</p>
              <button type="button" onClick={() => { setEditScope("whole"); setEditRegion(null); }} className="text-xs font-semibold text-white/55 hover:text-white">Clear selection</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setEditScope("whole"); setEditRegion(null); }} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${editScope === "whole" ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-black/20 text-white/70 hover:border-white/25"}`}>Whole image</button>
              <button type="button" onClick={() => { setEditScope("selected"); if (uploadedImage && !editRegion) setEditRegion({ x: 24, y: 24, width: 38, height: 34 }); }} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${editScope === "selected" ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014]" : "border-white/10 bg-black/20 text-white/70 hover:border-white/25"}`}>Select area to edit</button>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/50">{uploadedImage ? "Draw directly on the large preview to mark the part you want to change." : "Upload an image first to choose an edit area."}</p>
          </div>
        )}

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/70" htmlFor="prompt">{editorOnly ? "Step 2 · Choose cleanup" : isHero ? (mode === "edit" ? (task === "Professional headshot" ? "Optional headshot instructions" : "Describe the edit") : "Describe your image") : mode === "edit" ? "Describe the edit" : "Prompt"}</label>
          {!hidePromptLibraryLink && !(isHero && lockedMode === "edit") && <a href="/prompts" className="text-xs font-bold text-[#86EFAC] no-underline transition hover:text-[#A7F3D0]">Browse prompt library →</a>}
        </div>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={promptPlaceholder}
          className={`${isHero ? (isHeadshotOnly ? "min-h-[156px] p-4 text-sm leading-6" : "min-h-[132px] p-4 text-sm leading-6") : editorOnly ? "min-h-[104px] p-4 text-sm leading-6" : "min-h-[176px] p-5 text-base leading-7"} w-full resize-none rounded-2xl border border-white/14 bg-[#100C08] text-white outline-none ring-[#86EFAC]/25 placeholder:text-white/40 transition focus:border-[#86EFAC]/70 focus:ring-4`}
        />
        {isHeadshotMode && uploadedImage && (
          <p className="mt-2 rounded-2xl border border-[#86EFAC]/20 bg-[#102014]/45 px-3 py-2 text-xs leading-5 text-[#C8FADC]">
            Headshot preprocessing is on: we first crop toward the face and upper torso, then change outfit, background, and lighting around the same person.
          </p>
        )}

        {(!isHero || mode === "text") && <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={clearPromptChoices} className={`rounded-full border ${isHero ? "px-3 py-2 text-xs" : "px-3 py-2 text-sm"} font-semibold transition ${!task && !selectedStyle && !selectedLighting && !selectedShot && !ratio ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014] shadow-[0_0_0_1px_rgba(134,239,172,0.28)]" : "border-white/10 bg-white/[0.035] text-white/58 hover:border-white/25 hover:text-white"}`}>{!task && !selectedStyle && !selectedLighting && !selectedShot && !ratio ? "✓ Write my own" : "Write my own"}</button>
          {visiblePromptTasks.map((item) => (
            <button type="button" key={item.label} onClick={() => applyTask(item)} className={`rounded-full border ${isHero ? "px-3 py-2 text-xs" : "px-3 py-2 text-sm"} font-semibold transition ${task === item.label ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014] shadow-[0_0_0_1px_rgba(134,239,172,0.28)]" : "border-white/10 bg-white/[0.035] text-white/58 hover:border-white/25 hover:text-white"}`}>{task === item.label ? `✓ ${item.label}` : item.label}</button>
          ))}
        </div>}

        {isHero && compactPromptBuilder && mode === "text" && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/82">Choose the look</p>
            </div>
            <div className="space-y-2.5">
              {compactOptionGroups.map((group) => {
                const isExpanded = expandedLookGroups[group.kind];
                return (
                  <div key={group.label} className="rounded-2xl border border-white/[0.055] bg-[#100C08]/38 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F4DFC8]/72">{group.label}</p>
                      {group.overflowOptions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandedLookGroups((current) => ({ ...current, [group.kind]: !current[group.kind] }))}
                          className="rounded-full border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/46 transition hover:border-[#D4A574]/35 hover:bg-[#D4A574]/8 hover:text-[#F4DFC8]/82"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? `Show fewer ${group.moreLabel} −` : `More ${group.moreLabel} +`}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.displayedOptions.map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => applyPromptModifier(group.kind, option, group.value, group.setter)}
                          className={`min-h-8 rounded-full border px-3 py-1.5 text-[11px] font-semibold leading-none transition ${group.value === option ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014] shadow-[0_0_0_1px_rgba(134,239,172,0.28)]" : "border-white/10 bg-black/16 text-white/62 hover:border-[#D4A574]/38 hover:bg-white/[0.04] hover:text-white"}`}
                        >
                          {group.value === option ? `✓ ${option}` : option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mode === "text" && <div className={`${isHero ? "mt-4" : "mt-5"}`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">{isHero ? "Choose image size" : "Ratio"}</p>
          <div className={`${isHero ? "grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-black/14 p-1.5 sm:grid-cols-7" : "grid-cols-4 gap-2"} grid`}>
            {visibleRatios.map((item) => (
              <button type="button" key={item.ratio} onClick={() => setRatio(item.ratio)} className={`rounded-xl border px-2 ${isHero ? "py-1.5 text-xs" : "py-2 text-xs"} text-center font-semibold transition ${ratio === item.ratio ? "border-[#86EFAC] bg-[#86EFAC] text-[#102014] shadow-[0_0_0_1px_rgba(134,239,172,0.28)]" : "border-transparent bg-black/12 text-white/60 hover:border-white/18 hover:bg-white/[0.04] hover:text-white"}`}>
                <span className="block">{ratio === item.ratio ? `✓ ${item.label}` : item.label}</span>
                {!isHero && <span className="mt-1 block font-mono text-[10px] opacity-75">{item.textCredits} cr</span>}
              </button>
            ))}
          </div>
          {!isHero && <p className="mt-2 text-xs leading-5 text-white/50">Auto keeps the source feel for reference edits. Square and landscape sizes use more credits because the image API bills by rounded megapixels.</p>}
        </div>}

        <div className={`${isHero ? "sticky bottom-0 z-10 -mx-4 mt-4 border-t border-white/10 bg-[#1E1711]/96 px-4 py-3 shadow-[0_-18px_32px_rgba(0,0,0,0.24)] backdrop-blur" : "mt-5 flex flex-col gap-2"} flex flex-col gap-2`}>
          {isHeadshotMode && (
            <p className="rounded-2xl border border-[#86EFAC]/16 bg-[#102014]/35 px-3 py-2 text-center text-xs font-semibold text-[#C8FADC]">
              Current output: {currentQuote.sizeLabel} · {currentQuote.creditsCharged} credits
            </p>
          )}
          {authenticated && editorOnly && needsUpload ? (
            <label htmlFor="upload-image" className="cursor-pointer rounded-full bg-[#86EFAC] px-5 py-3 text-center text-base font-bold text-[#102014] transition hover:bg-[#A7F3D0]">
              Upload photo to start
            </label>
          ) : authenticated ? (
            <>
              <button type="button" onClick={runGenerate} disabled={!canGenerate} className="rounded-full bg-[#86EFAC] px-5 py-3 text-base font-bold text-[#102014] transition hover:bg-[#A7F3D0] disabled:cursor-not-allowed disabled:opacity-45">
                {state === "processing" ? (mode === "edit" ? "Editing image…" : "Generating image…") : needsUpload ? "Upload photo to start" : effectivePrompt.trim().length < 20 ? (mode === "edit" ? "Describe the edit" : "Write or choose a prompt") : mode === "edit" && task === "Professional headshot" ? `Create professional headshot — ${currentQuote.creditsCharged} credits` : mode === "edit" ? `Generate edit — ${currentQuote.creditsCharged} credits` : `Generate image — ${currentQuote.creditsCharged} credits`}
              </button>
              {(uploadedImage || generatedImage) && (
                <a href="/account/history" className="rounded-full border border-[#86EFAC]/35 bg-[#86EFAC]/10 px-5 py-3 text-center text-sm font-bold text-[#C8FADC] no-underline transition hover:border-[#86EFAC]/70 hover:bg-[#86EFAC]/15">
                  View generation history
                </a>
              )}
            </>
          ) : (
            <a href={mode === "edit" ? `/login?next=${encodeURIComponent(editLoginPath)}` : "/login?next=/generate"} className="rounded-full bg-[#86EFAC] px-5 py-3 text-center text-sm font-bold text-[#102014] no-underline transition hover:bg-[#A7F3D0]">{mode === "text" ? "Sign in to generate free" : task === "Professional headshot" ? "Sign in and generate headshot" : "Sign in to edit free"}</a>
          )}
          {uploadedImage && <button type="button" onClick={removePhoto} className="rounded-full border border-white/12 px-5 py-3 text-sm font-bold text-white/75 transition hover:border-white/30">Remove photo</button>}
        </div>

        <p className="mt-3 text-xs leading-5 text-white/55">
          {!authenticated
            ? "3 free credits after sign-in. No payment required. Credits are used only when you generate or edit an image."
            : needsUpload
              ? isHeadshotOnly
                ? "Upload a face photo first to start the professional headshot flow."
                : lockedMode === "edit"
                  ? "Upload a photo first. This page is for editing uploaded images, not text-to-image generation."
                  : "Upload a reference image first, or switch to Create from Text."
              : creditsRemaining < currentQuote.creditsCharged
                ? `This request needs ${currentQuote.creditsCharged} credits. You have ${creditsRemaining} credits.`
                : isHeadshotMode
                  ? `Professional headshot uses ${currentQuote.creditsCharged} credits. We keep your face as the anchor while replacing outfit, background, and framing.`
                  : mode === "edit"
                    ? `Reference edit uses ${currentQuote.creditsCharged} credits. The uploaded image is treated as the visual anchor.`
                  : `Text-to-image uses ${currentQuote.creditsCharged} credits for the selected size.`}
        </p>
      </aside>

      <section className={`relative min-w-0 bg-[radial-gradient(circle_at_50%_0%,rgba(134,239,172,0.16),transparent_30%),linear-gradient(180deg,#15110C_0%,#0B0907_100%)] ${isHero ? (uploadedImage ? "min-h-[760px] p-3 md:p-5 xl:p-6" : "min-h-[500px] p-3 md:p-5 xl:p-6") : "min-h-[520px] p-4 md:p-6"}`}>
        <div className={`${isHero || editorOnly ? "hidden" : "mb-5"} flex items-center justify-between gap-3 text-xs text-white/55`}>
          <span className="ml-auto">{editorOnly ? "Photo edit workflow" : mode === "edit" ? "Edit workflow" : "Prompt workflow"} · {currentQuote.sizeLabel}</span>
        </div>
        {!hidePreviewIntro && <div className={`${isHero ? "mb-3" : "mb-5"}`}>
          {isHero ? (
            <div>
              <p className="sr-only">Reference-first AI Editor</p>
              <PreviewHeadingTag className="mt-1 max-w-4xl font-heading text-[2.55rem] font-normal leading-[1.02] tracking-[-0.05em] text-white md:text-[3.45rem] xl:text-[3.75rem]">
                {mode === "edit" ? "Edit uploaded images with AI" : compactPromptBuilder ? "Generate AI images with ready-made prompts" : "Create AI images from ready prompts"}
              </PreviewHeadingTag>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/76">{mode === "edit" ? "Upload a photo, describe the change you want, and compare the before-and-after result before downloading." : compactPromptBuilder ? "Pick a prompt, customize the style, lighting, shot, and size, then create a polished AI image in seconds." : "Pick a proven prompt, adjust the text if needed, and generate a polished image without starting from a blank page."}</p>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#86EFAC]">AI Editor RSP</p>
              <h3 className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] text-[#86EFAC] md:text-5xl">{editorOnly ? "See what gets removed" : mode === "edit" ? "AI Image Editor" : "AI Image Generator"}</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/68">{editorOnly ? "Drag the divider to compare the original photo with the cleaned result." : mode === "edit" ? "Upload a photo, choose the whole image or a selected redraw area, describe the change, then preview and download the result." : "Start from a ready prompt, adjust the image details, then generate and download a polished AI image."}</p>
            </div>
          )}

        </div>}

        <div className={`${isHero ? "mt-2" : "mt-6"} mx-auto max-w-[1280px] overflow-hidden rounded-[28px] border border-white/10 bg-black/35 p-2 md:p-3 shadow-2xl`}>
          {mode === "text" ? (
            <div className={`relative ${isHero ? "aspect-[16/6.8]" : "aspect-[16/8.5]"} overflow-hidden rounded-[22px] bg-[#241B13]`}>
              <img src={generatedImage || previewImage} alt="Generated image preview" className={`h-full w-full object-cover transition ${generatedImage ? "brightness-105 contrast-105 saturate-110" : "scale-[1.02] opacity-55 brightness-90 saturate-90"}`} draggable={false} />
              <div className={`absolute inset-0 ${generatedImage ? "bg-gradient-to-t from-black/30 via-transparent to-black/12" : "bg-[radial-gradient(circle_at_center,rgba(134,239,172,0.14),rgba(0,0,0,0.46)_54%,rgba(0,0,0,0.68))]"}`} />
              <span className="absolute left-4 top-4 rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white">{generatedImage ? "Generated" : "Preview reference"}</span>
              {state === "processing" && <div className="absolute inset-0 flex items-center justify-center bg-black/35"><div className="rounded-2xl border border-white/15 bg-black/70 px-5 py-3 text-sm font-semibold text-white">Generating image…</div></div>}
              {state === "failed" && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-red-400/35 bg-red-950/70 p-4 text-center text-sm text-red-100">{error || "Generation failed. Please adjust the prompt and try again."}</div></div>}
              {state === "ready" && !generatedImage && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-white/15 bg-black/70 p-4 text-center text-sm text-white">Job submitted. Request {jobId?.slice(0, 10)}…</div></div>}
              {state === "idle" && !generatedImage && <div className="absolute inset-0 flex items-center justify-center p-5 text-center"><div className={`${isHero ? "max-w-[360px] p-4" : "max-w-lg p-5"} rounded-[26px] border border-white/14 bg-black/52 shadow-[0_22px_70px_rgba(0,0,0,0.38)] backdrop-blur-md`}><div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#86EFAC]/70" /><p className={`${isHero ? "text-[1.35rem]" : "text-2xl"} font-heading font-normal leading-tight tracking-[-0.03em] text-white`}>Start with a prompt, then generate</p><p className="mt-2 text-sm leading-6 text-white/70">Choose a ready prompt or write your own. Refine the look, then create.</p></div></div>}
            </div>
          ) : uploadedImage ? (
            <div className={`relative flex ${isHero ? "min-h-[620px]" : "min-h-[320px]"} items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_center,rgba(134,239,172,0.12),rgba(36,27,19,0.92)_48%,rgba(10,15,12,0.98))] p-3 md:p-4`}>
              <div
                className={`${generatedImage ? "cursor-ew-resize" : editScope === "selected" ? "cursor-crosshair" : ""} relative max-h-[min(76vh,760px)] max-w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#F3E8DA]/10 shadow-[0_28px_80px_rgba(0,0,0,0.42)] touch-none select-none`}
                style={{ aspectRatio: editPreviewAspect, height: editPreviewAspect < 1 ? "min(76vh,760px)" : "auto", width: editPreviewAspect >= 1 ? "100%" : "auto" }}
                role={generatedImage ? "slider" : editScope === "selected" ? "application" : undefined}
                aria-label={generatedImage ? "Drag to compare before and after edit" : editScope === "selected" ? "Draw edit area on uploaded image" : undefined}
                aria-valuemin={generatedImage ? 12 : undefined}
                aria-valuemax={generatedImage ? 88 : undefined}
                aria-valuenow={generatedImage ? comparePosition : undefined}
                tabIndex={generatedImage ? 0 : undefined}
                onPointerDown={(event) => { if (generatedImage) startCompareDrag(event); else if (editScope === "selected") beginRegionSelect(event); }}
                onPointerMove={(event) => { if (generatedImage && isDraggingCompare) updateComparePosition(event); else if (!generatedImage && editScope === "selected") updateRegionSelect(event); }}
                onPointerUp={(event) => { if (generatedImage) stopCompareDrag(event); else if (editScope === "selected") endRegionSelect(event); }}
                onPointerCancel={(event) => { if (generatedImage) stopCompareDrag(event); else if (editScope === "selected") endRegionSelect(event); }}
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
                {generatedImage && <><span className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">Before · uploaded photo</span><span className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">{isHeadshotMode ? "After · professional headshot" : "After · generated result"}</span><span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/62 px-4 py-1.5 text-xs font-bold text-white/85 shadow-lg backdrop-blur-sm">Drag to compare before / after</span><div className="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.55)]" style={{ left: `${comparePosition}%` }} /><div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl" style={{ left: `${comparePosition}%` }}>↔</div></>}
                {!generatedImage && editScope === "selected" && editRegion && (
                  <div className="pointer-events-none absolute rounded-lg border-2 border-[#86EFAC] bg-[#86EFAC]/10 shadow-[0_0_22px_rgba(134,239,172,0.32)]" style={{ left: `${editRegion.x}%`, top: `${editRegion.y}%`, width: `${editRegion.width}%`, height: `${editRegion.height}%` }} />
                )}
                {!generatedImage && (
                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-white/78">
                    <span className="rounded-full border border-white/12 bg-black/55 px-3 py-1.5 backdrop-blur-sm">{editScope === "selected" ? "Drag on this large preview to choose the edit area" : "Whole image will be edited"}</span>
                    {editScope === "selected" && editRegion && <span className="rounded-full border border-[#86EFAC]/35 bg-[#102014]/75 px-3 py-1.5 text-[#C8FADC] backdrop-blur-sm">Selected area</span>}
                  </div>
                )}
                {state === "processing" && <div className="absolute inset-0 flex items-center justify-center bg-black/35"><div className="rounded-2xl border border-white/15 bg-black/70 px-5 py-3 text-sm font-semibold text-white">Generating image…</div></div>}
                {state === "failed" && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-red-400/35 bg-red-950/70 p-4 text-center text-sm text-red-100">{error || "Generation failed. Please adjust the prompt and try again."}</div></div>}
                {state === "ready" && !generatedImage && <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6"><div className="max-w-sm rounded-2xl border border-white/15 bg-black/70 p-4 text-center text-sm text-white">Job submitted. Request {jobId?.slice(0, 10)}…</div></div>}
              </div>
            </div>
          ) : (
            <div className={`relative ${isHero ? "min-h-[420px] md:min-h-[520px]" : "min-h-[320px]"} overflow-hidden rounded-[22px] border border-white/10 bg-[#DED4C7] shadow-[0_28px_90px_rgba(0,0,0,0.35)]`}>
              {isHeadshotMode ? (
                <div className="relative h-full min-h-[420px] overflow-hidden rounded-[22px] bg-[linear-gradient(112deg,#17110C_0%,#2A2118_24%,#D8CEC0_24%,#EEE6DA_100%)] md:min-h-[520px]">
                  <img src={previewImage} alt="Professional headshot example" className="absolute inset-y-0 right-0 h-full w-full object-contain object-right-bottom brightness-105 contrast-105 saturate-105 md:w-[78%]" draggable={false} />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,8,6,0.92)_0%,rgba(16,12,8,0.74)_24%,rgba(16,12,8,0.14)_52%,rgba(16,12,8,0.02)_100%)]" />
                  <span className="absolute left-5 top-5 rounded-full border border-[#86EFAC]/35 bg-[#102014]/75 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C8FADC] shadow-lg backdrop-blur-sm">Example result</span>
                  <div className="absolute bottom-5 left-5 max-w-[300px] text-left md:bottom-7 md:left-7">
                    <p className="font-heading text-3xl font-normal leading-[0.98] tracking-[-0.045em] text-white md:text-4xl">Clean professional headshot</p>
                    <p className="mt-3 max-w-[280px] text-sm leading-6 text-white/70">Upload your photo to generate the same polished business profile style.</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-white/78">
                      <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 backdrop-blur-sm">LinkedIn</span>
                      <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 backdrop-blur-sm">Resume</span>
                      <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 backdrop-blur-sm">Business profile</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative h-full min-h-[420px] cursor-ew-resize touch-none select-none overflow-hidden rounded-[22px] bg-[#17110C] md:min-h-[520px]"
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
                  <img src={editorOnly ? editorCleanupDemoBefore : previewImage} alt={editorOnly ? "Before travel photo with background tourists" : "Before reference demo"} className="absolute inset-0 h-full w-full object-cover opacity-90 brightness-95 saturate-95" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-black/20" />
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}>
                    <img src={editorOnly ? editorCleanupDemoAfter : previewImage} alt={editorOnly ? "After AI cleanup with tourists removed" : "After edited result demo"} className="h-full w-full object-cover brightness-110 contrast-110 saturate-115" draggable={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-black/10" />
                  </div>
                  <span className="absolute left-5 top-5 rounded-full border border-white/14 bg-black/62 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-sm">Before · example</span>
                  <span className="absolute right-5 top-5 rounded-full border border-[#86EFAC]/35 bg-[#102014]/78 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#C8FADC] shadow-lg backdrop-blur-sm">After · AI edit</span>
                  {!editorOnly && (
                    <div className="absolute bottom-5 left-5 max-w-[380px] text-left md:bottom-7 md:left-7">
                      <p className="font-heading text-3xl font-normal leading-[0.98] tracking-[-0.045em] text-white md:text-4xl">Preview your edit before download</p>
                      <p className="mt-3 max-w-[330px] text-sm leading-6 text-white/72">Upload your photo to see your own before/after comparison here.</p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 w-px bg-white/85 shadow-[0_0_18px_rgba(255,255,255,0.55)]" style={{ left: `${comparePosition}%` }} />
                  <div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl" style={{ left: `${comparePosition}%` }}>↔</div>
                </div>
              )}
            </div>
          )}
        </div>

        {generatedImage && (
          <div className={`${isHero ? "mt-3 p-3" : "mt-4 p-4"} mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/62 md:flex-row md:items-center md:justify-between`}>
          {!isHero && <p><strong className="text-white">Result ready:</strong> Preview the edited image, download it, open the full-size file, or keep editing from this result.</p>}
          <div className="flex flex-wrap gap-2">
            <a href={generatedImage} download={`ai-editor-rsp-${(ratio || currentQuote.ratio).replace(":", "x")}.jpg`} className="rounded-full bg-[#86EFAC] px-4 py-2 text-xs font-bold text-[#102014] no-underline">{mode === "edit" ? "Download edited image" : "Download image"}</a>
            <a href={generatedImage} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white no-underline">Open full size</a>
            <button type="button" onClick={editGeneratedResult} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition hover:border-white/35">Edit this result</button>
            <button type="button" onClick={clearResult} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 transition hover:border-white/35">{mode === "text" ? "Try another prompt" : "Start over"}</button>
          </div>
          </div>
        )}
        {!generatedImage && (!editorOnly || Boolean(uploadedImage)) && (
          <div className={`${isHero ? "mt-3 p-3" : "mt-4 p-4"} mx-auto grid max-w-5xl gap-3 rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(134,239,172,0.028)_55%,rgba(0,0,0,0.12))] text-xs text-white/64 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:grid-cols-[1fr_auto] sm:items-center`}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#86EFAC]/22 bg-[#86EFAC]/9 text-sm font-bold text-[#C8FADC] shadow-[0_0_24px_rgba(134,239,172,0.08)]">↳</span>
              <div>
                <p className="text-sm font-bold text-white/86">Output tray</p>
                <p className="mt-0.5 text-xs text-white/48">Actions unlock when a result is ready.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/42">
              {["Preview", "Download", "Edit again"].map((action) => (
                <span key={action} className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/16 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/22" />
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}
        {showHeadshotSteps && (
          <div className={`${isHero ? "mt-3" : "mt-4"} mx-auto grid max-w-5xl gap-3 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className={`${isHero ? "p-3" : "p-4"} rounded-2xl border border-[#86EFAC]/14 bg-[#102014]/20`}>
              <p className="text-sm font-bold text-[#C8FADC]">Simple headshot workflow</p>
              <p className="mt-2 text-sm leading-6 text-white/64">
                Upload photo <span className="text-[#86EFAC]">→</span> add optional outfit or background details <span className="text-[#86EFAC]">→</span> generate a {currentQuote.ratio} professional headshot.
              </p>
              <p className="mt-2 text-xs font-semibold text-white/42">Current request: {currentQuote.creditsCharged} credits</p>
            </div>
            <div className={`${isHero ? "p-3" : "p-4"} rounded-2xl border border-white/10 bg-white/[0.035]`}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-white/82">Best results checklist</p>
                <span className="rounded-full border border-[#86EFAC]/20 bg-[#86EFAC]/10 px-2.5 py-1 text-xs font-semibold text-[#C8FADC]">Photo tips</span>
              </div>
              <div className="grid gap-2 text-sm leading-6 text-white/66 sm:grid-cols-2">
                {["Clear front-facing photo", "Good lighting, no sunglasses", "Face not heavily filtered", "Simple background works best"].map((tip) => (
                  <div key={tip} className="flex items-start gap-2 rounded-xl bg-black/12 px-3 py-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#86EFAC]" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


