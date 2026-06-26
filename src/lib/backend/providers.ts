import { providerSafetyOptions, safePromptInstruction } from "@/lib/backend/safety";
import { ratioToImageSize } from "@/lib/generation-pricing";

const FAL_QUEUE_BASE = "https://queue.fal.run";

export type GenerateRequest = {
  prompt: string;
  style?: string;
  ratio?: string;
  imageDataUrl?: string;
  editRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export function falConfigured() {
  return Boolean(process.env.FAL_API_KEY || process.env.FAL_KEY);
}

export function creemConfigured() {
  return Boolean(
    process.env.CREEM_API_KEY
      && process.env.CREEM_WEBHOOK_SECRET
      && process.env.CREEM_STARTER_PRODUCT_ID
      && process.env.CREEM_CREATOR_PRODUCT_ID
      && process.env.CREEM_STUDIO_PRODUCT_ID,
  );
}

function falKey() {
  return process.env.FAL_API_KEY || process.env.FAL_KEY || "";
}

function falModel() {
  return process.env.FAL_MODEL || "fal-ai/flux/dev";
}

function falQueueRequestModel(model = falModel()) {
  // fal.ai can submit on a specific model route but return queue URLs under
  // the model family route. Match that family route for polling existing jobs.
  if (model.startsWith("fal-ai/flux-pro/")) return "fal-ai/flux-pro";
  if (model.startsWith("fal-ai/flux/")) return "fal-ai/flux";
  return model;
}

function falImageToImageModel() {
  return process.env.FAL_IMAGE_TO_IMAGE_MODEL || "fal-ai/flux/dev/image-to-image";
}

function falHeadshotModel() {
  return process.env.FAL_HEADSHOT_IMAGE_MODEL || process.env.FAL_IMAGE_TO_IMAGE_MODEL || "fal-ai/flux/dev/image-to-image";
}

function isHeadshotInput(input: GenerateRequest) {
  return Boolean(input.imageDataUrl && input.style === "Professional headshot");
}

function submitModel(input: GenerateRequest) {
  if (isHeadshotInput(input)) return falHeadshotModel();
  return input.imageDataUrl ? falImageToImageModel() : falModel();
}

type FalQueuePayload = {
  detail?: string;
  request_id?: string;
  requestId?: string;
  status_url?: string;
  response_url?: string;
  [key: string]: unknown;
};

function jsonObject(value: unknown): FalQueuePayload {
  return value && typeof value === "object" ? value as FalQueuePayload : {};
}

function numericEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function clampStrength(value: number) {
  return Math.min(0.9, Math.max(0.1, value));
}

export function buildFalRequestBody(input: GenerateRequest) {
  const prompt = input.prompt?.trim();
  const isHeadshotEdit = isHeadshotInput(input);
  const model = submitModel(input);
  const usesKontext = model.includes("kontext");
  const referenceInstruction = input.imageDataUrl
    ? isHeadshotEdit
      ? [
          "The uploaded image is the mandatory identity anchor. Keep the exact same adult person as the source photo.",
          "Preserve recognizable face identity, facial structure, age, skin tone, hairstyle/hairline, expression, and natural facial details. Identity preservation has higher priority than changing outfit, background, or composition.",
          "Treat the submitted reference as a headshot-preprocessed crop, not as a composition to preserve. Produce a tight shoulders-up LinkedIn/business headshot with the face large, centered, and clearly recognizable.",
          "Transform presentation details into a realistic professional profile photo: clean blazer or requested professional outfit, no crossbody bag, no visible hands, no lower body, polished grooming, plain neutral grey studio background, no trees, no street, no outdoor park, eye-level camera angle, natural skin texture, sharp eyes, trustworthy business portrait.",
          "Do not invent a new person, do not change ethnicity, do not change facial geometry, do not over-beautify into a different face, and do not keep hats/sunglasses/casual fashion when the user asks for professional attire.",
        ].join(" ")
      : "Use the uploaded image as the primary reference. Preserve the recognizable subject, pose/composition, major colors, and visual identity unless the user explicitly asks to change them. Apply the prompt as an edit or style transformation to that reference image; do not replace it with an unrelated scene."
    : "Create a new image from the user-provided text prompt.";
  const regionInstruction = input.imageDataUrl && input.editRegion
    ? `The user selected a local redraw area on the uploaded image: left ${input.editRegion.x.toFixed(1)}%, top ${input.editRegion.y.toFixed(1)}%, width ${input.editRegion.width.toFixed(1)}%, height ${input.editRegion.height.toFixed(1)}%. Prioritize changes inside this selected rectangle and keep the unselected area as unchanged as possible.`
    : "";
  const enrichedPrompt = [
    referenceInstruction,
    regionInstruction,
    prompt,
    input.style ? `Style direction: ${input.style}.` : "",
    safePromptInstruction(),
    "Avoid text overlays unless explicitly requested.",
  ].filter(Boolean).join("\n");
  const editStrength = isHeadshotEdit
    ? clampStrength(numericEnv("FAL_HEADSHOT_IDENTITY_STRENGTH", usesKontext ? 0.76 : 0.58))
    : clampStrength(numericEnv("FAL_REFERENCE_EDIT_STRENGTH", 0.45));

  const baseBody = {
    prompt: enrichedPrompt,
    image_size: ratioToImageSize(input.ratio),
    num_images: 1,
    output_format: "jpeg",
    ...providerSafetyOptions(),
  };

  if (!input.imageDataUrl) return baseBody;

  return usesKontext
    ? {
        ...baseBody,
        image_url: input.imageDataUrl,
        image_prompt_strength: editStrength,
        guidance_scale: numericEnv("FAL_HEADSHOT_GUIDANCE_SCALE", 6),
      }
    : {
        ...baseBody,
        image_url: input.imageDataUrl,
        strength: editStrength,
      };
}

export async function submitFalGeneration(input: GenerateRequest) {
  const prompt = input.prompt?.trim();
  if (!prompt || prompt.length < 20) {
    return { ok: false as const, status: 400, error: "Prompt must be at least 20 characters." };
  }
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }

  const requestBody = buildFalRequestBody(input);
  const model = submitModel(input);
  const response = await fetch(`${FAL_QUEUE_BASE}/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = jsonObject(await response.json().catch(() => ({})));
  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: typeof data?.detail === "string" ? data.detail : "fal.ai generation request failed.",
      provider: "fal.ai",
    };
  }

  return {
    ok: true as const,
    provider: "fal.ai",
    model,
    requestId: data.request_id || data.requestId || null,
    statusUrl: data.status_url || null,
    responseUrl: data.response_url || null,
    raw: data,
  };
}

export async function getFalStatus(requestId: string, model?: string | null) {
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }
  const requestModel = falQueueRequestModel(model || falModel());
  const response = await fetch(`${FAL_QUEUE_BASE}/${requestModel}/requests/${encodeURIComponent(requestId)}/status`, {
    headers: { Authorization: `Key ${falKey()}` },
  });
  const data = jsonObject(await response.json().catch(() => ({})));
  if (!response.ok) return { ok: false as const, status: response.status, error: "fal.ai status request failed.", raw: data };
  return { ok: true as const, provider: "fal.ai", model: requestModel, raw: data };
}

export async function getFalResult(requestId: string, model?: string | null) {
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }
  const requestModel = falQueueRequestModel(model || falModel());
  const response = await fetch(`${FAL_QUEUE_BASE}/${requestModel}/requests/${encodeURIComponent(requestId)}`, {
    headers: { Authorization: `Key ${falKey()}` },
  });
  const data = jsonObject(await response.json().catch(() => ({})));
  if (!response.ok) return { ok: false as const, status: response.status, error: "fal.ai result request failed.", raw: data };
  return { ok: true as const, provider: "fal.ai", model: requestModel, raw: data };
}
