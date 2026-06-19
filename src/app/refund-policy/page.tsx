import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";
import { PAYMENT_PROVIDER, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Refund Policy",
  description: "Refund rules for AI Editor RSP credits, monthly plans, failed generations, and billing-provider refunds.",
  path: "/refund-policy",
  noindex: true,
});

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6 text-rsp-text">
            Refund Policy
          </h1>
          <p className="text-neutral-500 text-sm mb-8">Last updated: June 2026</p>

          <div className="prose prose-neutral max-w-none text-neutral-700 leading-7">
            <p className="mb-4">
              AI Editor RSP uses credits for AI image generation. This Refund Policy explains the refund rules for paid monthly plans processed through {PAYMENT_PROVIDER} and for failed or blocked generation attempts.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Free Credits</h2>
            <p className="mb-4">
              New users receive 3 free credits total as a one-time trial grant. Free credits have no cash value, are not transferable, and are not refundable. If a paid plan is later refunded, any unused free signup credits remain on the account; the refund only revokes paid-plan credits and paid subscription access.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Paid Monthly Plans</h2>
            <p className="mb-4">
              After billing activation, paid plans may grant a fixed number of credits for each billing period. Current public plan copy describes Starter, Creator, and Studio monthly credit plans. Paid credits are intended for the current billing period and do not roll over unless the plan page says otherwise.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Refund Eligibility</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Refund requests are eligible within 14 days of purchase.</li>
              <li>Refunds are available only if no more than 50% of the credits granted by that purchase or billing period have been used.</li>
              <li>Refunds may be denied for abuse, fraud, policy violations, chargeback abuse, or attempts to bypass technical or safety limits.</li>
              <li>Applicable consumer protection law may provide additional rights in some regions.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Failed or Blocked Generations</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>If a prompt is blocked by our safety checks before generation, credits are not charged.</li>
              <li>If a provider rejects a request, returns no usable result, times out, or fails because of a system error, the affected credit may be returned or not deducted according to product logic.</li>
              <li>If generated output is blocked after provider processing for safety reasons, the system may return the affected credit once for that request.</li>
              <li>Subjective dissatisfaction with AI output style, composition, resemblance, or perceived quality does not automatically qualify for a refund or replacement credits.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Cancellations</h2>
            <p className="mb-4">
              If subscriptions are enabled, you can cancel directly from <a className="text-brand-500 underline" href="/account/billing">Account → Billing → Cancel subscription</a> or from the Creem Customer Portal opened by the Manage billing button. Cancellation stops future recurring billing. Remaining credits and access follow the active plan, safety rules, and payment-provider status.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">How Refunds Are Processed</h2>
            <p className="mb-4">
              Payments, taxes, invoices, refunds, and chargebacks may be processed by {PAYMENT_PROVIDER} or another payment provider/Merchant of Record. Refund timing, supported countries, tax treatment, payment-method availability, and chargeback handling depend on that provider&apos;s current terms and the applicable payment network.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Request a Refund</h2>
            <p className="mb-4">
              The primary refund path is inside your account: <a className="text-brand-500 underline" href="/account/billing#refund">Account → Billing → Refund now</a>. The button starts the refund flow directly from the signed-in account. The account shows <strong>refund_requested</strong> while the payment-provider refund is pending and <strong>refunded</strong> only after Creem confirms the refund.
            </p>
            <p className="mb-4">
              If the account button is unavailable, contact <a className="text-brand-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the email associated with your account. Do not send card numbers, passwords, API keys, or sensitive identity documents by email.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
