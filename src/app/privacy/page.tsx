import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Learn how AI Editor RSP collects, uses, and protects account, credits, generation, and billing data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <section className="px-4 pb-12 pt-28 md:pt-32">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6 text-rsp-text">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Last updated: June 2026
          </p>

          <div className="prose prose-neutral max-w-none text-neutral-700 leading-7">
            <p className="mb-4">
              AI Editor RSP (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides prompt-assisted AI image generation, account access, and credits-based generation plans. This Privacy Policy explains what information we collect, why we use it, which third-party services process it, and how you can contact us.
            </p>
            <p className="mb-6 text-sm text-neutral-500">
              This policy is a user-facing compliance summary, not legal advice. Payments are processed by third-party payment providers when you choose a paid plan.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Account information:</strong> email address, display name, login provider, authentication state, plan, and credits balance.</li>
              <li><strong>Authentication data:</strong> Google OAuth response data needed to sign you in, email magic link tokens, and security/session cookies.</li>
              <li><strong>Generation data:</strong> prompts, selected style/aspect settings, uploaded input images when you choose to upload a photo, generated results, safety checks, and credit usage.</li>
              <li><strong>Billing data:</strong> selected plan, checkout status, payment identifiers, subscription status, refunds, and credit grants when you choose a paid plan. We do not store full card numbers on our servers.</li>
              <li><strong>Technical data:</strong> IP address, browser/device information, logs, abuse-prevention signals, Cloudflare security/performance data, and optional analytics data when you consent to analytics cookies.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>To provide login, account access, credits, image generation, and result delivery.</li>
              <li>To process billing, subscription changes, refunds, support requests, and abuse prevention after payment is enabled.</li>
              <li>To run safety checks, prevent prohibited content, detect repeated violations, and protect the service.</li>
              <li>To maintain site reliability, resolve errors, prevent fraud, and improve user experience when analytics consent is enabled.</li>
              <li>To send transactional email such as magic links, account notices, payment notices, and support responses.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Cloudflare:</strong> hosting, security, storage, performance, and infrastructure services.</li>
              <li><strong>Analytics providers:</strong> Google Analytics, Microsoft Clarity, Plausible, or similar tools may process optional analytics data only after analytics consent and only when configured.</li>
              <li><strong>Google OAuth:</strong> sign-in with your Google account when you choose Google login.</li>
              <li><strong>Resend:</strong> email magic links and transactional email delivery.</li>
              <li><strong>AI model and safety providers:</strong> fal.ai processes prompts, uploaded input images, and generation requests for the model routes disclosed on our <a className="text-brand-500 underline" href="/ai-models">AI Models Used</a> page. We run automated safety checks and abuse-prevention rules before generation to block prohibited, unsafe, unauthorized, impersonation, document-fraud, adult, or minors-related requests.</li>
              <li><strong>Payment providers:</strong> payment, tax, invoice, subscription, refund, chargeback, and account review processing when billing is used.</li>
              <li><strong>External creator tools:</strong> links to platforms such as CapCut, ChatGPT, Gemini, Bing Image Creator, or similar services are governed by those services&apos; own policies.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Cookies and Local State</h2>
            <p className="mb-4">
              We use essential cookies for login, session integrity, credits state, OAuth security, and fraud prevention. Optional analytics cookies are only used after you consent. See our <a className="text-brand-500 underline" href="/cookie-policy">Cookie Policy</a> for cookie names, purposes, and preference controls.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Retention</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Authentication cookies are time-limited and can be cleared by logging out or clearing browser cookies.</li>
              <li>Generated image retention depends on your plan and current product settings. Public plan copy describes up to 90-day image retention for paid plans.</li>
              <li>Payment, invoice, refund, tax, fraud, and support records may be retained as needed for compliance, dispute handling, and legal obligations.</li>
              <li>Safety and abuse-prevention records may be retained to enforce our Content Policy and protect the service.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Your Choices and Rights</h2>
            <p className="mb-4">
              You may request access, correction, deletion, or export of personal information associated with your account. Some records may be retained where required for security, fraud prevention, payment disputes, tax, or legal compliance. To make a request, contact us from the email associated with your account.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Children</h2>
            <p className="mb-4">
              AI Editor RSP is not intended for children. Do not use the service to create, request, upload, or distribute sexualized, exploitative, or otherwise prohibited content involving minors.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Contact Us</h2>
            <p className="mb-4">
              For privacy questions or requests, contact us at: <a className="text-brand-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
