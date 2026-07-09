import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { aiModelDisclosures } from "@/lib/ai-models";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Models Used — AI Editor RSP",
  description: "Current AI model providers and model routes used for AI Editor RSP image generation and editing.",
  alternates: { canonical: `${SITE_URL}/ai-models` },
};

export default function AiModelsPage() {
  const models = aiModelDisclosures();

  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4 border-rsp-secondary/35 bg-white/70 text-rsp-secondary">AI Models Used</p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-rsp-text md:text-6xl">Generation model disclosure.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">
            AI Editor RSP publicly lists the third-party AI image model routes currently used for generation and editing. Prompt-based generation requests are screened by Stripe Moderation API before any model call.
          </p>
        </div>

        <section className="mt-10 grid gap-4">
          {models.map((item) => (
            <article key={`${item.feature}-${item.model}`} className="border border-rsp-border bg-white/85 p-6 shadow-[0_18px_50px_rgba(92,61,34,0.08)]">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-rsp-secondary">{item.feature}</p>
              <h2 className="mt-2 font-heading text-2xl font-bold leading-snug text-rsp-text">{item.provider} · {item.model}</h2>
              <p className="mt-3 text-base leading-7 text-rsp-muted">{item.notes}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 border border-rsp-border bg-white/75 p-6 shadow-[0_18px_50px_rgba(92,61,34,0.07)]">
          <h2 className="font-heading text-2xl font-bold text-rsp-text">Updates and safety routing</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-rsp-muted">
            <li>We may update or replace models to improve quality, reliability, safety, or cost efficiency.</li>
            <li>When material generation model changes are deployed, we update this page to keep the disclosure current.</li>
            <li>All prompt-based image generation and editing requests are screened before generation. Requests with deny or flag moderation decisions are not sent to the AI model and are not charged credits.</li>
          </ul>
        </section>

        <div className="mt-8 border border-rsp-secondary/25 bg-[#FFF7EA] p-5 text-sm font-medium leading-6 text-[#7A3F12] shadow-[0_18px_40px_rgba(184,115,51,0.10)]">
          Questions about AI model usage or safety controls: {SUPPORT_EMAIL}.
        </div>
      </main>
      <Footer />
    </>
  );
}
