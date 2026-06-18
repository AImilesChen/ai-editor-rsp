import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    policy: "AI Editor RSP generation safety rules",
    enforcement: [
      "Prompt safety check before provider calls",
      "Provider safety checker and NSFW filter flags where supported",
      "Output safety check using provider metadata before returning result images",
      "Safety event logging, credit-safe failures, and repeated-violation limits",
    ],
    blockedCategories: [
      "sexual or nude content",
      "minors in sexual or exploitative contexts",
      "graphic violence or gore",
      "self-harm",
      "hate or targeted harassment",
      "extremist content",
      "fake documents, scams, or deception",
      "impersonation or non-consensual deepfakes",
      "high-risk copyright, trademark, or publicity-rights misuse",
    ],
    creditPolicy: {
      promptBlocked: "not_charged",
      providerRejected: "not_charged",
      outputBlocked: "refunded_once",
    },
  });
}
