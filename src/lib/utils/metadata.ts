import { Metadata } from "next";

const SITE_NAME = "AI Editor RSP";
const SITE_URL = "https://aieditorrspediting.org";
const DEFAULT_DESCRIPTION =
  "AI Editor RSP provides prompt-assisted AI image generation, curated RSP-style prompts, account access, credits, and creator workflows.";

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  noindex = false,
}: {
  title: string;
  description?: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [`${SITE_URL}/og-image.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
