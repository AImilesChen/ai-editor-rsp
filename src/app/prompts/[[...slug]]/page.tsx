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
const professionalHeadshotHref = "/ai-headshot-generator#headshot-upload";

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
      robots: legacyPrompt.slug.startsWith("p1-") ? { index: false, follow: true } : undefined,
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
        ...(stylePage.sampleImage ? { images: [stylePage.sampleImage] } : {}),
      },
    };
  }

  return {
    title: "Browse AI Image Prompts",
    description: `Browse all ${activePrompts.length} original AI image prompts, plus ${promptPages.length} prompt style guides for AI Editor RSP.`,
    alternates: { canonical: `${site.url}/prompts` },
    openGraph: {
      title: "Browse AI Image Prompts",
      description: `Browse all ${activePrompts.length} original AI image prompts, plus ${promptPages.length} prompt style guides for AI Editor RSP.`,
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
              {page.slug === "ai-headshot" ? (
                <Link
                  href={professionalHeadshotHref}
                  className="rounded-full bg-rsp-primary px-5 py-2.5 text-sm font-bold text-rsp-on-primary no-underline transition hover:opacity-90"
                >
                  Upload photo for headshot
                </Link>
              ) : null}
              <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
              <Link
                href="/prompts"
                className="rounded-full border border-rsp-secondary/30 px-5 py-2.5 text-sm font-bold text-rsp-secondary no-underline transition hover:bg-rsp-secondary/10"
              >
                Back to all prompts
              </Link>
            </div>
          </div>
          {page.sampleImage ? (
            <div className="rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-[0_24px_80px_rgba(94,63,36,0.16)] backdrop-blur">
              <img
                src={page.sampleImage}
                alt={page.sampleImageAlt ?? `${page.h1} prompt-matched sample`}
                className="h-auto w-full rounded-[1.5rem] object-contain"
              />
              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-rsp-muted">
                Prompt-matched sample
              </p>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_24px_80px_rgba(94,63,36,0.12)] backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rsp-secondary">Prompt examples only</p>
              <p className="mt-4 text-sm leading-6 text-rsp-muted">
                We only show a case image when the visual asset is confirmed to match this prompt category. Use the prompts below to generate your own output.
              </p>
            </div>
          )}
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
                      <div className="grid gap-5 p-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="overflow-hidden rounded-2xl border border-rsp-border bg-[#F3E8DA]">
                          <img
                            src={example.sampleImage}
                            alt={example.sampleImageAlt}
                            className="h-auto w-full object-contain"
                          />
                          <p className="border-t border-rsp-border bg-white/70 px-3 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-rsp-muted">
                            Generated case image
                          </p>
                        </div>
                        <div>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-heading text-lg font-semibold">{example.title}</h3>
                            <div className="flex shrink-0 flex-wrap gap-2">
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

function PromptsLibraryPage() {
  return (
    <>
      <section className="section-pad pt-32">
        <div className="mx-auto max-w-screen-2xl">
          <p className="eyebrow text-center">Prompt Library</p>
          <h1 className="mt-3 text-center font-heading text-5xl font-bold">Browse AI Image Prompts</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-rsp-muted">
            Browse ready-to-use AI image prompts by style, scene, and use case.
          </p>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-rsp-panel p-4">
            <input
              className="w-full rounded-xl border border-white/10 bg-rsp-panel-strong px-4 py-3 text-rsp-text outline-none focus:border-rsp-primary"
              placeholder="Search prompts by style, scene, or tool"
              aria-label="Search prompts"
            />
          </div>
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
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const pages = promptPages.filter((page) => page.category === category.key);
              if (!pages.length) return null;
              return (
                <span
                  key={category.key}
                  className="rounded-full border border-rsp-border bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-rsp-secondary"
                >
                  {category.label} · {pages.length}
                </span>
              );
            })}
          </div>
          <div className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-4">
            {promptPages.map((page) => (
              <article
                key={page.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-rsp-border bg-rsp-panel shadow-[0_14px_40px_rgba(94,63,36,0.08)] transition hover:-translate-y-1 hover:border-rsp-primary/60 hover:shadow-[0_18px_55px_rgba(94,63,36,0.14)]"
              >
                <Link href={`/prompts/${page.slug}`} className="block no-underline">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F3E8DA]">
                    {page.sampleImage ? (
                      <img
                        src={page.sampleImage}
                        alt={page.sampleImageAlt ?? `${page.h1} prompt-matched sample`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-rsp-muted">
                        Prompt examples only
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                      {page.sampleImage ? "Matching sample" : "No sample image"}
                    </div>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rsp-secondary">{page.categoryLabel}</p>
                  <h4 className="mt-2 min-h-[3.5rem] font-heading text-xl font-bold leading-tight text-rsp-text">{page.h1}</h4>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-rsp-muted">{page.metaDescription}</p>
                  <div className="mt-auto pt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <CopyPromptButton prompt={page.prompts[0]?.prompt ?? ""} label="Copy prompt" />
                      <Link href={`/prompts/${page.slug}`} className="text-sm font-bold text-rsp-secondary no-underline">
                        View guide →
                      </Link>
                      {page.slug === "ai-headshot" ? (
                        <Link href={professionalHeadshotHref} className="text-sm font-bold text-rsp-secondary no-underline">
                          Upload photo →
                        </Link>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
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
