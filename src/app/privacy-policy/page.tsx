import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Editor RSP",
  description: "AI Editor RSP privacy policy preview. Account, payment, AI provider, and analytics details require final compliance review.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4">Legal</p>
          <h1 className="font-heading text-4xl font-bold text-white md:text-6xl">Privacy Policy</h1>
          <p className="mt-5 text-[#A7ABB8]">This preview covers the front-end policy entry. Account data, payment records, generated image retention, AI provider processing, and analytics details require final compliance review.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-[#A7ABB8]">Compliance status: NEEDS_REVIEW. Contact: {SUPPORT_EMAIL}.</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
