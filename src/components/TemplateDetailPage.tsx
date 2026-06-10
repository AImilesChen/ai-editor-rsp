"use client";

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import AffiliateNote from "./AffiliateNote";
import type { Template } from "@/lib/data/templates";

export default function TemplateDetailPage({ template }: { template: Template }) {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-container mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500 mb-6">
            <Link href="/" className="text-brand-500 no-underline hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/templates" className="text-brand-500 no-underline hover:underline">Templates</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-700">{template.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Visual */}
            <div>
              <div
                role="img"
                aria-label={`${template.title} vertical template preview`}
                className="aspect-[9/16] max-h-[540px] rounded-lg overflow-hidden shadow-md bg-cover bg-center"
                style={{
                  backgroundImage: `url(/images/templates/${template.slug}-detail.webp)`,
                }}
              />
              <p className="text-xs text-neutral-500 mt-3">
                Simulated preview. Actual template appearance may vary in CapCut.
              </p>
            </div>

            {/* Right: Content */}
            <div>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-sm text-xs font-medium">
                  {template.category}
                </span>
                <span className="bg-brand-100 text-brand-500 px-2.5 py-1 rounded-sm text-xs font-medium">
                  CapCut
                </span>
                <span className="bg-warning-bg text-warning px-2.5 py-1 rounded-sm text-xs font-medium">
                  Trending {template.trending_score}/100
                </span>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                {template.title}
              </h1>

              <div className="mb-6">
                <p className="text-neutral-500 text-sm mb-1">
                  <strong className="text-neutral-700">Song:</strong> {template.song_name}
                </p>
                <p className="text-neutral-500 text-sm mb-1">
                  <strong className="text-neutral-700">Artist:</strong> {template.artist}
                </p>
                <p className="text-neutral-500 text-sm mb-1">
                  <strong className="text-neutral-700">Language:</strong> {template.language}
                </p>
                <p className="text-neutral-500 text-sm">
                  <strong className="text-neutral-700">Platforms:</strong> {template.platform.join(", ")}
                </p>
              </div>

              {/* CTA */}
              <div className="bg-warning-bg border border-warning/20 rounded-lg p-5 mb-6">
                <p className="text-warning text-sm font-medium mb-3">
                  This link opens CapCut app or website. Not affiliated with CapCut.
                </p>
                <a
                  href={template.template_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold text-white bg-brand-500 no-underline transition-colors hover:bg-brand-400"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Use in CapCut
                </a>
                <AffiliateNote />
              </div>

              {/* Steps */}
              <div className="mb-6">
                <span className="text-neutral-700 text-sm font-medium block mb-3">
                  How to use this template
                </span>
                <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-2">
                  {template.tutorial_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <span className="text-neutral-700 text-sm font-medium block mb-2">Tags</span>
                <div className="flex gap-2 flex-wrap">
                  {template.tags.map((tag) => (
                    <span key={tag} className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attribution */}
              <div className="bg-neutral-100 border-l-[3px] border-brand-500 rounded-r-md p-4">
                <p className="text-neutral-700 text-sm">
                  <strong>Source:</strong> {template.attribution}
                  {template.source_url && template.source_url !== "#" && (
                    <>
                      {" "}
                      <a
                        href={template.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 no-underline hover:underline"
                      >
                        View original →
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
