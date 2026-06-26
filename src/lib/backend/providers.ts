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

function falQueueRequestModel() {
  const model = falModel();
  // fal.ai returns queue status/result URLs under fal-ai/flux even when the
  // submission endpoint is fal-ai/flux/dev. Keep non-flux model paths intact.
  if (model.startsWith("fal-ai/flux/")) return "fal-ai/flux";
  return model;
}

function falImageToImageModel() {
  return process.env.FAL_IMAGE_TO_IMAGE_MODEL || "fal-ai/flux/dev/image-to-image";
}

function submitModel(input: GenerateRequest) {
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

export async function submitFalGeneration(input: GenerateRequest) {
  const prompt = input.prompt?.trim();
  if (!prompt || prompt.length < 20) {
    return { ok: false as const, status: 400, error: "Prompt must be at least 20 characters." };
  }
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }

  const isHeadshotEdit = input.imageDataUrl && input.style === "Professional headshot";
  const referenceInstruction = input.imageDataUrl
    ? isHeadshotEdit
      ? "Use the uploaded image as the primary identity reference. Preserve the same adult person's face, identity, age, facial structure, hairstyle, and natural expression, but transform the portrait into a realistic professional LinkedIn/business headshot. Follow requested outfit/background/lighting details even when they require changing casual clothes, sunglasses, hats, or outdoor backgrounds. Do not keep casual fashion styling if the user asks for professional attire."
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

  const requestBody = {
    prompt: enrichedPrompt,
    image_size: ratioToImageSize(input.ratio),
    num_images: 1,
    output_format: "jpeg",
    ...providerSafetyOptions(),
    ...(input.imageDataUrl ? { image_url: input.imageDataUrl, strength: isHeadshotEdit ? 0.68 : 0.45 } : {}),
  };

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

export async function getFalStatus(requestId: string) {
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }
  const response = await fetch(`${FAL_QUEUE_BASE}/${falQueueRequestModel()}/requests/${encodeURIComponent(requestId)}/status`, {
    headers: { Authorization: `Key ${falKey()}` },
  });
  const data = jsonObject(await response.json().catch(() => ({})));
  if (!response.ok) return { ok: false as const, status: response.status, error: "fal.ai status request failed.", raw: data };
  return { ok: true as const, provider: "fal.ai", model: falModel(), raw: data };
}

export async function getFalResult(requestId: string) {
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }
  const response = await fetch(`${FAL_QUEUE_BASE}/${falQueueRequestModel()}/requests/${encodeURIComponent(requestId)}`, {
    headers: { Authorization: `Key ${falKey()}` },
  });
  const data = jsonObject(await response.json().catch(() => ({})));
  if (!response.ok) return { ok: false as const, status: response.status, error: "fal.ai result request failed.", raw: data };
  return { ok: true as const, provider: "fal.ai", model: falModel(), raw: data };
}
