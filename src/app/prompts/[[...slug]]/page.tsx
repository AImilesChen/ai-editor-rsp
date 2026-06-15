import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { promptCards, site } from "@/lib/rsp-content";

export async function generateStaticParams() { return [{ slug: [] }, ...promptCards.map((p) => ({ slug: [p.slug] }))]; }

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const item = slug?.[0] ? promptCards.find((p) => p.slug === slug[0]) : undefined;
  if (item) return { title: `${item.title} — AI Image Prompt`, description: item.prompt, alternates: { canonical: `${site.url}/prompts/${item.slug}` } };
  return { title: "Browse AI Image Prompts", description: "Curated RSP editing prompt library for the AI Editor RSP mock generator.", alternates: { canonical: `${site.url}/prompts` } };
}

export default async function PromptsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const selected = slug?.[0] ? promptCards.find((p) => p.slug === slug[0]) : undefined;
  if (slug?.[0] && !selected) notFound();
  return (<><Header /><main className="section-pad pt-32"><div className="mx-auto max-w-screen-2xl">{selected ? (<article className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div className={`min-h-[420px] rounded-2xl bg-gradient-to-br ${selected.image} p-6`}><span className="chip bg-black/30 text-white">{selected.style}</span></div><div><p className="eyebrow">Prompt detail</p><h1 className="mt-3 font-heading text-5xl font-bold">{selected.title}</h1><p className="mt-5 text-rsp-muted">{selected.prompt}</p><div className="mt-6 rounded-2xl border border-white/10 bg-rsp-panel p-5 font-mono text-sm leading-6 text-rsp-text">{selected.prompt}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href={`/generate?prompt=${selected.slug}`} className="rounded-full bg-rsp-primary px-6 py-3 text-center text-sm font-bold text-rsp-on-primary no-underline">Generate with this prompt</Link><Link href="/prompts" className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-bold text-rsp-text no-underline">Back to library</Link></div><p className="mt-4 text-sm text-rsp-muted">Generate CTA opens the mock console only; no fal.ai request is made in this build.</p></div></article>) : (<><p className="eyebrow text-center">Prompt Library</p><h1 className="mt-3 text-center font-heading text-5xl font-bold">Browse AI Image Prompts</h1><p className="mx-auto mt-4 max-w-2xl text-center text-rsp-muted">Curated prompts for RSP editing. Find a style, click to generate, and keep backend-dependent actions clearly marked as mock.</p><div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-rsp-panel p-4"><input className="w-full rounded-xl border border-white/10 bg-rsp-panel-strong px-4 py-3 text-rsp-text outline-none focus:border-rsp-primary" placeholder="Search prompts by style, subject, or keyword..." /></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{promptCards.map((card)=><article key={card.slug} className="glass-card overflow-hidden"><div className={`h-48 bg-gradient-to-br ${card.image}`} /><div className="p-5"><div className="mb-3 flex gap-2"><span className="chip-active">{card.style}</span><span className="chip">{card.ratio}</span></div><h2 className="font-heading text-xl font-bold">{card.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-rsp-muted">{card.prompt}</p><Link href={`/prompts/${card.slug}`} className="mt-5 inline-block rounded-full bg-rsp-primary px-5 py-3 text-sm font-bold text-rsp-on-primary no-underline">Try this prompt</Link></div></article>)}</div></>)}</div></main><Footer /></>);
}
