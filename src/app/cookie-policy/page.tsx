import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description:
    "Learn how RSP Hub uses cookies and similar technologies.",
  path: "/cookie-policy",
  noindex: true,
});

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6">
            Cookie Policy
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Last updated: June 2026
          </p>

          <div className="prose prose-neutral max-w-none text-neutral-600">
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              What Are Cookies
            </h2>
            <p className="mb-4">
              Cookies are small text files stored on your device when you visit
              a website. They help websites function properly and improve user
              experience.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              How We Use Cookies
            </h2>
            <p className="mb-4">
              RSP Hub uses minimal cookies for essential site functionality. We
              prioritize your privacy and do not use invasive tracking
              technologies.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Required for basic site
                functionality such as navigation and security.
              </li>
              <li>
                <strong>Analytics Cookies (Optional):</strong> Help us
                understand how visitors interact with our site. We use
                privacy-focused analytics that anonymize your data.
              </li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Managing Cookies
            </h2>
            <p className="mb-4">
              You can control cookies through your browser settings. Most
              browsers allow you to refuse or delete cookies. Note that
              disabling essential cookies may affect site functionality.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Third-Party Cookies
            </h2>
            <p className="mb-4">
              We do not use third-party advertising cookies. External links to
              CapCut, ChatGPT, and other platforms may set their own cookies
              subject to their respective policies.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this Cookie Policy periodically. Please check back
              for the latest version.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about our Cookie Policy, contact us at:
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
