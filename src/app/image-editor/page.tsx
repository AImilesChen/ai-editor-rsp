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
    description: "Clean up tourists or passersby while preserving the travel scene naturally.",
    prompt: "Remove the people in the background and keep the main subject unchanged.",
    beforeImage: "/images/image-editor-cases/premium-remove-people-before.webp",
    afterImage: "/images/image-editor-cases/premium-remove-people-after.webp",
    alt: "Before and after AI photo edit showing background people removed while the main subject stays unchanged",
  },
  {
    title: "Remove unwanted objects",
    description: "Erase table clutter, notes, or small distractions without breaking the scene.",
    prompt: "Remove the selected object and fill the area naturally.",
    beforeImage: "/images/image-editor-cases/premium-remove-objects-before.webp",
    afterImage: "/images/image-editor-cases/premium-remove-objects-after.webp",
    alt: "Before and after AI photo edit showing a distracting object removed from a product photo",
  },
  {
    title: "Clean product backgrounds",
    description: "Turn messy product shots into cleaner listing-ready images.",
    prompt: "Clean up the background and keep the product sharp and unchanged.",
    beforeImage: "/images/image-editor-cases/premium-clean-product-background-before.webp",
    afterImage: "/images/image-editor-cases/premium-clean-product-background-after.webp",
    alt: "Before and after AI photo edit showing a cluttered product background cleaned into a studio background",
  },
  {
    title: "Remove text or marks",
    description: "Erase sample text, date stamps, or visible marks from images you can edit.",
    prompt: "Remove the unwanted text or mark and reconstruct the background naturally.",
    beforeImage: "/images/image-editor-cases/premium-remove-text-before.webp",
    afterImage: "/images/image-editor-cases/premium-remove-text-after.webp",
    alt: "Before and after AI photo edit showing unwanted text and marks removed from an owned image",
  },
];

export default function ImageEditorPage() {
  return (
    <>
      <Header />
      <main className="bg-rsp-bg pb-14 pt-28 md:pb-20 md:pt-32">
        <section className="rsp-container">
          <div className="mx-auto mb-8 max-w-4xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rsp-secondary">AI Photo Editor</p>
            <h1 className="mt-3 font-heading text-5xl font-normal leading-[0.95] tracking-[-0.055em] text-rsp-text md:text-7xl">
              Remove people, objects, and text from photos.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-rsp-muted md:text-lg">
              Upload a photo, choose what to remove, preview the before/after, then download the cleaned result.
            </p>
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
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">Common edits</p>
              <h2 className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">Photo cleanup examples</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-rsp-muted">
              Drag each image to see what gets removed. Only edit images you own or have permission to modify.
            </p>
          </div>

          <ImageEditorExamples examples={editUseCases} />
        </section>
      </main>
      <Footer />
    </>
  );
}
