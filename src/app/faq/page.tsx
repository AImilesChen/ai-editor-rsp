import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import { faqs } from "@/lib/data/faq";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about RSP Editing prompts, CapCut templates, and how to use this site.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-neutral-500 text-lg">
              Everything you need to know about using RSP Hub.
            </p>
          </div>

          <FAQAccordion items={faqs} />
        </div>
      </section>
      <Footer />
    </>
  );
}
