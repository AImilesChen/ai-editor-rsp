import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Headshot Generator — AI Editor RSP",
  description: "Upload your photo and generate a polished professional headshot for LinkedIn, resumes, and business profiles.",
  alternates: { canonical: `${SITE_URL}/image-editor` },
};

export default function ReferenceEditPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section id="try-reference-edit" className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-6 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto max-w-screen-2xl">
            <div className="mb-5 max-w-4xl">
              <p className="eyebrow text-[10px]">AI Image Editor</p>
              <h1 className="mt-3 font-heading text-4xl font-normal leading-[0.98] tracking-[-0.05em] text-rsp-text md:text-6xl">
                Upload a photo. Create a professional headshot.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-rsp-muted md:text-base">
                A focused headshot flow: upload your photo, keep 3:4 portrait framing, add optional outfit or background details, then generate.
              </p>
            </div>

            <div id="headshot-upload" className="scroll-mt-28">
              <GenerateConsole headingLevel="h2" previewHeadingLevel="h2" variant="hero" defaultMode="edit" lockedMode="edit" defaultPreset="headshot" hidePreviewIntro />
            </div>

            <p className="mt-4 rounded-[24px] border border-rsp-border bg-white/76 p-4 text-xs leading-5 text-rsp-muted shadow-[0_10px_28px_rgba(46,32,18,0.06)] backdrop-blur">
              Upload your own photo or an image you have permission to edit. AI tries to preserve identity, but results may vary.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
