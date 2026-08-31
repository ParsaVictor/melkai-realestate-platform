"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PHONE = "09223688369";
const PHONE_FA = "۰۹۲۲۳۶۸۸۳۶۹";

/**
 * دکمه‌های شناور: تماس، دستیار، بازگشت به بالا.
 *
 * سه مسئله‌ای که حل شده:
 * ۱) روی محتوا می‌افتادند → هنگام اسکرول کم‌رنگ می‌شوند و با هاور/لمس برمی‌گردند.
 * ۲) قابل جابه‌جایی نبودند → با درگ عمودی می‌شود کنارشان زد (با رفرش به جای اول برمی‌گردند).
 * ۳) «بازگشت به بالا» کار نمی‌کرد → scroll-snap با اسکرول نرم تداخل داشت؛
 *    حین حرکت موقتاً خاموش می‌شود.
 */
export default function FloatingActions() {
  const [showPhone, setShowPhone] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [dim, setDim] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const dimTimer = useRef<number | null>(null);
  const drag = useRef<{ startY: number; baseY: number; moved: boolean } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
      setDim(true);
      if (dimTimer.current) window.clearTimeout(dimTimer.current);
      dimTimer.current = window.setTimeout(() => setDim(false), 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (dimTimer.current) window.clearTimeout(dimTimer.current);
    };
  }, []);

  /** اسکرول نرم به بالا — snap موقتاً خاموش تا وسط راه گیر نکند */
  const toTop = useCallback(() => {
    const root = document.querySelector<HTMLElement>(".snap-root");
    const prev = root?.style.scrollSnapType ?? "";
    if (root) root.style.scrollSnapType = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      if (root) root.style.scrollSnapType = prev;
    }, 900);
  }, []);

  // درگ عمودی خوشهٔ دکمه‌ها
  const onDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, baseY: offsetY, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 4) d.moved = true;
    // محدود به بازهٔ منطقی تا از صفحه بیرون نزند
    setOffsetY(Math.max(-window.innerHeight * 0.6, Math.min(60, d.baseY + dy)));
  };
  const onUp = () => { drag.current = null; };

  const shell = `transition-opacity duration-500 ${dim ? "opacity-45" : "opacity-100"} hover:!opacity-100 focus-within:!opacity-100`;

  return (
    <>
      {/* ── تماس (چپ) ── */}
      <div
        className={`fixed left-4 z-50 flex items-center gap-3 md:left-6 ${shell}`}
        style={{ bottom: `calc(1.25rem + ${-offsetY}px)` }}
      >
        <button
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClick={() => { if (!drag.current?.moved) setShowPhone((v) => !v); }}
          aria-expanded={showPhone}
          aria-label="نمایش شمارهٔ تماس — با کشیدن می‌توانید جابه‌جا کنید"
          className="group relative flex h-14 w-14 shrink-0 cursor-grab touch-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_10px_30px_-6px_rgba(16,185,129,.75)] transition-transform duration-300 hover:scale-110 active:cursor-grabbing"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/55 motion-safe:animate-ping" style={{ animationDuration: "3s" }} />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/30 motion-safe:animate-ping" style={{ animationDuration: "3s", animationDelay: "1.5s" }} />
          <svg className="relative h-6 w-6 text-white motion-safe:animate-[wiggle_4s_ease-in-out_infinite]"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
               strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 5a2 2 0 012-2h2.6a1 1 0 01.95.68l1.2 3.3a1 1 0 01-.27 1.06l-1.6 1.5a14 14 0 006.1 6.1l1.5-1.6a1 1 0 011.06-.27l3.3 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z" />
          </svg>
        </button>

        <a
          href={`tel:${PHONE}`}
          className={`flex items-center gap-2 overflow-hidden rounded-full border border-emerald-400/40 bg-[#0d1424]/95 py-3 text-sm font-black text-emerald-300 shadow-[0_12px_34px_-12px_rgba(0,0,0,.9)] backdrop-blur-md transition-all duration-300 ${
            showPhone ? "max-w-[240px] px-5 opacity-100" : "pointer-events-none max-w-0 px-0 opacity-0"
          }`}
        >
          <span className="whitespace-nowrap tabular-nums" dir="ltr">{PHONE_FA}</span>
          <span className="whitespace-nowrap text-[11px] font-medium text-slate-400">تماس بگیرید</span>
        </a>
      </div>

      {/* ── دستیار + بازگشت به بالا (راست) ── */}
      <div
        className={`fixed right-4 z-50 flex flex-col items-center gap-3 md:right-6 ${shell}`}
        style={{ bottom: `calc(1.25rem + ${-offsetY}px)` }}
      >
        <button
          onClick={toTop}
          aria-label="بازگشت به ابتدای صفحه"
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0d1424]/95 text-white/70 shadow-lg backdrop-blur-md transition-all duration-400 hover:scale-110 hover:border-[#c9a84c]/60 hover:text-[#f0d080] ${
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        <div className="relative">
          {aiOpen && (
            <div className="absolute bottom-[4.5rem] right-0 w-[19rem] overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-[#0d1424]/97 shadow-[0_28px_80px_-22px_rgba(0,0,0,.95)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-l from-[#c9a84c]/15 to-transparent px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#f0d080] to-[#c9a84c] text-sm">✦</span>
                  <span className="text-sm font-black text-white">دستیار هوشمند مُلک‌آی</span>
                </div>
                <span className="rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">دمو</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="rounded-2xl rounded-tr-sm border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-xs leading-6 text-slate-200">
                  سلام 👋 بگو دنبال چه ملکی هستی، بقیه‌اش با من.
                </div>
                <div className="mr-8 rounded-2xl rounded-tl-sm bg-[#c9a84c]/15 px-3.5 py-2.5 text-xs leading-6 text-[#e8d9a8]">
                  «با ۸ میلیارد، نزدیک مترو، ساختمانی با شارژ منظم»
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#070b14] px-3 py-2.5">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]/70 motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                  <span className="text-[11px] text-slate-500">این قابلیت به‌زودی فعال می‌شود…</span>
                </div>
              </div>
            </div>
          )}

          <button
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onClick={() => { if (!drag.current?.moved) setAiOpen((v) => !v); }}
            aria-expanded={aiOpen}
            aria-label="دستیار هوشمند (نسخهٔ نمایشی) — با کشیدن می‌توانید جابه‌جا کنید"
            className="group relative flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full border border-[#c9a84c]/50 bg-gradient-to-br from-[#1b2740] to-[#0d1424] shadow-[0_10px_30px_-8px_rgba(201,168,76,.7)] transition-all duration-300 hover:scale-110 hover:border-[#c9a84c] active:cursor-grabbing"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full border border-[#c9a84c]/30 motion-safe:animate-ping" style={{ animationDuration: "3.5s" }} />
            <span className="relative bg-gradient-to-br from-[#f0d080] to-[#c9a84c] bg-clip-text text-2xl text-transparent">✦</span>
            <span className="absolute -top-1 -left-1 rounded-full bg-amber-400 px-1.5 py-px text-[9px] font-black text-[#0a0e1a]">دمو</span>
          </button>
        </div>
      </div>
    </>
  );
}
