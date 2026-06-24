import { NextRequest, NextResponse } from "next/server";
import { encodeSignedPayload, isValidEmail, MAGIC_LINK_TTL_MS, normalizeEmail, safeRedirectPath, siteOrigin } from "@/lib/backend/auth";

type Body = { email?: string; next?: string };

function fromEmail() {
  return process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || "AI Editor RSP <support@aieditorrspediting.org>";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as Body;
  const email = normalizeEmail(body.email || "");
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY is not configured." }, { status: 503 });
  }

  const origin = siteOrigin(request);
  const nextPath = safeRedirectPath(body.next);
  const token = await encodeSignedPayload({ email, provider: "email", nonce: crypto.randomUUID(), next: nextPath }, MAGIC_LINK_TTL_MS);
  const magicUrl = `${origin}/api/auth/magic/verify?token=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail(),
      to: email,
      subject: "Your AI Editor RSP login link",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#2A1F14"><h2>Log in to AI Editor RSP</h2><p>Click the secure link below to sign in. It expires in 15 minutes.</p><p><a href="${magicUrl}" style="display:inline-block;background:#B87333;color:#110B02;padding:12px 18px;text-decoration:none;font-weight:bold">Log in securely</a></p><p>If you did not request this, you can ignore this email.</p></div>`,
      text: `Log in to AI Editor RSP: ${magicUrl}\n\nThis link expires in 15 minutes.`,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
  if (!response.ok) {
    console.warn("resend_magic_link_failed", JSON.stringify({ status: response.status, error: data.message || data.error }));
    return NextResponse.json({ ok: false, error: "Could not send magic link. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: "Magic link sent. Check your inbox." });
}
