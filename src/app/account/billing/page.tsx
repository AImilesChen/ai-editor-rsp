import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountBillingCenter from "@/components/AccountBillingCenter";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Billing — AI Editor RSP",
  description: "Manage AI Editor RSP billing status, credits, plan actions, and refund requests.",
  alternates: { canonical: `${SITE_URL}/account/billing` },
  robots: { index: false, follow: true },
};

export default function BillingPage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 font-heading text-5xl font-normal text-rsp-text">Billing</h1>
        <AccountBillingCenter />
      </main>
      <Footer />
    </>
  );
}
