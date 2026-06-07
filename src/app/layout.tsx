import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "RSP Editing Prompts & CapCut Templates — Copy & Create",
  description:
    "Discover trending RSP-style AI photo prompts and CapCut templates. Copy in one click. Free to browse. Independent guide.",
  metadataBase: new URL("https://aieditorrspediting.org"),
  alternates: {
    canonical: "https://aieditorrspediting.org",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "RSP Editing Prompts & CapCut Templates — Copy & Create",
    description:
      "Discover trending RSP-style AI photo prompts and CapCut templates. Copy in one click. Free to browse. Independent guide.",
    url: "https://aieditorrspediting.org",
    siteName: "RSP Hub",
    type: "website",
    images: ["https://aieditorrspediting.org/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RSP Editing Prompts & CapCut Templates — Copy & Create",
    description:
      "Discover trending RSP-style AI photo prompts and CapCut templates. Copy in one click. Free to browse. Independent guide.",
    images: ["https://aieditorrspediting.org/og-image.png"],
  },
  icons: {
    icon: [
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
        {children}
      </body>
    </html>
  );
}
