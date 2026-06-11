import Script from "next/script";

const DEFAULT_GA_MEASUREMENT_ID = "G-RF7ZQTBKBW";
const DEFAULT_CLARITY_PROJECT_ID = "x57xd4laxk";
const DEFAULT_PLAUSIBLE_SCRIPT_URL =
  "https://plausible.shipsolo.io/js/pa-DY_KqwMYVe82xYA2-O8Dt.js";

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || DEFAULT_CLARITY_PROJECT_ID;
  const plausibleScriptUrl =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || DEFAULT_PLAUSIBLE_SCRIPT_URL;

  return (
    <>
      {plausibleScriptUrl ? (
        <>
          <Script src={plausibleScriptUrl} strategy="afterInteractive" />
          <Script id="plausible-init" strategy="afterInteractive">
            {`
              window.plausible = window.plausible || function(){
                (plausible.q = plausible.q || []).push(arguments);
              };
              plausible.init = plausible.init || function(i){
                plausible.o = i || {};
              };
              plausible.init();
            `}
          </Script>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      ) : null}
    </>
  );
}
