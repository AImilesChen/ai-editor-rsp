import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Generate Console — AI Editor RSP",
  description: "AI image editor workflow with upload, edit-area selection, prompt input, generation, preview, and download.",
  alternates: { canonical: `${SITE_URL}/generate` },
};

export default function GeneratePage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-10 pt-28 md:pb-12 md:pt-32">
        <GenerateConsole />
      </main>
      <Footer />
    </>
  );
}
