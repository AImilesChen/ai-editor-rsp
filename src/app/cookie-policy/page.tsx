import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/utils/metadata";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "Learn how AI Editor RSP uses essential cookies for login, sessions, credits, OAuth security, and analytics status.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <section className="py-12 px-4">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-heading text-[26px] md:text-4xl font-bold mb-6 text-rsp-text">
            Cookie Policy
          </h1>
          <p className="text-neutral-500 text-sm mb-8">Last updated: June 2026</p>

          <div className="prose prose-neutral max-w-none text-neutral-700 leading-7">
            <p className="mb-4">
              This Cookie Policy explains how AI Editor RSP uses cookies and similar technologies for site functionality, login, credits, security, and analytics status.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Cookies We Use</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>rsp_session:</strong> essential session cookie used for anonymous session state, free credits, generation status, safety limits, and credit-safe failures.</li>
              <li><strong>rsp_auth:</strong> essential authentication cookie used after Google or email magic-link login to identify your account, plan, and credits state.</li>
              <li><strong>rsp_oauth_state:</strong> short-lived OAuth security cookie used to protect the Google login flow from cross-site request forgery.</li>
              <li><strong>Security cookies:</strong> infrastructure services may set security or performance cookies to protect the site, route traffic, and prevent abuse.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Why These Cookies Are Needed</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Keep you signed in and maintain account state.</li>
              <li>Track credits balance and generation safety state.</li>
              <li>Protect OAuth login, prevent abuse, and secure requests.</li>
              <li>Operate the website reliably through Cloudflare hosting and security services.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Optional Analytics</h2>
            <p className="mb-4">
              AI Editor RSP may use optional analytics tools such as Google Analytics, Microsoft Clarity, Plausible, or similar services to understand page performance and improve the product. These optional analytics scripts are loaded only after you agree to analytics cookies in the preference banner.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Essential:</strong> always active for login, sessions, credits, security, billing safety, and abuse prevention.</li>
              <li><strong>Analytics:</strong> optional pageview, device, browser, and interaction signals used to improve the site.</li>
              <li><strong>Marketing:</strong> reserved for future advertising pixels and not loaded unless enabled and configured.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Third-Party Cookies</h2>
            <p className="mb-4">
              External links to tools, AI providers, payment providers, CapCut, ChatGPT, Gemini, Bing Image Creator, or other platforms may set their own cookies when you visit those services. Their cookies are governed by their own policies.
            </p>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Managing Cookies</h2>
            <p className="mb-4">
              You can accept all optional cookies, reject non-essential cookies, or manage analytics and marketing preferences at any time. Disabling essential cookies may prevent login, credits tracking, generation requests, billing flows, or security checks from working correctly.
            </p>
            <div className="mb-6">
              <CookiePreferencesButton />
            </div>

            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have questions about cookies, contact: <a className="text-brand-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
