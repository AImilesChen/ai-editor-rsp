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
          <p className="rsp-chip mb-4">AI Policy</p>
          <h1 className="font-heading text-4xl font-bold text-white md:text-6xl">Clear AI usage policy before launch.</h1>
          <p className="mt-5 text-lg text-[#A7ABB8]">{legalDisclaimer}</p>
        </div>
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => <div key={item} className="rsp-card p-5 text-[#E2E5F3]">{item}</div>)}
        </section>
        <div className="mt-8 rounded-2xl border border-[#F4B860]/30 bg-[#F4B860]/10 p-5 text-sm text-[#F4B860]">
          Provider planned: {AI_PROVIDER}. Contact: {SUPPORT_EMAIL}. This is front-end policy copy, not final legal approval.
        </div>
      </main>
      <Footer />
    </>
  );
}
