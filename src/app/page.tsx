import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import ReferenceEditExplainer from "@/components/ReferenceEditExplainer";
import CopyPromptButton from "@/components/CopyPromptButton";
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
          <div id="generator" className="relative mx-auto max-w-screen-2xl scroll-mt-24">
            <GenerateConsole headingLevel="h2" variant="hero" />
          </div>
        </section>

        <ReferenceEditExplainer compact />


        <section className="section-pad">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Prompt Library</p><h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em]">Curated creator-ready prompts</h2></div><Link href="/prompts" className="text-rsp-secondary no-underline">View library →</Link></div>
            <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">{promptCards.map((card) => <article key={card.slug} className="glass-card overflow-hidden"><Link href={`/prompts/${card.slug}`} className="block bg-[#F3E8DA] no-underline"><img src={card.imagePath} alt={`${card.title} generated sample`} className="h-auto w-full object-contain brightness-105 saturate-110" loading="eager" /></Link><div className="p-5"><div className="mb-3 flex gap-2"><span className="chip-active">{card.style}</span><span className="chip">{card.ratio}</span></div><h3 className="font-heading text-xl font-normal tracking-[-0.02em]">{card.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-rsp-muted">{card.prompt}</p><div className="mt-4 flex flex-wrap items-center gap-3"><CopyPromptButton prompt={card.prompt} /><Link href={`/prompts/${card.slug}`} className="text-sm font-bold text-rsp-secondary no-underline">View details →</Link></div></div></article>)}</div>
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

