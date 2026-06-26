"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "@/components/CookieConsentBanner";

const DEFAULT_GA_MEASUREMENT_ID = "G-RF7ZQTBKBW";
const DEFAULT_CLARITY_PROJECT_ID = "x57xd4laxk";
const DEFAULT_PLAUSIBLE_SCRIPT_URL = "https://plausible.shipsolo.io/js/pa-DY_KqwMYVe82xYA2-O8Dt.js";
const DEFAULT_PLAUSIBLE_DOMAIN = "aieditorrspediting.org";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || DEFAULT_CLARITY_PROJECT_ID;
const plausibleScriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || DEFAULT_PLAUSIBLE_SCRIPT_URL;
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || DEFAULT_PLAUSIBLE_DOMAIN;

type ConsentChoice = {
  analytics?: boolean;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as ConsentChoice;
    return Boolean(parsed.analytics);
  } catch {
    return false;
  }
}

export default function Analytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    setAnalyticsAllowed(hasAnalyticsConsent());

    const handleConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentChoice>).detail;
      const allowed = Boolean(detail?.analytics);
      setAnalyticsAllowed(allowed);

      if (!allowed && gaId) {
        window[`ga-disable-${gaId}`] = true;
      }
      if (!allowed && typeof window.clarity === "function") {
        window.clarity("consent", false);
      }
      if (allowed && typeof window.clarity === "function") {
        window.clarity("consent", true);
      }
    };

    window.addEventListener(CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, handleConsentChange);
  }, []);

  if (!analyticsAllowed) return null;

  return (
    <>
      {plausibleScriptUrl && plausibleDomain ? <Script src={plausibleScriptUrl} data-domain={plausibleDomain} strategy="afterInteractive" /> : null}
      {gaId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" /> : null}
      {gaId ? (
        <Script id="ga4-init" strategy="afterInteractive">{`
          window['ga-disable-${gaId}'] = false;
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'update', { analytics_storage: 'granted' });
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}</Script>
      ) : null}
      {clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${clarityId}");
          window.clarity('consent', true);
        `}</Script>
      ) : null}
    </>
  );
}
