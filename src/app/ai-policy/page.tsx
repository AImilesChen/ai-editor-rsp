import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { aiModelDisclosureText } from "@/lib/ai-models";
import { legalDisclaimer, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Policy — AI Editor RSP",
  description: "AI model provider, generated image limitations, content safety, and review status for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/ai-policy` },
};

export default function AiPolicyPage() {
  const modelDisclosure = aiModelDisclosureText();
  const rules = [
    {
      title: "No illegal or harmful activity",
      body: "Do not use AI Editor RSP to create content that facilitates illegal activity, abuse, fraud, threats, evasion, or real-world harm.",
    },
    {
      title: "No NSFW, sexually explicit, or pornographic generation",
      body: "We do not allow users to generate, upload, request, or distribute NSFW, sexually explicit, pornographic, erotic, adult sexual, fetish, nudity, sexual acts, or sexualized body-part content through our AI image generation or editing tools.",
    },
    {
      title: "No sexual exploitation or non-consensual imagery",
      body: "We also prohibit sexualized minors, child sexual content, non-consensual intimate imagery, sexual exploitation, sexual abuse material, explicit deepfakes, and attempts to evade moderation controls.",
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
          <h1 className="font-heading text-4xl font-bold leading-tight text-rsp-text md:text-6xl">Clear AI usage policy for image generation.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">{legalDisclaimer}</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-rsp-text">
            Our safety rules are based on common AI usage-policy principles used across major AI platforms. This page is AI Editor RSP&apos;s own user-facing safety summary.
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
            <li>Every prompt-based image generation or editing request is screened by automated safety checks and abuse-prevention rules before generation. Requests that are denied or flagged for safety review are blocked before model invocation and are not charged credits.</li>
            <li>Prompt and output moderation may run before and after generation. Payment, abuse, and policy reviews may also use third-party safety and fraud-prevention tools.</li>
            <li>Current generation model disclosure: {modelDisclosure}. See <a className="text-brand-500 underline" href="/ai-models">AI Models Used</a> for details and updates.</li>
            <li>Users remain responsible for prompt inputs, generated outputs, and downstream usage decisions.</li>
          </ul>
        </section>

        <div className="mt-8 border border-rsp-secondary/25 bg-[#FFF7EA] p-5 text-sm font-medium leading-6 text-[#7A3F12] shadow-[0_18px_40px_rgba(184,115,51,0.10)]">
          Contact: {SUPPORT_EMAIL}. This policy describes the current safety and AI-use rules for account access, credits, generation requests, billing, and refunds.
        </div>
      </main>
      <Footer />
    </>
  );
}
