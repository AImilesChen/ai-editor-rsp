import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
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
    description: "Clean background distractions while keeping the main subject, lighting, and scene natural.",
    prompt: "Remove the people in the background and keep the main subject unchanged.",
    image: "/images/image-editor-cases/real-remove-people-before-after.webp",
    alt: "Before and after AI photo edit showing background people removed while the main subject stays unchanged",
  },
  {
    title: "Remove unwanted objects",
    description: "Select a distracting object and reconstruct the surrounding texture, shadows, and perspective.",
    prompt: "Remove the selected object and fill the area naturally.",
    image: "/images/image-editor-cases/real-remove-object-before-after.webp",
    alt: "Before and after AI photo edit showing a distracting object removed from a product photo",
  },
  {
    title: "Clean product backgrounds",
    description: "Make product shots look simpler, cleaner, and more sales-ready without changing the product.",
    prompt: "Clean up the background and keep the product sharp and unchanged.",
    image: "/images/image-editor-cases/real-clean-product-background-before-after.webp",
    alt: "Before and after AI photo edit showing a cluttered product background cleaned into a studio background",
  },
  {
    title: "Remove text or marks",
    description: "Remove unwanted text, stains, or marks from images you own or have permission to edit.",
    prompt: "Remove the unwanted text or mark and reconstruct the background naturally.",
    image: "/images/image-editor-cases/real-remove-text-marks-before-after.webp",
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
              Remove unwanted people, objects, and distractions.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-rsp-muted md:text-lg">
              This editor is only for photo editing: upload an image, select the area to fix, describe the change, then download the cleaned result. For text-to-image generation, use the homepage.
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
            <p className="max-w-xl text-sm leading-6 text-rsp-muted">
              Choose a task in the editor above or write your own instruction. Only edit images you own or have permission to modify.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {editUseCases.map((item) => (
              <article key={item.title} className="flex h-full flex-col overflow-hidden rounded-[28px] border border-rsp-border bg-rsp-panel shadow-[0_16px_44px_rgba(58,41,30,0.08)]">
                <div className="aspect-[3/2] overflow-hidden bg-rsp-surface">
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-2xl font-normal tracking-[-0.035em] text-rsp-text">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-rsp-muted">{item.description}</p>
                  <p className="mt-4 rounded-2xl border border-rsp-border bg-white/55 px-4 py-3 text-xs leading-5 text-rsp-muted">
                    <span className="font-bold text-rsp-text">Example instruction:</span> {item.prompt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
