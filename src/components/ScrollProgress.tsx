"use client";

import { useEffect, useRef, useState } from "react";

/**
 * نوار پیشرفت بالای صفحه + نشانگر بخش‌ها.
 *
 * نشانگر کناری عمداً «نقطه‌های باریک» است و برچسب فقط روی هاور باز می‌شود،
 * چون نسخهٔ قبلی روی تصاویر می‌افتاد و متن‌ها را قاطی می‌کرد.
 * ضمناً وقتی کاربر در حال اسکرول نیست، خودش کم‌رنگ می‌شود.
 */

const SECTIONS = [
  { id: "hero", label: "خانه" },
  { id: "why", label: "چرا مُلک‌آی" },
  { id: "neighbor-score", label: "امتیاز همسایگی" },
  { id: "smart", label: "شارژ هوشمند" },
  { id: "digital-twin", label: "دوقلوی دیجیتال" },
  { id: "management", label: "پنل مدیریت" },
  { id: "properties", label: "املاک" },
  { id: "comparison", label: "مقایسه" },
  { id: "voices", label: "نظرات" },
  { id: "advisors", label: "مشاوران" },
];

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [present, setPresent] = useState<typeof SECTIONS>([]);
  const [idle, setIdle] = useState(true);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    setPresent(SECTIONS.filter((s) => document.getElementById(s.id)));
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      setIdle(false);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIdle(true), 1100);

      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setPct(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);

        const probe = doc.clientHeight * 0.4;
        let current: string | null = null;
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= probe && r.bottom > probe) {
            current = s.id;
            break;
          }
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  const started = pct > 3;

  return (
    <>
      {/* نوار پیشرفت بالا */}
      <div
        className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
        role="progressbar"
        aria-label="پیشرفت مطالعهٔ صفحه"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full origin-right bg-gradient-to-l from-[#c9a84c] via-[#f0d080] to-emerald-400"
          style={{ width: `${pct}%`, transition: "width 90ms linear" }}
        />
      </div>

      {/* نشانگر بخش‌ها — فقط صفحه‌های خیلی پهن، تا روی محتوا نیفتد */}
      {present.length > 2 && (
        <nav
          aria-label="پیمایش بخش‌های صفحه"
          className={`group/rail fixed left-2 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-start gap-2 rounded-full border border-white/5 bg-[#070b14]/50 px-1.5 py-3 backdrop-blur-sm transition-all duration-500 2xl:flex ${
            started ? "opacity-100" : "pointer-events-none opacity-0"
          } ${idle ? "opacity-35 hover:opacity-100" : "opacity-90"}`}
        >
          {present.map((s) => {
            const on = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                aria-label={s.label}
                title={s.label}
                className="group/dot relative flex items-center py-0.5"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    on ? "h-5 w-[3px] bg-[#f0d080]" : "h-[3px] w-[3px] bg-white/40 group-hover/dot:bg-white/80"
                  }`}
                />
                {/* برچسب فقط روی هاورِ همان نقطه باز می‌شود */}
                <span className="pointer-events-none absolute left-full ms-2 hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#0d1424] px-2 py-1 text-[10px] text-white/85 shadow-lg group-hover/dot:block">
                  {s.label}
                </span>
              </a>
            );
          })}
        </nav>
      )}
    </>
  );
}
