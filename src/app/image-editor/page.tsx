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
    caseLabel: "Case 01 · Travel cleanup",
    title: "Remove people from travel photos",
    description: "A real travel-style scene with the main subject preserved and background tourists removed without turning the plaza into a fake studio backdrop.",
    task: "Remove passersby",
    result: "Subject and architecture stay natural",
    beforeImage: "/images/image-editor-cases/image2-travel-people-removal-before.webp",
    afterImage: "/images/image-editor-cases/image2-travel-people-removal-after.webp",
    alt: "Before and after AI photo edit showing background tourists removed while the main subject stays natural",
    initialPosition: 42,
  },
  {
    caseLabel: "Case 02 · Home clutter",
    title: "Clean messy room clutter",
    description: "The sofa, desk, window, table, and lighting remain consistent while papers, cups, cables, and visual noise are cleared from the room.",
    task: "Remove clutter",
    result: "Cleaner room, same layout",
    beforeImage: "/images/image-editor-cases/image2-object-removal-table-before.webp",
    afterImage: "/images/image-editor-cases/image2-object-removal-table-after.webp",
    alt: "Before and after AI photo edit showing clutter removed from a living room and home office",
    initialPosition: 48,
  },
  {
    caseLabel: "Case 03 · Product photo",
    title: "Clean product backgrounds",
    description: "Product shape, label direction, and lighting stay stable while the surrounding background distractions are reduced for a cleaner listing image.",
    task: "Clean product scene",
    result: "Sharper product focus",
    beforeImage: "/images/image-editor-cases/image2-product-background-cleanup-before.webp",
    afterImage: "/images/image-editor-cases/image2-product-background-cleanup-after.webp",
    alt: "Before and after AI photo edit showing product background distractions removed",
    initialPosition: 52,
  },
  {
    caseLabel: "Case 04 · Text marks",
    title: "Remove text or watermarks",
    description: "Visible text and red marks are removed from an owned image while the coffee cup, desk surface, and photo composition remain believable.",
    task: "Erase text marks",
    result: "Clean image surface",
    beforeImage: "/images/image-editor-cases/image2-text-marks-removal-before.webp",
    afterImage: "/images/image-editor-cases/image2-text-marks-removal-after.webp",
    alt: "Before and after AI photo edit showing unwanted text and marks removed from an owned image",
    initialPosition: 40,
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

        <section className="rsp-container mt-12 md:mt-16">
          <div className="mx-auto mb-7 flex max-w-7xl flex-col gap-4 md:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">Approved cleanup examples</p>
              <h2 className="mt-2 font-heading text-3xl font-normal tracking-[-0.045em] text-rsp-text md:text-5xl">
                Real before / after cleanup results
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-rsp-muted md:text-base">
                Drag each 4:3 pair to compare the original and cleaned image. The examples below focus on preserving the subject, framing, and natural lighting.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-rsp-muted lg:max-w-md lg:justify-end">
              {["People", "Home", "Product", "Text marks"].map((item) => (
                <span key={item} className="rounded-full border border-rsp-border bg-white/70 px-3 py-2 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ImageEditorExamples examples={editUseCases} />
        </section>
      </main>
      <Footer />
    </>
  );
}
