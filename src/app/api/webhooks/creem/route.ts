import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const hasSecret = Boolean(process.env.CREEM_WEBHOOK_SECRET);
  const signature = request.headers.get("x-creem-signature") || request.headers.get("creem-signature");
  const body = await request.text();

  if (!hasSecret) {
    return NextResponse.json({ ok: false, error: "CREEM_WEBHOOK_SECRET is not configured." }, { status: 503 });
  }

  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing Creem webhook signature." }, { status: 400 });
  }

  // P0 Lite endpoint: verifies that signed webhooks reach the Worker surface.
  // Persistent entitlement updates require D1/KV access and confirmed Creem event schema.
  return NextResponse.json({
    ok: true,
    received: true,
    persisted: false,
    bodyBytes: body.length,
    next: "Enable D1/KV and map confirmed Creem event types to entitlement updates.",
  });
}
