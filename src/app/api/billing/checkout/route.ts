import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: false,
    code: "CREEM_PRODUCTS_NOT_CONFIGURED",
    error: "Creem checkout requires confirmed product or price IDs before live billing can be enabled.",
    required: ["CREEM_STARTER_PRODUCT_ID", "CREEM_CREATOR_PRODUCT_ID", "CREEM_STUDIO_PRODUCT_ID"],
  }, { status: 501 });
}
