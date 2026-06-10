interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeGradient?: string;
  afterGradient?: string;
  beforeImage?: string;
  afterImage?: string;
  image?: string;
  alt?: string;
}

function imageBackground(image?: string, gradient?: string) {
  if (!image) return { background: gradient };
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export default function BeforeAfter({
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  beforeGradient = "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
  afterGradient = "linear-gradient(135deg,#bfdbfe,#93c5fd)",
  beforeImage,
  afterImage,
  image,
  alt = "Before and after preview",
}: BeforeAfterProps) {
  if (image) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full relative bg-cover bg-center"
        style={imageBackground(image)}
      />
    );
  }

  return (
    <div className="flex w-full h-full" role="img" aria-label={alt}>
      <div
        className="flex-1 flex items-center justify-center relative bg-cover bg-center"
        style={imageBackground(beforeImage, beforeGradient)}
      >
        <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-sm text-[11px]">
          {beforeLabel}
        </span>
      </div>
      <div
        className="flex-1 flex items-center justify-center relative bg-cover bg-center"
        style={imageBackground(afterImage, afterGradient)}
      >
        <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-sm text-[11px]">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
