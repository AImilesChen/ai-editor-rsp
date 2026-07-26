import { MetadataRoute } from "next";
import { prompts } from "@/lib/data/prompts";
import { templates } from "@/lib/data/templates";
import { effects } from "@/lib/data/effects";
import { promptPages } from "@/lib/data/prompt-pages";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;
const CONTENT_LAST_MODIFIED = new Date("2026-07-11T00:00:00.000Z");
const isPrimaryContent = (slug: string) => !slug.startsWith("p1-");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/image-editor`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.96 },
    { url: `${BASE_URL}/generate`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${BASE_URL}/ai-headshot-generator`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.93 },
    { url: `${BASE_URL}/reference-edit`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.92 },
    { url: `${BASE_URL}/prompts`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE_URL}/templates`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/effects`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/tiktok-effects`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${BASE_URL}/instagram-reels-effects`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${BASE_URL}/youtube-shorts-effects`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${BASE_URL}/about-rsp-editing`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/ai-policy`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${BASE_URL}/content-policy`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${BASE_URL}/ai-models`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${BASE_URL}/privacy`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/refund-policy`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const promptRoutes = prompts.filter((p) => isPrimaryContent(p.slug)).map((p) => ({
    url: `${BASE_URL}/prompts/${p.slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const promptPageRoutes = promptPages.map((p) => ({
    url: `${BASE_URL}/prompts/${p.slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }));

  const templateRoutes = templates.filter((t) => isPrimaryContent(t.slug)).map((t) => ({
    url: `${BASE_URL}/templates/${t.slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const effectRoutes = effects.filter((e) => isPrimaryContent(e.slug)).map((e) => ({
    url: `${BASE_URL}/effects/${e.slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...promptRoutes, ...promptPageRoutes, ...templateRoutes, ...effectRoutes];
}
