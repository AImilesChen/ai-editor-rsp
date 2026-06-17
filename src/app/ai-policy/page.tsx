import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AI_PROVIDER, legalDisclaimer, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Policy — AI Editor RSP",
  description: "AI model provider, generated image limitations, content safety, and review status for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/ai-policy` },
};

export default function AiPolicyPage() {
  const items = [
    "Generation uses third-party AI model providers such as fal.ai after backend integration.",
    "Users remain responsible for prompt inputs, generated outputs, and downstream usage decisions.",
    "The service should not be used to create illegal, abusive, deceptive, or rights-infringing content.",
    "Usage rights and limitations may depend on provider and model terms.",
    "Compliance status is NEEDS_REVIEW until provider, payment, retention, and jurisdiction checks are complete.",
  ];
  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4 border-rsp-secondary/35 bg-white/70 text-rsp-secondary">AI Policy</p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-rsp-text md:text-6xl">Clear AI usage policy before launch.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">{legalDisclaimer}</p>
        </div>
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="border border-rsp-border bg-white/80 p-5 text-base leading-7 text-rsp-text shadow-[0_18px_50px_rgba(92,61,34,0.08)]">
              {item}
            </div>
          ))}
        </section>
        <div className="mt-8 border border-rsp-secondary/25 bg-[#FFF7EA] p-5 text-sm font-medium leading-6 text-[#7A3F12] shadow-[0_18px_40px_rgba(184,115,51,0.10)]">
          Provider planned: {AI_PROVIDER}. Contact: {SUPPORT_EMAIL}. This is front-end policy copy, not final legal approval.
        </div>
      </main>
      <Footer />
    </>
  );
}
