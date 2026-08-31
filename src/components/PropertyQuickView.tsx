"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { properties } from "@/data/properties";
import { faDigits, toman, perMeter, LISTING_LABEL, TYPE_LABEL, scoreTone } from "@/lib/format";
import { useStore } from "@/lib/store";

type P = (typeof properties)[number];
const ALL = properties as unknown as P[];

/**
 * پیش‌نمایش سریع ملک.
 * چرا مودال و نه رفتن مستقیم به صفحه: کاربر در جریان مرور است؛ بردنش به صفحهٔ دیگر
 * جریان را می‌شکند. اینجا نگاه سریع می‌کند و اگر جدی بود، «جزئیات کامل» را می‌زند.
 */
export default function PropertyQuickView({
  id,
  onClose,
}: {
  id: number | null;
  onClose: () => void;
}) {
  const { isSaved, toggleSaved, inCompare, toggleCompare, ready } = useStore();
  const [shot, setShot] = useState(0);
  const [msg, setMsg] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const p = id != null ? ALL.find((x) => x.id === id) ?? null : null;

  // گالری: تصویر خود ملک + سه تصویر دیگر به‌عنوان نمای داخلی
  const shots = p
    ? [p.imageUrl, ...ALL.filter((x) => x.id !== p.id).slice(0, 3).map((x) => x.imageUrl)]
    : [];

  useEffect(() => {
    setShot(0);
  }, [id]);

  // قفل اسکرول پس‌زمینه + بستن با Esc + پیمایش گالری با جهت‌ها
  useEffect(() => {
    if (!p) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setShot((s) => (s + 1) % shots.length);
      if (e.key === "ArrowRight") setShot((s) => (s - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [p, onClose, shots.length]);

  const compare = useCallback(() => {
    if (!p) return;
    const r = toggleCompare(p.id);
    if (!r.ok && r.reason) {
      setMsg(r.reason);
      setTimeout(() => setMsg(""), 2600);
    }
  }, [p, toggleCompare]);

  if (!p || !mounted) return null;

  const tone = scoreTone(p.neighborScore);
  const saved = ready && isSaved(p.id);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`پیش‌نمایش ${p.title}`}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/12 bg-[#0d1424] shadow-[0_40px_120px_-30px_rgba(0,0,0,.95)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* تصویر */}
        <div className="relative">
          <img
            src={shots[shot]}
            alt={p.title}
            className="h-56 w-full object-cover sm:h-72"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-transparent" />

          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="بستن پیش‌نمایش"
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0a0e1a]/85 text-white/80 backdrop-blur-md transition-colors hover:text-white"
          >
            ✕
          </button>

          <span className="absolute right-3 top-3 rounded-lg border border-white/20 bg-[#0a0e1a]/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            {LISTING_LABEL[p.listingType]}
          </span>

          {/* بندانگشتی‌ها */}
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {shots.map((s, i) => (
              <button
                key={s + i}
                onClick={() => setShot(i)}
                aria-label={`تصویر ${faDigits(i + 1)}`}
                aria-current={i === shot}
                className={`h-1.5 rounded-full transition-all ${i === shot ? "w-6 bg-[#f0d080]" : "w-1.5 bg-white/45 hover:bg-white/75"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white sm:text-xl">{p.title}</h3>
              <p className="mt-1 text-xs text-white/55">📍 {p.address}</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-[#f0d080]">{toman(p.price)}</p>
              <p className="mt-0.5 text-[11px] text-white/45">هر متر {perMeter(p.price, p.area)}</p>
            </div>
          </div>

          {/* مشخصات کوتاه */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { i: "📐", v: `${faDigits(p.area)} م²`, k: "متراژ" },
              { i: "🛏", v: faDigits(p.bedrooms), k: "خواب" },
              { i: "🏢", v: `${faDigits(p.floor)} از ${faDigits(p.totalFloors)}`, k: "طبقه" },
              { i: "📅", v: faDigits(p.yearBuilt), k: "سال ساخت" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl border border-white/10 bg-[#070b14]/70 p-2.5 text-center">
                <div className="text-sm">{x.i}</div>
                <div className="mt-0.5 text-xs font-black text-white">{x.v}</div>
                <div className="text-[10px] text-white/45">{x.k}</div>
              </div>
            ))}
          </div>

          {/* امتیاز همسایگی */}
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#070b14]/70 p-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <svg width="56" height="56" className="-rotate-90" aria-hidden>
                <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,.1)" strokeWidth="5" fill="none" />
                <circle
                  cx="28" cy="28" r="24" stroke={tone.color} strokeWidth="5" strokeLinecap="round" fill="none"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - p.neighborScore / 100)}
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{faDigits(p.neighborScore)}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                امتیاز همسایگی: <span style={{ color: tone.color }}>{tone.label}</span>
              </p>
              <p className="mt-1 text-[11px] leading-6 text-white/55">
                بر پایهٔ نظم پرداخت شارژ، نگهداری فنی و همزیستی ساکنین این ساختمان.
              </p>
            </div>
          </div>

          {p.hasCelebNeighbor && (
            <div className="celeb-badge mt-3 flex items-center gap-3 rounded-2xl p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">🌟</span>
              <div>
                <p className="text-sm font-bold text-white">ساکن شاخص تأییدشده</p>
                <p className="text-[11px] text-purple-200">با رضایت خود فرد · هویت و واحد محفوظ</p>
              </div>
            </div>
          )}

          {msg && (
            <p className="mt-3 rounded-xl bg-rose-500/15 px-3 py-2 text-center text-[11px] text-rose-200">{msg}</p>
          )}

          {/* اقدام‌ها */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/property/${p.id}`} className="btn-gold flex-1 rounded-xl px-5 py-3 text-center text-sm font-black">
              مشاهدهٔ جزئیات کامل
            </Link>
            <button
              onClick={() => toggleSaved(p.id)}
              aria-pressed={saved}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm transition-colors hover:border-rose-400/50"
            >
              {saved ? "❤️" : "🤍"}
            </button>
            <button
              onClick={compare}
              aria-pressed={ready && inCompare(p.id)}
              className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                ready && inCompare(p.id)
                  ? "border-[#c9a84c]/60 bg-[#c9a84c]/15 text-[#f0d080]"
                  : "border-white/15 bg-white/[0.05] text-white/70 hover:border-[#c9a84c]/50"
              }`}
            >
              ⇄ مقایسه
            </button>
            <a
              href={`tel:${p.agentPhone}`}
              className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
            >
              📞 {p.agentName}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
