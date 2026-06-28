import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import CopyPromptButton from "@/components/CopyPromptButton";
import PricingPlanCards from "@/components/PricingPlanCards";
import { faqItems, pricingPlans, promptCards, site } from "@/lib/rsp-content";

export const metadata = {
  title: "AI Image Generator with Ready Prompts — AI Editor RSP",
  description: "Generate AI images and edit uploaded photos with ready-made prompts, starter credits, and simple credit-based plans.",
  alternates: { canonical: site.url },
};


export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-8 md:px-8 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div id="generator" className="relative mx-auto max-w-screen-2xl scroll-mt-24">
            <GenerateConsole headingLevel="h2" variant="hero" defaultMode="text" lockedMode="text" compactPromptBuilder />
          </div>
        </section>

        <section className="border-y border-rsp-border bg-rsp-surface px-4 py-5 md:px-8">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Need a professional headshot?</p>
              <p className="mt-2 text-sm leading-6 text-rsp-muted">Upload a face photo and create a polished AI headshot for LinkedIn, resumes, company bios, and business profiles.</p>
            </div>
            <Link href="/ai-headshot-generator" className="rsp-button-secondary shrink-0 px-5 py-3 text-sm">Open AI Headshot →</Link>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Prompt Library</p><h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em]">Creator-ready prompts for faster image generation</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-rsp-muted">Start from tested prompt ideas for portraits, product photos, social posts, study rooms, anime styles, and more.</p></div><Link href="/prompts" className="text-rsp-secondary no-underline">View library →</Link></div>
            <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">{promptCards.map((card) => <article key={card.slug} className="glass-card overflow-hidden"><Link href={`/prompts/${card.slug}`} className="block bg-[#F3E8DA] no-underline"><img src={card.imagePath} alt={`${card.title} generated sample`} className="h-auto w-full object-contain brightness-105 saturate-110" loading="eager" /></Link><div className="p-5"><div className="mb-3 flex gap-2"><span className="chip-active">{card.style}</span><span className="chip">{card.ratio}</span></div><h3 className="font-heading text-xl font-normal tracking-[-0.02em]">{card.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-rsp-muted">{card.prompt}</p><div className="mt-4 flex flex-wrap items-center gap-3"><Link href={`/generate?prompt=${card.slug}`} className="rounded-full border border-rsp-secondary/30 bg-rsp-secondary/10 px-4 py-2 text-sm font-bold text-rsp-secondary no-underline transition hover:border-rsp-secondary hover:bg-rsp-secondary hover:text-white">Use this prompt</Link><CopyPromptButton prompt={card.prompt} label="Copy" className="bg-white/60" /><Link href={`/prompts/${card.slug}`} className="text-sm font-bold text-rsp-secondary no-underline">View details →</Link></div></div></article>)}</div>
          </div>
        </section>
        <section className="section-pad bg-rsp-surface">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Pricing</p>
              <h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em] text-rsp-text md:text-5xl">Simple credits for AI image generation</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-rsp-muted">Start free with 3 credits. Upgrade when you need more monthly image credits.</p>
            </div>
            <PricingPlanCards plans={pricingPlans} variant="home" />
            <div className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[24px] border border-rsp-secondary/20 bg-white/60 px-5 py-3 text-xs leading-5 text-rsp-muted shadow-sm">
              <span><strong className="text-rsp-text">Credit guide:</strong> 1 credit portrait text-to-image</span>
              <span className="hidden text-rsp-secondary/45 md:inline">•</span>
              <span>2 credits square/landscape text-to-image or portrait edit</span>
              <span className="hidden text-rsp-secondary/45 md:inline">•</span>
              <span>4+ credits larger edits and headshots</span>
            </div>
          </div>
        </section>
        <section className="section-pad bg-rsp-surface"><div className="mx-auto max-w-3xl"><p className="eyebrow text-center">FAQ</p>{faqItems.map((item) => <div key={item.q} className="mt-5 glass-card p-5"><h3 className="font-heading text-xl font-normal tracking-[-0.02em]">{item.q}</h3><p className="mt-2 text-rsp-muted">{item.a}</p></div>)}</div></section>
      </main>
      <Footer />
    </>
  );
}

