import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Read the Terms of Service for using RSP Hub. Understand your rights and responsibilities.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Last updated: June 2026
          </p>

          <div className="prose prose-neutral max-w-none text-neutral-600">
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using RSP Hub, you accept and agree to be bound
              by these Terms of Service. If you do not agree, please do not use
              our website.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Service Description
            </h2>
            <p className="mb-4">
              RSP Hub is an independent educational resource that provides AI
              photo prompts and CapCut template links. We do not provide AI
              image generation services, video editing software, or template
              hosting.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Third-Party Tools
            </h2>
            <p className="mb-4">
              You are responsible for complying with the terms of service of any
              third-party tools you use, including but not limited to ChatGPT,
              Gemini, Bing Image Creator, and CapCut. We are not responsible for
              any issues arising from your use of these platforms.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Intellectual Property
            </h2>
            <p className="mb-4">
              The prompts and tutorials on this site are for educational
              purposes. AI-generated images may be subject to the terms of the
              AI tool you use. CapCut templates are owned by their respective
              creators and linked through their channels.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Acceptable Use
            </h2>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                Do not use our content for illegal, harmful, or malicious
                purposes
              </li>
              <li>Do not scrape or automate access to our website</li>
              <li>Respect copyright and intellectual property rights</li>
              <li>Do not attempt to disrupt or damage our services</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Disclaimer
            </h2>
            <p className="mb-4">
              This site is provided &quot;as is&quot; without warranties of any
              kind. We do not guarantee that prompts will produce specific
              results, or that template links will remain active. AI-generated
              results vary and we are not responsible for outputs from
              third-party AI tools.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by law, RSP Hub shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of our site or third-party
              tools.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Changes to Terms
            </h2>
            <p className="mb-4">
              We may update these terms at any time. Continued use of the site
              after changes constitutes acceptance of the updated terms.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Contact
            </h2>
            <p className="mb-4">
              For questions about these Terms, contact us at:
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
