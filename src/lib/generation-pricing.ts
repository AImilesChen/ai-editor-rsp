export type GenerationRatio = "1:1" | "3:4" | "4:5" | "16:9";

export type GenerationQuote = {
  ratio: GenerationRatio;
  requestedRatio: string;
  imageSize: "square_hd" | "portrait_4_3" | "landscape_16_9";
  sizeLabel: string;
  sizeMultiplier: 1 | 2;
  mode: "text-to-image" | "image-to-image";
  creditsCharged: number;
  costBasis: "$0.025/MP text-to-image, $0.03/MP image-to-image; fal.ai rounds image output up to full megapixels";
};

const SUPPORTED_RATIOS: GenerationRatio[] = ["4:5", "3:4", "1:1", "16:9"];

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
    case "3:4":
    case "4:5":
    default:
      return "portrait_4_3";
  }
}

export function quoteGenerationCredits(input: { ratio?: string; imageDataUrl?: string | null }): GenerationQuote {
  const requestedRatio = input.ratio || "4:5";
  const ratio = normalizeGenerationRatio(requestedRatio);
  const mode = input.imageDataUrl ? "image-to-image" : "text-to-image";
  const imageSize = ratioToImageSize(ratio);
  const isLowCostPortrait = imageSize === "portrait_4_3";
  const sizeMultiplier: 1 | 2 = isLowCostPortrait ? 1 : 2;
  const baseCredits = mode === "image-to-image" ? 2 : 1;
  return {
    ratio,
    requestedRatio,
    imageSize,
    sizeLabel: requestedRatio === "auto" ? "Auto / source ratio" : isLowCostPortrait ? "Portrait" : imageSize === "square_hd" ? "Square HD" : "Landscape",
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
