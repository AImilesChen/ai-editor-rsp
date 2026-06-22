import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, publicUser } from "@/lib/backend/auth";
import { accountForPublicUser } from "@/lib/backend/billing-store";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ ok: true, authenticated: false, user: null });
  const account = await accountForPublicUser(user);
  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: {
      ...publicUser(user),
      plan: account.plan,
      creditsRemaining: account.creditsRemaining,
      creditsHeld: account.creditsHeld,
      subscriptionStatus: account.subscriptionStatus,
    },
  });
}
