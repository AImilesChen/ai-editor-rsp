"use client";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("rsp-open-cookie-preferences"))}
      className="rounded-full bg-rsp-text px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2c241b]"
    >
      Manage cookie preferences
    </button>
  );
}
