import Link from "next/link";
import { site } from "@/lib/rsp-content";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-rsp-bg px-4 py-12 text-rsp-muted md:px-12">
      <div className="mx-auto grid max-w-screen-2xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="font-heading text-2xl font-bold text-rsp-primary">AI Editor RSP</div>
          <p className="max-w-md text-sm leading-6">Dark cinematic prompt library with fal.ai generated case images for RSP-style creator workflows. Billing, persistent credits, and login are pending backend integration.</p>
          <p className="text-xs uppercase tracking-[0.16em] text-amber-200">Independent tool. Not affiliated with RSP Editing.</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-rsp-text">Product</h4>
          <Link className="footer-link" href="/generate">Generate</Link>
          <Link className="footer-link" href="/prompts">Prompt Library</Link>
          <Link className="footer-link" href="/pricing">Pricing</Link>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-rsp-text">Policies</h4>
          <Link className="footer-link" href="/privacy">Privacy</Link>
          <Link className="footer-link" href="/terms">Terms</Link>
          <Link className="footer-link" href="/refund-policy">Refund Policy</Link>
          <Link className="footer-link" href="/cookie-policy">Cookie Policy</Link>
          <Link className="footer-link" href="/content-policy">Content Policy</Link>
          <Link className="footer-link" href="/ai-policy">AI Policy</Link>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-rsp-text">Contact</h4>
          <a className="footer-link" href={`mailto:${site.support}`}>{site.support}</a>
          <p className="mt-3 text-sm">Operator details: [to be confirmed before launch]</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-screen-2xl border-t border-white/10 pt-6 text-xs text-rsp-muted">© 2026 AI Editor RSP. Compliance status: NEEDS_REVIEW before public launch.</div>
    </footer>
  );
}
