import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import BeforeAfter from "./BeforeAfter";
import CopyButton from "./CopyButton";
import { effects } from "@/lib/data/effects";
import { prompts } from "@/lib/data/prompts";

interface PlatformEffectsPageProps {
  platform: "TikTok" | "Instagram Reels" | "YouTube Shorts";
  title: string;
  subtitle: string;
}

export default function PlatformEffectsPage({ platform, title, subtitle }: PlatformEffectsPageProps) {
  const platformEffects = effects.filter((effect) => effect.platform.includes(platform)).slice(0, 12);
  const platformPrompts = prompts.filter((prompt) => prompt.platform.length > 0).slice(0, 9);

  return (
    <>
      <Header />
      <main className="px-4 py-12">
        <section className="mx-auto max-w-container">
          <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
            Independent guide. Not affiliated with RSP Editing.
          </p>
          <h1 className="font-heading text-[32px] font-bold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-500">{subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platformEffects.map((effect) => (
              <article key={effect.id} className="overflow-hidden rounded-xl bg-brand-900 text-white shadow-lg">
                <div className="aspect-[4/3] overflow-hidden">
                  <BeforeAfter image={effect.before_image} alt={`${effect.title} preview`} />
                </div>
                <div className="p-5">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{effect.category}</span>
                  <h2 className="mt-3 text-lg font-bold text-white">{effect.title}</h2>
                  <p className="mt-2 text-sm text-neutral-300">{effect.description}</p>
                  <Link href={`/effects/${effect.slug}`} className="mt-4 inline-flex rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white no-underline">
                    Explore Effect
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16 rounded-2xl bg-white/90 p-6 shadow-lg">
            <h2 className="font-heading text-2xl font-bold">Copy-ready prompt picks for {platform}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {platformPrompts.map((prompt) => (
                <article key={prompt.id} className="rounded-xl border border-neutral-300 bg-neutral-50 p-4">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">{prompt.category}</span>
                  <h3 className="mt-3 font-semibold">{prompt.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-500">{prompt.prompt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <CopyButton text={prompt.prompt} />
                    <Link href={`/prompts/${prompt.slug}`} className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 no-underline">
                      View Prompt
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
