import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminRefundReviewClient from "@/components/AdminRefundReviewClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Refund Review — AI Editor RSP",
  description: "Internal refund eligibility review for AI Editor RSP customer support.",
  alternates: { canonical: `${SITE_URL}/admin/refund-review` },
  robots: { index: false, follow: false },
};

export default function RefundReviewPage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <p className="eyebrow">Operations</p>
        <h1 className="mt-3 max-w-3xl font-heading text-5xl font-normal text-rsp-text">Refund Review</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-rsp-muted">
          Internal-only review surface for checking subscription payment, paid credit usage, refund window, and suggested refund handling.
        </p>
        <AdminRefundReviewClient />
      </main>
      <Footer />
    </>
  );
}
