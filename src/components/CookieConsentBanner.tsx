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
    <div className={`fixed bottom-0 z-[100] px-3 pb-3 ${isManaging ? "inset-x-0 sm:bottom-5 sm:px-5" : "inset-x-0 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[430px] sm:px-0"}`} role="region" aria-label="Cookie consent">
      <div className={`mx-auto rounded-[22px] border border-[#d6a35c] bg-[#fff8eb] shadow-[0_22px_70px_rgba(72,42,14,0.24)] ring-1 ring-[#f0c989] ${isManaging ? "max-w-4xl p-4" : "w-full p-3"}`}>
        <div className="grid gap-3">
          <div className={isManaging ? "" : "min-w-0"}>
            {isManaging ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a45f17]">Cookie choices</p>
                <h2 className="mt-1 text-base font-bold leading-5 text-rsp-text">Choose your cookie settings</h2>
                <p className="mt-1 text-sm leading-5 text-[#5f4d39]">We only load optional analytics or marketing cookies after you choose.</p>
              </>
            ) : (
              <p className="text-sm leading-5 text-[#5f4d39]"><strong className="text-rsp-text">Cookie choices:</strong> optional analytics and marketing load only after you choose.</p>
            )}

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

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => closeWith({ analytics: false, marketing: false })} className="min-h-11 rounded-full border border-[#d0a16a] bg-white px-3 py-2.5 text-sm font-bold text-rsp-text shadow-sm transition hover:bg-[#fff3de] focus:outline-none focus:ring-2 focus:ring-[#b86b20]">
              Reject non-essential
            </button>
            <button type="button" onClick={() => setIsManaging((value) => !value)} className="min-h-11 rounded-full border border-[#d8b47d] bg-[#f4dfbc] px-3 py-2.5 text-sm font-bold text-[#6f3e12] shadow-sm transition hover:bg-[#ebc88f] focus:outline-none focus:ring-2 focus:ring-[#b86b20]">
              {isManaging ? "Hide details" : "Manage preferences"}
            </button>
            {isManaging ? (
              <button type="button" onClick={() => closeWith({ analytics, marketing })} className="min-h-11 rounded-full bg-rsp-text px-3 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(46,34,20,0.22)] transition hover:bg-[#2c241b] focus:outline-none focus:ring-2 focus:ring-[#b86b20]">
                Save choices
              </button>
            ) : (
              <button type="button" onClick={() => closeWith({ analytics: true, marketing: true })} className="min-h-11 rounded-full bg-rsp-text px-3 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(46,34,20,0.22)] transition hover:bg-[#2c241b] focus:outline-none focus:ring-2 focus:ring-[#b86b20]">
                Accept all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { CONSENT_EVENT, CONSENT_STORAGE_KEY };
