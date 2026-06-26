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
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:left-auto sm:px-0 sm:pb-0" role="region" aria-label="Cookie consent">
      <div className={`ml-auto rounded-[20px] border border-[#ead8bb] bg-[#fffaf1]/95 p-3 shadow-[0_18px_54px_rgba(69,42,16,0.18)] backdrop-blur ${isManaging ? "max-w-4xl" : "max-w-sm"}`}>
        <div className="grid gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a36c2d]">Cookie preferences</p>
            <h2 className="sr-only">Optional cookies</h2>
            <p className="mt-1 max-w-[34ch] text-xs leading-4 text-[#5f4d39]">
              Optional analytics load only after you agree.
            </p>

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

          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => closeWith({ analytics: false, marketing: false })} className="rounded-full border border-[#d9bd91] bg-white px-2.5 py-2 text-xs font-semibold text-rsp-text transition hover:bg-[#fff3de]">
              Reject
            </button>
            <button type="button" onClick={() => setIsManaging((value) => !value)} className="rounded-full border border-transparent bg-[#f3e4cd] px-2.5 py-2 text-xs font-semibold text-[#7a4819] transition hover:bg-[#ead4b2]">
              {isManaging ? "Hide" : "Manage"}
            </button>
            {isManaging ? (
              <button type="button" onClick={() => closeWith({ analytics, marketing })} className="rounded-full bg-rsp-text px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-[#2c241b]">
                Save
              </button>
            ) : (
              <button type="button" onClick={() => closeWith({ analytics: true, marketing: true })} className="rounded-full bg-rsp-text px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-[#2c241b]">
                Accept
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { CONSENT_EVENT, CONSENT_STORAGE_KEY };
