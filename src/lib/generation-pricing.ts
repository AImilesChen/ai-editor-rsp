export type GenerationRatio = "1:1" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9";

export type GenerationQuote = {
  ratio: GenerationRatio;
  requestedRatio: string;
  imageSize: "square_hd" | "portrait_4_3" | "landscape_4_3" | "portrait_16_9" | "landscape_16_9";
  sizeLabel: string;
  sizeMultiplier: 1 | 2;
  mode: "text-to-image" | "image-to-image";
  creditsCharged: number;
  costBasis: "$0.025/MP text-to-image, $0.03/MP image-to-image; fal.ai rounds image output up to full megapixels";
};

const SUPPORTED_RATIOS: GenerationRatio[] = ["4:5", "5:4", "3:4", "4:3", "9:16", "16:9", "1:1"];

export function normalizeGenerationRatio(ratio?: string): GenerationRatio {
  if (ratio && SUPPORTED_RATIOS.includes(ratio as GenerationRatio)) return ratio as GenerationRatio;
  return "4:5";
}

export function ratioToImageSize(ratio?: string): GenerationQuote["imageSize"] {
  switch (normalizeGenerationRatio(ratio)) {
    case "1:1":
      return "square_hd";
    case "16:9":
      return "landscape_16_9";
    case "9:16":
      return "portrait_16_9";
    case "4:3":
    case "5:4":
      return "landscape_4_3";
    case "3:4":
    case "4:5":
    default:
      return "portrait_4_3";
  }
}

function generationSizeLabel(requestedRatio: string, imageSize: GenerationQuote["imageSize"]) {
  if (requestedRatio === "auto") return "Auto / source ratio";
  if (imageSize === "square_hd") return "Square HD";
  if (imageSize.startsWith("portrait")) return `Portrait ${requestedRatio}`;
  return `Landscape ${requestedRatio}`;
}

export function quoteGenerationCredits(input: { ratio?: string; imageDataUrl?: string | null }): GenerationQuote {
  const requestedRatio = input.ratio || "4:5";
  const ratio = normalizeGenerationRatio(requestedRatio);
  const mode = input.imageDataUrl ? "image-to-image" : "text-to-image";
  const imageSize = ratioToImageSize(ratio);
  const isSmallSize = imageSize === "portrait_4_3" || imageSize === "landscape_4_3";
  const sizeMultiplier: 1 | 2 = isSmallSize ? 1 : 2;
  const baseCredits = mode === "image-to-image" ? 2 : 1;
  return {
    ratio,
    requestedRatio,
    imageSize,
    sizeLabel: generationSizeLabel(requestedRatio, imageSize),
    sizeMultiplier,
    mode,
    creditsCharged: baseCredits * sizeMultiplier,
    costBasis: "$0.025/MP text-to-image, $0.03/MP image-to-image; fal.ai rounds image output up to full megapixels",
  };
}

export const GENERATION_RATIOS: Array<{ ratio: "auto" | GenerationRatio; label: string; textCredits: number; imageCredits: number; note?: string }> = [
  { ratio: "auto", label: "Auto", textCredits: quoteGenerationCredits({ ratio: "4:5" }).creditsCharged, imageCredits: quoteGenerationCredits({ ratio: "4:5", imageDataUrl: "data:image/png;base64," }).creditsCharged, note: "Keep source feel" },
  ...SUPPORTED_RATIOS.map((ratio) => ({
    ratio,
    label: ratio,
    textCredits: quoteGenerationCredits({ ratio }).creditsCharged,
    imageCredits: quoteGenerationCredits({ ratio, imageDataUrl: "data:image/png;base64," }).creditsCharged,
  })),
];
