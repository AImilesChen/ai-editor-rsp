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

const pricingFaq = [
  ["What is a credit?", "Credits are usage units, not fixed generations. Text-to-image portrait requests use 1 credit, square or landscape text requests use 2 credits, uploaded-photo portrait edits use 2 credits, and uploaded-photo square or landscape edits use 4 credits."],
  ["How do I get free credits?", "New users receive 3 credits upon first registration. This is a one-time grant and does not refresh monthly."],
  ["When do monthly credits arrive?", "Paid plan credits are granted at the start of each billing period."],
  ["Do credits expire?", "Free credits remain valid while your account is active. Paid plan credits are valid for the current billing period and do not roll over."],
  ["Can I get a refund?", "Refunds are available within 14 days of purchase if no more than 50% of paid credits from that billing period have been used. A confirmed refund revokes paid-plan credits but preserves any unused one-time free signup credits."],
  ["How do I manage or cancel billing?", "Use Account → Billing → Manage billing to open the Creem Customer Portal, or use Cancel subscription in the product to stop future recurring billing."],
  ["What happens if I cancel?", "Cancellation stops future recurring billing. Remaining credits and access follow the active plan status, safety rules, and Creem confirmation events. Monthly credits do not roll over after the billing period ends."],
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-pad bg-[radial-gradient(circle_at_18%_16%,rgba(184,115,51,0.14),transparent_28%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_100%)]">
          <div className="mx-auto max-w-screen-2xl text-center">
            <p className="eyebrow">Credits plans</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-5xl font-normal leading-tight tracking-[-0.04em] text-rsp-text md:text-7xl">Choose a generation plan.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">Monthly credit plans for creators. Checkout is processed through Creem after sign-in.</p>
          </div>
        </section>
        <section className="section-pad">
          <div className="mx-auto grid max-w-screen-2xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className={`glass-card flex flex-col p-6 ${plan.featured ? "border-rsp-secondary shadow-glow" : ""}`}>
                <p className="mb-3 text-sm font-bold text-rsp-secondary">{plan.badge === "Most Popular" ? "Recommended" : plan.badge}</p>
                <h2 className="font-heading text-3xl font-normal text-rsp-text">{plan.name}</h2>
                <div className="mt-4"><span className="font-heading text-5xl font-normal text-rsp-text">{plan.price}</span><span className="text-rsp-muted"> {plan.cadence}</span></div>
                <p className="mt-3 text-sm font-semibold text-rsp-secondary">{plan.quota}</p>
                {"audience" in plan ? <p className="mt-3 text-sm leading-6 text-rsp-text">{plan.audience}</p> : null}
                {"estimate" in plan ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-rsp-muted">{plan.estimate}</p> : null}
                <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-rsp-muted">{plan.features.map((f) => <li key={f}>• {f}</li>)}</ul>
                <Link href={plan.name === "Free" ? "/generate" : `/checkout?plan=${plan.name.toLowerCase()}`} className="rsp-button-primary mt-7 w-full">{plan.name === "Free" ? "Try Generator" : plan.cta}</Link>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-8 grid max-w-screen-2xl gap-3 md:grid-cols-3">
            <div className="border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">Secure checkout:</strong> Payments are processed by Creem after sign-in. Credits are added after payment is confirmed.</div>
            <div className="border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">Cancel anytime:</strong> Monthly credits are valid for the current billing period and do not roll over.</div>
            <div className="border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">AI usage:</strong> {legalDisclaimer}</div>
          </div>
        </section>
        <section className="section-pad bg-rsp-surface">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-center">Pricing FAQ</p>
            <div className="mt-8 grid gap-4">
              {pricingFaq.map(([q, a]) => <article key={q} className="glass-card p-5"><h2 className="font-heading text-2xl font-normal text-rsp-text">{q}</h2><p className="mt-2 leading-7 text-rsp-muted">{a}</p></article>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
