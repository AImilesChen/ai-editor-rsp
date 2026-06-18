import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/backend/auth";
import {
  creemApiBase,
  creemMode,
  creemProductId,
  extractCheckoutUrl,
  isBillingPlan,
  missingCreemConfig,
  originFromRequest,
} from "@/lib/backend/creem";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", error: "Sign in before starting checkout." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { plan?: unknown };
  const plan = typeof body.plan === "string" ? body.plan.toLowerCase() : "";
  if (!isBillingPlan(plan)) {
    return NextResponse.json({ ok: false, code: "INVALID_PLAN", error: "Plan must be starter, creator, or studio." }, { status: 400 });
  }

  const missing = missingCreemConfig();
  if (missing.length > 0) {
    return NextResponse.json({
      ok: false,
      code: "CREEM_CONFIG_INCOMPLETE",
      error: "Creem checkout is not fully configured.",
      missing,
    }, { status: 503 });
  }

  const productId = creemProductId(plan);
  if (!productId) {
    return NextResponse.json({ ok: false, code: "CREEM_PRODUCT_NOT_CONFIGURED", error: "Selected plan is not configured." }, { status: 503 });
  }

  const origin = originFromRequest(request);
  const successUrl = `${origin}/checkout?status=success&plan=${plan}`;
  const checkoutPayload = {
    product_id: productId,
    success_url: successUrl,
    metadata: {
      user_id: user.id,
      email: user.email,
      plan,
      source: "ai-editor-rsp",
    },
  };

  const response = await fetch(`${creemApiBase()}/checkouts`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.CREEM_API_KEY || "",
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify(checkoutPayload),
  });

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 500) };
  }

  if (!response.ok) {
    const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    return NextResponse.json({
      ok: false,
      code: "CREEM_CHECKOUT_FAILED",
      error: "Creem checkout creation failed.",
      status: response.status,
      traceId: record.trace_id || record.traceId,
      mode: creemMode(),
    }, { status: 502 });
  }

  const checkoutUrl = extractCheckoutUrl(payload);
  if (!checkoutUrl) {
    return NextResponse.json({
      ok: false,
      code: "CREEM_CHECKOUT_URL_MISSING",
      error: "Creem checkout response did not include a checkout URL.",
      mode: creemMode(),
    }, { status: 502 });
  }

  return NextResponse.json({ ok: true, checkoutUrl, plan, mode: creemMode() });
}
