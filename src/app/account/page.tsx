import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "My Account — AI Editor RSP",
  description: "Account overview, credits balance, generation history, and billing state for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/account` },
  robots: { index: false, follow: true },
};

const activity = [
  ["Today", "No activity yet. Try your first generation.", "Empty"],
  ["Credits", "+3 free starter credits", "Preview"],
  ["Billing", "No purchases yet. Choose a plan to get started.", "Pending"],
];

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="eyebrow">Account center</p><h1 className="mt-3 font-heading text-5xl font-normal tracking-[-0.04em] text-rsp-text">My Account</h1></div>
          <Link href="/generate" className="rsp-button-primary">Try Generator</Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rsp-card p-5">
            <p className="text-sm font-semibold text-rsp-muted">Plan badge</p>
            <h2 className="mt-2 font-heading text-4xl font-normal text-rsp-text">Free</h2>
            <div className="mt-5 border border-rsp-secondary/35 bg-rsp-secondary/10 p-4 font-mono text-sm font-semibold text-rsp-secondary">Credits: 3 remaining</div>
            <nav className="mt-6 grid gap-2">
              <Link className="choice-active no-underline" href="/account">Overview</Link>
              <Link className="choice no-underline" href="/account/history">Generation History</Link>
              <Link className="choice no-underline" href="/account/billing">Billing</Link>
            </nav>
          </aside>
          <section className="rsp-card p-5 md:p-7">
            <h2 className="font-heading text-3xl font-normal text-rsp-text">Recent generations</h2>
            <div className="mt-5 grid gap-3">
              {activity.map(([date, text, status]) => <div key={date} className="grid gap-2 border border-rsp-border bg-white/55 p-4 md:grid-cols-[120px_1fr_120px]"><span className="font-mono text-xs uppercase tracking-[0.16em] text-rsp-muted">{date}</span><span className="text-rsp-text">{text}</span><span className="text-sm font-semibold text-rsp-secondary">{status}</span></div>)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
