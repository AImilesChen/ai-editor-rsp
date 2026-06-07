import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="py-20 px-4 text-center">
        <div className="max-w-container mx-auto">
          <h1 className="font-heading text-6xl font-bold text-brand-500 mb-4">404</h1>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-brand-500 text-white px-7 py-3.5 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-400"
            >
              Go Home
            </Link>
            <Link
              href="/prompts"
              className="inline-flex items-center justify-center gap-1.5 px-7 py-3.5 rounded-full text-[15px] font-semibold text-neutral-700 border border-neutral-300 no-underline transition-colors hover:bg-neutral-100"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
