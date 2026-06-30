"use client";

import { useState } from "react";

type CleanupExample = {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  alt: string;
  initialPosition?: number;
  caseLabel?: string;
  task?: string;
  result?: string;
};

type ImageEditorExamplesProps = {
  examples: CleanupExample[];
};

function BeforeAfterSlider({ item }: { item: CleanupExample }) {
  const [position, setPosition] = useState(item.initialPosition ?? 50);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-[#eadccd] bg-white shadow-[0_22px_70px_rgba(88,60,38,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(88,60,38,0.17)]">
      <div className="flex items-center justify-between border-b border-[#eadccd] bg-[#fff9f1] px-5 py-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-rsp-secondary">{item.caseLabel}</p>
          <h3 className="mt-1 font-heading text-2xl font-normal tracking-[-0.04em] text-rsp-text md:text-[28px]">{item.title}</h3>
        </div>
        <span className="rounded-full border border-rsp-border bg-white px-3 py-1 text-xs font-bold text-rsp-text shadow-sm">4:3 pair</span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-[#efe5d9]">
        <img src={item.beforeImage} alt={`${item.alt} before edit`} className="absolute inset-0 h-full w-full object-contain" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <img src={item.afterImage} alt={`${item.alt} after edit`} className="absolute inset-0 h-full w-full object-contain" />
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-rsp-text/82 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
          Before
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-emerald-700/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
          After
        </div>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
          <div className="h-full w-[3px] -translate-x-1/2 bg-white shadow-[0_0_18px_rgba(0,0,0,0.35)]" />
          <div className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/94 text-rsp-text shadow-[0_12px_28px_rgba(58,41,30,0.25)] transition duration-300 group-hover:scale-105">
            <span className="text-lg leading-none">↔</span>
          </div>
        </div>

        <input
          aria-label={`Drag to compare before and after: ${item.title}`}
          type="range"
          min="12"
          max="88"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-rsp-text/72 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur md:text-sm">
          Drag to compare
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <p className="text-sm leading-6 text-rsp-muted md:text-base">{item.description}</p>
        <div className="mt-auto grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f8efe4] p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-rsp-secondary">Task</p>
            <p className="mt-1 font-semibold text-rsp-text">{item.task}</p>
          </div>
          <div className="rounded-2xl bg-[#edf7ef] p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Result</p>
            <p className="mt-1 font-semibold text-rsp-text">{item.result}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ImageEditorExamples({ examples }: ImageEditorExamplesProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-2">
      {examples.map((item) => (
        <BeforeAfterSlider key={item.title} item={item} />
      ))}
    </div>
  );
}
