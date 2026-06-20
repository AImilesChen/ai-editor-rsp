import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import ReferenceEditExplainer from "@/components/ReferenceEditExplainer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reference Image Editor — AI Editor RSP",
  description: "Upload a reference image, describe what should change, and compare the AI edited result with the original using a before and after slider.",
  alternates: { canonical: `${SITE_URL}/image-editor` },
};

const benefits = [
  { title: "Keep the subject", body: "Preserve the main person, product, pose, and composition instead of asking AI to invent everything again." },
  { title: "Change a specific part", body: "Replace a background, clean up lighting, remove distractions, or restyle the image with a focused prompt." },
  { title: "Verify the result", body: "Use before/after comparison to check whether the edit changed only what you requested." },
];

export default function ReferenceEditPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-12 md:px-8 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="eyebrow">AI Reference Image Editor</p>
              <h1 className="mt-4 max-w-4xl font-heading text-5xl font-normal leading-[0.98] tracking-[-0.05em] text-rsp-text md:text-7xl">
                Edit an image from a reference.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-rsp-muted">
                Upload a photo, tell AI exactly what to change, and compare the edited result with the original. This is for controlled edits, not random text-to-image generation.
              </p>
              <div className="mt-7 grid gap-3">
                {benefits.map((item) => (
                  <div key={item.title} className="glass-card p-5">
                    <h2 className="font-heading text-2xl font-normal tracking-[-0.03em] text-rsp-text">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-rsp-muted">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#try-reference-edit" className="rsp-button px-5 py-3 text-sm">Try Reference Edit</Link>
                <Link href="/" className="rsp-button-secondary px-5 py-3 text-sm">Back to prompt generator</Link>
              </div>
            </div>
            <div className="rounded-[32px] border border-rsp-border bg-[#15110C] p-3 shadow-[0_24px_80px_rgba(46,32,18,0.22)] md:p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-[#241B13]">
                <img src="/images/generated/lofi-girl-vibes.webp" alt="Before reference image example" className="absolute inset-0 h-full w-full object-cover opacity-70 blur-[1.5px] saturate-75" />
                <div className="absolute inset-0 overflow-hidden [clip-path:inset(0_0_0_50%)]">
                  <img src="/images/generated/lofi-girl-vibes.webp" alt="After AI edited result example" className="h-full w-full object-cover brightness-105 contrast-110 saturate-125" />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white">Before · uploaded image</span>
                <span className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white">After · AI edit</span>
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/85 shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/75 text-sm text-white shadow-xl">↔</div>
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[#86EFAC]/25 bg-black/65 p-4 text-sm leading-6 text-white/85">
                  Reference Edit shows the original and the AI edited result together, so users can verify exactly what changed.
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReferenceEditExplainer />

        <section id="try-reference-edit" className="section-pad bg-rsp-surface scroll-mt-24">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-8 max-w-3xl">
              <p className="eyebrow">Try it now</p>
              <h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">Upload, prompt, compare.</h2>
              <p className="mt-4 text-lg leading-8 text-rsp-muted">The editor below starts in Reference Edit mode. Upload a source image first, then describe the specific change you want.</p>
            </div>
            <GenerateConsole headingLevel="h2" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
