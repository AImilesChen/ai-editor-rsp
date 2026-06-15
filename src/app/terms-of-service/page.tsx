import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service — AI Editor RSP",
  description: "AI Editor RSP terms preview. Subscription, refunds, taxes, credits, and AI usage rules require backend and compliance confirmation.",
  alternates: { canonical: `${SITE_URL}/terms-of-service` },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-white md:text-6xl">Terms of Service</h1>
          <p className="mt-5 text-[#A7ABB8]">This preview preserves the front-end legal entry. Subscription handling, refunds, taxes, credits, AI content rules, and cancellation flows require backend and compliance confirmation before launch.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-[#A7ABB8]">Compliance status: NEEDS_REVIEW. Contact: {SUPPORT_EMAIL}.</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
