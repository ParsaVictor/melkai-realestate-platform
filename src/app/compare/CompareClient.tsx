"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import PropertyMiniCard, {
  PropertyMiniCardSkeleton,
  type ListedProperty,
} from "@/components/PropertyMiniCard";
import { properties } from "@/data/properties";
import {
  faDigits,
  enDigits,
  toman,
  perMeter,
  LISTING_LABEL,
  TYPE_LABEL,
  scoreTone,
} from "@/lib/format";
import { StoreProvider, useStore, COMPARE_LIMIT } from "@/lib/store";

const ALL = properties as unknown as ListedProperty[];
const BY_ID = new Map<number, ListedProperty>(ALL.map((p) => [p.id, p]));

/**
 * StoreProvider هنوز در layout ریشه نصب نیست، پس اگر بالادست نبود همین‌جا می‌سازیمش.
 * این تشخیص از دوباره‌پیچیدن (و شکستن state مشترک) جلوگیری می‌کند.
 */
function useHasStore() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useStore();
    return true;
  } catch {
    return false;
  }
}

/* ───────────────── امتیاز کل ───────────────── */

/** مقیاس ۰..۱ نسبت به همین مجموعه؛ وقتی همه برابرند مقدار خنثی می‌دهیم */
function norm(v: number, arr: number[]) {
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  return mx === mn ? 0.5 : (v - mn) / (mx - mn);
}

/** امتیاز نسبی هر ملک در همین مقایسه (نه امتیاز مطلق بازار) */
function relativeScores(items: ListedProperty[]): number[] {
  if (items.length === 0) return [];
  const ppms = items.map((p) => (p.area > 0 ? p.price / p.area : 0));
  const scores = items.map((p) => p.neighborScore);
  const areas = items.map((p) => p.area);
  const years = items.map((p) => p.yearBuilt);

  return items.map((p, i) => {
    const amenities = [p.parking, p.elevator, p.storage, p.balcony].filter(Boolean).length / 4;
    const total =
      0.38 * norm(p.neighborScore, scores) +
      0.22 * (1 - norm(ppms[i], ppms)) +
      0.16 * norm(p.area, areas) +
      0.12 * amenities +
      0.12 * norm(p.yearBuilt, years);
    return Math.round(total * 100);
  });
}

/* ───────────────── ردیف‌های جدول ───────────────── */

type Row = {
  key: string;
  label: string;
  /** متن ساده — هم برای CSV و هم برای تشخیص «یکسان بودن» ردیف */
  text: (p: ListedProperty) => string;
  cell?: (p: ListedProperty) => ReactNode;
};

const YES = <span className="font-bold text-emerald-300">دارد</span>;
const NO = <span className="text-slate-500">ندارد</span>;

const ROWS: Row[] = [
  { key: "type", label: "نوع ملک", text: (p) => TYPE_LABEL[p.propertyType] ?? "—" },
  { key: "listing", label: "نوع آگهی", text: (p) => LISTING_LABEL[p.listingType] ?? "—" },
  {
    key: "price",
    label: "قیمت",
    text: (p) => toman(p.price),
    cell: (p) => <span className="font-black text-[#f0d080]">{toman(p.price)}</span>,
  },
  { key: "ppm", label: "قیمت هر متر", text: (p) => perMeter(p.price, p.area) },
  { key: "area", label: "متراژ", text: (p) => `${faDigits(p.area)} متر` },
  { key: "bedrooms", label: "اتاق خواب", text: (p) => faDigits(p.bedrooms) },
  { key: "bathrooms", label: "سرویس بهداشتی", text: (p) => faDigits(p.bathrooms) },
  {
    key: "floor",
    label: "طبقه",
    text: (p) => `${faDigits(p.floor)} از ${faDigits(p.totalFloors)}`,
  },
  { key: "year", label: "سال ساخت", text: (p) => faDigits(p.yearBuilt) },
  { key: "parking", label: "پارکینگ", text: (p) => (p.parking ? "دارد" : "ندارد"), cell: (p) => (p.parking ? YES : NO) },
  { key: "storage", label: "انباری", text: (p) => (p.storage ? "دارد" : "ندارد"), cell: (p) => (p.storage ? YES : NO) },
  { key: "balcony", label: "بالکن", text: (p) => (p.balcony ? "دارد" : "ندارد"), cell: (p) => (p.balcony ? YES : NO) },
  { key: "elevator", label: "آسانسور", text: (p) => (p.elevator ? "دارد" : "ندارد"), cell: (p) => (p.elevator ? YES : NO) },
  {
    key: "neighborScore",
    label: "امتیاز همسایگی",
    text: (p) => `${faDigits(p.neighborScore)} از ۱۰۰ (${scoreTone(p.neighborScore).label})`,
    cell: (p) => {
      const tone = scoreTone(p.neighborScore);
      return (
        <span className="inline-flex items-center gap-2">
          <span className="font-black" style={{ color: tone.color }}>
            {faDigits(p.neighborScore)}
          </span>
          <span className="text-[11px] text-slate-500">{tone.label}</span>
        </span>
      );
    },
  },
  { key: "city", label: "شهر", text: (p) => p.city },
  { key: "neighborhood", label: "محله", text: (p) => p.neighborhood },
  {
    key: "celeb",
    label: "همسایهٔ شاخص",
    text: (p) =>
      p.hasCelebNeighbor && p.celebName
        ? `${p.celebName}${p.celebProfession ? ` — ${p.celebProfession}` : ""}`
        : "ندارد",
    cell: (p) =>
      p.hasCelebNeighbor && p.celebName ? (
        <span className="inline-flex flex-col">
          <span className="font-bold text-[#f0d080]">{p.celebName}</span>
          {p.celebProfession && (
            <span className="text-[11px] text-slate-500">{p.celebProfession}</span>
          )}
        </span>
      ) : (
        NO
      ),
  },
];

/* ───────────────── صفحه ───────────────── */

export default function CompareClient() {
  const store = useStore();
  const ready = store?.ready ?? false;
  const compare = useMemo(() => store?.compare ?? [], [store?.compare]);

  const [tab, setTab] = useState<"overview" | "details">("overview");
  const [onlyDiff, setOnlyDiff] = useState(false);

  const items = useMemo(
    () => compare.map((id) => BY_ID.get(id)).filter((p): p is ListedProperty => Boolean(p)),
    [compare],
  );

  const scores = useMemo(() => relativeScores(items), [items]);

  const best = useMemo(() => {
    if (items.length === 0) return null;
    return {
      score: Math.max(...scores),
      price: Math.min(...items.map((p) => p.price)),
      area: Math.max(...items.map((p) => p.area)),
      neighbor: Math.max(...items.map((p) => p.neighborScore)),
    };
  }, [items, scores]);

  const visibleRows = useMemo(() => {
    if (!onlyDiff) return ROWS;
    return ROWS.filter((r) => new Set(items.map((p) => r.text(p))).size > 1);
  }, [onlyDiff, items]);

  function exportCsv() {
    if (items.length === 0) return;
    const esc = (s: string) => `"${enDigits(s).replace(/"/g, '""')}"`;
    const lines: string[] = [];
    lines.push(["ویژگی", ...items.map((p) => p.title)].map(esc).join(","));
    lines.push(
      ["امتیاز کل مقایسه", ...items.map((_, i) => String(scores[i]))].map(esc).join(","),
    );
    ROWS.forEach((r) => {
      lines.push([r.label, ...items.map((p) => r.text(p))].map(esc).join(","));
    });

    // BOM لازم است تا اکسل فارسی را درست باز کند
    const blob = new Blob(["﻿" + lines.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "molkai-compare.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const enough = items.length >= 2;

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />

      <section className="grid-bg">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <header className="mb-6">
            <nav aria-label="مسیر صفحه" className="mb-3 text-xs text-slate-500">
              <Link href="/" className="transition-colors hover:text-[#f0d080]">
                خانه
              </Link>
              <span className="mx-2 opacity-50">/</span>
              <span className="text-slate-400">مقایسه</span>
            </nav>

            <h1 className="text-3xl font-black sm:text-4xl">
              <span className="gold-text-gradient">مقایسهٔ ملک‌ها</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              تا {faDigits(COMPARE_LIMIT)} ملک را کنار هم بگذارید. آنچه واقعاً فرق دارد را ببینید،
              نه فهرست بلندی از ویژگی‌های تکراری.
            </p>
          </header>

          {/* ── نوار ابزار ── */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[#0d1424]/70 p-4 backdrop-blur-md">
            <div
              role="tablist"
              aria-label="حالت مقایسه"
              className="flex rounded-xl border border-white/10 bg-[#070b14] p-1"
            >
              {(
                [
                  ["overview", "مقایسهٔ کلی"],
                  ["details", "مقایسهٔ جزئی"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  id={`tab-${value}`}
                  aria-selected={tab === value}
                  aria-controls={`panel-${value}`}
                  onClick={() => setTab(value)}
                  className={`rounded-lg px-4 py-2 text-xs font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                    tab === value
                      ? "bg-[#c9a84c]/15 text-[#f0d080]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-slate-400">
                {ready
                  ? `${faDigits(items.length)} از ${faDigits(COMPARE_LIMIT)} ملک`
                  : "در حال بارگذاری…"}
              </span>

              {tab === "details" && (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-bold text-slate-300 transition-colors hover:border-white/25 focus-within:ring-2 focus-within:ring-[#c9a84c]">
                  <input
                    type="checkbox"
                    checked={onlyDiff}
                    onChange={(e) => setOnlyDiff(e.target.checked)}
                    className="h-4 w-4 accent-[#c9a84c] focus-visible:outline-none"
                  />
                  فقط تفاوت‌ها را نشان بده
                </label>
              )}

              <button
                type="button"
                onClick={exportCsv}
                disabled={!enough}
                className="rounded-xl border border-[#c9a84c]/50 bg-[#c9a84c]/10 px-3.5 py-2 text-xs font-bold text-[#f0d080] transition-colors hover:bg-[#c9a84c]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                خروجی CSV
              </button>

              <button
                type="button"
                onClick={() => store?.clearCompare()}
                disabled={!ready || items.length === 0}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-slate-400 transition-colors hover:border-rose-400/40 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                خالی‌کردن لیست
              </button>
            </div>
          </div>

          {/* ── محتوا ── */}
          {!ready ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }, (_, i) => (
                <PropertyMiniCardSkeleton key={i} />
              ))}
            </div>
          ) : !enough ? (
            <EmptyCompare
              count={items.length}
              current={items}
              onAdd={(id) => store?.toggleCompare(id)}
              onRemove={(id) => store?.toggleCompare(id)}
            />
          ) : tab === "overview" ? (
            <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
              <OverviewGrid
                items={items}
                scores={scores}
                best={best}
                onRemove={(id) => store?.toggleCompare(id)}
              />
            </div>
          ) : (
            <div id="panel-details" role="tabpanel" aria-labelledby="tab-details">
              <DetailsTable
                items={items}
                rows={visibleRows}
                hiddenCount={ROWS.length - visibleRows.length}
                onlyDiff={onlyDiff}
                onRemove={(id) => store?.toggleCompare(id)}
              />
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

/* ───────────────── مقایسهٔ کلی ───────────────── */

function BestBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-300">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 13l4 4L19 7" />
      </svg>
      بهترین
    </span>
  );
}

function Metric({ label, value, isBest }: { label: string; value: ReactNode; isBest: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-white/10 py-2.5 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="flex items-center gap-2 text-left">
        {isBest && <BestBadge />}
        <span className="font-bold text-slate-100">{value}</span>
      </span>
    </div>
  );
}

function OverviewGrid({
  items,
  scores,
  best,
  onRemove,
}: {
  items: ListedProperty[];
  scores: number[];
  best: { score: number; price: number; area: number; neighbor: number } | null;
  onRemove: (id: number) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-5">
        {items.map((p, i) => {
          const tone = scoreTone(p.neighborScore);
          const isTop = best !== null && scores[i] === best.score;
          return (
            <article
              key={p.id}
              className={`relative flex min-w-0 flex-1 basis-[258px] flex-col overflow-hidden rounded-3xl border bg-[#0d1424]/70 backdrop-blur-md transition-colors ${
                isTop ? "border-emerald-400/40" : "border-white/10"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14] to-transparent" />
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label={`حذف ${p.title} از مقایسه`}
                  title="حذف از مقایسه"
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#070b14]/85 text-slate-300 transition-colors hover:border-rose-400/50 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                {isTop && (
                  <span className="absolute bottom-3 right-3 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                    بالاترین امتیاز کل
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-sm font-black text-white">
                  <Link href={`/property/${p.id}`} className="transition-colors hover:text-[#f0d080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">
                  {p.city} · {p.neighborhood}
                </p>

                {/* امتیاز کل */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#070b14]/70 p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500">امتیاز کل مقایسه</span>
                    <span className="text-2xl font-black text-[#f0d080]">
                      {faDigits(scores[i])}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#c9a84c] to-[#f0d080]"
                      style={{ width: `${scores[i]}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Metric
                    label="قیمت"
                    value={<span className="text-[#f0d080]">{toman(p.price)}</span>}
                    isBest={best !== null && p.price === best.price}
                  />
                  <Metric
                    label="متراژ"
                    value={`${faDigits(p.area)} متر`}
                    isBest={best !== null && p.area === best.area}
                  />
                  <Metric
                    label="امتیاز همسایگی"
                    value={<span style={{ color: tone.color }}>{faDigits(p.neighborScore)}</span>}
                    isBest={best !== null && p.neighborScore === best.neighbor}
                  />
                  <Metric label="قیمت هر متر" value={perMeter(p.price, p.area)} isBest={false} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 rounded-2xl border border-white/10 bg-[#0d1424]/50 px-4 py-3 text-[11px] leading-6 text-slate-500">
        «امتیاز کل مقایسه» فقط میان همین ملک‌های انتخاب‌شده محاسبه می‌شود — ترکیبی از امتیاز
        همسایگی، قیمت هر متر، متراژ، امکانات و سال ساخت. با تغییر فهرست، امتیازها هم عوض می‌شوند.
      </p>
    </>
  );
}

/* ───────────────── مقایسهٔ جزئی ───────────────── */

function DetailsTable({
  items,
  rows,
  hiddenCount,
  onlyDiff,
  onRemove,
}: {
  items: ListedProperty[];
  rows: Row[];
  hiddenCount: number;
  onlyDiff: boolean;
  onRemove: (id: number) => void;
}) {
  const stickyCell =
    "sticky start-0 z-10 bg-[#0d1424] px-4 py-3 text-right align-middle font-bold text-slate-400";

  return (
    <>
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0d1424]/70 backdrop-blur-md">
        <table className="w-full min-w-[680px] border-collapse text-right text-sm">
          <caption className="sr-only">جدول مقایسهٔ ویژگی‌های ملک‌های انتخاب‌شده</caption>
          <thead>
            <tr>
              <th scope="col" className={`${stickyCell} z-20 w-40 min-w-[9rem] border-b border-white/10 text-xs`}>
                ویژگی
              </th>
              {items.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="min-w-[11rem] border-b border-white/10 bg-[#0d1424]/40 px-4 py-3 text-right align-top"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/property/${p.id}`}
                        className="line-clamp-2 text-xs font-black text-white transition-colors hover:text-[#f0d080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                      >
                        {p.title}
                      </Link>
                      <span className="mt-1 block text-[10px] font-medium text-slate-500">
                        {p.neighborhood}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      aria-label={`حذف ستون ${p.title}`}
                      title="حذف از مقایسه"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-400 transition-colors hover:border-rose-400/50 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.key} className={idx % 2 === 1 ? "bg-white/[0.02]" : undefined}>
                <th scope="row" className={`${stickyCell} border-t border-white/10 text-xs`}>
                  {r.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="border-t border-white/10 px-4 py-3 text-xs text-slate-200">
                    {r.cell ? r.cell(p) : r.text(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onlyDiff && (
        <p className="mt-4 text-[11px] text-slate-500">
          {rows.length === 0
            ? "این ملک‌ها در همهٔ ویژگی‌های جدول یکسان‌اند — کلید «فقط تفاوت‌ها» را خاموش کنید تا جدول کامل را ببینید."
            : `${faDigits(hiddenCount)} ردیف که مقدارشان بین همهٔ ملک‌ها یکسان بود پنهان شد.`}
        </p>
      )}
    </>
  );
}

/* ───────────────── حالت خالی ───────────────── */

function EmptyCompare({
  count,
  current,
  onAdd,
  onRemove,
}: {
  count: number;
  current: ListedProperty[];
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const currentIds = new Set(current.map((p) => p.id));
  const suggestions = ALL.filter((p) => p.featured && !currentIds.has(p.id)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="drop-in rounded-3xl border border-dashed border-white/15 bg-[#0d1424]/50 px-6 py-12 text-center backdrop-blur-md">
        <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#c9a84c]/30 bg-[#070b14]">
          <svg
            className="h-9 w-9 text-[#c9a84c]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 5h6v14H4zM14 5h6v14h-6z" />
            <path d="M12 3v18" strokeDasharray="2 3" />
          </svg>
        </span>

        <h2 className="text-xl font-black text-white sm:text-2xl">
          {count === 0 ? "هنوز ملکی برای مقایسه انتخاب نکرده‌اید" : "یک ملک دیگر هم انتخاب کنید"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
          {count === 0
            ? `روی دکمهٔ «مقایسه» در هر آگهی بزنید تا اینجا اضافه شود. تا ${faDigits(COMPARE_LIMIT)} ملک را می‌توانید هم‌زمان کنار هم بگذارید.`
            : "مقایسه از دو ملک به بالا معنا پیدا می‌کند. یکی دیگر را از پیشنهادهای زیر یا از فهرست نشان‌شده‌ها اضافه کنید."}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#search"
            className="btn-gold rounded-xl px-6 py-3 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
          >
            رفتن به جستجو
          </Link>
          <Link
            href="/saved"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
          >
            نشان‌شده‌های من
          </Link>
        </div>
      </div>

      {count === 1 && (
        <section aria-label="انتخاب فعلی">
          <h3 className="mb-3 text-sm font-black text-slate-300">انتخاب فعلی شما</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {current.map((p) => (
              <PropertyMiniCard
                key={p.id}
                property={p}
                compared
                onToggleCompare={onRemove}
              />
            ))}
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section aria-label="پیشنهاد برای مقایسه">
          <h3 className="mb-3 text-sm font-black text-slate-300">
            پیشنهاد برای شروع مقایسه
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <PropertyMiniCard key={p.id} property={p} onToggleCompare={onAdd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
