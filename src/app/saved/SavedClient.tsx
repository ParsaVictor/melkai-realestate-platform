"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import PropertyMiniCard, {
  PropertyMiniCardSkeleton,
  type ListedProperty,
} from "@/components/PropertyMiniCard";
import { properties } from "@/data/properties";
import { faDigits } from "@/lib/format";
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

export default function SavedClient() {
  const hasStore = useHasStore();
  return hasStore ? (
    <SavedView />
  ) : (
    <StoreProvider>
      <SavedView />
    </StoreProvider>
  );
}

function SavedView() {
  const { ready, saved, compare, toggleSaved, toggleCompare } = useStore();

  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // پیام و حالت تأیید هر دو خودبه‌خود بسته می‌شوند تا روی صفحه جا خوش نکنند
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    if (!confirmClear) return;
    const t = window.setTimeout(() => setConfirmClear(false), 6000);
    return () => window.clearTimeout(t);
  }, [confirmClear]);

  const items = useMemo(
    () => saved.map((id) => BY_ID.get(id)).filter((p): p is ListedProperty => Boolean(p)),
    [saved],
  );

  const room = Math.max(0, COMPARE_LIMIT - compare.length);
  const pending = items.filter((p) => !compare.includes(p.id));
  const canBulkCompare = pending.length > 0 && room > 0;

  function addAllToCompare() {
    if (!canBulkCompare) return;
    const picked = pending.slice(0, room);
    picked.forEach((p) => toggleCompare(p.id));
    setNotice(
      picked.length < pending.length
        ? `${faDigits(picked.length)} ملک اضافه شد؛ سقف مقایسه ${faDigits(COMPARE_LIMIT)} ملک است.`
        : `${faDigits(picked.length)} ملک به مقایسه اضافه شد.`,
    );
  }

  function clearAll() {
    saved.forEach((id) => toggleSaved(id));
    setConfirmClear(false);
    setNotice("فهرست نشان‌شده‌ها پاک شد.");
  }

  return (
    <PageShell
      title="نشان‌شده‌های شما"
      crumb="نشان‌شده‌ها"
      lead="هر ملکی که نشان می‌کنید همین‌جا می‌ماند — حتی بعد از بستن مرورگر. از اینجا می‌توانید چند مورد را کنار هم بگذارید و تفاوت‌هایشان را ببینید."
    >
      {/* ── نوار ابزار ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[#0d1424]/70 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-300">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.8 8.6a5 5 0 0 0-8.8-2.6A5 5 0 0 0 3.2 8.6c0 4.3 8.8 10 8.8 10s8.8-5.7 8.8-10z" />
            </svg>
          </span>
          <span className="font-bold text-white">
            {ready ? `${faDigits(items.length)} ملک نشان‌شده` : "در حال بارگذاری…"}
          </span>
          {ready && compare.length > 0 && (
            <span className="rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-2.5 py-1 text-[11px] font-bold text-[#f0d080]">
              {faDigits(compare.length)} در مقایسه
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addAllToCompare}
            disabled={!ready || !canBulkCompare}
            className="rounded-xl border border-[#c9a84c]/50 bg-[#c9a84c]/10 px-3.5 py-2 text-xs font-bold text-[#f0d080] transition-colors hover:bg-[#c9a84c]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            همه را به مقایسه اضافه کن
          </button>

          <Link
            href="/compare"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
          >
            رفتن به مقایسه
          </Link>

          {confirmClear ? (
            <span className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-2 py-1.5">
              <span className="px-1 text-[11px] font-bold text-rose-200">مطمئنید؟</span>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg bg-rose-500/80 px-2.5 py-1.5 text-[11px] font-black text-white transition-colors hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
              >
                بله، پاک کن
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                انصراف
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={!ready || items.length === 0}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-slate-400 transition-colors hover:border-rose-400/40 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              پاک‌کردن همه
            </button>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {notice && (
          <div className="mb-5 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-3 text-xs font-bold text-[#f0d080]">
            {notice}
          </div>
        )}
      </div>

      {/* ── محتوا ── */}
      {!ready ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <PropertyMiniCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptySaved />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <PropertyMiniCard
              key={p.id}
              property={p}
              compared={compare.includes(p.id)}
              compareDisabled={room === 0}
              onToggleCompare={(id) => {
                const r = toggleCompare(id);
                if (!r.ok && r.reason) setNotice(r.reason);
              }}
              onRemove={toggleSaved}
              removeLabel="حذف از نشان‌شده‌ها"
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

/** قالب مشترک صفحه: نوار بالا، عنوان و فوتر */
function PageShell({
  title,
  crumb,
  lead,
  children,
}: {
  title: string;
  crumb: string;
  lead: string;
  children: ReactNode;
}) {
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
              <span className="text-slate-400">{crumb}</span>
            </nav>

            <h1 className="text-3xl font-black sm:text-4xl">
              <span className="gold-text-gradient">{title}</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{lead}</p>
          </header>

          {children}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

function EmptySaved() {
  return (
    <div className="drop-in rounded-3xl border border-dashed border-white/15 bg-[#0d1424]/50 px-6 py-14 text-center backdrop-blur-md">
      <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#c9a84c]/30 bg-[#070b14]">
        <svg
          className="h-9 w-9 text-[#c9a84c]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20.8 8.6a5 5 0 0 0-8.8-2.6A5 5 0 0 0 3.2 8.6c0 4.3 8.8 10 8.8 10s8.8-5.7 8.8-10z" />
        </svg>
      </span>

      <h2 className="text-xl font-black text-white sm:text-2xl">هنوز ملکی را نشان نکرده‌اید</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
        روی نشان قلب هر آگهی بزنید تا همین‌جا ذخیره شود. بعد می‌توانید تا{" "}
        {faDigits(COMPARE_LIMIT)} مورد را کنار هم بگذارید و قیمت، متراژ و امتیاز همسایگی‌شان را
        مقایسه کنید.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/#search"
          className="btn-gold rounded-xl px-6 py-3 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
        >
          رفتن به جستجو
        </Link>
        <Link
          href="/#properties"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
        >
          دیدن املاک ویژه
        </Link>
      </div>
    </div>
  );
}
