import { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE = "rsp_session";
export const DEFAULT_LIFETIME_CREDITS = 3;

type SessionPayload = {
  sid: string;
  plan: "free" | "starter" | "creator" | "studio";
  creditsRemaining: number;
  safetyStrikeCount: number;
  safetyLimitedUntil?: number;
  refundedRequestIds: string[];
  createdAt: number;
  updatedAt: number;
};

const encoder = new TextEncoder();

function base64UrlEncode(input: string) {
  if (typeof btoa === "function") {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  if (typeof atob === "function") return atob(padded);
  return Buffer.from(input, "base64url").toString("utf8");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const bytes = String.fromCharCode(...new Uint8Array(signature));
  return base64UrlEncode(bytes);
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-only-ai-editor-rsp-session-secret";
  throw new Error("SESSION_SECRET or AUTH_SECRET must be configured in production");
}

function newSession(): SessionPayload {
  return {
    sid: crypto.randomUUID(),
    plan: "free",
    creditsRemaining: DEFAULT_LIFETIME_CREDITS,
    safetyStrikeCount: 0,
    refundedRequestIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export async function encodeSession(payload: SessionPayload) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const sig = await hmac(body, sessionSecret());
  return `${body}.${sig}`;
}

export async function decodeSession(value?: string | null): Promise<SessionPayload | null> {
  if (!value || !value.includes(".")) return null;
  const [body, sig] = value.split(".");
  if (!body || !sig) return null;
  const expected = await hmac(body, sessionSecret());
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const parsed = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    if (!parsed.sid || typeof parsed.creditsRemaining !== "number") return null;
    return {
      sid: parsed.sid,
      plan: parsed.plan || "free",
      creditsRemaining: Math.max(0, Number(parsed.creditsRemaining) || 0),
      safetyStrikeCount: Math.max(0, Number(parsed.safetyStrikeCount) || 0),
      safetyLimitedUntil: typeof parsed.safetyLimitedUntil === "number" ? parsed.safetyLimitedUntil : undefined,
      refundedRequestIds: Array.isArray(parsed.refundedRequestIds) ? parsed.refundedRequestIds.filter((id): id is string => typeof id === "string").slice(-20) : [],
      createdAt: typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export async function getSession(request: NextRequest) {
  return (await decodeSession(request.cookies.get(SESSION_COOKIE)?.value)) || newSession();
}

export async function setSessionCookie(response: NextResponse, session: SessionPayload) {
  const value = await encodeSession({ ...session, updatedAt: Date.now() });
  response.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function recordSafetyStrike(session: SessionPayload, severity: "low" | "medium" | "high" | "critical") {
  const nextStrikeCount = session.safetyStrikeCount + 1;
  const shouldLimit = severity === "critical" || nextStrikeCount >= 3;
  return {
    ...session,
    safetyStrikeCount: nextStrikeCount,
    safetyLimitedUntil: shouldLimit ? Date.now() + 24 * 60 * 60 * 1000 : session.safetyLimitedUntil,
  };
}

export function isSafetyLimited(session: SessionPayload) {
  return typeof session.safetyLimitedUntil === "number" && session.safetyLimitedUntil > Date.now();
}

export function refundCreditOnce(session: SessionPayload, requestId: string) {
  if (!requestId || session.refundedRequestIds.includes(requestId)) return session;
  return {
    ...session,
    creditsRemaining: session.creditsRemaining + 1,
    refundedRequestIds: [...session.refundedRequestIds, requestId].slice(-20),
  };
}

export type { SessionPayload };
