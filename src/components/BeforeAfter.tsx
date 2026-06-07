interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeGradient?: string;
  afterGradient?: string;
}

export default function BeforeAfter({
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  beforeGradient = "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
  afterGradient = "linear-gradient(135deg,#bfdbfe,#93c5fd)",
}: BeforeAfterProps) {
  return (
    <div className="flex w-full h-full">
      <div
        className="flex-1 flex items-center justify-center relative"
        style={{ background: beforeGradient }}
      >
        <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-sm text-[11px]">
          {beforeLabel}
        </span>
      </div>
      <div
        className="flex-1 flex items-center justify-center relative"
        style={{ background: afterGradient }}
      >
        <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-sm text-[11px]">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
