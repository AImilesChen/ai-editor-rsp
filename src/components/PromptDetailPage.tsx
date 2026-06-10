"use client";

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import CopyButton from "./CopyButton";
import BeforeAfter from "./BeforeAfter";
import type { Prompt } from "@/lib/data/prompts";

export default function PromptDetailPage({ prompt }: { prompt: Prompt }) {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-container mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500 mb-6">
            <Link href="/" className="text-brand-500 no-underline hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/prompts" className="text-brand-500 no-underline hover:underline">Prompts</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-700">{prompt.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Visual */}
            <div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <BeforeAfter
                  image={prompt.after_image || prompt.before_image}
                  alt={`${prompt.title} generated result preview`}
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
                  {prompt.category}
                </span>
                <span className="bg-brand-100 text-brand-500 px-2.5 py-1 rounded-sm text-xs font-medium">
                  {prompt.tool}
                </span>
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-sm text-xs font-medium">
                  {prompt.difficulty}
                </span>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                {prompt.title}
              </h1>

              <p className="text-neutral-500 mb-6">
                {prompt.prompt.slice(0, 200)}...
              </p>

              {/* Prompt Box */}
              <div className="bg-brand-900 rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-neutral-300 text-sm font-medium">Prompt</span>
                  <CopyButton text={prompt.prompt} label="Copy" />
                </div>
                <pre className="font-mono text-sm text-white whitespace-pre-wrap break-words leading-relaxed">
                  {prompt.prompt}
                </pre>
              </div>

              {prompt.negative_prompt && (
                <div className="bg-neutral-100 rounded-lg p-5 mb-6">
                  <span className="text-neutral-700 text-sm font-medium block mb-2">Negative Prompt</span>
                  <pre className="font-mono text-sm text-neutral-500 whitespace-pre-wrap break-words">
                    {prompt.negative_prompt}
                  </pre>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <span className="text-neutral-500 text-xs block mb-1">Difficulty</span>
                  <span className="text-neutral-900 font-semibold text-sm">{prompt.difficulty}</span>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <span className="text-neutral-500 text-xs block mb-1">Estimated Time</span>
                  <span className="text-neutral-900 font-semibold text-sm">{prompt.estimated_time}</span>
                </div>
              </div>

              {/* Tools */}
              <div className="mb-6">
                <span className="text-neutral-700 text-sm font-medium block mb-2">Works with</span>
                <div className="flex gap-2 flex-wrap">
                  {prompt.tool_alternatives.map((tool) => (
                    <span key={tool} className="bg-brand-100 text-brand-500 px-3 py-1.5 rounded-full text-xs font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <span className="text-neutral-700 text-sm font-medium block mb-2">How to use</span>
                <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-1.5">
                  <li>Copy the prompt above</li>
                  <li>Open {prompt.tool} or your preferred AI image tool</li>
                  <li>Paste the prompt and generate</li>
                  {prompt.input_image_required && (
                    <li>Upload your photo when prompted</li>
                  )}
                  <li>Download and share your creation</li>
                </ol>
              </div>

              {/* Attribution */}
              <div className="bg-neutral-100 border-l-[3px] border-brand-500 rounded-r-md p-4">
                <p className="text-neutral-700 text-sm">
                  <strong>Source:</strong> {prompt.attribution}
                  {prompt.source_url && prompt.source_url !== "#" && (
                    <>
                      {" "}
                      <a
                        href={prompt.source_url}
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
