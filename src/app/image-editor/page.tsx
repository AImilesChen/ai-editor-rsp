import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import ImageEditorExamples from "@/components/ImageEditorExamples";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Photo Editor to Remove People, Objects, Text Marks & Background Clutter",
  description:
    "Use AI Editor RSP as an AI photo editor and object remover for owned images. Brush what to remove, clean people, objects, text marks, or background clutter, then compare before and after.",
  keywords: [
    "AI photo editor",
    "AI object remover",
    "remove people from photos",
    "clean up image",
    "remove objects from photos",
    "remove text from image",
    "photo cleanup tool",
  ],
  alternates: { canonical: `${SITE_URL}/image-editor` },
  openGraph: {
    title: "AI Photo Editor & Object Remover | AI Editor RSP",
    description:
      "Brush unwanted areas in your own photos and use AI to remove people, objects, text marks, and background distractions while preserving the rest of the image.",
    url: `${SITE_URL}/image-editor`,
    type: "website",
  },
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
    title: "Remove text or marks",
    description: "Visible text and red marks are removed from an owned image while the coffee cup, desk surface, and photo composition remain believable.",
    task: "Erase text marks",
    result: "Clean image surface",
    beforeImage: "/images/image-editor-cases/image2-text-marks-removal-before.webp",
    afterImage: "/images/image-editor-cases/image2-text-marks-removal-after.webp",
    alt: "Before and after AI photo edit showing unwanted text and marks removed from an owned image",
    initialPosition: 40,
  },
];

const cleanupWorkflows = [
  {
    title: "Remove people from photos",
    body: "Clean background tourists, passersby, or accidental people from travel and lifestyle photos while keeping the main subject and setting recognizable.",
  },
  {
    title: "Remove objects from photos",
    body: "Brush over cups, cables, trash, signs, packaging, or other distracting items and let the editor rebuild the surrounding area.",
  },
  {
    title: "Clean up product photos",
    body: "Reduce background clutter around products for cleaner marketplace, portfolio, or social images without changing the product shape.",
  },
  {
    title: "Remove text marks from owned images",
    body: "Erase visible notes, labels, stickers, or markup from images you own or have permission to edit, then compare the result before downloading.",
  },
];

const editorSteps = [
  {
    title: "Upload your image",
    body: "Start with a JPG, PNG, or WebP photo. The workspace keeps the original visible so you can judge the edit against the source image.",
  },
  {
    title: "Brush the area to remove",
    body: "Paint only the unwanted person, object, text mark, or clutter. Unpainted areas are treated as content to preserve, not as extra edit targets.",
  },
  {
    title: "Preview and compare",
    body: "Use the before / after comparison to check whether the cleanup still looks natural before opening or downloading the result.",
  },
];

const editorFaqs = [
  {
    question: "What can I remove with the AI photo editor?",
    answer:
      "AI Editor RSP is designed for common photo cleanup tasks such as removing people from photos, removing unwanted objects, cleaning up product backgrounds, and erasing text marks or markup from images you own or have permission to edit.",
  },
  {
    question: "How do I control what the AI object remover changes?",
    answer:
      "Use Brush area and paint the unwanted item. The editor sends the original image plus a visible brush overlay so the cleanup prompt can focus on the marked area and preserve unpainted parts of the photo.",
  },
  {
    question: "Will unpainted areas stay unchanged?",
    answer:
      "The workflow is built around preserving unpainted areas, and the prompt asks the model to keep the rest of the image stable. Very complex scenes can still vary, so always compare the before and after preview before using the result.",
  },
  {
    question: "Can I remove text or marks from any image?",
    answer:
      "Only edit images you own or have permission to modify. Do not use the tool to remove rights notices, attribution, or protective marks from third-party images without authorization.",
  },
  {
    question: "Is this the same as a full design editor?",
    answer:
      "No. This page is focused on photo cleanup: remove people, remove objects, clean backgrounds, and erase visible marks. It keeps the workflow simple so the main task is upload, brush, generate, compare, and download.",
  },
  {
    question: "Who is the AI image editor best for?",
    answer:
      "It is best for creators, marketers, e-commerce sellers, freelancers, and small teams that need fast photo cleanup for owned images instead of a full manual retouching workflow.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: editorFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Editor RSP AI Photo Editor",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/image-editor`,
  description:
    "A browser-based AI photo editor for removing people, unwanted objects, text marks, and background clutter from owned images with a brush-based cleanup workflow.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    availability: "https://schema.org/OnlineOnly",
  },
};

export default function ImageEditorPage() {
  return (
    <>
      <Header />
      <script type="application/ld+json">{JSON.stringify([faqJsonLd, softwareJsonLd])}</script>
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

        <section className="rsp-container mt-12 md:mt-16">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-[2rem] border border-rsp-border bg-white/80 p-6 shadow-sm md:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">Photo cleanup workflows</p>
              <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.045em] text-rsp-text md:text-5xl">
                One AI object remover for the cleanup tasks people search for.
              </h2>
              <p className="mt-4 text-sm leading-6 text-rsp-muted md:text-base">
                Keep the tool simple: upload a photo, brush what should disappear, and compare the cleaned result. The page focuses on practical image cleanup instead of adding a full design suite around a single edit.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {cleanupWorkflows.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-rsp-border bg-rsp-panel p-5 shadow-sm">
                  <h3 className="font-heading text-2xl font-normal tracking-[-0.035em] text-rsp-text">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-rsp-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rsp-container mt-12 md:mt-16">
          <div className="rounded-[2rem] border border-rsp-border bg-[#FBF7F0] p-6 shadow-sm md:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">Best fit</p>
                <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.045em] text-rsp-text md:text-5xl">
                  Use the AI image editor when the original photo is almost right.
                </h2>
                <p className="mt-4 text-sm leading-6 text-rsp-muted md:text-base">
                  The strongest use case is cleanup, not total replacement. If a travel photo has background people, a product image has table clutter, or a social post has a distracting mark, brush the problem area and keep the rest of the image familiar.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {["Travel and lifestyle cleanup", "Product and marketplace photos", "Creator images with small distractions"].map((item) => (
                  <article key={item} className="rounded-[1.35rem] border border-rsp-border bg-white/80 p-5">
                    <h3 className="text-base font-bold text-rsp-text">{item}</h3>
                    <p className="mt-2 text-sm leading-6 text-rsp-muted">Remove people, objects, marks, or clutter while preserving the subject, framing, and natural lighting.</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rsp-container mt-12 md:mt-16">
          <div className="rounded-[2rem] border border-rsp-border bg-rsp-text p-6 text-white shadow-sm md:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">How it works</p>
                <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.045em] md:text-5xl">
                  Brush-based cleanup keeps the edit focused.
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                  Competitor pages often rely on one-click demos. For AI Editor RSP, the clearest user promise is control: the brush tells the editor what to remove, and the before / after slider makes the result easy to inspect.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {editorSteps.map((step, index) => (
                  <article key={step.title} className="rounded-[1.35rem] border border-white/10 bg-white/10 p-5">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-rsp-secondary">Step {index + 1}</span>
                    <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rsp-container mt-12 md:mt-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rsp-secondary">AI photo editor FAQ</p>
            <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-0.045em] text-rsp-text md:text-5xl">
              Questions before you clean up an image
            </h2>
          </div>
          <div className="mx-auto mt-7 grid max-w-4xl gap-3">
            {editorFaqs.map((item) => (
              <details key={item.question} className="group rounded-[1.4rem] border border-rsp-border bg-white/80 p-5 shadow-sm">
                <summary className="cursor-pointer list-none text-left text-base font-bold text-rsp-text marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-rsp-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
