import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Content Policy — AI Editor RSP",
  description: "Content safety rules and reporting contact for AI Editor RSP.",
  alternates: { canonical: `${SITE_URL}/content-policy` },
};

export default function ContentPolicyPage() {
  return (
    <>
      <Header />
      <main className="rsp-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="rsp-chip mb-4">Content Policy</p>
          <h1 className="font-heading text-4xl font-bold text-white md:text-6xl">Content safety rules.</h1>
          <p className="mt-5 text-[#A7ABB8]">
            Do not submit prompts intended to create illegal, abusive, deceptive, sexually exploitative, or rights-infringing content.
            Report issues to {SUPPORT_EMAIL}.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
