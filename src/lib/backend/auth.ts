import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LIFETIME_CREDITS } from "@/lib/backend/session";

export const AUTH_COOKIE = "rsp_auth";
export const OAUTH_STATE_COOKIE = "rsp_oauth_state";
export const OAUTH_NEXT_COOKIE = "rsp_oauth_next";
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
export const AUTH_TTL_SECONDS = 60 * 60 * 24 * 30;

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  provider: "google" | "email";
  plan: "free" | "starter" | "creator" | "studio";
  creditsRemaining: number;
  createdAt: number;
};

const encoder = new TextEncoder();

function base64UrlEncode(input: string) {
  if (typeof btoa === "function") return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
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

function authSecret() {
  return process.env.AUTH_SECRET || process.env.SESSION_SECRET || "dev-only-ai-editor-rsp-auth-secret";
}

async function hmac(message: string, secret = authSecret()) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const bytes = String.fromCharCode(...new Uint8Array(signature));
  return base64UrlEncode(bytes);
}

function stableUserId(email: string) {
  return `usr_${base64UrlEncode(email.trim().toLowerCase()).slice(0, 24)}`;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function createAuthUser(input: { email: string; name?: string; picture?: string; provider: "google" | "email" }): AuthUser {
  const email = normalizeEmail(input.email);
  return {
    id: stableUserId(email),
    email,
    name: input.name || email.split("@")[0],
    picture: input.picture,
    provider: input.provider,
    plan: "free",
    creditsRemaining: DEFAULT_LIFETIME_CREDITS,
    createdAt: Date.now(),
  };
}

export async function encodeSignedPayload(payload: Record<string, unknown>, ttlMs?: number) {
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp: ttlMs ? Date.now() + ttlMs : undefined }));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

export async function decodeSignedPayload<T extends Record<string, unknown>>(token?: string | null): Promise<T | null> {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmac(body);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const parsed = JSON.parse(base64UrlDecode(body)) as T & { exp?: number };
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function encodeAuthCookie(user: AuthUser) {
  return encodeSignedPayload(user);
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const user = await decodeSignedPayload<AuthUser>(request.cookies.get(AUTH_COOKIE)?.value);
  if (!user?.email || !user.id) return null;
  return user;
}

export async function setAuthCookie(response: NextResponse, user: AuthUser) {
  response.cookies.set(AUTH_COOKIE, await encodeAuthCookie(user), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_TTL_SECONDS,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export function publicUser(user: AuthUser | null) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    provider: user.provider,
    plan: user.plan,
    creditsRemaining: user.creditsRemaining,
  };
}

export function siteOrigin(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export function safeRedirectPath(value?: string | null) {
  if (!value) return "/account";
  try {
    const decoded = decodeURIComponent(value);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/account";
    if (decoded.startsWith("/api/")) return "/account";
    return decoded;
  } catch {
    return "/account";
  }
}
