import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutStartButton from "@/components/CheckoutStartButton";
import { pricingPlans, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Checkout — AI Editor RSP" },
  description: "Secure checkout entry for AI Editor RSP credits plans.",
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
  const isSuccess = status === "success";
  const statusCopy = isSuccess ? "Subscription complete" : status === "cancel" ? "Checkout canceled" : status === "failed" ? "Payment failed" : "Checkout selection";
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 font-heading text-5xl font-normal tracking-[-0.04em] text-rsp-text md:text-6xl">{statusCopy}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-rsp-muted">
            {isSuccess
              ? "Payment is complete. We are updating your AI Editor RSP credits and subscription status now. Do not start another checkout for the same plan."
              : "Monthly credit plans use a secure hosted checkout. Sign in first, then continue to payment. Credits are added after payment confirmation."}
          </p>
          {isSuccess ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <section className="rsp-card p-6 md:p-8">
                <h2 className="font-heading text-3xl font-normal text-rsp-text">Payment received</h2>
                <div className="mt-5 border border-rsp-secondary/30 bg-rsp-secondary/10 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-rsp-secondary">Selected plan</p>
                  <h3 className="mt-2 font-heading text-4xl font-normal text-rsp-text">{plan.name}</h3>
                  <p className="mt-3 font-semibold text-rsp-secondary">{plan.quota}</p>
                  <p className="mt-4 text-sm leading-6 text-rsp-muted">If credits do not appear immediately, refresh Account → Billing in a few moments or contact support.</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/account/billing" className="rsp-button-primary text-center">View subscription</Link>
                  <Link href="/generate" className="rounded-full border border-rsp-border bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-rsp-text no-underline">Start generating</Link>
                </div>
              </section>
              <aside className="rsp-card p-6">
                <h2 className="font-heading text-2xl font-normal text-rsp-text">What happens next</h2>
                <div className="mt-5 space-y-4 text-sm leading-6 text-rsp-muted">
                  <p><strong className="text-rsp-text">No second payment needed:</strong> Your payment has already returned successfully.</p>
                  <p><strong className="text-rsp-text">Credits:</strong> Credits are added automatically after payment confirmation.</p>
                  <p><strong className="text-rsp-text">Billing:</strong> Manage cancellation, refund eligibility, and invoices from Account → Billing.</p>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <section className="rsp-card p-6 md:p-8">
                <h2 className="font-heading text-3xl font-normal text-rsp-text">Selected plan</h2>
                <div className="mt-5 border border-rsp-border bg-white/60 p-5">
                  <p className="text-sm font-bold text-rsp-secondary">{plan.badge === "Most Popular" ? "Recommended" : plan.badge}</p>
                  <h3 className="mt-2 font-heading text-4xl font-normal text-rsp-text">{plan.name}</h3>
                  <p className="mt-3"><span className="font-heading text-5xl font-normal text-rsp-text">{plan.price}</span><span className="text-rsp-muted"> {plan.cadence}</span></p>
                  <p className="mt-3 font-semibold text-rsp-secondary">{plan.quota}</p>
                </div>
                <CheckoutStartButton plan={plan.name.toLowerCase()} />
                <p className="mt-5 text-sm leading-6 text-rsp-muted">Complete payment on Stripe&apos;s secure checkout page. This monthly subscription renews automatically until canceled. Prices include applicable taxes, and paid credits are valid for the current billing period only and do not roll over.</p>
                <p className="mt-3 text-xs leading-5 text-rsp-muted">By continuing, you agree to the <Link href="/terms" className="text-rsp-secondary no-underline">Terms</Link>, <Link href="/privacy" className="text-rsp-secondary no-underline">Privacy Policy</Link>, and <Link href="/refund-policy" className="text-rsp-secondary no-underline">Refund Policy</Link>. Credits are added after Stripe confirms payment.</p>
              </section>
              <aside className="rsp-card p-6">
                <h2 className="font-heading text-2xl font-normal text-rsp-text">Checkout status</h2>
                <div className="mt-5 space-y-4 text-sm leading-6 text-rsp-muted">
                  <p><strong className="text-rsp-text">Success:</strong> You will land on a subscription complete page. Do not start another checkout after payment succeeds.</p>
                  <p><strong className="text-rsp-text">Cancel:</strong> Checkout canceled. No payment was taken.</p>
                  <p><strong className="text-rsp-text">Failed:</strong> Payment failed. Please try another payment method or contact support.</p>
                  <p><strong className="text-rsp-text">Refund:</strong> Eligible requests may be submitted within 7 days if no more than 20% of paid credits have been used; completion requires review and Stripe confirmation.</p>
                </div>
                <Link href="/pricing" className="mt-6 inline-block text-rsp-secondary no-underline">Back to pricing →</Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
