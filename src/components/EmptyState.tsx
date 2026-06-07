import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title = "No results found",
  subtitle = "Try a different keyword or filter.",
  ctaText = "Browse all",
  ctaHref = "/",
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-5">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neutral-300 mx-auto mb-4"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <line x1="8" y1="8" x2="14" y2="14" />
        <line x1="14" y1="8" x2="8" y2="14" />
      </svg>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 mb-5">{subtitle}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-neutral-700 border border-neutral-300 no-underline transition-colors hover:bg-neutral-100"
      >
        {ctaText}
      </Link>
    </div>
  );
}
