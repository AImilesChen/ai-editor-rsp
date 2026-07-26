import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminRefundReviewClient from "@/components/AdminRefundReviewClient";
import { AUTH_COOKIE, decodeSignedPayload, type AuthUser } from "@/lib/backend/auth";
import { isAdminEmail } from "@/lib/backend/admin";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: "Refund Review — AI Editor RSP" },
  description: "Internal refund eligibility review for AI Editor RSP customer support.",
  alternates: { canonical: `${SITE_URL}/admin/refund-review` },
  robots: { index: false, follow: false },
};

async function currentAuthUser() {
  const cookieStore = await cookies();
  const user = await decodeSignedPayload<AuthUser>(cookieStore.get(AUTH_COOKIE)?.value);
  if (!user?.email || !user.id) return null;
  return user;
}

export default async function RefundReviewPage() {
  const user = await currentAuthUser();
  if (!user) redirect("/login?next=/admin/refund-review");
  if (!isAdminEmail(user.email)) notFound();

  return (
    <>
      <Header />
      <main className="rsp-container pb-16 pt-32">
        <p className="eyebrow">Operations</p>
        <h1 className="mt-3 max-w-3xl font-heading text-5xl font-normal text-rsp-text">Refund Review</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-rsp-muted">
          Internal-only review surface for checking subscription payment, paid credit usage, refund window, and suggested refund handling.
        </p>
        <AdminRefundReviewClient adminEmail={user.email} />
      </main>
      <Footer />
    </>
  );
}
