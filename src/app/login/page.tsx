import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log In — AI Editor RSP",
  description: "Log in with Google or email magic link to manage credits and image generation history.",
  alternates: { canonical: `${SITE_URL}/login` },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <p className="eyebrow">Account access</p>
            <h1 className="mt-4 font-heading text-5xl font-normal tracking-[-0.04em] text-rsp-text md:text-6xl">Log in to continue</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-rsp-muted">New users get 3 free credits to start generating. Sign in to manage credits, generation history, and billing once account access is enabled for public launch.</p>
            <div className="mt-8 grid gap-3 text-sm text-rsp-muted">
              <div className="border border-rsp-border bg-white/55 p-4"><strong className="text-rsp-text">Google OAuth</strong><br />Primary login path for P2.0.</div>
              <div className="border border-rsp-border bg-white/55 p-4"><strong className="text-rsp-text">Email Magic Link</strong><br />Passwordless fallback for creator accounts.</div>
            </div>
          </section>
          <section className="rsp-card p-6 md:p-8" aria-label="Login form preview">
            <h2 className="font-heading text-3xl font-normal text-rsp-text">Log In</h2>
            <button className="mt-6 w-full border border-rsp-border bg-white px-5 py-4 text-left font-semibold text-rsp-text" type="button">Continue with Google</button>
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-rsp-muted"><span className="h-px flex-1 bg-rsp-border" />Or use email<span className="h-px flex-1 bg-rsp-border" /></div>
            <label htmlFor="email" className="text-sm font-semibold text-rsp-text">Email</label>
            <input id="email" type="email" placeholder="your@email.com" className="mt-2 w-full border border-rsp-border bg-[#FBF7F0] px-4 py-3 text-rsp-text outline-none ring-rsp-secondary/30 focus:ring-4" />
            <button type="button" className="rsp-button-primary mt-4 w-full">Send magic link</button>
            <p className="mt-4 text-sm leading-6 text-rsp-muted">No password needed. Check your inbox for a secure link.</p>
            <p className="mt-6 text-xs leading-5 text-rsp-muted">By continuing, you agree to our <Link className="text-rsp-secondary no-underline" href="/terms">Terms</Link> and <Link className="text-rsp-secondary no-underline" href="/privacy">Privacy Policy</Link>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
