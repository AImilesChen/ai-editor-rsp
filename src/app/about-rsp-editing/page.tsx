import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "About RSP Editing",
  description:
    "Learn about RSP Editing, the trending AI photo editing brand. This is an independent guide with prompts, templates, and tutorials.",
  path: "/about-rsp-editing",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <section className="px-4 pb-12 pt-28 md:pt-32">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6">
            About RSP Editing
          </h1>

          <div className="bg-neutral-100 border-l-[3px] border-brand-500 rounded-r-md p-5 mb-8">
            <p className="text-neutral-700 text-sm leading-relaxed">
              <strong>Independent guide.</strong> Not affiliated with RSP
              Editing. This site is not affiliated with, endorsed by, or
              sponsored by RSP Editing or rspediting.com.
            </p>
          </div>

          <div className="prose prose-neutral max-w-none">
            <h2 className="font-heading text-xl font-bold mb-3">
              What is RSP Editing?
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              RSP Editing is a popular content creator known for AI photo
              editing tutorials and CapCut templates. Their style has become a
              trending phenomenon across TikTok, Instagram Reels, and YouTube
              Shorts, inspiring millions of creators to experiment with AI
              image generation and video editing.
            </p>

            <h2 className="font-heading text-xl font-bold mb-3">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-6">
              <li>
                <strong>AI Photo Prompts</strong> — Copy-paste ready prompts for
                ChatGPT, Gemini, and Bing Image Creator
              </li>
              <li>
                <strong>CapCut Templates</strong> — One-click links to trending
                templates for TikTok, Reels, and Shorts
              </li>
              <li>
                <strong>Effect Tutorials</strong> — Step-by-step guides to
                recreate popular visual effects
              </li>
              <li>
                <strong>Before & After Comparisons</strong> — See what these
                prompts and templates can do
              </li>
            </ul>

            <h2 className="font-heading text-xl font-bold mb-3">
              Is This Affiliated?
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              No. This is an independent fan-made guide created for educational
              purposes. We are not affiliated with, endorsed by, or sponsored by
              RSP Editing or rspediting.com. All prompts and templates are
              collected from publicly available sources and organized for easy
              discovery.
            </p>

            <h2 className="font-heading text-xl font-bold mb-3">
              How to Use This Site
            </h2>
            <ol className="list-decimal list-inside text-neutral-600 space-y-2 mb-6">
              <li>
                Browse our library of prompts, templates, and effects
              </li>
              <li>Click &quot;Copy Prompt&quot; or &quot;Use Template&quot; on any item</li>
              <li>
                Paste prompts into ChatGPT, Gemini, or Bing Image Creator
              </li>
              <li>
                Open CapCut template links directly in the CapCut app
              </li>
              <li>Share your creations on your favorite platform</li>
            </ol>

            <h2 className="font-heading text-xl font-bold mb-3">
              Important Notes
            </h2>
            <ul className="list-disc list-inside text-neutral-600 space-y-2 mb-6">
              <li>
                All content is free to browse — no signup or payment required
              </li>
              <li>
                AI-generated results may vary based on the tool and settings
                you use
              </li>
              <li>
                We do not provide AI generation services — we only share
                prompts
              </li>
              <li>
              CapCut templates link to the CapCut platform — we do
                not host template files
              </li>

            </ul>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/prompts"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              Browse Prompts
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-1.5 px-7 py-3.5 rounded-full text-[15px] font-semibold text-neutral-700 border border-neutral-300 no-underline transition-colors hover:bg-neutral-100"
            >
              Read FAQ
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
