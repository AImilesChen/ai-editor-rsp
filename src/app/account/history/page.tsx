import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerationHistoryClient from "@/components/GenerationHistoryClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: "Generation History — AI Editor RSP" },
  alternates: { canonical: `${SITE_URL}/account/history` },
  robots: { index: false, follow: true },
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 font-heading text-5xl font-normal text-rsp-text">Generation History</h1>
        <p className="mt-4 max-w-2xl text-rsp-muted">
          Find images you generated from this account. Closing the generator page will not remove completed results.
        </p>
        <GenerationHistoryClient />
      </main>
      <Footer />
    </>
  );
}
