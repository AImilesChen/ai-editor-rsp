import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Disclaimer",
  description:
    "Important disclaimers about AI Editor RSP's relationship to RSP Editing, AI generation, and third-party tools.",
  path: "/disclaimer",
  noindex: true,
});

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6">
            Disclaimer
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Last updated: June 2026
          </p>

          <div className="prose prose-neutral max-w-none text-neutral-600">
            <div className="bg-neutral-100 border-l-[3px] border-brand-500 rounded-r-md p-5 mb-8">
              <p className="text-neutral-700 text-sm leading-relaxed m-0">
                <strong>Independent guide.</strong> Not affiliated with RSP
                Editing. This site is not affiliated with, endorsed by, or
                sponsored by RSP Editing or rspediting.com.
              </p>
            </div>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Independent Status
            </h2>
            <p className="mb-4">
              AI Editor RSP is an independent creator tool and prompt-assisted
              image generation site inspired by RSP-style editing workflows. We are not affiliated with, endorsed by, or
              sponsored by RSP Editing, rspediting.com, or any associated
              entities.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              AI Generation Disclaimer
            </h2>
            <p className="mb-4">
              AI Editor RSP provides prompt-assisted image generation and curated
              prompt inspiration. Generated images are processed by third-party
              AI model/API providers and results may vary significantly based on
              provider availability, model version, settings, prompts, and input images used.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Third-Party Tools
            </h2>
            <p className="mb-4">
              References to ChatGPT, Gemini, Bing Image Creator, CapCut, and
              other platforms are for informational purposes only. We do not
              own or control these platforms. Users must comply with each
              platform&apos;s terms of service.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Affiliate Disclosure
            </h2>
            <p className="mb-4">
              Some links on this site may be affiliate links. This means we may
              earn a small commission if you click through and make a purchase
              or use a service. This comes at no additional cost to you and
              helps support the maintenance of this free resource.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Copyright and Trademarks
            </h2>
            <p className="mb-4">
              All trademarks, logos, and brand names are the property of their
              respective owners. &quot;RSP Editing&quot; and related marks belong to their
              respective owners. Our use of these references falls under fair
              use for educational and informational purposes.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              No Guarantees
            </h2>
            <p className="mb-4">
              We make no guarantees about the accuracy, completeness, or
              effectiveness of any prompt or template. AI-generated content is
              inherently unpredictable. Use all prompts and templates at your
              own discretion.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Limitation of Liability
            </h2>
            <p className="mb-4">
              AI Editor RSP and its operators shall not be liable for any damages
              arising from the use of this site or third-party tools. This
              includes but is not limited to direct, indirect, incidental, or
              consequential damages.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">
              Contact
            </h2>
            <p className="mb-4">
              For questions about this disclaimer, contact us at:
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
