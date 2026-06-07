import { Metadata } from "next";

const SITE_NAME = "RSP Hub";
const SITE_URL = "https://aieditorrspediting.org";
const DEFAULT_DESCRIPTION =
  "Discover trending RSP-style AI photo prompts and CapCut templates. Copy in one click. Free to browse. Independent guide.";

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
