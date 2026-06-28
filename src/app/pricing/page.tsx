import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlanCards from "@/components/PricingPlanCards";
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
  ["What uses credits?", "Credits are used when you generate or edit an image. Portrait text-to-image starts at 1 credit, regular uploaded-image edits start at 2 credits, and professional headshots start at 4 credits."],
  ["When do monthly credits arrive?", "Paid plan credits are granted at the start of each billing period."],
  ["Do credits expire?", "Free credits remain valid while your account is active. Paid plan credits are valid for the current billing period and do not roll over."],
  ["Can I get a refund?", "Self-service refunds are available within 7 days of purchase if no more than 20% of paid credits from that billing period have been used. A confirmed refund revokes paid-plan credits but preserves any unused one-time free signup credits."],
  ["How do I manage or cancel billing?", "Use Account → Billing to manage payment details, invoices, cancellation, and refund requests."],
  ["What happens if I cancel?", "Cancellation stops future recurring billing. Remaining credits and access follow the active plan rules and monthly credits do not roll over after the billing period ends."],
  ["Can I use generated images commercially?", "Generated images may be used depending on your use case, the underlying AI model terms, and your own legal review. AI Editor RSP does not guarantee every output is free from third-party rights or suitable for every commercial use."],
];

const resultExamples = [
  {
    label: "Portraits",
    title: "Profile images",
    src: "/images/prompt-cases/ai-headshot-case.webp",
    alt: "AI generated professional headshot sample",
  },
  {
    label: "Products",
    title: "Commerce shots",
    src: "/images/prompt-cases/product-photography-case.webp",
    alt: "AI generated product photography sample",
  },
  {
    label: "Social",
    title: "Creator visuals",
    src: "/images/generated/lofi-girl-vibes.webp",
    alt: "AI generated social media visual sample",
  },
];

const trustItems = ["No card required for free credits", "Secure hosted checkout", "Cancel anytime", "7-day refund if mostly unused"];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-[radial-gradient(circle_at_18%_12%,rgba(184,115,51,0.14),transparent_28%),linear-gradient(135deg,#F7F2EA_0%,#EFE7DC_100%)] px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-10">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-7 max-w-4xl">
              <p className="eyebrow">Credits plans</p>
              <h1 className="mt-3 max-w-4xl font-heading text-4xl font-normal leading-[1.05] tracking-[-0.04em] text-rsp-text md:text-6xl">
                Simple pricing for AI image creation
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-rsp-muted md:text-lg">
                Start free with 3 credits, then choose monthly credits for portraits, product shots, social visuals, and uploaded-image edits.
              </p>
            </div>

            <PricingPlanCards plans={pricingPlans} />

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-[24px] border border-rsp-border bg-white/55 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-rsp-muted shadow-sm md:text-sm md:normal-case md:tracking-normal">
              {trustItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <span className="text-rsp-secondary">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad bg-rsp-surface">
          <div className="mx-auto max-w-screen-2xl">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <p className="eyebrow">What credits create</p>
                <h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em] text-rsp-text">See the kind of image work your credits cover</h2>
                <p className="mt-4 text-sm leading-7 text-rsp-muted">
                  Use one balance across text-to-image, ready prompts, and uploaded-image edits. These examples make the plans feel concrete before the detailed rules.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {resultExamples.map((example) => (
                  <article key={example.src} className="overflow-hidden rounded-[28px] border border-rsp-border bg-white shadow-sm">
                    <img src={example.src} alt={example.alt} className="aspect-[4/3] w-full object-cover" />
                    <div className="p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-rsp-secondary">{example.label}</p>
                      <h3 className="mt-1 font-heading text-2xl font-normal text-rsp-text">{example.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-[#f5eee4]">
          <div className="mx-auto grid max-w-screen-2xl gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="eyebrow">How credits work</p>
              <h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.03em] text-rsp-text">Transparent usage after the plans</h2>
              <p className="mt-4 text-sm leading-7 text-rsp-muted">
                The plan cards stay first so you can compare price and quota quickly. Details are grouped here after the decision area.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-[24px] border border-rsp-border bg-white/75 p-5 text-sm leading-6 text-rsp-muted"><strong className="block text-rsp-text">1 credit</strong>Portrait text-to-image</div>
              <div className="rounded-[24px] border border-rsp-border bg-white/75 p-5 text-sm leading-6 text-rsp-muted"><strong className="block text-rsp-text">2 credits</strong>Square or landscape text-to-image, or regular portrait image edit</div>
              <div className="rounded-[24px] border border-rsp-border bg-[#fff4e3] p-5 text-sm leading-6 text-rsp-muted shadow-sm"><strong className="block text-rsp-text">4 credits</strong>Professional headshot with uploaded photo</div>
              <div className="rounded-[24px] border border-rsp-border bg-white/75 p-5 text-sm leading-6 text-rsp-muted"><strong className="block text-rsp-text">4+ credits</strong>Larger uploaded-image edits</div>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-screen-2xl gap-3 md:grid-cols-3">
            <div className="rounded-[24px] border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">Secure checkout:</strong> Payments are processed through a secure hosted checkout after sign-in. AI Editor RSP does not store your payment details.</div>
            <div className="rounded-[24px] border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">Cancel anytime:</strong> Monthly credits are valid for the current billing period and do not roll over.</div>
            <div className="rounded-[24px] border border-rsp-border bg-white/65 p-5 text-sm leading-6 text-rsp-muted"><strong className="text-rsp-text">AI usage:</strong> {legalDisclaimer}</div>
          </div>
        </section>

        <section className="section-pad bg-rsp-surface">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-center">Pricing FAQ</p>
            <h2 className="mt-3 text-center font-heading text-4xl font-normal tracking-[-0.03em] text-rsp-text">Questions before you choose a plan</h2>
            <div className="mt-8 grid gap-3">
              {pricingFaq.map(([q, a], index) => (
                <details key={q} open={index < 2} className="group rounded-[24px] border border-rsp-border bg-white/75 p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-heading text-2xl font-normal text-rsp-text marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {q}
                      <span className="text-lg text-rsp-secondary transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 leading-7 text-rsp-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
