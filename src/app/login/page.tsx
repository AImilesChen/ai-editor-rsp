import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginPanel from "@/components/LoginPanel";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log In — AI Editor RSP",
  description: "Log in with Google or email magic link to manage credits and image generation history.",
  alternates: { canonical: `${SITE_URL}/login` },
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <p className="eyebrow">Account access</p>
            <h1 className="mt-4 font-heading text-5xl font-normal tracking-[-0.04em] text-rsp-text md:text-6xl">Log in to continue</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-rsp-muted">New users get 3 free credits total. Sign in to manage credits, generation history, billing, and refund requests from your account.</p>
            <div className="mt-8 grid gap-3 text-sm text-rsp-muted">
              <div className="border border-rsp-border bg-white/55 p-4"><strong className="text-rsp-text">Google sign-in</strong><br />Primary login path for account access.</div>
              <div className="border border-rsp-border bg-white/55 p-4"><strong className="text-rsp-text">Email magic link</strong><br />Passwordless sign-in if you prefer email.</div>
              <div className="border border-rsp-secondary/35 bg-rsp-secondary/10 p-4"><strong className="text-rsp-text">Credits</strong><br />Different image modes and sizes use different credit amounts. Paid plans use secure hosted checkout.</div>
            </div>
          </section>
          <LoginPanel error={params.error} />
        </div>
      </main>
      <Footer />
    </>
  );
}
