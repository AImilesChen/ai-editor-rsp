import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-neutral-300 pt-16 pb-8">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          <div>
            <h4 className="text-white text-base font-semibold mb-4">Explore</h4>
            <Link href="/prompts" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Prompts
            </Link>
            <Link href="/templates" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Templates
            </Link>
            <Link href="/effects" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Effects
            </Link>
            <Link href="/about-rsp-editing" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              About
            </Link>
          </div>
          <div>
            <h4 className="text-white text-base font-semibold mb-4">Legal</h4>
            <Link href="/privacy" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Disclaimer
            </Link>
            <Link href="/cookie-policy" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Cookie Policy
            </Link>
            <Link href="/refund-policy" className="block text-neutral-300 text-sm mb-2.5 no-underline transition-colors hover:text-white">
              Refund Policy
            </Link>
          </div>
          <div>
            <h4 className="text-white text-base font-semibold mb-4">Connect</h4>
            <span className="block text-neutral-500 text-sm">Social links coming soon</span>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-[13px] text-neutral-500">
          <p>© 2026 RSP Hub. Independent guide. Not affiliated with RSP Editing.</p>
        </div>
      </div>
    </footer>
  );
}
