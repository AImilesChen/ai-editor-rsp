import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { faqItems, integrationStates, pricingPlans, promptCards, site } from "@/lib/rsp-content";

export const metadata = {
  title: "AI Image Generator for RSP Editing Prompts",
  description: "Browse RSP editing prompts, preview fal.ai generated sample cases, and compare confirmed Free, Starter, Creator, and Studio credit plans.",
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-pad relative overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-rsp-primary/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-screen-2xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="eyebrow">Upload-first AI image generator</p>
              <h1 className="mt-5 font-heading text-5xl font-bold leading-[0.98] tracking-tight text-rsp-text md:text-7xl">Upload a photo. Generate an RSP-style image.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-rsp-muted">Start with your own image, add a short prompt, and generate a polished edit without browsing through examples first.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/generate" className="rounded-full bg-rsp-primary px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-on-primary no-underline">Upload & Generate</Link>
                <Link href="/prompts" className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-text no-underline">Browse Prompts</Link>
              </div>
              <p className="mt-5 text-sm text-rsp-muted">Start with 3 free credits total. Monthly plans start at $7.99 for 120 credits. Payment and account flows are pending backend integration.</p>
            </div>
            <div className="glass-card p-4">
              <div className="rounded-2xl bg-gradient-to-br from-rsp-primary/25 via-rsp-panel-strong to-rsp-secondary/20 p-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="eyebrow">Quick start</p>
                  <h2 className="mt-3 font-heading text-3xl font-bold text-rsp-text">Generate from your image</h2>
                  <div className="mt-5 rounded-2xl border border-dashed border-rsp-primary/50 bg-rsp-primary/5 p-6 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rsp-primary/15 text-3xl">＋</div>
                    <p className="mt-4 font-semibold text-rsp-text">Upload photo</p>
                    <p className="mt-2 text-sm text-rsp-muted">PNG, JPG, or WebP. Use your own image as the starting point.</p>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-rsp-panel/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Prompt</p>
                    <p className="mt-2 font-mono text-sm text-rsp-muted">Add the style you want, then generate the edited image.</p>
                  </div>
                  <Link href="/generate" className="mt-5 block rounded-full bg-rsp-primary px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-on-primary no-underline">Start Generating</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-pad bg-rsp-surface"><div className="mx-auto max-w-screen-2xl"><GenerateConsole headingLevel="h2" /></div></section>
        <section className="section-pad">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Prompt Library</p><h2 className="mt-3 font-heading text-4xl font-bold">Curated creator-ready prompts</h2></div><Link href="/prompts" className="text-rsp-primary no-underline">View library →</Link></div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{promptCards.map((card) => <article key={card.slug} className="glass-card overflow-hidden"><img src={card.imagePath} alt={`${card.title} fal.ai generated sample`} className="h-44 w-full object-cover brightness-110 saturate-125" loading="eager" /><div className="p-5"><div className="mb-3 flex gap-2"><span className="chip-active">{card.style}</span><span className="chip">{card.ratio}</span></div><h3 className="font-heading text-xl font-bold">{card.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-rsp-muted">{card.prompt}</p><Link href={`/prompts/${card.slug}`} className="mt-4 inline-block text-sm font-bold text-rsp-primary no-underline">Use this prompt →</Link></div></article>)}</div>
          </div>
        </section>
        <section className="section-pad bg-rsp-surface">
          <div className="mx-auto max-w-screen-2xl"><p className="eyebrow text-center">Confirmed Pricing</p><h2 className="mt-3 text-center font-heading text-4xl font-bold">Credits-based plans</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{pricingPlans.map((plan) => <div key={plan.name} className={`glass-card p-6 ${plan.featured ? "border-rsp-primary" : ""}`}><h3 className="font-heading text-2xl font-bold">{plan.name}</h3><div className="mt-4"><span className="font-heading text-4xl font-bold">{plan.price}</span><span className="text-rsp-muted"> {plan.cadence}</span></div><p className="mt-4 text-rsp-muted">{plan.generations}</p><Link href="/pricing" className="mt-6 block rounded-full border border-white/15 px-4 py-3 text-center text-sm font-bold text-rsp-text no-underline">{plan.cta}</Link></div>)}</div></div>
        </section>
        <section className="section-pad">
          <div className="mx-auto grid max-w-screen-2xl gap-6 lg:grid-cols-2"><div><p className="eyebrow">Component states</p><h2 className="mt-3 font-heading text-4xl font-bold">Integration readiness states</h2><p className="mt-4 text-rsp-muted">Backend-dependent features are visibly labeled so the frontend does not pretend fal.ai, Creem, login, or credit deduction is live.</p></div><div className="grid gap-3">{integrationStates.map((item) => <div key={item.label} className="glass-card p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">{item.label}</h3><span className="chip-active">{item.state}</span></div><p className="mt-2 text-sm text-rsp-muted">{item.detail}</p></div>)}</div></div>
        </section>
        <section className="section-pad bg-rsp-surface"><div className="mx-auto max-w-3xl"><p className="eyebrow text-center">FAQ</p>{faqItems.map((item) => <div key={item.q} className="mt-5 glass-card p-5"><h3 className="font-heading text-xl font-bold">{item.q}</h3><p className="mt-2 text-rsp-muted">{item.a}</p></div>)}</div></section>
      </main>
      <Footer />
    </>
  );
}
