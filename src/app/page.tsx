import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { faqItems, pricingPlans, promptCards, site } from "@/lib/rsp-content";

export const metadata = {
  title: "AI Image Generator for RSP Editing Prompts",
  description: "Upload a photo, add a short prompt, and generate polished AI image edits with confirmed credits-based plans.",
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-pad relative overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.13),transparent_30%),linear-gradient(135deg,#0b0f1a_0%,#101522_48%,#090b10_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
          <div className="relative mx-auto grid max-w-screen-2xl items-start gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="lg:pt-4">
              <p className="eyebrow">Upload-first image generator</p>
              <h1 className="mt-5 max-w-4xl font-heading text-5xl font-normal leading-[1.02] tracking-[-0.04em] text-rsp-text md:text-7xl">
                Upload a photo. <span className="italic text-[#f6d0a8]">Generate an RSP-style image.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-rsp-muted">
                Start with your own image, add a short prompt, and generate a polished edit without browsing through examples first.
              </p>
              <div className="mt-8 grid max-w-2xl gap-3 text-sm text-rsp-muted sm:grid-cols-3">
                <div className="border border-rsp-border bg-black/20 p-4"><span className="font-mono text-rsp-secondary">01</span><br />Upload on the right</div>
                <div className="border border-rsp-border bg-black/20 p-4"><span className="font-mono text-rsp-secondary">02</span><br />Add a short prompt</div>
                <div className="border border-rsp-border bg-black/20 p-4"><span className="font-mono text-rsp-secondary">03</span><br />Generate on this page</div>
              </div>
              <div className="mt-5 flex items-center gap-4 text-sm">
                <span className="text-rsp-muted">Use the live generator on the right.</span>
                <Link href="/prompts" className="text-rsp-secondary no-underline">Browse prompts →</Link>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-rsp-muted">
                Start with 3 free credits total. Monthly plan previews begin at $7.99 for 120 credits.
              </p>
            </div>

            <div id="generator" className="relative scroll-mt-24">
              <GenerateConsole headingLevel="h2" variant="hero" />
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Prompt Library</p><h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em]">Curated creator-ready prompts</h2></div><Link href="/prompts" className="text-rsp-secondary no-underline">View library →</Link></div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{promptCards.map((card) => <article key={card.slug} className="glass-card overflow-hidden"><img src={card.imagePath} alt={`${card.title} generated sample`} className="h-44 w-full object-cover brightness-110 saturate-125" loading="eager" /><div className="p-5"><div className="mb-3 flex gap-2"><span className="chip-active">{card.style}</span><span className="chip">{card.ratio}</span></div><h3 className="font-heading text-xl font-normal tracking-[-0.02em]">{card.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-rsp-muted">{card.prompt}</p><Link href={`/prompts/${card.slug}`} className="mt-4 inline-block text-sm font-bold text-rsp-secondary no-underline">Use this prompt →</Link></div></article>)}</div>
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
