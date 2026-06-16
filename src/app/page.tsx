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

function CropMarks() {
  return (
    <>
      <span className="absolute left-3 top-3 h-8 w-8 border-l border-t border-rsp-secondary" aria-hidden="true" />
      <span className="absolute right-3 top-3 h-8 w-8 border-r border-t border-rsp-secondary" aria-hidden="true" />
      <span className="absolute bottom-3 left-3 h-8 w-8 border-b border-l border-rsp-secondary" aria-hidden="true" />
      <span className="absolute bottom-3 right-3 h-8 w-8 border-b border-r border-rsp-secondary" aria-hidden="true" />
    </>
  );
}

export default function HomePage() {
  const beforeImage = promptCards[3] || promptCards[0];
  const afterImage = promptCards[0];

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-pad relative overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.13),transparent_30%),linear-gradient(135deg,#0b0f1a_0%,#101522_48%,#090b10_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
          <div className="relative mx-auto grid max-w-screen-2xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="eyebrow">Upload-first image generator</p>
              <h1 className="mt-5 max-w-4xl font-heading text-5xl font-normal leading-[1.02] tracking-[-0.04em] text-rsp-text md:text-7xl">
                Upload a photo. <span className="italic text-[#f6d0a8]">Generate an RSP-style image.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-rsp-muted">
                Start with your own image, add a short prompt, and generate a polished edit without browsing through examples first.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/generate" className="rsp-button-primary px-7 py-4 uppercase tracking-[0.12em]">Upload &amp; Generate</Link>
                <Link href="/prompts" className="rsp-button-secondary px-7 py-4 uppercase tracking-[0.12em]">Browse Prompts</Link>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-rsp-muted">
                Start with 3 free credits total. Monthly plans start at $7.99 for 120 credits. Payment and account flows are pending backend integration.
              </p>
            </div>

            <div className="relative border border-rsp-border bg-rsp-panel/75 p-4 backdrop-blur-xl">
              <CropMarks />
              <div className="border border-rsp-border bg-[#0a0e19]/80 p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rsp-border pb-4">
                  <div>
                    <p className="eyebrow">Creator console</p>
                    <h2 className="mt-2 font-heading text-3xl font-normal tracking-[-0.03em] text-rsp-text">Generate from your image</h2>
                  </div>
                  <span className="border border-rsp-secondary/40 px-3 py-1.5 font-mono text-xs text-rsp-secondary">STYLE ENGINE: RSP-01</span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="border border-dashed border-rsp-secondary/55 bg-rsp-secondary/5 p-5">
                    <div className="grid h-12 w-12 place-items-center border border-rsp-secondary/50 text-2xl text-rsp-secondary">↥</div>
                    <p className="mt-4 font-semibold text-rsp-text">Upload photo</p>
                    <p className="mt-2 text-sm leading-6 text-rsp-muted">PNG, JPG, or WebP. Use your own image as the starting point.</p>
                    <div className="mt-5 border-t border-rsp-border pt-4">
                      <p className="font-mono text-xs tracking-[0.12em] text-rsp-secondary">PROMPT</p>
                      <p className="mt-2 font-mono text-sm leading-6 text-rsp-muted">cinematic low light, warm skin tone, refined studio contrast</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="relative overflow-hidden border border-rsp-border bg-black/30">
                        <img src={beforeImage.imagePath} alt="Original photo reference for AI Editor RSP" className="h-40 w-full object-cover grayscale-[35%] saturate-75" loading="eager" />
                        <span className="absolute left-2 top-2 bg-black/55 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-rsp-muted">ORIGINAL</span>
                      </div>
                      <span className="font-mono text-rsp-secondary">→</span>
                      <div className="relative overflow-hidden border border-rsp-secondary/50 bg-black/30">
                        <img src={afterImage.imagePath} alt="Generated cinematic edit preview" className="h-40 w-full object-cover brightness-110 saturate-125" loading="eager" />
                        <span className="absolute left-2 top-2 bg-black/55 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-rsp-secondary">RSP EDIT</span>
                      </div>
                    </div>
                    <Link href="/generate" className="rsp-button-primary w-full py-4 uppercase tracking-[0.12em]">Start Generating</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-rsp-surface"><div className="mx-auto max-w-screen-2xl"><GenerateConsole headingLevel="h2" /></div></section>
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
