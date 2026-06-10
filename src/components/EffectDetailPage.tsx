"use client";

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import BeforeAfter from "./BeforeAfter";
import { prompts } from "@/lib/data/prompts";
import { templates } from "@/lib/data/templates";
import type { Effect } from "@/lib/data/effects";

export default function EffectDetailPage({ effect }: { effect: Effect }) {
  const relatedPrompt = effect.prompt_id
    ? prompts.find((p) => p.slug === effect.prompt_id)
    : null;
  const relatedTemplate = effect.template_id
    ? templates.find((t) => t.slug === effect.template_id)
    : null;

  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-container mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500 mb-6">
            <Link href="/" className="text-brand-500 no-underline hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/effects" className="text-brand-500 no-underline hover:underline">
              Effects
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-700">{effect.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Visual */}
            <div>
              <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                <BeforeAfter
                  image={effect.before_image}
                  alt={`${effect.title} before and after comparison`}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                AI-generated preview simulation. Results may vary.
              </p>
            </div>

            {/* Right: Content */}
            <div>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-sm text-xs font-medium">
                  {effect.category}
                </span>
                <span className="bg-brand-100 text-brand-500 px-2.5 py-1 rounded-sm text-xs font-medium">
                  {effect.type === "prompt" ? "AI Prompt" : "CapCut Template"}
                </span>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                {effect.title}
              </h1>

              <p className="text-neutral-500 mb-6">{effect.description}</p>

              {/* Tutorial Steps */}
              <div className="mb-6">
                <span className="text-neutral-700 text-sm font-medium block mb-3">
                  How to recreate this effect
                </span>
                <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-2">
                  {effect.tutorial_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Related Resources */}
              {(relatedPrompt || relatedTemplate) && (
                <div className="mb-6">
                  <span className="text-neutral-700 text-sm font-medium block mb-3">
                    Related Resources
                  </span>
                  <div className="flex flex-col gap-3">
                    {relatedPrompt && (
                      <Link
                        href={`/prompts/${relatedPrompt.slug}`}
                        className="flex items-center gap-3 bg-neutral-50 rounded-lg p-4 no-underline transition-colors hover:bg-neutral-100"
                      >
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-500">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-neutral-900 font-semibold text-sm block">
                            {relatedPrompt.title}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            Copy the prompt
                          </span>
                        </div>
                      </Link>
                    )}
                    {relatedTemplate && (
                      <Link
                        href={`/templates/${relatedTemplate.slug}`}
                        className="flex items-center gap-3 bg-neutral-50 rounded-lg p-4 no-underline transition-colors hover:bg-neutral-100"
                      >
                        <div className="w-10 h-10 bg-warning-bg rounded-lg flex items-center justify-center text-warning">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-neutral-900 font-semibold text-sm block">
                            {relatedTemplate.title}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            Use in CapCut
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mb-6">
                <span className="text-neutral-700 text-sm font-medium block mb-2">
                  Tags
                </span>
                <div className="flex gap-2 flex-wrap">
                  {effect.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-neutral-100 border-l-[3px] border-brand-500 rounded-r-md p-4">
                <p className="text-neutral-700 text-sm">
                  <strong>Independent guide.</strong> Not affiliated with RSP
                  Editing. AI-generated results may vary. We do not provide AI
                  generation services.
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
