"use client";

import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "rsp_cookie_consent_v1";
const CONSENT_EVENT = "rsp-cookie-consent-change";

type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentChoice) : null;
  } catch {
    return null;
  }
}

function saveConsent(choice: Pick<ConsentChoice, "analytics" | "marketing">) {
  const payload: ConsentChoice = { ...choice, savedAt: new Date().toISOString() };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: payload }));
  return payload;
}

export default function CookieConsentBanner() {
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setAnalytics(Boolean(saved.analytics));
      setMarketing(Boolean(saved.marketing));
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setIsReady(true);

    const openPreferences = () => {
      const current = readConsent();
      setAnalytics(Boolean(current?.analytics));
      setMarketing(Boolean(current?.marketing));
      setIsVisible(true);
      setIsManaging(true);
    };

    window.addEventListener("rsp-open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("rsp-open-cookie-preferences", openPreferences);
  }, []);

  if (!isReady || !isVisible) return null;

  const closeWith = (choice: Pick<ConsentChoice, "analytics" | "marketing">) => {
    saveConsent(choice);
    setAnalytics(choice.analytics);
    setMarketing(choice.marketing);
    setIsManaging(false);
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:inset-x-auto sm:left-5 sm:px-0 sm:pb-5" role="region" aria-label="Cookie consent">
      <div className={`rounded-3xl border border-[#ead8bb] bg-[#fffaf1]/95 p-3 shadow-[0_18px_54px_rgba(69,42,16,0.18)] backdrop-blur ${isManaging ? "max-w-4xl" : "max-w-5xl"}`}>
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
              <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a36c2d]">Cookie preferences</p>
              <h2 className="shrink-0 font-heading text-base font-bold leading-snug text-rsp-text">Choose optional cookies</h2>
              <p className="text-xs leading-5 text-[#6f5a42]">
                Essential cookies keep login, credits, and security working. Optional analytics load only after you agree.
              </p>
            </div>

            {isManaging ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <label className="rounded-2xl border border-[#ead8bb] bg-white/70 p-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-[#b86b20]" />
                    <span>
                      <span className="block font-semibold text-rsp-text">Essential</span>
                      <span className="mt-1 block text-xs leading-5 text-[#6f5a42]">Required for login, sessions, credits, billing safety, and abuse prevention.</span>
                    </span>
                  </div>
                </label>
                <label className="rounded-2xl border border-[#ead8bb] bg-white/70 p-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="mt-1 h-4 w-4 accent-[#b86b20]" />
                    <span>
                      <span className="block font-semibold text-rsp-text">Analytics</span>
                      <span className="mt-1 block text-xs leading-5 text-[#6f5a42]">GA4, Microsoft Clarity, Plausible, or similar analytics when configured.</span>
                    </span>
                  </div>
                </label>
                <label className="rounded-2xl border border-[#ead8bb] bg-white/70 p-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="mt-1 h-4 w-4 accent-[#b86b20]" />
                    <span>
                      <span className="block font-semibold text-rsp-text">Marketing</span>
                      <span className="mt-1 block text-xs leading-5 text-[#6f5a42]">Reserved for future advertising pixels. AI Editor RSP does not load marketing pixels unless this is enabled and configured.</span>
                    </span>
                  </div>
                </label>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {isManaging ? (
              <button type="button" onClick={() => closeWith({ analytics, marketing })} className="rounded-full bg-rsp-text px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2c241b]">
                Save preferences
              </button>
            ) : (
              <button type="button" onClick={() => closeWith({ analytics: true, marketing: true })} className="rounded-full bg-rsp-text px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2c241b]">
                Accept all
              </button>
            )}
            <button type="button" onClick={() => closeWith({ analytics: false, marketing: false })} className="rounded-full border border-[#d9bd91] bg-white px-4 py-2 text-sm font-semibold text-rsp-text transition hover:bg-[#fff3de]">
              Reject non-essential
            </button>
            <button type="button" onClick={() => setIsManaging((value) => !value)} className="rounded-full px-2 py-2 text-xs font-semibold text-[#8a5520] underline-offset-4 transition hover:underline sm:text-sm">
              Manage preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CONSENT_EVENT, CONSENT_STORAGE_KEY };
