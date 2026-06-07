import { Metadata } from "next";
import { notFound } from "next/navigation";
import { effects } from "@/lib/data/effects";
import { createMetadata } from "@/lib/utils/metadata";
import EffectListPage from "@/components/EffectListPage";
import EffectDetailPage from "@/components/EffectDetailPage";

export async function generateStaticParams() {
  const paths = [{ slug: [] as string[] }];
  effects.forEach((e) => {
    paths.push({ slug: [e.slug] });
  });
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return createMetadata({
      title: "Trending AI Photo Effects",
      description:
        "See trending AI photo effects. Before and after comparisons. Copy prompts and recreate the look.",
      path: "/effects",
    });
  }
  const effect = effects.find((e) => e.slug === slug[0]);
  if (!effect) {
    return createMetadata({
      title: "Effect Not Found",
      path: "/effects",
    });
  }
  return createMetadata({
    title: `${effect.title} — AI Photo Effect`,
    description: effect.description.slice(0, 160),
    path: `/effects/${effect.slug}`,
  });
}

export default async function EffectsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return <EffectListPage />;
  }

  const effect = effects.find((e) => e.slug === slug[0]);
  if (!effect) {
    notFound();
  }

  return <EffectDetailPage effect={effect} />;
}
