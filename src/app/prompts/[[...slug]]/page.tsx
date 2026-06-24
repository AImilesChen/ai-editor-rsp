import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyPromptButton from "@/components/CopyPromptButton";
import { promptPages, promptLibraryMeta, categories } from "@/lib/data/prompt-pages";
import { site } from "@/lib/rsp-content";

export async function generateStaticParams() {
  return [{ slug: [] }, ...promptPages.map((p) => ({ slug: [p.slug] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = slug?.[0] ? promptPages.find((p) => p.slug === slug[0]) : undefined;

  if (page) {
    return {
      title: page.title,
      description: page.metaDescription,
      alternates: { canonical: `${site.url}/prompts/${page.slug}` },
      openGraph: {
        title: page.title,
        description: page.metaDescription,
        url: `${site.url}/prompts/${page.slug}`,
        type: "article",
      },
    };
  }

  return {
    title: promptLibraryMeta.title,
    description: promptLibraryMeta.metaDescription,
    alternates: { canonical: `${site.url}/prompts` },
    openGraph: {
      title: promptLibraryMeta.title,
      description: promptLibraryMeta.metaDescription,
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

function PromptDetailPage({ page }: { page: (typeof promptPages)[number] }) {
  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rsp-border bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-12 md:px-8 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
        <div className="relative mx-auto max-w-screen-2xl">
          <p className="eyebrow">{page.categoryLabel} style</p>
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
              Back to library
            </Link>
          </div>
        </div>
      </section>

      <div className="section-pad">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.38fr]">
            {/* Main content */}
            <div className="space-y-10">
              {/* What it is */}
              <section>
                <h2 className="font-heading text-2xl font-bold">What it is</h2>
                <p className="mt-3 text-base leading-7 text-rsp-muted">{page.whatItIs}</p>
              </section>

              {/* Best for */}
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

              {/* Prompt examples */}
              <section>
                <h2 className="font-heading text-2xl font-bold">Prompt examples</h2>
                <div className="mt-5 space-y-5">
                  {page.prompts.map((example, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-rsp-border bg-rsp-panel p-5"
                    >
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
                  ))}
                </div>
              </section>

              {/* Better results tips */}
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

              {/* FAQ */}
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

              {/* Related styles */}
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

              {/* Bottom CTA */}
              <div className="rounded-2xl border border-rsp-border bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] p-8">
                <h2 className="font-heading text-2xl font-bold">Ready to generate?</h2>
                <p className="mt-2 text-rsp-muted">Pick a prompt above and start creating in seconds.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
                  <Link
                    href="/generate"
                    className="rounded-full border border-rsp-secondary/30 px-5 py-2.5 text-sm font-bold text-rsp-secondary no-underline transition hover:bg-rsp-secondary/10"
                  >
                    Open AI image editor
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
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

function PromptLibraryPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rsp-border bg-[radial-gradient(circle_at_18%_22%,rgba(184,115,51,0.16),transparent_30%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_52%,#FBF7F0_100%)] px-4 py-12 md:px-8 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(94,63,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(94,63,36,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70" />
        <div className="relative mx-auto max-w-screen-2xl text-center">
          <p className="eyebrow">Prompt Library</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-[-0.03em] md:text-5xl">
            {promptLibraryMeta.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-rsp-muted">
            {promptLibraryMeta.metaDescription}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/generate"
              className="rounded-full bg-rsp-primary px-6 py-3 text-sm font-bold text-rsp-on-primary no-underline transition hover:opacity-90"
            >
              Start generating
            </Link>
            <Link
              href="/suggest-prompt"
              className="rounded-full border border-rsp-secondary/30 px-6 py-3 text-sm font-bold text-rsp-secondary no-underline transition hover:bg-rsp-secondary/10"
            >
              Suggest a prompt
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-pad">
        <div className="mx-auto max-w-screen-2xl">
          {categories.map((cat) => {
            const catPrompts = promptPages.filter((p) => p.category === cat.key);
            if (catPrompts.length === 0) return null;
            return (
              <div key={cat.key} className="mb-14">
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="font-heading text-2xl font-bold">{cat.label}</h2>
                  <span className="rounded-full border border-rsp-secondary/30 bg-rsp-secondary/10 px-3 py-1 text-xs font-semibold text-rsp-secondary">
                    {catPrompts.length}
                  </span>
                </div>
                <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {catPrompts.map((page) => (
                    <article
                      key={page.slug}
                      className="group overflow-hidden rounded-2xl border border-rsp-border bg-rsp-panel transition hover:-translate-y-1 hover:border-rsp-primary/60"
                    >
                      <Link href={`/prompts/${page.slug}`} className="block no-underline">
                        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#F3E8DA] to-[#EFE7DC]">
                          <span className="font-heading text-5xl font-bold text-rsp-secondary/20">
                            {page.h1.charAt(0)}
                          </span>
                        </div>
                      </Link>
                      <div className="p-5">
                        <span className="text-xs uppercase tracking-[0.16em] text-rsp-muted">
                          {page.categoryLabel}
                        </span>
                        <h3 className="mt-2 font-heading text-xl font-bold text-rsp-text">
                          {page.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-rsp-muted">
                          {page.metaDescription}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <CopyPromptButton
                            prompt={page.prompts[0]?.prompt ?? ""}
                            label="Copy prompt"
                          />
                          <Link
                            href={`/prompts/${page.slug}`}
                            className="text-sm font-bold text-rsp-secondary no-underline"
                          >
                            View details →
                          </Link>
                        </div>
                        <div className="mt-3">
                          <UsePromptButton prompt={page.prompts[0]?.prompt ?? ""} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default async function PromptsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const selected = slug?.[0] ? promptPages.find((p) => p.slug === slug[0]) : undefined;

  if (slug?.[0] && !selected) notFound();

  return (
    <>
      <Header />
      <main className="pt-20">
        {selected ? <PromptDetailPage page={selected} /> : <PromptLibraryPage />}
      </main>
      <Footer />
    </>
  );
}
