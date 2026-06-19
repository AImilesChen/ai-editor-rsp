import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";
import { AI_PROVIDER, PAYMENT_PROVIDER, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: "Read the Terms of Service for using AI Editor RSP, including AI generation, credits, accounts, and billing rules.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6 text-rsp-text">
            Terms of Service
          </h1>
          <p className="text-neutral-500 text-sm mb-8">Last updated: June 2026</p>

          <div className="prose prose-neutral max-w-none text-neutral-700 leading-7">
            <p className="mb-4">
              By accessing or using AI Editor RSP, you agree to these Terms of Service. If you do not agree, do not use the site, account features, generation tools, or billing features.
            </p>
            <p className="mb-6 text-sm text-neutral-500">
              Live payment collection is disabled until billing activation and final compliance review are complete. These terms prepare the service for the confirmed credits-based model.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Service Description</h2>
            <p className="mb-4">
              AI Editor RSP provides prompt-assisted AI image generation, curated RSP-style prompt inspiration, image upload workflows, account access, credits, and related creator tools. Images are generated through third-party AI model/API providers such as {AI_PROVIDER}. Output quality, availability, and usage rights may vary by model, provider terms, prompt, uploaded image, and applicable law.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Accounts and Security</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>You may sign in using Google OAuth or email magic link.</li>
              <li>You are responsible for keeping your email account and devices secure.</li>
              <li>We may limit, suspend, or terminate access for abuse, fraud, safety violations, or attempts to bypass credits or technical limits.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Credits and Plans</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>New users receive 3 free credits total as a one-time trial grant.</li>
              <li>Generation cost can vary by mode and image size. Text-to-image portrait requests use fewer credits; square, landscape, and uploaded-photo edits use more credits because provider cost is higher.</li>
              <li>Paid monthly plans are expected to grant credits at the start of each billing period. Paid credits do not roll over unless stated otherwise in the plan copy.</li>
              <li>Plans, credit amounts, queues, retention periods, and prices may change before or after billing launch. Changes will be shown before purchase where required.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Billing</h2>
            <p className="mb-4">
              When live billing is enabled, payments, taxes, invoices, subscriptions, refunds, and chargebacks may be processed by {PAYMENT_PROVIDER} or another payment provider/Merchant of Record. You must provide accurate billing information and comply with the payment provider&apos;s terms. We do not store full card numbers on our servers.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Refunds and Failed Generations</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Refunds are available within 14 days of purchase if no more than 50% of the granted credits have been used, unless applicable law requires otherwise.</li>
              <li>If a prompt is blocked before generation, credits are not charged.</li>
              <li>If the AI provider rejects a request, times out, or returns no usable result due to a system/provider failure, we may avoid charging or return the affected credit according to product logic.</li>
              <li>Subjective dissatisfaction with AI output style, composition, or quality does not automatically qualify for a refund or extra credits.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Acceptable Use</h2>
            <p className="mb-4">
              You must follow our <a className="text-brand-500 underline" href="/content-policy">Content Policy</a> and <a className="text-brand-500 underline" href="/ai-policy">AI Policy</a>. Do not use the service to create illegal, abusive, deceptive, sexually exploitative, non-consensual, hateful, violent, extremist, or rights-infringing content. Do not submit prompts or uploads that violate copyright, trademark, publicity, privacy, or platform/provider rules.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Third-Party Tools and Rights</h2>
            <p className="mb-4">
              AI providers, payment providers, email providers, external prompt tools, CapCut, ChatGPT, Gemini, Bing Image Creator, and other linked platforms may have their own terms. You are responsible for reviewing and complying with those terms before using generated images, prompts, or linked resources commercially or publicly.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Disclaimers</h2>
            <p className="mb-4">
              The service is provided &quot;as is&quot; and &quot;as available&quot;. We do not promise that outputs will be accurate, unique, copyright-safe, commercially suitable, uninterrupted, error-free, or accepted by any platform. AI-generated outputs may vary and require human review before publication.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, AI Editor RSP and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from your use of the site, generation tools, generated outputs, third-party services, or billing providers.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Contact</h2>
            <p className="mb-4">
              For questions about these Terms, contact: <a className="text-brand-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
