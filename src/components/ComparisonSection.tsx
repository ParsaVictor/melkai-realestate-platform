"use client";

import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>(threshold = 0.15) {
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

const COMPARISON = [
  { feature: "آگهی ملک با فیلتر پیشرفته", us: true, others: true, legacy: true },
  { feature: "امتیاز همسایگی مبتنی بر دادهٔ واقعی", us: true, others: false, legacy: false },
  { feature: "پنل اختصاصی مدیریت ساختمان", us: true, others: false, legacy: false },
  { feature: "اجرای تدریجی و انسانی شارژ با IoT", us: true, others: false, legacy: false },
  { feature: "شاخص پرستیژ با احراز و رضایت", us: true, others: false, legacy: false },
  { feature: "ارزش‌گذاری هوشمند با اثر همسایگی", us: true, others: false, legacy: false },
  { feature: "دوقلوی دیجیتال سه‌بعدی ساختمان", us: true, others: false, legacy: false },
  { feature: "گزارش کارشناس و بازدید تأییدشده", us: true, others: false, legacy: true },
];

export default function ComparisonSection() {
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  return (
    <section id="comparison" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
      <div
        ref={head.ref}
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ${head.seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          مقایسه
        </span>
        <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
          چرا این پلتفرم <span className="gold-text-gradient">یک نسل جلوتر</span> است
        </h2>
        <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
          سایت‌های آگهی تا لحظهٔ معامله کنار شما هستند و بعد رها می‌کنند. ما از جستجو تا شارژ ماهانه
          و مجمع سالانه همراه شماییم — و همان داده را به قیمت ملک برمی‌گردانیم.
        </p>
      </div>

      <div
        ref={body.ref}
        className={`mt-12 overflow-x-auto rounded-3xl border border-white/10 bg-[#0d1424]/70 backdrop-blur-md transition-all duration-700 ${body.seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <table className="w-full min-w-[640px] text-right text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="p-5 font-bold">قابلیت</th>
              <th className="p-5 font-black text-emerald-300">مُلک‌آی</th>
              <th className="p-5 font-bold">سایت‌های آگهی عمومی</th>
              <th className="p-5 font-bold">سامانه‌های املاک سنتی</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.feature} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                <td className="p-5 text-white/75">{row.feature}</td>
                <td className="p-5 text-lg text-emerald-400">{row.us ? "✔" : "—"}</td>
                <td className="p-5 text-lg text-white/30">{row.others ? "✔" : "—"}</td>
                <td className="p-5 text-lg text-white/30">{row.legacy ? "✔" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
