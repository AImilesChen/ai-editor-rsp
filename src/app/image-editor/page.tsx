import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import ImageEditorExamples from "@/components/ImageEditorExamples";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Photo Editor — Remove People, Objects, and Background Distractions | AI Editor RSP",
  description:
    "Upload a photo and use AI to remove unwanted people, objects, text marks, or messy backgrounds. Select an area, describe the edit, preview the result, and download.",
  alternates: { canonical: `${SITE_URL}/image-editor` },
};

const editUseCases = [
  {
    title: "Remove people from travel photos",
    description: "Clear background people from open travel scenes while keeping the road, light, and perspective natural.",
    beforeImage: "/images/image-editor-cases/remove-people-large-before.webp",
    afterImage: "/images/image-editor-cases/remove-people-large-after.webp",
    alt: "Before and after AI photo edit showing people removed from a travel road photo",
  },
  {
    title: "Object removal",
    description: "Remove distracting desk or table items while preserving hands, cups, shadows, and surface texture.",
    beforeImage: "/images/image-editor-cases/remove-object-large-before.webp",
    afterImage: "/images/image-editor-cases/remove-object-large-after.webp",
    alt: "Before and after AI photo edit showing unwanted objects removed from a cafe table photo",
  },
  {
    title: "Product background cleanup",
    description: "Remove sale cards and visual clutter so the product stays sharp enough for listings and ads.",
    beforeImage: "/images/image-editor-cases/clean-product-background-large-before.webp",
    afterImage: "/images/image-editor-cases/clean-product-background-large-after.webp",
    alt: "Before and after AI photo edit showing product packaging clutter removed",
  },
  {
    title: "Text and mark removal",
    description: "Erase sample labels, date stamps, or marks from images you own without leaving blur patches.",
    beforeImage: "/images/image-editor-cases/remove-text-marks-large-before.webp",
    afterImage: "/images/image-editor-cases/remove-text-marks-large-after.webp",
    alt: "Before and after AI photo edit showing sample text removed from an image",
  },
];

export default function ImageEditorPage() {
  return (
    <>
      <Header />
      <main className="bg-rsp-bg pb-14 pt-28 md:pb-20 md:pt-32">
        <section className="rsp-container">
          <div className="mx-auto mb-8 max-w-5xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rsp-secondary">Premium AI Photo Editor</p>
            <h1 className="mt-3 font-heading text-5xl font-normal leading-[0.95] tracking-[-0.055em] text-rsp-text md:text-7xl">
              Clean up a photo without rebuilding it from scratch.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-rsp-muted md:text-lg">
              Upload your image, choose the cleanup task, and generate a before/after result through a premium reference-preserving edit route.
            </p>
            <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left text-sm text-rsp-muted sm:grid-cols-3">
              {["1. Upload your photo", "2. Pick what to remove", "3. Preview and download"].map((step) => (
                <div key={step} className="rounded-2xl border border-rsp-border bg-rsp-panel px-4 py-3 font-semibold text-rsp-text shadow-sm">
                  {step}
                </div>
              ))}
            </div>
          </div>

          <GenerateConsole
            headingLevel="h2"
            lockedMode="edit"
            defaultMode="edit"
            editorOnly
            hidePromptLibraryLink
            loginReturnPath="/image-editor"
          />
        </section>

        <section className="rsp-container mt-14 md:mt-20">
          <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">Real cleanup cases</p>
              <h2 className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">Drag to compare before and after</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-rsp-muted">
              Four large before/after examples selected for clean reconstruction, sharp product edges, and no obvious blur-patch artifacts.
            </p>
          </div>

          <ImageEditorExamples examples={editUseCases} />
        </section>
      </main>
      <Footer />
    </>
  );
}
