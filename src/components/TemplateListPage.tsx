"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";
import AffiliateNote from "./AffiliateNote";
import { templates } from "@/lib/data/templates";
import { templateCategories } from "@/lib/data/categories";

export default function TemplateListPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return templates;
    return templates.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              CapCut Template Library
            </h1>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              Find trending CapCut templates. Bhojpuri, Bengali, Hindi, English. One-click links.
            </p>
          </div>

          <FilterBar
            categories={templateCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {filtered.length === 0 ? (
            <EmptyState
              title="No templates found"
              subtitle="Try a different category."
              ctaText="Browse all templates"
              ctaHref="/templates"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5"
                >
                  <div
                    role="img"
                    aria-label={`${template.title} template preview`}
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url(${template.preview_image})` }}
                  />
                  <div className="p-5">
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-sm text-xs font-medium">
                        {template.category}
                      </span>
                      <span className="bg-brand-100 text-brand-500 px-2.5 py-1 rounded-sm text-xs font-medium">
                        CapCut
                      </span>
                    </div>
                    <h3 className="text-[17px] font-semibold mb-2 leading-tight">
                      {template.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      {template.song_name} by {template.artist}
                    </p>
                    <div className="flex gap-2.5">
                      <a
                        href={template.template_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white bg-brand-500 no-underline transition-colors hover:bg-brand-400"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Use Template
                      </a>
                      <Link
                        href={`/templates/${template.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-neutral-700 border border-neutral-300 no-underline transition-colors hover:bg-neutral-100"
                      >
                        Details
                      </Link>
                    </div>
                    <AffiliateNote />
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
