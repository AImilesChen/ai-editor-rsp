import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prompts } from "@/lib/data/prompts";
import { createMetadata } from "@/lib/utils/metadata";
import PromptListPage from "@/components/PromptListPage";
import PromptDetailPage from "@/components/PromptDetailPage";

export async function generateStaticParams() {
  const paths = [{ slug: [] as string[] }];
  prompts.forEach((p) => {
    paths.push({ slug: [p.slug] });
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
      title: "AI Photo Prompts Library",
      description:
        "Browse 50+ RSP-style AI photo prompts. Double exposure, horror, lofi, 3D, festival, cinematic, and more. Copy to ChatGPT or Gemini.",
      path: "/prompts",
    });
  }
  const prompt = prompts.find((p) => p.slug === slug[0]);
  if (!prompt) {
    return createMetadata({
      title: "Prompt Not Found",
      path: "/prompts",
    });
  }
  return createMetadata({
    title: `${prompt.title} — AI Image Prompt`,
    description: prompt.prompt.slice(0, 160),
    path: `/prompts/${prompt.slug}`,
  });
}

export default async function PromptsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return <PromptListPage />;
  }

  const prompt = prompts.find((p) => p.slug === slug[0]);
  if (!prompt) {
    notFound();
  }

  return <PromptDetailPage prompt={prompt} />;
}
