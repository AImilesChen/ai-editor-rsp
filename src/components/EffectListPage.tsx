"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import BeforeAfter from "./BeforeAfter";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";
import { effects } from "@/lib/data/effects";
import { effectCategories } from "@/lib/data/categories";

export default function EffectListPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return effects;
    return effects.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              Trending AI Photo Effects
            </h1>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              See trending AI photo effects. Before and after comparisons.
            </p>
          </div>

          <FilterBar
            categories={effectCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {filtered.length === 0 ? (
            <EmptyState
              title="No effects found"
              subtitle="Try a different category."
              ctaText="Browse all effects"
              ctaHref="/effects"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((effect) => (
                <div
                  key={effect.id}
                  className="bg-brand-900 text-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <BeforeAfter
                      beforeGradient="linear-gradient(135deg,#334155,#475569)"
                      afterGradient="linear-gradient(135deg,#1e3a5f,#2563eb)"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className="bg-white/10 text-white px-2.5 py-1 rounded-sm text-xs font-medium">
                        {effect.category}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-semibold mb-2 leading-tight text-white">
                      {effect.title}
                    </h3>
                    <p className="text-sm text-neutral-300 mb-4">
                      {effect.description.slice(0, 100)}...
                    </p>
                    <Link
                      href={`/effects/${effect.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white border-[1.5px] border-white/25 no-underline transition-all hover:bg-white/[0.08] hover:border-white/40"
                    >
                      Explore Effect
                    </Link>
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
