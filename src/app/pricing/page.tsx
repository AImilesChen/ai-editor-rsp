import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { legalDisclaimer, pricingPlans, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — AI Editor RSP",
  description: "Free, Starter, Creator, and Studio generation credit plans for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="mb-10 text-center">
          <p className="rsp-chip mb-4">Credits plans</p>
          <h1 className="font-heading text-4xl font-bold text-white md:text-6xl">Choose a generation plan.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#A7ABB8]">Billing is pending backend and Creem integration. These cards preserve the confirmed pricing copy and route CTAs to waitlist for now.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`rsp-card p-5 ${plan.featured ? "border-[#35D0BA]/60 shadow-glow" : ""}`}>
              <p className="mb-3 text-sm font-bold text-[#F4B860]">{plan.badge}</p>
              <h2 className="font-heading text-2xl font-bold text-white">{plan.name}</h2>
              <div className="mt-3"><span className="font-heading text-4xl font-bold text-white">{plan.price}</span><span className="text-[#A7ABB8]"> {plan.cadence}</span></div>
              <p className="mt-2 text-sm text-[#35D0BA]">{plan.quota}</p>
              <ul className="mt-5 space-y-2 text-sm text-[#A7ABB8]">{plan.features.map((f) => <li key={f}>• {f}</li>)}</ul>
              <Link href="/waitlist" className="rsp-button-primary mt-6 w-full">{plan.cta}</Link>
            </article>
          ))}
        </div>
        <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-[#A7ABB8]">{legalDisclaimer} Payments, tax, invoice, refund, login, and credits enforcement require backend/compliance follow-up before launch.</p>
      </main>
      <Footer />
    </>
  );
}
