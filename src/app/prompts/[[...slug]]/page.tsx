import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyPromptButton from "@/components/CopyPromptButton";
import { prompts } from "@/lib/data/prompts";
import { site } from "@/lib/rsp-content";

const activePrompts = prompts.filter((prompt) => prompt.status === "active");

export async function generateStaticParams() {
  return [{ slug: [] }, ...activePrompts.map((prompt) => ({ slug: [prompt.slug] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const item = slug?.[0] ? activePrompts.find((prompt) => prompt.slug === slug[0]) : undefined;

  if (item) {
    return {
      title: `${item.title} — AI Image Prompt`,
      description: item.prompt,
      alternates: { canonical: `${site.url}/prompts/${item.slug}` },
      openGraph: {
        title: `${item.title} — AI Image Prompt`,
        description: item.prompt,
        url: `${site.url}/prompts/${item.slug}`,
        type: "article",
      },
    };
  }

  return {
    title: "Browse AI Image Prompts",
    description: `Browse ${activePrompts.length} AI image prompts with categories, tool notes, and preview images for AI Editor RSP.`,
    alternates: { canonical: `${site.url}/prompts` },
    openGraph: {
      title: "Browse AI Image Prompts",
      description: `Browse ${activePrompts.length} AI image prompts with categories, tool notes, and preview images for AI Editor RSP.`,
      url: `${site.url}/prompts`,
      type: "website",
    },
  };
}

export default async function PromptsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const selected = slug?.[0] ? activePrompts.find((prompt) => prompt.slug === slug[0]) : undefined;

  if (slug?.[0] && !selected) notFound();

  return (
    <>
      <Header />
      <main className="section-pad pt-32">
        <div className="mx-auto max-w-screen-2xl">
          {selected ? (
            <article className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden rounded-2xl border border-rsp-border bg-[#F3E8DA]">
                {selected.after_image ? (
                  <img
                    src={selected.after_image}
                    alt={`${selected.title} preview`}
                    className="h-auto w-full object-contain"
                  />
                ) : null}
                <span className="chip absolute left-6 top-6 bg-white/85 text-rsp-text shadow-sm">{selected.category}</span>
              </div>
              <div>
                <p className="eyebrow">Prompt detail</p>
                <h1 className="mt-3 font-heading text-5xl font-bold">{selected.title}</h1>
                <p className="mt-5 text-rsp-muted">{selected.prompt}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-rsp-panel p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Category</p>
                    <p className="mt-2 font-semibold text-rsp-text">{selected.category}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-rsp-panel p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-rsp-muted">Tool</p>
                    <p className="mt-2 font-semibold text-rsp-text">{selected.tool}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-rsp-panel p-5 font-mono text-sm leading-6 text-rsp-text">
                  {selected.prompt}
                </div>
                <div className="mt-4">
                  <CopyPromptButton prompt={selected.prompt} />
                </div>
                {selected.negative_prompt ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-rsp-panel/70 p-5 text-sm leading-6 text-rsp-muted">
                    <span className="font-semibold text-rsp-text">Negative prompt: </span>
                    {selected.negative_prompt}
                  </div>
                ) : null}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/generate?prompt=${selected.slug}`} className="rounded-full bg-rsp-primary px-6 py-3 text-center text-sm font-bold text-rsp-on-primary no-underline">
                    Generate with this prompt
                  </Link>
                  <Link href="/prompts" className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-bold text-rsp-text no-underline">
                    Back to library
                  </Link>
                </div>
                <p className="mt-4 text-sm text-rsp-muted">Generation requests run through the secure Worker API when configured.</p>
              </div>
            </article>
          ) : (
            <>
              <p className="eyebrow text-center">Prompt Library</p>
              <h1 className="mt-3 text-center font-heading text-5xl font-bold">Browse AI Image Prompts</h1>
              <p className="mx-auto mt-4 max-w-2xl text-center text-rsp-muted">
                Browse all {activePrompts.length} prompt recipes with categories, tool notes, preview images, and detail pages.
              </p>
              <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-rsp-panel p-4">
                <input
                  className="w-full rounded-xl border border-white/10 bg-rsp-panel-strong px-4 py-3 text-rsp-text outline-none focus:border-rsp-primary"
                  placeholder="Search prompts by style, scene, or tool"
                  aria-label="Search prompts"
                />
                <p className="mt-3 text-sm text-rsp-muted">Static library view: use browser find or open a prompt card for details.</p>
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
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
