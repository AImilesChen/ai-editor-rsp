"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import CopyButton from "./CopyButton";
import BeforeAfter from "./BeforeAfter";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";
import { prompts } from "@/lib/data/prompts";
import { promptCategories } from "@/lib/data/categories";

export default function PromptListPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return prompts;
    return prompts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              AI Photo Prompts Library
            </h1>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              Browse 12+ RSP-style AI photo prompts. Copy to ChatGPT or Gemini.
            </p>
          </div>

          <FilterBar
            categories={promptCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {filtered.length === 0 ? (
            <EmptyState
              title="No prompts found"
              subtitle="Try a different category."
              ctaText="Browse all prompts"
              ctaHref="/prompts"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <BeforeAfter
                      beforeGradient="linear-gradient(135deg,#e2e8f0,#cbd5e1)"
                      afterGradient="linear-gradient(135deg,#bfdbfe,#93c5fd)"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-sm text-xs font-medium">
                        {prompt.category}
                      </span>
                      <span className="bg-brand-100 text-brand-500 px-2.5 py-1 rounded-sm text-xs font-medium">
                        {prompt.tool}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-semibold mb-2 leading-tight">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      {prompt.prompt.slice(0, 100)}...
                    </p>
                    <div className="flex gap-2.5">
                      <CopyButton text={prompt.prompt} />
                      <Link
                        href={`/prompts/${prompt.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-neutral-700 border border-neutral-300 no-underline transition-colors hover:bg-neutral-100"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
