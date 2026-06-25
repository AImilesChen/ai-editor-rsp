import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import ReferenceEditExplainer from "@/components/ReferenceEditExplainer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Image Editor — AI Editor RSP",
  description: "Upload a photo, describe the change you want, and compare the before-and-after AI edit before downloading.",
  alternates: { canonical: `${SITE_URL}/image-editor` },
};

const professionalHeadshotPrompt = "Turn the uploaded photo into a realistic professional LinkedIn headshot. Preserve the same person's face, identity, age, facial structure, and natural expression. Dress the person in a clean navy blazer and light shirt. Use a soft grey studio background, natural skin texture, soft studio lighting, eye-level camera angle, sharp facial details, polished corporate portrait style, professional and trustworthy.";
const professionalHeadshotHref = `/image-editor?prompt=${encodeURIComponent(professionalHeadshotPrompt)}#headshot-upload`;

const benefits = [
  { title: "Keep the subject", body: "Preserve the main person, product, pose, and composition while changing only what you describe." },
  { title: "Change a focused part", body: "Replace a background, clean up lighting, remove distractions, or restyle the image with a focused prompt." },
  { title: "Verify before download", body: "Use the before/after comparison to check that the edit changed only what you requested." },
];

export default function ReferenceEditPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section id="try-reference-edit" className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-6 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto max-w-screen-2xl">
            <div className="mb-4 rounded-[28px] border border-rsp-primary/25 bg-white/82 p-4 shadow-[0_14px_42px_rgba(46,32,18,0.08)] backdrop-blur md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="eyebrow text-[10px]">New photo-to-headshot preset</p>
                  <h2 className="mt-2 font-heading text-3xl font-normal leading-tight tracking-[-0.04em] text-rsp-text md:text-4xl">
                    Upload your photo, generate a professional headshot
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-rsp-muted md:text-base">
                    Keep the same person and facial identity while changing the outfit, lighting, and background into a polished LinkedIn-style business portrait.
                  </p>
                </div>
                <a
                  href={professionalHeadshotHref}
                  className="rsp-button-primary shrink-0 px-5 py-3 text-center text-sm"
                >
                  Start with headshot preset
                </a>
              </div>
            </div>

            <div id="headshot-upload" className="scroll-mt-28">
              <GenerateConsole headingLevel="h2" previewHeadingLevel="h2" variant="hero" defaultMode="edit" lockedMode="edit" hidePreviewIntro />
            </div>

            <div className="mt-5 rounded-[28px] border border-rsp-border bg-white/76 p-4 shadow-[0_14px_42px_rgba(46,32,18,0.08)] backdrop-blur md:p-5 lg:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.48fr)_minmax(0,1.52fr)] lg:items-start">
                <div>
                  <p className="eyebrow text-[10px]">AI Reference Image Editor</p>
                  <h1 className="mt-3 max-w-xl font-heading text-3xl font-normal leading-[0.98] tracking-[-0.045em] text-rsp-text md:text-4xl lg:text-5xl">
                    Edit uploaded images with AI
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-rsp-muted md:text-base">
                    Upload a photo, describe the change you want, then compare the before-and-after result before downloading.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {benefits.map((item, index) => (
                    <div key={item.title} className="rounded-2xl border border-rsp-border bg-rsp-surface/82 p-4 shadow-[0_8px_22px_rgba(46,32,18,0.045)]">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rsp-text text-[10px] font-bold text-white">0{index + 1}</span>
                        <h2 className="font-heading text-lg font-normal tracking-[-0.03em] text-rsp-text">{item.title}</h2>
                      </div>
                      <p className="text-xs leading-5 text-rsp-muted md:text-[13px]">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 border-t border-rsp-border pt-4 md:flex-row md:items-center md:justify-between">
                <p className="max-w-3xl text-xs leading-5 text-rsp-muted">
                  Uploaded images are processed to create your requested edit; review our Privacy Policy and AI Policy for details.
                </p>
                <Link href="/" className="rsp-button-secondary px-4 py-2.5 text-xs md:text-sm">Use ready prompts instead</Link>
              </div>
            </div>
          </div>
        </section>

        <ReferenceEditExplainer />
      </main>
      <Footer />
    </>
  );
}
