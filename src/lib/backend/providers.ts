import { providerSafetyOptions, safePromptInstruction } from "@/lib/backend/safety";

const FAL_QUEUE_BASE = "https://queue.fal.run";

export type GenerateRequest = {
  prompt: string;
  style?: string;
  ratio?: string;
  imageDataUrl?: string;
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

function ratioToImageSize(ratio?: string) {
  switch (ratio) {
    case "1:1":
      return "square_hd";
    case "16:9":
      return "landscape_16_9";
    case "3:4":
      return "portrait_4_3";
    case "4:5":
    default:
      return "portrait_4_3";
  }
}

export async function submitFalGeneration(input: GenerateRequest) {
  const prompt = input.prompt?.trim();
  if (!prompt || prompt.length < 20) {
    return { ok: false as const, status: 400, error: "Prompt must be at least 20 characters." };
  }
  if (!falConfigured()) {
    return { ok: false as const, status: 503, error: "FAL_API_KEY is not configured." };
  }

  const enrichedPrompt = [
    prompt,
    input.style ? `Style direction: ${input.style}.` : "",
    safePromptInstruction(),
    "Editorial image generation for a user-provided prompt. Avoid text overlays unless explicitly requested.",
  ].filter(Boolean).join("\n");

  const requestBody = {
    prompt: enrichedPrompt,
    image_size: ratioToImageSize(input.ratio),
    num_images: 1,
    output_format: "jpeg",
    ...providerSafetyOptions(),
    ...(input.imageDataUrl ? { image_url: input.imageDataUrl, strength: 0.82 } : {}),
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

  const data = await response.json().catch(() => ({}));
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
  const data = await response.json().catch(() => ({}));
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
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false as const, status: response.status, error: "fal.ai result request failed.", raw: data };
  return { ok: true as const, provider: "fal.ai", model: falModel(), raw: data };
}
