import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, publicUser } from "@/lib/backend/auth";
import { accountForPublicUser, selfServiceRefundStatusForUser } from "@/lib/backend/billing-store";
import { isAdminEmail } from "@/lib/backend/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const noStoreHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
  if (!user) return NextResponse.json({ ok: true, authenticated: false, user: null }, { headers: noStoreHeaders });
  const account = await accountForPublicUser(user);
  const selfServiceRefund = await selfServiceRefundStatusForUser(user);
  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: {
      ...publicUser(user),
      plan: account.plan,
      creditsRemaining: account.creditsRemaining,
      creditsHeld: account.creditsHeld,
      subscriptionStatus: account.subscriptionStatus,
      selfServiceRefund,
      isAdmin: isAdminEmail(user.email),
    },
  }, { headers: noStoreHeaders });
}
