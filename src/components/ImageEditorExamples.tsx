"use client";

import { useState } from "react";

type CleanupExample = {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  alt: string;
};

type ImageEditorExamplesProps = {
  examples: CleanupExample[];
};

function BeforeAfterSlider({ item }: { item: CleanupExample }) {
  const [position, setPosition] = useState(52);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[32px] border border-rsp-border bg-rsp-panel shadow-[0_22px_70px_rgba(58,41,30,0.12)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-rsp-surface">
        <img src={item.beforeImage} alt={`${item.alt} before edit`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <img src={item.afterImage} alt={`${item.alt} after edit`} className="h-full w-full object-cover" />
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-rsp-text/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          Before
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-emerald-700/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          After
        </div>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
          <div className="h-full w-[3px] -translate-x-1/2 bg-white shadow-[0_0_18px_rgba(0,0,0,0.35)]" />
          <div className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/92 text-rsp-text shadow-[0_12px_28px_rgba(58,41,30,0.25)]">
            <span className="text-lg leading-none">↔</span>
          </div>
        </div>

        <input
          aria-label={`Drag to compare before and after: ${item.title}`}
          type="range"
          min="8"
          max="92"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-rsp-text/65 px-4 py-2 text-xs font-semibold text-white backdrop-blur md:text-sm">
          Drag to compare
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-heading text-2xl font-normal tracking-[-0.04em] text-rsp-text md:text-[30px]">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-rsp-muted md:text-base">{item.description}</p>
      </div>
    </article>
  );
}

export default function ImageEditorExamples({ examples }: ImageEditorExamplesProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
      {examples.map((item) => (
        <BeforeAfterSlider key={item.title} item={item} />
      ))}
    </div>
  );
}
