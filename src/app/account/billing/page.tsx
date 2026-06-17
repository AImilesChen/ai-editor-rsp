import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Billing — AI Editor RSP", alternates: { canonical: `${SITE_URL}/account/billing` }, robots: { index: false, follow: true } };
export default function BillingPage() {
  return <><Header /><main className="rsp-container pb-16 pt-32"><p className="eyebrow">Account</p><h1 className="mt-3 font-heading text-5xl font-normal text-rsp-text">Billing</h1><section className="rsp-card mt-8 p-8"><p className="text-rsp-muted">No purchases yet. Choose a plan to get started.</p><Link href="/pricing" className="rsp-button-primary mt-6">View plans</Link><div className="mt-8 grid gap-3 md:grid-cols-4"><div className="border border-rsp-border bg-white/55 p-4"><strong>Receipt</strong><br /><span className="text-rsp-muted">None yet</span></div><div className="border border-rsp-border bg-white/55 p-4"><strong>Plan</strong><br /><span className="text-rsp-muted">Free</span></div><div className="border border-rsp-border bg-white/55 p-4"><strong>Amount</strong><br /><span className="text-rsp-muted">$0</span></div><div className="border border-rsp-border bg-white/55 p-4"><strong>Status</strong><br /><span className="text-rsp-secondary">Preview</span></div></div></section></main><Footer /></>;
}
