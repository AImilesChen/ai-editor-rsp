import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import BeforeAfter from "@/components/BeforeAfter";
import AffiliateNote from "@/components/AffiliateNote";
import { prompts } from "@/lib/data/prompts";
import { templates } from "@/lib/data/templates";
import { effects } from "@/lib/data/effects";
import { faqs } from "@/lib/data/faq";
import FAQAccordion from "@/components/FAQAccordion";

export default function HomePage() {
  const featuredPrompts = prompts.slice(0, 6);
  const featuredTemplates = templates.slice(0, 3);
  const featuredEffects = effects.slice(0, 3);
  const featuredFaqs = faqs.slice(0, 6);

  return (
    <>
      <Header />

      {/* Hero */}
      <section
        className="text-white pt-20 pb-16 px-4"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div className="max-w-[1080px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/10 px-4 py-2.5 rounded-full text-sm text-neutral-300 mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Independent guide. Not affiliated with RSP Editing.
          </div>
          <h1 className="font-heading text-[32px] md:text-5xl font-bold leading-tight mb-5">
            Get Trending RSP-Style AI Photo Prompts & CapCut Templates
          </h1>
          <p className="text-lg text-neutral-300 mb-8 max-w-[560px] mx-auto">
            Copy trending prompts, discover templates, and try creator-style effects faster. No signup needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/prompts"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400 hover:-translate-y-0.5"
            >
              Browse Prompts
            </Link>
            <Link
              href="/templates"
              className="bg-transparent text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 border-[1.5px] border-white/25 transition-all hover:bg-white/[0.08] hover:border-white/40"
            >
              Browse Templates
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.06] shadow-2xl">
              <div
                role="img"
                aria-label="Double exposure travel prompt preview"
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: "url(/images/prompts/double-exposure-travel-rishikesh-card.webp)" }}
              />
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-200 mb-1">Prompt result</p>
                <p className="text-sm text-white/90">Travel portrait style users can preview before copying.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.06] shadow-2xl md:translate-y-6">
              <div
                role="img"
                aria-label="CapCut template phone mockup preview"
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: "url(/images/templates/bollywood-trending-template-thumbnail.webp)" }}
              />
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-200 mb-1">Template cover</p>
                <p className="text-sm text-white/90">Phone-first preview for Reels and CapCut users.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.06] shadow-2xl">
              <div
                role="img"
                aria-label="Before and after effect comparison preview"
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: "url(/images/effects/diwali-glow-comparison.webp)" }}
              />
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-200 mb-1">Before / After</p>
                <p className="text-sm text-white/90">Clear effect examples so users know what they will get.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="py-20 px-4">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              Trending AI Photo Prompts
            </h2>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              Copy-paste ready prompts for ChatGPT, Gemini, and Bing Image Creator.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <BeforeAfter
                    image={prompt.before_image}
                    alt={`${prompt.title} visual preview`}
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
          <div className="text-center mt-8">
            <Link
              href="/prompts"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              View All Prompts
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-20 px-4 bg-neutral-100">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              Trending CapCut Templates
            </h2>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              One-click links to the popular templates. Use directly in CapCut.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
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
                  <AffiliateNote />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/templates"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              View All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Before & After Effects */}
      <section className="py-20 px-4">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              Before & After Effects
            </h2>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              See what these prompts and templates can do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEffects.map((effect) => (
              <div
                key={effect.id}
                className="bg-brand-900 text-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <BeforeAfter
                    image={effect.before_image}
                    alt={`${effect.title} before and after comparison`}
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
          <div className="text-center mt-8">
            <Link
              href="/effects"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              Explore Trending
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-neutral-100">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-neutral-500 text-lg max-w-[560px] mx-auto">
              Three steps to your next viral effect.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
                title: "Find",
                desc: "Browse or search for the effect you want from our curated library.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                ),
                title: "Copy",
                desc: "One-click copy the prompt or template link to your clipboard.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                ),
                title: "Create",
                desc: "Paste into ChatGPT, Gemini, or CapCut and share your creation.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-5 text-brand-500">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-[15px]">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/prompts"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="px-4 pb-0 pt-0">
        <div className="max-w-container mx-auto">
          <div className="bg-neutral-100 border-l-[3px] border-brand-500 px-6 py-5 my-12 rounded-r-md">
            <p className="text-neutral-700 text-sm leading-relaxed">
              <strong>Independent guide.</strong> Not affiliated with RSP Editing. All prompts and templates are for educational purposes. Respect copyright and platform terms. AI-generated results may vary. We do not provide AI generation services.{" "}
              <Link href="/disclaimer" className="text-brand-500 font-medium no-underline hover:underline">
                Read Full Disclaimer
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-neutral-100">
        <div className="max-w-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-[720px] mx-auto">
            <FAQAccordion items={featuredFaqs} />
          </div>
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-neutral-700 border border-neutral-300 no-underline transition-colors hover:bg-neutral-100"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
        }}
      >
        <div className="max-w-container mx-auto">
          <h2 className="font-heading text-[26px] md:text-4xl font-bold mb-4">
            Ready to create your next trending effect?
          </h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-[480px] mx-auto">
            Browse prompts and templates — no signup, no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/prompts"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              Browse Prompts
            </Link>
            <Link
              href="/templates"
              className="bg-transparent text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 border-[1.5px] border-white/25 transition-all hover:bg-white/[0.08] hover:border-white/40"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
