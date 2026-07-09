"use client";

import { useEffect, useMemo, useState } from "react";
import PricingPlanAction from "@/components/PricingPlanAction";

type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  quota: string;
  cta: string;
  badge: string;
  featured?: boolean;
  audience?: string;
  estimate?: string;
  generations?: string;
  features: string[];
};

type AuthResponse = {
  ok?: boolean;
  authenticated?: boolean;
  user?: {
    plan?: string;
    subscriptionStatus?: string;
  } | null;
};

const endedPlanStatuses = new Set(["canceled", "expired", "refunded", "disputed"]);
const refundPendingStatuses = new Set(["refund_requested"]);
const planRanks: Record<string, number> = {
  free: 0,
  starter: 1,
  creator: 2,
  studio: 3,
};

function normalize(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function isPaidPlan(plan?: string | null) {
  const value = normalize(plan);
  return Boolean(value && value !== "free");
}

function getPlanRank(plan?: string | null) {
  return planRanks[normalize(plan)] ?? -1;
}

function getActivePaidPlan(data: AuthResponse | null) {
  const userPlan = normalize(data?.user?.plan);
  const status = normalize(data?.user?.subscriptionStatus);
  if (!data?.authenticated || !isPaidPlan(userPlan) || endedPlanStatuses.has(status) || refundPendingStatuses.has(status)) return null;
  return userPlan;
}

function PricingAmount({ price, cadence, compact = false }: { price: string; cadence: string; compact?: boolean }) {
  const priceClass = compact ? "font-heading text-4xl font-normal leading-none" : "font-heading text-5xl font-normal leading-none text-rsp-text";
  const usdClass = compact ? "text-xs font-bold uppercase tracking-[0.16em] text-rsp-secondary" : "text-sm font-bold uppercase tracking-[0.18em] text-rsp-secondary";
  const wrapperClass = compact ? "mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1" : "mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1";

  if (price.startsWith("USD ")) {
    return (
      <div className={wrapperClass}>
        <span className={usdClass}>USD</span>
        <span className={priceClass}>{price.replace("USD ", "")}</span>
        <span className="text-rsp-muted">{cadence}</span>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <span className={priceClass}>{price}</span>
      <span className="text-rsp-muted">{cadence}</span>
    </div>
  );
}

export default function PricingPlanCards({ plans, variant = "pricing" }: { plans: PricingPlan[]; variant?: "pricing" | "home" }) {
  const defaultSelectedPlan = plans.find((plan) => plan.featured)?.name || plans[0]?.name || "Creator";
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState(defaultSelectedPlan);

  useEffect(() => {
    let canceled = false;
    const loadAuth = () => {
      fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
        .then((response) => response.json() as Promise<AuthResponse>)
        .then((data) => {
          if (!canceled) setAuth(data);
        })
        .catch(() => {
          if (!canceled) setAuth(null);
        });
    };
    loadAuth();
    const onFocus = () => loadAuth();
    const onVisibilityChange = () => {
      if (!document.hidden) loadAuth();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      canceled = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const activePaidPlan = useMemo(() => getActivePaidPlan(auth), [auth]);
  const compact = variant === "home";

  useEffect(() => {
    if (activePaidPlan) {
      const currentPlan = plans.find((plan) => normalize(plan.name) === activePaidPlan)?.name;
      if (currentPlan) setSelectedPlanName(currentPlan);
    }
  }, [activePaidPlan, plans]);

  const selectedPlanSlug = normalize(selectedPlanName);
  const canSelectPlans = !activePaidPlan;

  if (compact) {
    return (
      <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const planSlug = normalize(plan.name);
          const isCurrent = Boolean(activePaidPlan && activePaidPlan === planSlug);
          const upgradesCurrentPlan = Boolean(activePaidPlan && getPlanRank(plan.name) > getPlanRank(activePaidPlan));
          const selectedUpgradePlan = activePaidPlan && selectedPlanSlug !== activePaidPlan ? selectedPlanSlug : null;
          const isSelected = selectedUpgradePlan ? planSlug === selectedUpgradePlan : Boolean(isCurrent || (!activePaidPlan && selectedPlanSlug === planSlug));
          const isFeatured = isSelected;
          const eyebrow = activePaidPlan && plan.featured && !isCurrent ? "Regular use" : plan.badge;
          const cardAction = canSelectPlans || upgradesCurrentPlan ? () => setSelectedPlanName(plan.name) : undefined;
          return (
            <article
              key={plan.name}
              onClick={cardAction}
              onKeyDown={cardAction ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  cardAction();
                }
              } : undefined}
              role={cardAction ? "button" : undefined}
              tabIndex={cardAction ? 0 : undefined}
              className={`relative flex min-h-[430px] flex-col rounded-[30px] border bg-white/82 p-6 shadow-sm transition ${cardAction ? "cursor-pointer hover:-translate-y-1 hover:scale-[1.01] hover:border-rsp-primary/45 hover:shadow-[0_20px_55px_rgba(138,78,24,0.12)] active:scale-[0.995]" : ""} ${isFeatured ? "scale-[1.015] border-2 border-rsp-primary bg-[#fff4e3] shadow-[0_28px_70px_rgba(138,78,24,0.18)]" : "border-rsp-border"}`}
            >
              {isFeatured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rsp-primary px-4 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-rsp-on-primary shadow-[0_10px_20px_rgba(184,107,32,0.22)]">{isCurrent ? "Current plan" : "Selected plan"}</div>}
              <div className="flex min-h-[190px] flex-col">
                <p className={`mb-2 text-xs font-bold uppercase tracking-[0.14em] ${isFeatured ? "mt-2 text-rsp-primary" : "text-rsp-secondary"}`}>{eyebrow}</p>
                <h3 className="font-heading text-3xl font-normal text-rsp-text">{plan.name}</h3>
                <PricingAmount price={plan.price} cadence={plan.cadence} compact />
                <p className="mt-3 rounded-full border border-rsp-secondary/20 bg-rsp-secondary/8 px-3 py-1.5 text-sm font-bold text-rsp-secondary">{plan.quota}</p>
                {plan.generations ? <p className="mt-3 text-sm leading-6 text-rsp-muted">{plan.generations}</p> : null}
              </div>
              <ul className="mt-4 flex-1 space-y-2 text-sm leading-6 text-rsp-muted">
                {plan.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-rsp-secondary">✓</span><span>{feature}</span></li>)}
              </ul>
              <div className="mt-auto">
                <PricingPlanAction planName={plan.name} cta={plan.cta} emphasis={isFeatured ? "featured" : plan.name === "Free" ? "free" : "standard"} compact isSelected={isSelected} selectionEnabled={canSelectPlans} onSelect={() => setSelectedPlanName(plan.name)} />
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => {
        const planSlug = normalize(plan.name);
        const isCurrent = Boolean(activePaidPlan && activePaidPlan === planSlug);
        const upgradesCurrentPlan = Boolean(activePaidPlan && getPlanRank(plan.name) > getPlanRank(activePaidPlan));
        const selectedUpgradePlan = activePaidPlan && selectedPlanSlug !== activePaidPlan ? selectedPlanSlug : null;
        const isSelected = selectedUpgradePlan ? planSlug === selectedUpgradePlan : Boolean(isCurrent || (!activePaidPlan && selectedPlanSlug === planSlug));
        const isFeatured = isSelected;
        const isFree = plan.name === "Free";
        const eyebrow = activePaidPlan && plan.featured && !isCurrent ? "Regular use" : plan.badge;
        const cardAction = canSelectPlans || upgradesCurrentPlan ? () => setSelectedPlanName(plan.name) : undefined;
        return (
          <article
            key={plan.name}
            onClick={cardAction}
            onKeyDown={cardAction ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                cardAction();
              }
            } : undefined}
            role={cardAction ? "button" : undefined}
            tabIndex={cardAction ? 0 : undefined}
            className={`relative flex min-h-[500px] flex-col rounded-[30px] border bg-white/82 p-6 shadow-sm backdrop-blur transition ${cardAction ? "cursor-pointer hover:-translate-y-1 hover:scale-[1.01] hover:border-rsp-primary/45 hover:shadow-[0_22px_60px_rgba(138,78,24,0.12)] active:scale-[0.995]" : ""} ${
              isFeatured
                ? "scale-[1.015] border-2 border-rsp-primary bg-[#fff4e3] shadow-[0_30px_80px_rgba(138,78,24,0.22)] xl:-mt-4 xl:min-h-[544px]"
                : "border-rsp-border"
            }`}
          >
            {isFeatured ? (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-rsp-primary px-5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-rsp-on-primary shadow-[0_10px_22px_rgba(184,107,32,0.26)]">
                {isCurrent ? "Current plan" : "Selected plan"}
              </div>
            ) : null}
            <p className={`mb-3 text-sm font-bold ${isFeatured ? "mt-2 text-rsp-primary" : "text-rsp-secondary"}`}>{eyebrow}</p>
            <h2 className="font-heading text-3xl font-normal text-rsp-text">{plan.name}</h2>
            <PricingAmount price={plan.price} cadence={plan.cadence} />
            <p className="mt-3 text-sm font-semibold text-rsp-secondary">{plan.quota}</p>
            {plan.audience ? <p className="mt-3 text-sm leading-6 text-rsp-text">{plan.audience}</p> : null}
            {plan.estimate ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-rsp-muted">{plan.estimate}</p> : null}
            <ul className="mt-5 flex-1 space-y-2.5 text-sm leading-6 text-rsp-muted">
              {plan.features.slice(0, 4).map((f) => <li key={f} className="flex gap-2"><span className="text-rsp-secondary">+</span><span>{f}</span></li>)}
            </ul>
            <PricingPlanAction planName={plan.name} cta={plan.cta} emphasis={isFeatured ? "featured" : isFree ? "free" : "standard"} isSelected={isSelected} selectionEnabled={canSelectPlans} onSelect={() => setSelectedPlanName(plan.name)} />
          </article>
        );
      })}
    </div>
  );
}
