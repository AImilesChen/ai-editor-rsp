import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { faqItems, pricingPlans, promptCards, site } from "@/lib/rsp-content";

export const metadata = {
  title: "AI Image Editor for Reference Edits and RSP Prompts",
  description: "Upload a reference image, describe the edit, and generate polished AI image edits with transparent credits-based plans.",
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-8 md:px-8 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto grid max-w-screen-2xl items-start gap-6 xl:grid-cols-[minmax(280px,0.48fr)_minmax(0,1.52fr)]">
            <div className="max-w-md rounded-[28px] border border-rsp-border/70 bg-white/45 p-5 shadow-[0_18px_60px_rgba(94,63,36,0.10)] backdrop-blur md:p-6">
              <p className="eyebrow">Reference-first AI Image Editor</p>
              <h1 className="mt-4 font-heading text-4xl font-normal leading-[1.04] tracking-[-0.04em] text-rsp-text md:text-5xl">
                Upload a reference. <span className="italic text-rsp-secondary">Edit it with a prompt.</span>
              </h1>
              <p className="mt-4 text-base leading-7 text-rsp-muted">
                Keep the subject clear, describe the change, and compare Reference vs Edited Result in the workspace.
              </p>
              <div className="mt-5 grid gap-2 text-sm text-rsp-muted">
                <div className="flex items-center gap-3 border border-rsp-border bg-white/55 px-3 py-2"><span className="font-mono text-rsp-secondary">01</span><span>Upload reference image</span></div>
                <div className="flex items-center gap-3 border border-rsp-border bg-white/55 px-3 py-2"><span className="font-mono text-rsp-secondary">02</span><span>Choose edit task + prompt</span></div>
                <div className="flex items-center gap-3 border border-rsp-border bg-white/55 px-3 py-2"><span className="font-mono text-rsp-secondary">03</span><span>Generate and download</span></div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <span className="text-rsp-muted">3 free credits total.</span>
                <Link href="/prompts" className="text-rsp-secondary no-underline">Browse prompts →</Link>
              </div>
            </div>

            <div id="generator" className="relative scroll-mt-24">
              <GenerateConsole headingLevel="h2" variant="hero" />
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Prompt Library</p><h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em]">Curated creator-ready prompts</h2></div><Link href="/prompts" className="text-rsp-secondary no-underline">View library →</Link></div>
            <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">{promptCards.map((card) => <article key={card.slug} className="glass-card overflow-hidden"><div className="bg-[#F3E8DA]"><img src={card.imagePath} alt={`${card.title} generated sample`} className="h-auto w-full object-contain brightness-105 saturate-110" loading="eager" /></div><div className="p-5"><div className="mb-3 flex gap-2"><span className="chip-active">{card.style}</span><span className="chip">{card.ratio}</span></div><h3 className="font-heading text-xl font-normal tracking-[-0.02em]">{card.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-rsp-muted">{card.prompt}</p><Link href={`/prompts/${card.slug}`} className="mt-4 inline-block text-sm font-bold text-rsp-secondary no-underline">Use this prompt →</Link></div></article>)}</div>
          </div>
        </section>
        <section className="section-pad bg-rsp-surface">
          <div className="mx-auto max-w-screen-2xl"><p className="eyebrow text-center">Confirmed Pricing</p><h2 className="mt-3 text-center font-heading text-4xl font-normal tracking-[-0.03em]">Credits-based plans</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{pricingPlans.map((plan) => <div key={plan.name} className={`glass-card p-6 ${plan.featured ? "border-rsp-secondary" : ""}`}><h3 className="font-heading text-2xl font-normal">{plan.name}</h3><div className="mt-4"><span className="font-heading text-4xl font-normal">{plan.price}</span><span className="text-rsp-muted"> {plan.cadence}</span></div><p className="mt-4 text-rsp-muted">{plan.generations}</p><Link href="/pricing" className="rsp-button-secondary mt-6 block px-4 py-3 text-center text-sm">{plan.cta}</Link></div>)}</div></div>
        </section>
        <section className="section-pad bg-rsp-surface"><div className="mx-auto max-w-3xl"><p className="eyebrow text-center">FAQ</p>{faqItems.map((item) => <div key={item.q} className="mt-5 glass-card p-5"><h3 className="font-heading text-xl font-normal tracking-[-0.02em]">{item.q}</h3><p className="mt-2 text-rsp-muted">{item.a}</p></div>)}</div></section>
      </main>
      <Footer />
    </>
  );
}
