import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Tell Us What Prompt Templates You Need",
  description:
    "Tell us what photo you want to edit and see which RSP-style prompts match. Join the waitlist to be notified when this feature opens.",
  path: "/suggest-prompt",
  noindex: true,
});

export default function SuggestPromptPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-14 md:py-20">
        <section className="mx-auto max-w-container">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
              Static request collection
            </p>
            <h1 className="font-heading text-[34px] font-bold leading-tight md:text-5xl">
              Tell Us What Prompt Templates You Need
            </h1>
            <p className="mt-5 text-lg text-neutral-500">
              Describe your photo and we will show you matching prompt styles. This feature is planned — join the waitlist to get notified.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_420px]">
            <div className="rounded-2xl border border-neutral-300 bg-white/90 p-6 shadow-lg">
              <h2 className="font-heading text-2xl font-bold">Planned request flow</h2>
              <p className="mt-3 text-neutral-500">
                “Upload a photo and get matching prompt suggestions” is planned for a future update. In the meantime, browse our curated prompt library or join the waitlist to be the first to try it.
              </p>
              <div className="mt-6 rounded-xl bg-warning-bg p-4 text-sm text-neutral-800">
                This page collects feature interest and content requests. Use the editor for text prompts or uploaded-photo edits; do not submit sensitive, private, or rights-infringing images or prompts.
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {["Describe your editing goal", "Pick a matching style", "Get notified when ready"].map((step, index) => (
                  <div key={step} className="rounded-xl bg-neutral-50 p-4">
                    <span className="font-mono text-sm text-brand-500">0{index + 1}</span>
                    <p className="mt-2 font-semibold">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/prompts" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white no-underline">
                  Browse Prompts
                </Link>
                <Link href="/waitlist" className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 no-underline">
                  Join Waitlist
                </Link>
              </div>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
