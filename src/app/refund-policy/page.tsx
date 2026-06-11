import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Refund Policy",
  description:
    "RSP Hub refund policy. All content on this site is free to browse.",
  path: "/refund-policy",
  noindex: true,
});

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6">
            Refund Policy
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Last updated: June 2026
          </p>

          <div className="prose prose-neutral max-w-none text-neutral-600">
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Free Content
            </h2>
            <p className="mb-4">
              RSP Hub is a free content site. All prompts, templates, and
              tutorials are available at no cost. There are no paid products,
              subscriptions, or services offered on this site.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              No Payments, No Refunds
            </h2>
            <p className="mb-4">
              Since we do not charge for any content or services, there are no
              payments to refund. If you choose to support us through optional
              affiliate links (such as CapCut template links), those
              transactions are handled directly by the third-party platform and
              are subject to their refund policies.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Third-Party Purchases
            </h2>
            <p className="mb-4">
              If you make a purchase through an affiliate link on our site,
              please contact the respective platform (e.g., CapCut) for any
              refund inquiries. We do not process payments or handle refunds
              for third-party services.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Future Paid Features
            </h2>
            <p className="mb-4">
              If we introduce optional paid features in the future, a separate
              refund policy will be provided at that time. The core prompt and
              template library will remain free.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Refund Policy, contact us at:
              <a className="text-brand-500 underline" href="mailto:support@aieditorrspediting.org">
                support@aieditorrspediting.org
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
