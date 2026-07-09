import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import { ensureBillingAccount } from "@/lib/backend/billing-store";
import { createStripeCustomerPortal } from "@/lib/backend/stripe";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Please log in before managing billing." }, { status: 401 });

  const account = await ensureBillingAccount(user);
  if (!account) return NextResponse.json({ ok: false, code: "BILLING_STORE_UNAVAILABLE", message: "Billing account is unavailable." }, { status: 503 });
  if (!account.customerId) return NextResponse.json({ ok: false, code: "CUSTOMER_ID_MISSING", message: "Stripe customer ID is not available for this account yet." }, { status: 409 });

  const portal = await createStripeCustomerPortal(account.customerId);
  if (!portal.ok || !portal.url) {
    return NextResponse.json({ ok: false, code: "CUSTOMER_PORTAL_UNAVAILABLE", message: portal.message || "Stripe customer portal is unavailable." }, { status: portal.status || 502 });
  }

  return NextResponse.json({ ok: true, url: portal.url });
}
