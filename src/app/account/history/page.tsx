import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Generation History — AI Editor RSP", alternates: { canonical: `${SITE_URL}/account/history` }, robots: { index: false, follow: true } };
export default function HistoryPage() {
  return <><Header /><main className="rsp-container pb-16 pt-32"><p className="eyebrow">Account</p><h1 className="mt-3 font-heading text-5xl font-normal text-rsp-text">Generation History</h1><section className="rsp-card mt-8 p-8 text-center"><p className="text-rsp-muted">No generations yet. Try your first one.</p><Link href="/generate" className="rsp-button-primary mt-6">Try Generator</Link><div className="mt-8 grid border border-rsp-border text-left text-sm md:grid-cols-4"><div className="bg-rsp-surface p-3 font-semibold">Date</div><div className="bg-rsp-surface p-3 font-semibold">Prompt</div><div className="bg-rsp-surface p-3 font-semibold">Status</div><div className="bg-rsp-surface p-3 font-semibold">Result</div></div></section></main><Footer /></>;
}
