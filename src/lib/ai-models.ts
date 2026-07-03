export type AiModelDisclosure = {
  feature: string;
  provider: string;
  model: string;
  notes: string;
};

export function aiModelDisclosures(): AiModelDisclosure[] {
  const textToImageModel = process.env.FAL_MODEL || "fal-ai/flux/dev";
  const editModel = process.env.FAL_IMAGE_TO_IMAGE_MODEL || "fal-ai/nano-banana-pro/edit";
  const headshotModel = process.env.FAL_HEADSHOT_IMAGE_MODEL || process.env.FAL_IMAGE_TO_IMAGE_MODEL || "fal-ai/nano-banana-pro/edit";

  return [
    {
      feature: "Text-to-image generation",
      provider: "fal.ai",
      model: textToImageModel,
      notes: "Used when a user creates a new image from a text prompt.",
    },
    {
      feature: "Uploaded-photo image editing",
      provider: "fal.ai",
      model: editModel,
      notes: "Used for image editor requests that include an uploaded reference image or brush mask.",
    },
    {
      feature: "Professional headshot editing",
      provider: "fal.ai",
      model: headshotModel,
      notes: "Used for headshot requests that transform an uploaded adult reference photo into a professional profile image.",
    },
  ];
}

export function aiModelDisclosureText() {
  return aiModelDisclosures()
    .map((item) => `${item.feature}: ${item.provider} ${item.model}`)
    .join("; ");
}
