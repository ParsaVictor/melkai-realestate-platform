"use client";

import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

const PHASES = [
  {
    phase: "فاز ۱ — پایه",
    days: "۲۰ روز",
    tone: "border-emerald-400/40 bg-emerald-400/[0.07]",
    dot: "bg-emerald-400",
    items: ["سایت آگهی و جستجوی هوشمند", "پروفایل ساختمان و محله", "امتیاز همسایگی نسخهٔ ۱", "پنل مدیریت ساختمان پایه"],
  },
  {
    phase: "فاز ۲ — هوشمندسازی",
    days: "۴۵ روز",
    tone: "border-[#c9a84c]/40 bg-[#c9a84c]/[0.07]",
    dot: "bg-[#f0d080]",
    items: ["ارزش‌گذاری AVM", "درگاه پرداخت شارژ", "اعلان پیامکی و اپ ساکن", "نظرسنجی و صورت‌جلسه"],
  },
  {
    phase: "فاز ۳ — IoT",
    days: "۹۰ روز",
    tone: "border-sky-400/40 bg-sky-400/[0.07]",
    dot: "bg-sky-400",
    items: ["کنترلر فشار آب و موتورخانه", "کنتور هوشمند و تسهیم هزینه", "پلاک‌خوان پارکینگ", "داشبورد انرژی"],
  },
  {
    phase: "فاز ۴ — اکوسیستم",
    days: "۱۸۰ روز",
    tone: "border-violet-400/40 bg-violet-400/[0.07]",
    dot: "bg-violet-400",
    items: ["بازار خدمات ساختمان", "بیمه و وام ساختمانی", "API سازمانی برای انبوه‌سازان", "اپلیکیشن iOS و اندروید"],
  },
];

export default function RoadmapSection() {
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
      <div
        ref={head.ref}
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ${head.seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          نقشه راه اجرا
        </span>
        <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
          از دموی امروز تا <span className="gold-text-gradient">اکوسیستم کامل</span>
        </h2>
        <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
          هر فاز به‌تنهایی قابل تحویل و قابل استفاده است؛ لازم نیست تا آخر صبر کنید تا ارزش ببینید.
        </p>
      </div>

      <div ref={body.ref} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((p, i) => (
          <div
            key={p.phase}
            className={`rounded-3xl border p-6 backdrop-blur-md transition-all duration-700 hover:-translate-y-1 ${p.tone} ${
              body.seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-black text-white">
                <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                {p.phase}
              </span>
              <span className="rounded-full border border-white/15 bg-[#070b14]/60 px-2.5 py-0.5 text-[10px] font-bold text-white/70">
                {p.days}
              </span>
            </div>

            <ul className="mt-4 space-y-2.5">
              {p.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-[11px] leading-6 text-white/70">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
