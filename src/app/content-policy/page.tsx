import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Content Policy — AI Editor RSP",
  description: "Content safety rules and reporting contact for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/content-policy` },
};

export default function ContentPolicyPage() {
  const prohibited = [
    "Illegal activity, fraud, abuse, evasion, real-world harm, or instructions that enable wrongdoing.",
    "NSFW, sexually explicit, pornographic, erotic, adult sexual, fetish, nudity, sexual acts, or sexualized body-part content in prompts, uploads, generated images, or editing requests.",
    "Child sexual content, sexualized minors, sexual abuse material, sexual exploitation, explicit deepfakes, non-consensual intimate imagery, or attempts to bypass safety moderation.",
    "Hate, harassment, threats, humiliation, or abusive targeting of protected groups, private people, or vulnerable individuals.",
    "Deceptive impersonation, fake official documents, misleading media, scams, or images meant to misrepresent real people, events, or brands.",
    "Rights-infringing content, including prompts that misuse protected characters, logos, private likenesses, copyrighted material, or confidential information.",
    "Graphic gore, extremist praise or recruitment, weaponized intimidation, or content designed to facilitate violence.",
  ];

  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4 border-rsp-secondary/35 bg-white/70 text-rsp-secondary">Content Policy</p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-rsp-text md:text-6xl">Content safety rules.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">
            Do not submit prompts intended to create illegal, abusive, deceptive, NSFW, sexually explicit, pornographic, sexually exploitative, or rights-infringing content. These rules are aligned with common AI safety standards while remaining AI Editor RSP&apos;s own site policy.
          </p>
        </div>

        <section className="mt-10 border border-rsp-border bg-white/85 p-6 shadow-[0_18px_50px_rgba(92,61,34,0.08)]">
          <h2 className="font-heading text-2xl font-bold text-rsp-text">Prohibited content</h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-7 text-rsp-muted">
            {prohibited.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <div className="mt-8 border border-rsp-secondary/25 bg-[#FFF7EA] p-5 text-sm font-medium leading-6 text-[#7A3F12] shadow-[0_18px_40px_rgba(184,115,51,0.10)]">
          We screen prompt-based image generation and editing requests before generation, may refuse generation, remove content, suspend access, or request additional review when prompts or outputs create safety, legal, or rights risk. Report issues to {SUPPORT_EMAIL}.
        </div>
      </main>
      <Footer />
    </>
  );
}
