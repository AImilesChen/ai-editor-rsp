import { normalizeEmail } from "@/lib/backend/auth";

const FALLBACK_REFUND_REVIEW_ADMIN_EMAILS = ["chenminjian08@gmail.com", "veryhappygou@gmail.com"];

export function adminToken() {
  return process.env.REFUND_REVIEW_TOKEN || process.env.ADMIN_API_TOKEN || process.env.CRON_SECRET || "";
}

export function adminEmails() {
  const configured = (process.env.REFUND_REVIEW_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return new Set([...configured, ...FALLBACK_REFUND_REVIEW_ADMIN_EMAILS]);
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && adminEmails().has(normalizeEmail(email)));
}
