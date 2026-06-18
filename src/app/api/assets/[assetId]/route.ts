import { NextRequest, NextResponse } from "next/server";
import { getImageAssetForRequest } from "@/lib/backend/generation-store";
import { getAuthUser } from "@/lib/backend/auth";

type RouteContext = {
  params: Promise<{ assetId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { assetId } = await context.params;
  if (!assetId || !/^asset_[a-f0-9-]+$/i.test(assetId)) {
    return NextResponse.json({ ok: false, error: "Invalid asset id." }, { status: 400 });
  }

  const user = await getAuthUser(request);
  const asset = await getImageAssetForRequest({ assetId, user });
  if (!asset) {
    if (request.nextUrl.searchParams.get("debug") === "1") {
      const { debugImageAssetLookup } = await import("@/lib/backend/generation-store");
      return NextResponse.json({ ok: false, error: "Asset not found.", debug: await debugImageAssetLookup(assetId) }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: "Asset not found." }, { status: 404 });
  }

  return new Response(asset.object.body, {
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
