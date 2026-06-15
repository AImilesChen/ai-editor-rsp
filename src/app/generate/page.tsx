import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerateConsole from "@/components/GenerateConsole";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Generate Console — AI Editor RSP",
  description: "Mock AI image generation console with prompt input, style chips, aspect ratios, credits state, success and failed states.",
  alternates: { canonical: `${SITE_URL}/generate` },
};

export default function GeneratePage() {
  return (
    <>
      <Header />
      <main className="rsp-container py-12 md:py-16">
        <GenerateConsole />
      </main>
      <Footer />
    </>
  );
}
