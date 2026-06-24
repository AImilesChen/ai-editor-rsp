"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GenerationItem = {
  id: string;
  status: string;
  prompt: string;
  imageSize?: string | null;
  creditsQuoted?: number;
  creditsCharged?: number;
  publicAssetUrl?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: number;
  updatedAt: number;
  completedAt?: number | null;
};

type HistoryResponse = {
  ok?: boolean;
  items?: GenerationItem[];
  code?: string;
  error?: string;
};

export default function GenerationHistoryClient() {
  const [items, setItems] = useState<GenerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const completed = useMemo(() => items.filter((item) => item.status === "completed" && item.publicAssetUrl), [items]);

  useEffect(() => {
    let canceled = false;
    fetch(`/api/account/history?limit=60&t=${Date.now()}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({})) as HistoryResponse;
        if (!response.ok || !data.ok) throw new Error(data.error || "Could not load generation history.");
        return data.items || [];
      })
      .then((nextItems) => {
        if (!canceled) setItems(nextItems);
      })
      .catch((err: Error) => {
        if (!canceled) setError(err.message || "Could not load generation history.");
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => { canceled = true; };
  }, []);

  if (loading) {
    return <section className="rsp-card mt-8 p-8 text-rsp-muted">Loading your generation history…</section>;
  }

  if (error) {
    return (
      <section className="rsp-card mt-8 p-8 text-center">
        <h2 className="font-heading text-3xl font-normal text-rsp-text">Log in to see your saved images</h2>
        <p className="mt-3 text-rsp-muted">{error}</p>
        <Link href="/login?next=/account/history" className="rsp-button-primary mt-6">Log in</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rsp-card mt-8 p-8 text-center">
        <h2 className="font-heading text-3xl font-normal text-rsp-text">No generations yet</h2>
        <p className="mt-3 text-rsp-muted">After you generate an image, it will be saved here so closing the page will not lose the result.</p>
        <Link href="/generate" className="rsp-button-primary mt-6">Try Generator</Link>
      </section>
    );
  }

  return (
    <section className="rsp-card mt-8 p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Saved results</p>
          <h2 className="mt-2 font-heading text-3xl font-normal text-rsp-text">{completed.length} saved image{completed.length === 1 ? "" : "s"}</h2>
          <p className="mt-2 text-sm text-rsp-muted">Your latest 60 generation attempts are listed below. Completed items include the saved image and download link.</p>
        </div>
        <Link href="/generate" className="rsp-button-secondary">Generate another</Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden border border-rsp-border bg-white/65">
            <div className="flex aspect-[4/3] items-center justify-center bg-rsp-surface">
              {item.publicAssetUrl ? (
                <img src={item.publicAssetUrl} alt="Generated result" className="h-full w-full object-contain" loading="lazy" />
              ) : (
                <div className="px-5 text-center text-sm text-rsp-muted">
                  <p className="font-semibold uppercase tracking-[0.14em] text-rsp-text">{formatStatus(item.status)}</p>
                  <p className="mt-2">{item.errorMessage || "Result image is not available yet."}</p>
                </div>
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rsp-chip">{formatStatus(item.status)}</span>
                <span className="font-mono text-xs text-rsp-muted">{formatDate(item.completedAt || item.updatedAt || item.createdAt)}</span>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-rsp-text">{item.prompt}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-rsp-muted">
                <span>Size: <strong className="text-rsp-text">{item.imageSize || "auto"}</strong></span>
                <span>Credits: <strong className="text-rsp-text">{item.creditsCharged || item.creditsQuoted || 0}</strong></span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.publicAssetUrl ? (
                  <>
                    <a className="rsp-button-primary px-4 py-2 text-xs" href={item.publicAssetUrl} target="_blank" rel="noreferrer">Open image</a>
                    <a className="rsp-button-secondary px-4 py-2 text-xs" href={item.publicAssetUrl} download>Download</a>
                  </>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(value?: number | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
