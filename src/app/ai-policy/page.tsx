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
  const rules = [
    {
      title: "No illegal or harmful activity",
      body: "Do not use AI Editor RSP to create content that facilitates illegal activity, abuse, fraud, threats, evasion, or real-world harm.",
    },
    {
      title: "No sexual exploitation or non-consensual imagery",
      body: "We prohibit child sexual content, sexualized minors, non-consensual intimate imagery, explicit deepfakes, and sexual abuse material.",
    },
    {
      title: "No hate, harassment, or abusive targeting",
      body: "Prompts and outputs may not promote hateful, demeaning, threatening, or harassing content against protected groups or private individuals.",
    },
    {
      title: "No deception, impersonation, or misleading media",
      body: "Do not generate images intended to deceive people, impersonate others, falsify events, forge documents, or misrepresent real people or brands.",
    },
    {
      title: "No rights-infringing use",
      body: "Users remain responsible for respecting copyright, trademark, publicity, privacy, and model/provider terms before using generated images downstream.",
    },
    {
      title: "No graphic violence or extremist content",
      body: "Do not create graphic gore, instructions for violence, extremist praise, recruitment material, or content designed to intimidate or radicalize.",
    },
  ];

  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4 border-rsp-secondary/35 bg-white/70 text-rsp-secondary">AI Policy</p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-rsp-text md:text-6xl">Clear AI usage policy before launch.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">{legalDisclaimer}</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-rsp-text">
            Our safety rules are aligned with widely used AI usage-policy principles, including the types of content OpenAI and major AI providers prohibit. This page is not an official OpenAI policy page; it is AI Editor RSP&apos;s own user-facing safety summary.
          </p>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {rules.map((rule) => (
            <article key={rule.title} className="border border-rsp-border bg-white/85 p-5 shadow-[0_18px_50px_rgba(92,61,34,0.08)]">
              <h2 className="font-heading text-2xl font-bold leading-snug text-rsp-text">{rule.title}</h2>
              <p className="mt-3 text-base leading-7 text-rsp-muted">{rule.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 border border-rsp-border bg-white/75 p-6 shadow-[0_18px_50px_rgba(92,61,34,0.07)]">
          <h2 className="font-heading text-2xl font-bold text-rsp-text">Enforcement and review</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-rsp-muted">
            <li>We may block prompts, refuse generation, remove outputs, suspend access, or request additional review when content creates safety, legal, or rights risk.</li>
            <li>Prompt and output moderation runs before and after generation. AI image/video payment review may also require Creem moderation controls or an equivalent documented moderation process.</li>
            <li>Provider terms still apply. Generation uses third-party AI model providers such as {AI_PROVIDER} after backend integration.</li>
            <li>Users remain responsible for prompt inputs, generated outputs, and downstream usage decisions.</li>
          </ul>
        </section>

        <div className="mt-8 border border-rsp-secondary/25 bg-[#FFF7EA] p-5 text-sm font-medium leading-6 text-[#7A3F12] shadow-[0_18px_40px_rgba(184,115,51,0.10)]">
          Provider: {AI_PROVIDER}. Contact: {SUPPORT_EMAIL}. This policy describes the current safety and AI-use rules for account access, credits, generation requests, and billing activation.
        </div>
      </main>
      <Footer />
    </>
  );
}
