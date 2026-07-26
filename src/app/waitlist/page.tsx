import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Join the Waitlist — Get New Prompts & Templates First",
  description:
    "Join the AI Editor RSP waitlist and be the first to know when we add new prompts, templates, and features. No spam, opt out anytime.",
  path: "/waitlist",
  noindex: true,
});

export default function WaitlistPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-14 md:py-20">
        <section className="mx-auto grid max-w-container gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
              Independent guide. Not affiliated with RSP Editing.
            </p>
            <h1 className="font-heading text-[34px] font-bold leading-tight md:text-5xl">
              Get New Prompts & Templates First
            </h1>
            <p className="mt-5 max-w-xl text-lg text-neutral-500">
              Join the update list and be the first to know when we add new effects, templates, safety improvements, and creator workflows.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-neutral-700">
              <p className="rounded-xl bg-white/80 p-4 shadow-sm">Prompt directions, template references, image editing, generation history, billing, and refund review workflows are now available on AI Editor RSP.</p>
              <p className="rounded-xl bg-white/80 p-4 shadow-sm">Sign in to try free credits, then use Account → Billing to manage plans, cancellations, and eligible refund requests.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/prompts" className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 no-underline">
                Browse Prompts
              </Link>
              <Link href="/templates" className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 no-underline">
                Browse Templates
              </Link>
            </div>
          </div>
          <WaitlistForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
