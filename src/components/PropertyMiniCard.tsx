"use client";

import Link from "next/link";
import {
  faDigits,
  toman,
  perMeter,
  LISTING_LABEL,
  TYPE_LABEL,
  scoreTone,
} from "@/lib/format";

/** شکل ساده‌شدهٔ آگهی — چون آرایهٔ داده `as const` است و اینجا به نوع نرم نیاز داریم */
export type ListedProperty = {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  parking: boolean;
  elevator: boolean;
  storage: boolean;
  balcony: boolean;
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  imageUrl: string;
  neighborScore: number;
  hasCelebNeighbor: boolean;
  celebName: string | null;
  celebProfession: string | null;
  yearBuilt: number;
  featured: boolean;
  viewCount: number;
  agentName: string;
  agentPhone: string;
};

type Props = {
  property: ListedProperty;
  /** وضعیت نشان‌شدن؛ اگر onToggleSaved بدهید دکمه‌اش ظاهر می‌شود */
  saved?: boolean;
  onToggleSaved?: (id: number) => void;
  /** وضعیت حضور در لیست مقایسه؛ اگر onToggleCompare بدهید دکمه‌اش ظاهر می‌شود */
  compared?: boolean;
  onToggleCompare?: (id: number) => void;
  /** دکمهٔ حذف مستقیم (مثلاً حذف از نشان‌شده‌ها) */
  onRemove?: (id: number) => void;
  removeLabel?: string;
  compareDisabled?: boolean;
  className?: string;
};

const CHIP =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] disabled:cursor-not-allowed disabled:opacity-45";

const ICON = "h-4 w-4 shrink-0";

export default function PropertyMiniCard({
  property: p,
  saved = false,
  onToggleSaved,
  compared = false,
  onToggleCompare,
  onRemove,
  removeLabel = "حذف",
  compareDisabled = false,
  className = "",
}: Props) {
  const tone = scoreTone(p.neighborScore);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d1424]/70 backdrop-blur-md transition-colors duration-300 hover:border-[#c9a84c]/40 ${className}`}
    >
      <Link
        href={`/property/${p.id}`}
        aria-label={`مشاهدهٔ جزئیات ${p.title}`}
        className="relative block aspect-[4/3] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9a84c]"
      >
        <img
          src={p.imageUrl}
          alt={p.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/25 to-transparent"
        />

        <span className="absolute right-3 top-3 rounded-lg border border-white/15 bg-[#070b14]/80 px-2.5 py-1 text-[11px] font-bold text-slate-200">
          {LISTING_LABEL[p.listingType] ?? "فروش"}
        </span>

        <span
          className="absolute left-3 top-3 rounded-lg border px-2.5 py-1 text-[11px] font-black"
          style={{
            color: tone.color,
            borderColor: `${tone.color}66`,
            background: "rgba(7,11,20,0.8)",
          }}
        >
          {faDigits(p.neighborScore)}
          <span className="mr-1 font-medium opacity-80">همسایگی</span>
        </span>

        <span className="absolute bottom-3 right-3 text-base font-black text-[#f0d080] drop-shadow">
          {toman(p.price)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-[15px] font-black text-white">
            <Link
              href={`/property/${p.id}`}
              className="transition-colors hover:text-[#f0d080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
            >
              {p.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {p.city} · {p.neighborhood} · {TYPE_LABEL[p.propertyType] ?? "ملک"}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-xl border border-white/10 bg-[#070b14]/60 px-2.5 py-2">
            <dt className="text-slate-500">متراژ</dt>
            <dd className="mt-0.5 font-bold text-slate-200">{faDigits(p.area)} متر</dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#070b14]/60 px-2.5 py-2">
            <dt className="text-slate-500">هر متر</dt>
            <dd className="mt-0.5 font-bold text-slate-200">{perMeter(p.price, p.area)}</dd>
          </div>
        </dl>

        {(onToggleSaved || onToggleCompare || onRemove) && (
          <div className="mt-auto flex items-stretch gap-2 pt-1">
            {onToggleSaved && (
              <button
                type="button"
                onClick={() => onToggleSaved(p.id)}
                aria-pressed={saved}
                aria-label={saved ? `حذف ${p.title} از نشان‌شده‌ها` : `نشان‌کردن ${p.title}`}
                className={`${CHIP} ${
                  saved
                    ? "border-rose-400/50 bg-rose-500/10 text-rose-300"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25"
                }`}
              >
                <svg className={ICON} viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9} aria-hidden>
                  <path d="M20.8 8.6a5 5 0 0 0-8.8-2.6A5 5 0 0 0 3.2 8.6c0 4.3 8.8 10 8.8 10s8.8-5.7 8.8-10z" strokeLinejoin="round" />
                </svg>
                {saved ? "نشان‌شده" : "نشان‌کردن"}
              </button>
            )}

            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(p.id)}
                aria-pressed={compared}
                disabled={compareDisabled && !compared}
                aria-label={compared ? `حذف ${p.title} از مقایسه` : `افزودن ${p.title} به مقایسه`}
                className={`${CHIP} ${
                  compared
                    ? "border-[#c9a84c]/60 bg-[#c9a84c]/15 text-[#f0d080]"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25"
                }`}
              >
                <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
                  <path d="M4 5h6v14H4zM14 5h6v14h-6z" strokeLinejoin="round" />
                </svg>
                {compared ? "در مقایسه" : "مقایسه"}
              </button>
            )}

            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`${removeLabel} — ${p.title}`}
                title={removeLabel}
                className="inline-flex w-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-300 transition-colors hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
              >
                <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
                  <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/** اسکلتون هم‌اندازهٔ کارت — تا وقتی localStorage خوانده نشده */
export function PropertyMiniCardSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1424]/70 backdrop-blur-md"
    >
      <div className="aspect-[4/3] w-full bg-white/[0.05] motion-safe:animate-pulse" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-white/[0.07] motion-safe:animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-white/[0.05] motion-safe:animate-pulse" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-11 rounded-xl bg-white/[0.05] motion-safe:animate-pulse" />
          <div className="h-11 rounded-xl bg-white/[0.05] motion-safe:animate-pulse" />
        </div>
        <div className="h-9 rounded-xl bg-white/[0.05] motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
