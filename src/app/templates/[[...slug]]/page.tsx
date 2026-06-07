import { Metadata } from "next";
import { notFound } from "next/navigation";
import { templates } from "@/lib/data/templates";
import { createMetadata } from "@/lib/utils/metadata";
import TemplateListPage from "@/components/TemplateListPage";
import TemplateDetailPage from "@/components/TemplateDetailPage";

export async function generateStaticParams() {
  const paths = [{ slug: [] as string[] }];
  templates.forEach((t) => {
    paths.push({ slug: [t.slug] });
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
      title: "CapCut Template Library",
      description:
        "Find trending CapCut templates. Bhojpuri, Bengali, Hindi, English. One-click links. Use directly in CapCut.",
      path: "/templates",
    });
  }
  const template = templates.find((t) => t.slug === slug[0]);
  if (!template) {
    return createMetadata({
      title: "Template Not Found",
      path: "/templates",
    });
  }
  return createMetadata({
    title: `${template.title} — CapCut Template`,
    description: `Use the ${template.song_name} CapCut template. ${template.category} song template for TikTok, Reels, and Shorts.`,
    path: `/templates/${template.slug}`,
  });
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return <TemplateListPage />;
  }

  const template = templates.find((t) => t.slug === slug[0]);
  if (!template) {
    notFound();
  }

  return <TemplateDetailPage template={template} />;
}
