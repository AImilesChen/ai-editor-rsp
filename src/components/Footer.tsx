import Link from "next/link";
import { site } from "@/lib/rsp-content";

export default function Footer() {
  return (
    <footer className="border-t border-rsp-border bg-rsp-surface px-4 py-12 text-rsp-muted md:px-12">
      <div className="mx-auto grid max-w-screen-2xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="font-heading text-2xl font-normal text-rsp-text">AI Editor RSP</div>
          <p className="max-w-md text-sm leading-6">Upload-first image generation and curated RSP-style prompts for creator workflows.</p>
          <p className="text-xs uppercase tracking-[0.16em] text-rsp-secondary">Independent tool. Not affiliated with RSP Editing.</p>
          <p className="max-w-md text-xs leading-5 text-rsp-muted">Legal pages updated for account access, credits, AI generation, and billing activation.</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-rsp-text">Product</h4>
          <Link className="footer-link" href="/generate">Generate</Link>
          <Link className="footer-link" href="/prompts">Prompt Library</Link>
          <Link className="footer-link" href="/pricing">Pricing</Link>
          <Link className="footer-link" href="/account">Account</Link>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-rsp-text">Policies</h4>
          <Link className="footer-link" href="/privacy">Privacy</Link>
          <Link className="footer-link" href="/terms">Terms</Link>
          <Link className="footer-link" href="/refund-policy">Refund Policy</Link>
          <Link className="footer-link" href="/account/billing#refund">Request Refund</Link>
          <Link className="footer-link" href="/cookie-policy">Cookie Policy</Link>
          <Link className="footer-link" href="/content-policy">Content Policy</Link>
          <Link className="footer-link" href="/ai-policy">AI Policy</Link>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-rsp-text">Contact</h4>
          <a className="footer-link" href={`mailto:${site.support}`}>{site.support}</a>
          <p className="mt-3 text-sm">Operator: AI Editor RSP. Mailing address available upon lawful request.</p>
          <p className="mt-3 text-xs leading-5">Refunds available within 14 days if no more than 50% of credits have been used. Start from Account → Billing → Refund Now.</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-screen-2xl border-t border-rsp-border pt-6 text-xs text-rsp-muted">© 2026 AI Editor RSP. Commercial launch pending backend and compliance final review.</div>
    </footer>
  );
}
