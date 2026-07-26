import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountOverview from "@/components/AccountOverview";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "My Account — AI Editor RSP" },
  description: "Account overview, credits balance, generation history, and billing state for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/account` },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="eyebrow">Account center</p><h1 className="mt-3 font-heading text-5xl font-normal tracking-[-0.04em] text-rsp-text">My Account</h1></div>
          <Link href="/generate" className="rsp-button-primary">Try Generator</Link>
        </div>
        <AccountOverview />
      </main>
      <Footer />
    </>
  );
}
