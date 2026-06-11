import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Learn how RSP Hub handles your data and protects your privacy.",
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Last updated: June 2026
          </p>

          <div className="prose prose-neutral max-w-none text-neutral-600">
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Introduction
            </h2>
            <p className="mb-4">
              RSP Hub (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This Privacy
              Policy explains how we collect, use, and protect your information
              when you visit our website.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Information We Collect
            </h2>
            <p className="mb-4">
              <strong>Automatically Collected:</strong> We may collect basic
              analytics data such as page views, browser type, and device
              information through privacy-focused analytics tools. This data is
              anonymized and cannot identify you personally.
            </p>
            <p className="mb-4">
              <strong>Cookies:</strong> We use minimal cookies for site
              functionality. We do not use tracking cookies for advertising
              purposes.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>To improve our website and user experience</li>
              <li>To understand which content is most popular</li>
              <li>To ensure the security and stability of our site</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Third-Party Services
            </h2>
            <p className="mb-4">
              We use Cloudflare for CDN and security services. Cloudflare may
              process your IP address for security and performance purposes.
            </p>
            <p className="mb-4">
              External links to CapCut, ChatGPT, Gemini, and other platforms are
              subject to those platforms&apos; privacy policies.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Data Storage
            </h2>
            <p className="mb-4">
              We do not store personal data on our servers. Any data collected
              through analytics is anonymized and retained for a limited time.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Your Rights
            </h2>
            <p className="mb-4">
              You have the right to access, correct, or delete any personal data
              we may hold. Since we collect minimal data, most requests can be
              addressed by clearing your browser cookies.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a className="text-brand-500 underline" href="mailto:privacy@aieditorrspediting.org">
                privacy@aieditorrspediting.org
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
