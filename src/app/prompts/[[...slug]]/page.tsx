import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyPromptButton from "@/components/CopyPromptButton";
import { prompts } from "@/lib/data/prompts";
import { promptPages, promptLibraryMeta, categories } from "@/lib/data/prompt-pages";
import { site } from "@/lib/rsp-content";

const activePrompts = prompts.filter((prompt) => prompt.status === "active");

export async function generateStaticParams() {
  return [
    { slug: [] },
    ...activePrompts.map((prompt) => ({ slug: [prompt.slug] })),
    ...promptPages.map((page) => ({ slug: [page.slug] })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const legacyPrompt = slug?.[0] ? activePrompts.find((prompt) => prompt.slug === slug[0]) : undefined;
  const stylePage = slug?.[0] ? promptPages.find((page) => page.slug === slug[0]) : undefined;

  if (legacyPrompt) {
    return {
      title: `${legacyPrompt.title} — AI Image Prompt`,
      description: legacyPrompt.prompt,
      alternates: { canonical: `${site.url}/prompts/${legacyPrompt.slug}` },
      openGraph: {
        title: `${legacyPrompt.title} — AI Image Prompt`,
        description: legacyPrompt.prompt,
        url: `${site.url}/prompts/${legacyPrompt.slug}`,
        type: "article",
        images: legacyPrompt.after_image ? [legacyPrompt.after_image] : undefined,
      },
    };
  }

  if (stylePage) {
    return {
      title: stylePage.title,
      description: stylePage.metaDescription,
      alternates: { canonical: `${site.url}/prompts/${stylePage.slug}` },
      openGraph: {
        title: stylePage.title,
        description: stylePage.metaDescription,
        url: `${site.url}/prompts/${stylePage.slug}`,
        type: "article",
        images: [stylePage.sampleImage],
      },
    };
  }

  return {
    title: "Browse AI Image Prompts",
    description: `Browse all ${activePrompts.length} original AI image prompts, plus ${promptPages.length} prompt style guides with example images for AI Editor RSP.`,
    alternates: { canonical: `${site.url}/prompts` },
    openGraph: {
      title: "Browse AI Image Prompts",
      description: `Browse all ${activePrompts.length} original AI image prompts, plus ${promptPages.length} prompt style guides with example images for AI Editor RSP.`,
      url: `${site.url}/prompts`,
      type: "website",
    },
  };
}

function UsePromptButton({ prompt }: { prompt: string }) {
  const href = `/generate?prompt=${encodeURIComponent(prompt)}`;
  return (
    <Link
      href={href}
      className="rounded-full bg-rsp-primary px-5 py-2.5 text-sm font-bold text-rsp-on-primary no-underline transition hover:opacity-90"
    >
      Use this prompt
    </Link>
  );
}

function LegacyPromptDetailPage({ prompt }: { prompt: (typeof activePrompts)[number] }) {
  return (
    <article className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative overflow-hidden rounded-2xl border border-rsp-border bg-[#F3E8DA]">
        {prompt.after_image ? (
          <img
            src={prompt.after_image}
            alt={`${prompt.title} preview`}
            className="h-auto w-full object-contain"
          />
        ) : null}
        <span className="chip absolute left-6 top-6 bg-white/85 text-rsp-text shadow-sm">{prompt.category}</span>
      </div>
      <div>
        <p className="eyebrow">Prompt detail</p>
        <h1 className="mt-3 font-heading text-5xl font-bold">{prompt.title}</h1>
        <p className="mt-5 text-rsp-muted">{prompt.prompt}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-rsp-panel p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Category</p>
            <p className="mt-2 font-semibold text-rsp-text">{prompt.category}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-rsp-panel p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Tool</p>
            <p className="mt-2 font-semibold text-rsp-text">{prompt.tool}</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-rsp-panel p-5 font-mono text-sm leading-6 text-rsp-text">
          {prompt.prompt}
        </div>
        <div className="mt-4">
          <CopyPromptButton prompt={prompt.prompt} />
        </div>
        {prompt.negative_prompt ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-rsp-panel/70 p-5 text-sm leading-6 text-rsp-muted">
            <span className="font-semibold text-rsp-text">Negative prompt: </span>
            {prompt.negative_prompt}
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={`/generate?prompt=${encodeURIComponent(prompt.prompt)}`} className="rounded-full bg-rsp-primary px-6 py-3 text-center text-sm font-bold text-rsp-on-primary no-underline">
            Generate with this prompt
          </Link>
          <Link href="/prompts" className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-bold text-rsp-text no-underline">
            Back to library
          </Link>
        </div>
      </div>
    </article>
  );
}

function StyleGuideDetailPage({ page }: { page: (typeof promptPages)[number] }) {
  return (
    <article>
      <section className="relative overflow-hidden border-b border-rsp-border bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-12 md:px-8 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
        <div className="relative mx-auto grid max-w-screen-2xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <p className="eyebrow">{page.categoryLabel} style guide</p>
            <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-[-0.03em] md:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-rsp-muted">{page.heroText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
              <Link
                href="/prompts"
                className="rounded-full border border-rsp-secondary/30 px-5 py-2.5 text-sm font-bold text-rsp-secondary no-underline transition hover:bg-rsp-secondary/10"
              >
                Back to all prompts
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-[0_24px_80px_rgba(94,63,36,0.16)] backdrop-blur">
            <img
              src={page.sampleImage}
              alt={page.sampleImageAlt}
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
            />
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-rsp-muted">
              Example output
            </p>
          </div>
        </div>
      </section>

      <div className="section-pad">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.38fr]">
            <div className="space-y-10">
              <section>
                <h2 className="font-heading text-2xl font-bold">What it is</h2>
                <p className="mt-3 text-base leading-7 text-rsp-muted">{page.whatItIs}</p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold">Best for</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {page.bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-rsp-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rsp-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold">Prompt examples</h2>
                <div className="mt-5 space-y-5">
                  {page.prompts.map((example, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl border border-rsp-border bg-rsp-panel"
                    >
                      <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="relative min-h-56 bg-[#F3E8DA] lg:min-h-full">
                          <img
                            src={page.sampleImage}
                            alt={`${page.sampleImageAlt} for ${example.title}`}
                            className="h-full min-h-56 w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                            Sample image
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-heading text-lg font-semibold">{example.title}</h3>
                            <div className="flex shrink-0 gap-2">
                              <CopyPromptButton prompt={example.prompt} label="Copy" />
                              <UsePromptButton prompt={example.prompt} />
                            </div>
                          </div>
                          <div className="mt-4 rounded-xl border border-white/10 bg-rsp-panel-strong p-4">
                            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-rsp-text">
                              {example.prompt}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold">Better results tips</h2>
                <ul className="mt-3 space-y-2">
                  {page.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-rsp-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rsp-secondary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold">FAQ</h2>
                <div className="mt-5 space-y-4">
                  {page.faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-2xl border border-rsp-border bg-rsp-panel p-5">
                      <h3 className="font-heading text-lg font-semibold">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-rsp-muted">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold">Related styles</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {page.related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/prompts/${rel.slug}`}
                      className="rounded-full border border-rsp-secondary/30 bg-rsp-secondary/10 px-4 py-2 text-sm font-semibold text-rsp-secondary no-underline transition hover:bg-rsp-secondary hover:text-white"
                    >
                      {rel.title}
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <aside className="hidden space-y-6 lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-rsp-border bg-rsp-panel p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Category</p>
                  <p className="mt-2 font-semibold text-rsp-text">{page.categoryLabel}</p>
                </div>
                <div className="rounded-2xl border border-rsp-border bg-rsp-panel p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Prompts</p>
                  <p className="mt-2 font-semibold text-rsp-text">{page.prompts.length} examples</p>
                </div>
                <div className="rounded-2xl border border-rsp-border bg-rsp-panel p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Quick action</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
                    <Link
                      href="/prompts"
                      className="rounded-full border border-white/15 px-4 py-2 text-center text-sm font-bold text-rsp-text no-underline transition hover:bg-white/10"
                    >
                      Browse all prompts
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}

function categoryAnchor(categoryKey: string) {
  return `style-${categoryKey.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function PromptStyleQuickNav() {
  return (
    <section className="mx-auto mt-8 max-w-screen-xl rounded-[2rem] border border-rsp-border bg-white/75 p-5 shadow-[0_18px_60px_rgba(94,63,36,0.10)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rsp-secondary">Quick find</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-rsp-text">Style guide categories</h2>
          <p className="mt-2 text-sm leading-6 text-rsp-muted">
            Jump to the new prompt categories, then open the style guide that matches the image you want to create.
          </p>
        </div>
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const pages = promptPages.filter((page) => page.category === category.key);
            if (!pages.length) return null;
            return (
              <div key={category.key} className="rounded-2xl border border-rsp-border bg-rsp-panel p-4">
                <a
                  href={`#${categoryAnchor(category.key)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-rsp-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rsp-secondary no-underline transition hover:bg-rsp-secondary hover:text-white"
                >
                  {category.label}
                  <span>{pages.length}</span>
                </a>
                <div className="mt-3 flex flex-col gap-2">
                  {pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/prompts/${page.slug}`}
                      className="text-sm font-semibold leading-5 text-rsp-text no-underline transition hover:text-rsp-secondary"
                    >
                      {page.h1}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PromptsLibraryPage() {
  return (
    <>
      <section className="section-pad pt-32">
        <div className="mx-auto max-w-screen-2xl">
          <p className="eyebrow text-center">Prompt Library</p>
          <h1 className="mt-3 text-center font-heading text-5xl font-bold">Browse AI Image Prompts</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-rsp-muted">
            Browse all {activePrompts.length} original prompt recipes with categories, tool notes, preview images, and detail pages. New style-guide pages are added below without replacing the original library.
          </p>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-rsp-panel p-4">
            <input
              className="w-full rounded-xl border border-white/10 bg-rsp-panel-strong px-4 py-3 text-rsp-text outline-none focus:border-rsp-primary"
              placeholder="Search prompts by style, scene, or tool"
              aria-label="Search prompts"
            />
            <p className="mt-3 text-sm text-rsp-muted">Static library view: use browser find or open a prompt card for details.</p>
          </div>
          <PromptStyleQuickNav />
          <div className="mt-10 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activePrompts.map((prompt) => (
              <article key={prompt.slug} className="group overflow-hidden rounded-2xl border border-rsp-border bg-rsp-panel transition hover:-translate-y-1 hover:border-rsp-primary/60">
                <Link href={`/prompts/${prompt.slug}`} className="relative block bg-[#F3E8DA] no-underline">
                  {prompt.after_image ? (
                    <img
                      src={prompt.after_image}
                      alt={`${prompt.title} preview`}
                      className="h-auto w-full object-contain transition duration-500"
                    />
                  ) : null}
                  <span className="chip absolute left-4 top-4 bg-white/85 text-rsp-text shadow-sm">{prompt.category}</span>
                </Link>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">{prompt.tool}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-rsp-text">{prompt.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-rsp-muted">{prompt.prompt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-rsp-muted">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <CopyPromptButton prompt={prompt.prompt} />
                    <Link href={`/prompts/${prompt.slug}`} className="text-sm font-bold text-rsp-secondary no-underline">View details →</Link>
                    <Link href={`/generate?prompt=${encodeURIComponent(prompt.prompt)}`} className="text-sm font-bold text-rsp-secondary no-underline">Use this prompt</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-rsp-border bg-rsp-panel/30">
        <div className="mx-auto max-w-screen-2xl">
          <p className="eyebrow text-center">New style guides</p>
          <h2 className="mt-3 text-center font-heading text-4xl font-bold tracking-[-0.03em]">
            {promptLibraryMeta.h1}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-rsp-muted">
            These are additional prompt-guide pages with example outputs. They do not replace the original prompt cases above.
          </p>
          <div className="mt-10 space-y-12">
            {categories.map((category) => {
              const pages = promptPages.filter((page) => page.category === category.key);
              if (!pages.length) return null;
              return (
                <section key={category.key} id={categoryAnchor(category.key)} className="scroll-mt-28">
                  <div className="mb-5 flex items-center gap-3">
                    <h3 className="font-heading text-2xl font-bold">{category.label}</h3>
                    <span className="rounded-full bg-rsp-secondary/10 px-3 py-1 text-xs font-semibold text-rsp-secondary">
                      {pages.length}
                    </span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {pages.map((page) => (
                      <article
                        key={page.slug}
                        className="group overflow-hidden rounded-2xl border border-rsp-border bg-rsp-panel transition hover:-translate-y-1 hover:border-rsp-primary/60"
                      >
                        <Link href={`/prompts/${page.slug}`} className="block no-underline">
                          <div className="relative h-56 overflow-hidden bg-[#F3E8DA]">
                            <img
                              src={page.sampleImage}
                              alt={page.sampleImageAlt}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                              Example output
                            </div>
                          </div>
                        </Link>
                        <div className="p-5">
                          <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">{page.categoryLabel}</p>
                          <h4 className="mt-2 font-heading text-xl font-bold text-rsp-text">{page.h1}</h4>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-rsp-muted">{page.metaDescription}</p>
                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <CopyPromptButton prompt={page.prompts[0]?.prompt ?? ""} label="Copy prompt" />
                            <Link href={`/prompts/${page.slug}`} className="text-sm font-bold text-rsp-secondary no-underline">
                              View guide →
                            </Link>
                            <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default async function PromptsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const selectedLegacyPrompt = slug?.[0] ? activePrompts.find((prompt) => prompt.slug === slug[0]) : undefined;
  const selectedStylePage = slug?.[0] ? promptPages.find((page) => page.slug === slug[0]) : undefined;

  if (slug?.[0] && !selectedLegacyPrompt && !selectedStylePage) notFound();

  return (
    <>
      <Header />
      <main>
        {selectedLegacyPrompt ? (
          <section className="section-pad pt-32">
            <div className="mx-auto max-w-screen-2xl">
              <LegacyPromptDetailPage prompt={selectedLegacyPrompt} />
            </div>
          </section>
        ) : selectedStylePage ? (
          <StyleGuideDetailPage page={selectedStylePage} />
        ) : (
          <PromptsLibraryPage />
        )}
      </main>
      <Footer />
    </>
  );
}
