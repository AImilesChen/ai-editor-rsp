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
    description: "Remove background tourists while keeping the main person, pose, and travel scene believable.",
    beforeImage: "/images/image-editor-cases/image2-travel-people-removal-before.webp",
    afterImage: "/images/image-editor-cases/image2-travel-people-removal-after.webp",
    alt: "Before and after AI photo edit showing background tourists removed while the main subject stays natural",
  },
  {
    title: "Remove unwanted objects",
    description: "Erase table clutter, phones, notes, or small distractions without changing the real scene.",
    beforeImage: "/images/image-editor-cases/image2-object-removal-table-before.webp",
    afterImage: "/images/image-editor-cases/image2-object-removal-table-after.webp",
    alt: "Before and after AI photo edit showing unwanted objects removed from a cafe table",
  },
  {
    title: "Clean product backgrounds",
    description: "Remove promo tags and background clutter while keeping the product sharp for listings or ads.",
    beforeImage: "/images/image-editor-cases/image2-product-background-cleanup-before.webp",
    afterImage: "/images/image-editor-cases/image2-product-background-cleanup-after.webp",
    alt: "Before and after AI photo edit showing product background distractions removed",
  },
  {
    title: "Remove text or marks",
    description: "Erase sample text, date stamps, or visible marks from images you own or can modify.",
    beforeImage: "/images/image-editor-cases/image2-text-marks-removal-before.webp",
    afterImage: "/images/image-editor-cases/image2-text-marks-removal-after.webp",
    alt: "Before and after AI photo edit showing unwanted text and marks removed from an owned image",
  },
];

export default function ImageEditorPage() {
  return (
    <>
      <Header />
      <main className="bg-rsp-bg pb-14 pt-28 md:pb-20 md:pt-32">
        <section className="rsp-container">
          <div className="mx-auto mb-9 max-w-5xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rsp-secondary">AI Photo Editor</p>
            <h1 className="mt-3 font-heading text-5xl font-normal leading-[0.95] tracking-[-0.055em] text-rsp-text md:text-7xl">
              Clean unwanted people, objects, and marks from real photos.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-rsp-muted md:text-lg">
              Upload your image, describe the area to clean, compare before and after, then download a result that still looks like your original photo.
            </p>
            <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left text-sm text-rsp-muted sm:grid-cols-3">
              {["Upload the original", "Tell AI what to remove", "Compare before / after"].map((step) => (
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
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">Approved cleanup examples</p>
              <h2 className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] text-rsp-text md:text-5xl">Drag to compare real before and after edits</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-rsp-muted">
              These approved examples use the same clear before/after structure: visible distractions on the left, cleaned results on the right. Only edit images you own or have permission to modify.
            </p>
          </div>

          <ImageEditorExamples examples={editUseCases} />
        </section>
      </main>
      <Footer />
    </>
  );
}
