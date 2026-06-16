import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Libre_Caslon_Text } from "next/font/google";
import Analytics from "@/components/Analytics";
import { site } from "@/lib/rsp-content";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre-caslon", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-hanken-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono", display: "swap" });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: "en",
};

export const metadata: Metadata = {
  title: { default: "AI Editor RSP — AI Image Generator & Prompt Library", template: "%s | AI Editor RSP" },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
  openGraph: { title: "AI Editor RSP — AI Image Generator & Prompt Library", description: site.description, url: site.url, siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image", title: "AI Editor RSP", description: site.description },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${hanken.variable} ${mono.variable} dark`}>
      <body className="min-h-screen bg-rsp-bg font-body text-rsp-text antialiased">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
