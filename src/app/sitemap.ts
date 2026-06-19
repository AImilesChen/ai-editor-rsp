import { MetadataRoute } from "next";
import { prompts } from "@/lib/data/prompts";
import { templates } from "@/lib/data/templates";
import { effects } from "@/lib/data/effects";

const BASE_URL = "https://aieditorrspediting.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/generate`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${BASE_URL}/reference-edit`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.92 },
    { url: `${BASE_URL}/prompts`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE_URL}/templates`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/effects`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/tiktok-effects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${BASE_URL}/instagram-reels-effects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${BASE_URL}/youtube-shorts-effects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${BASE_URL}/suggest-prompt`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/waitlist`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/about-rsp-editing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/ai-policy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${BASE_URL}/content-policy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const promptRoutes = prompts.map((p) => ({
    url: `${BASE_URL}/prompts/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const templateRoutes = templates.map((t) => ({
    url: `${BASE_URL}/templates/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const effectRoutes = effects.map((e) => ({
    url: `${BASE_URL}/effects/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...promptRoutes, ...templateRoutes, ...effectRoutes];
}
