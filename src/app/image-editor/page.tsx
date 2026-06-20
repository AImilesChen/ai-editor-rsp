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
        <section id="try-reference-edit" className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-8 md:px-8 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
          <div className="relative mx-auto grid max-w-screen-2xl gap-6 xl:grid-cols-[0.36fr_0.64fr] xl:items-start">
            <div className="rounded-[30px] border border-rsp-border bg-white/72 p-5 shadow-[0_18px_60px_rgba(46,32,18,0.12)] backdrop-blur md:p-7">
              <p className="eyebrow">AI Reference Image Editor</p>
              <h1 className="mt-4 font-heading text-4xl font-normal leading-[0.98] tracking-[-0.05em] text-rsp-text md:text-6xl">
                Upload image. Select area. Edit with AI.
              </h1>
              <p className="mt-5 text-base leading-7 text-rsp-muted">
                Start from your own image: upload a photo, choose whole image or the exact area to redraw, describe only the change, then compare and download the result.
              </p>
              <div className="mt-6 grid gap-3">
                {benefits.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-rsp-border bg-rsp-surface/80 p-4">
                    <h2 className="font-heading text-xl font-normal tracking-[-0.03em] text-rsp-text">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-rsp-muted">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#try-reference-edit" className="rsp-button px-5 py-3 text-sm">Upload image to start</Link>
                <Link href="/" className="rsp-button-secondary px-5 py-3 text-sm">Use ready prompts instead</Link>
              </div>
              <p className="mt-4 text-xs leading-5 text-rsp-muted">3 free credits after login · No payment required to try.</p>
            </div>
            <GenerateConsole headingLevel="h2" previewHeadingLevel="h2" variant="hero" defaultMode="edit" lockedMode="edit" />
          </div>
        </section>

        <ReferenceEditExplainer />
      </main>
      <Footer />
    </>
  );
}
