import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Analytics from "@/components/Analytics";
import "./globals.css";

const SITE_URL = "https://aieditorrspediting.org";
const SITE_NAME = "RSP Hub";
const SITE_DESCRIPTION =
  "Discover trending RSP-style AI photo prompts and CapCut templates. Copy in one click. Free to browse. Independent guide.";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const AHREFS_SITE_VERIFICATION = "ANjbNIeHZbKYGz6prY1k3w";

const verificationOther: Record<string, string> = {
  "ahrefs-site-verification":
    process.env.NEXT_PUBLIC_AHREFS_SITE_VERIFICATION || AHREFS_SITE_VERIFICATION,
};

if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther["msvalidate.01"] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
}

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "support@aieditorrspediting.org",
          contactType: "customer support",
          availableLanguage: ["en"],
        },
      ],
      sameAs: [],
    },
  ],
};

export const metadata: Metadata = {
  title: "RSP Editing Prompts & CapCut Templates — Copy & Create",
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: verificationOther,
  },
  openGraph: {
    title: "RSP Editing Prompts & CapCut Templates — Copy & Create",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [`${SITE_URL}/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "RSP Editing Prompts & CapCut Templates — Copy & Create",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body antialiased bg-neutral-50 text-neutral-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
