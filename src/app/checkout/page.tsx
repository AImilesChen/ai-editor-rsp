import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pricingPlans, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout Preview — AI Editor RSP",
  description: "Checkout state preview for AI Editor RSP credits plans.",
  alternates: { canonical: `${SITE_URL}/checkout` },
  robots: { index: false, follow: true },
};

function selectedPlan(plan?: string) {
  const match = pricingPlans.find((item) => item.name.toLowerCase() === (plan || "creator").toLowerCase());
  return match || pricingPlans.find((item) => item.name === "Creator") || pricingPlans[1];
}

export default async function CheckoutPage({ searchParams }: { searchParams?: Promise<{ plan?: string; status?: string }> }) {
  const params = await searchParams;
  const plan = selectedPlan(params?.plan);
  const status = params?.status;
  const statusCopy = status === "success" ? "Payment success" : status === "cancel" ? "Checkout canceled" : status === "failed" ? "Payment failed" : "Checkout selection";
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 font-heading text-5xl font-normal tracking-[-0.04em] text-rsp-text md:text-6xl">{statusCopy}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">Checkout states are prepared for the confirmed monthly credit plans. Live payment collection remains off until billing activation and final compliance review are complete.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <section className="rsp-card p-6 md:p-8">
              <h2 className="font-heading text-3xl font-normal text-rsp-text">Selected plan</h2>
              <div className="mt-5 border border-rsp-border bg-white/60 p-5">
                <p className="text-sm font-bold text-rsp-secondary">{plan.badge === "Most Popular" ? "Recommended" : plan.badge}</p>
                <h3 className="mt-2 font-heading text-4xl font-normal text-rsp-text">{plan.name}</h3>
                <p className="mt-3"><span className="font-heading text-5xl font-normal text-rsp-text">{plan.price}</span><span className="text-rsp-muted"> {plan.cadence}</span></p>
                <p className="mt-3 font-semibold text-rsp-secondary">{plan.quota}</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link href="/checkout?status=success" className="rsp-button-primary text-center">Preview success</Link>
                <Link href="/checkout?status=cancel" className="rsp-button-secondary text-center">Preview cancel</Link>
                <Link href="/checkout?status=failed" className="rsp-button-secondary text-center">Preview failed</Link>
              </div>
            </section>
            <aside className="rsp-card p-6">
              <h2 className="font-heading text-2xl font-normal text-rsp-text">State copy</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-rsp-muted">
                <p><strong className="text-rsp-text">Success:</strong> Payment received. Credits have been added to your account.</p>
                <p><strong className="text-rsp-text">Cancel:</strong> Checkout canceled. No payment was taken.</p>
                <p><strong className="text-rsp-text">Failed:</strong> Payment failed. Please try another payment method or contact support.</p>
                <p><strong className="text-rsp-text">Refund:</strong> Refunds available within 14 days if no more than 50% of credits have been used.</p>
              </div>
              <Link href="/pricing" className="mt-6 inline-block text-rsp-secondary no-underline">Back to pricing →</Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
