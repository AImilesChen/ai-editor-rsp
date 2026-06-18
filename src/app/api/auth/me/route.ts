import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, publicUser } from "@/lib/backend/auth";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  return NextResponse.json({ ok: true, authenticated: Boolean(user), user: publicUser(user) });
}
