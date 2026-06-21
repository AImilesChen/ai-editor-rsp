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
        <section id="try-reference-edit" className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-8 md:px-8 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto max-w-screen-2xl">
            <div className="mb-6 rounded-[34px] border border-rsp-border bg-white/72 p-5 shadow-[0_18px_60px_rgba(46,32,18,0.10)] backdrop-blur md:p-7 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-end">
                <div>
                  <p className="eyebrow">AI Reference Image Editor</p>
                  <h1 className="mt-4 max-w-4xl font-heading text-4xl font-normal leading-[0.96] tracking-[-0.055em] text-rsp-text md:text-6xl lg:text-7xl">
                    Edit uploaded images with AI
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-rsp-muted md:text-lg">
                    Upload a photo, describe the change you want, and compare the before-and-after result before downloading.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {benefits.map((item, index) => (
                    <div key={item.title} className="rounded-2xl border border-rsp-border bg-rsp-surface/82 p-4 shadow-[0_8px_24px_rgba(46,32,18,0.06)]">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rsp-text text-xs font-bold text-white">0{index + 1}</span>
                        <h2 className="font-heading text-xl font-normal tracking-[-0.03em] text-rsp-text">{item.title}</h2>
                      </div>
                      <p className="text-sm leading-6 text-rsp-muted">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-rsp-border pt-4 md:flex-row md:items-center md:justify-between">
                <p className="max-w-3xl text-xs leading-5 text-rsp-muted">
                  Uploaded images are processed to create your requested edit; review our Privacy Policy and AI Policy for details.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/" className="rsp-button-secondary px-5 py-3 text-sm">Use ready prompts instead</Link>
                </div>
              </div>
            </div>

            <GenerateConsole headingLevel="h2" previewHeadingLevel="h2" variant="hero" defaultMode="edit" lockedMode="edit" hidePreviewIntro />
          </div>
        </section>

        <ReferenceEditExplainer />
      </main>
      <Footer />
    </>
  );
}
