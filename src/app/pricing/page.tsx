import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlanAction from "@/components/PricingPlanAction";
import { legalDisclaimer, pricingPlans, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Pricing — AI Editor RSP",
  description: "Simple credit plans for AI image generation, uploaded-image editing, and ready-made prompt workflows.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

const pricingFaq = [
  ["How do free credits work?", "You get 3 free credits after sign-in. No payment is required to try the generator."],
  ["What uses credits?", "Credits are used when you generate or edit an image. Portrait text-to-image starts at 1 credit, while larger sizes or uploaded-image edits may use more credits."],
  ["When do monthly credits arrive?", "Paid plan credits are granted at the start of each billing period."],
  ["Do credits expire?", "Free credits remain valid while your account is active. Paid plan credits are valid for the current billing period and do not roll over."],
  ["Can I get a refund?", "Self-service refunds are available within 7 days of purchase if no more than 20% of paid credits from that billing period have been used. A confirmed refund revokes paid-plan credits but preserves any unused one-time free signup credits."],
  ["How do I manage or cancel billing?", "Use Account → Billing to manage payment details, invoices, cancellation, and refund requests."],
  ["What happens if I cancel?", "Cancellation stops future recurring billing. Remaining credits and access follow the active plan rules and monthly credits do not roll over after the billing period ends."],
  ["Can I use generated images commercially?", "Generated images may be used depending on your use case, the underlying AI model terms, and your own legal review. AI Editor RSP does not guarantee every output is free from third-party rights or suitable for every commercial use."],
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-pad bg-[radial-gradient(circle_at_18%_16%,rgba(184,115,51,0.14),transparent_28%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_100%)]">
          <div className="mx-auto max-w-screen-2xl text-center">
            <p className="eyebrow">Credits plans</p>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-5xl font-normal leading-tight tracking-[-0.04em] text-rsp-text md:text-7xl">Simple credits for AI image generation</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">Choose a monthly credit plan for generating images, editing uploaded photos, and exploring ready-made prompts.</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold text-rsp-secondary">Start free with 3 credits after sign-in. Upgrade only when you need more image credits.</p>
          </div>
        </section>
        <section className="section-pad">
          <div className="mx-auto mb-8 max-w-screen-2xl rounded-[28px] border border-rsp-secondary/25 bg-rsp-secondary/10 p-5 text-sm leading-6 text-rsp-muted md:p-6">
            <h2 className="font-heading text-2xl font-normal text-rsp-text">How credits work</h2>
            <p className="mt-2">Credits are used when you generate or edit images.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <p><strong className="text-rsp-text">1 credit:</strong> portrait text-to-image</p>
              <p><strong className="text-rsp-text">2 credits:</strong> square or landscape text-to-image, or portrait image edit</p>
              <p><strong className="text-rsp-text">4 credits:</strong> square or landscape image edit</p>
            </div>
            <p className="mt-4 font-semibold text-rsp-secondary">Free credits are available after sign-in. No payment required to try.</p>
          </div>
          <div className="mx-auto grid max-w-screen-2xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className={`glass-card flex flex-col p-6 ${plan.featured ? "border-rsp-secondary shadow-glow" : ""}`}>
                <p className="mb-3 text-sm font-bold text-rsp-secondary">{plan.badge}</p>
                <h2 className="font-heading text-3xl font-normal text-rsp-text">{plan.name}</h2>
                <div className="mt-4"><span className="font-heading text-5xl font-normal text-rsp-text">{plan.price}</span><span className="text-rsp-muted"> {plan.cadence}</span></div>
                <p className="mt-3 text-sm font-semibold text-rsp-secondary">{plan.quota}</p>
                {"audience" in plan ? <p className="mt-3 text-sm leading-6 text-rsp-text">{plan.audience}</p> : null}
                {"estimate" in plan ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-rsp-muted">{plan.estimate}</p> : null}
                <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-rsp-muted">{plan.features.map((f) => <li key={f}>• {f}</li>)}</ul>
                <PricingPlanAction planName={plan.name} cta={plan.cta} />
              </article>
            ))}
          </div>
          <div className="mx-auto mt-8 grid max-w-screen-2xl gap-3 md:grid-cols-3">
            <div className="border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">Secure checkout:</strong> Payments are processed through a secure hosted checkout after sign-in. AI Editor RSP does not store your payment details.</div>
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
