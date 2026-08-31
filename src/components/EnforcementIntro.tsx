"use client";

import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

/** سرتیتر موتور شمارهٔ ۲ — درست بالای شبیه‌ساز موجودِ سایت */
export function EnforcementIntro() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`mx-auto max-w-3xl px-4 text-center transition-all duration-700 ${
        seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        موتور شمارهٔ ۲ — ایدهٔ اختصاصی
      </span>
      <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
        شارژ ندادن، دیگر <span className="text-emerald-300">بی‌هزینه</span> نیست — اما هرگز
        غیرانسانی هم نمی‌شود
      </h2>
      <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
        به‌جای دعوا و آبروریزی، سیستم به‌صورت خودکار و پلکانی کیفیت سرویس‌های اشتراکی واحد بدهکار
        را کاهش می‌دهد؛ با اطلاع‌رسانی قبلی، مصوبه مجمع، سقف قانونی و بازگشت آنی پس از پرداخت.
      </p>
    </div>
  );
}

const GUARANTEES = [
  {
    title: "شفافیت کامل",
    body: "هر تغییر سرویس در دفتر رویداد ثبت و برای ساکن و هیئت‌مدیره قابل مشاهده و قابل اعتراض است.",
  },
  {
    title: "استثناهای انسانی",
    body: "سالمند، نوزاد، بیمار یا پروندهٔ مشکل مالی ← توقف خودکار سیاست و پیشنهاد پرداخت قسطی.",
  },
  {
    title: "هیچ‌وقت قطع کامل",
    body: "حداقل خدمت پایه (۵۵٪ فشار آب) همیشه برقرار است؛ سلامت و کرامت ساکن خط قرمز است.",
  },
];

/** سه تضمین — درست زیر شبیه‌ساز */
export function EnforcementGuarantees() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
      {GUARANTEES.map((g, i) => (
        <div
          key={g.title}
          className={`h-full rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 backdrop-blur-md transition-all duration-700 hover:-translate-y-1 hover:border-emerald-400/40 ${
            seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: `${i * 110}ms` }}
        >
          <p className="text-sm font-black text-emerald-300">{g.title}</p>
          <p className="mt-3 text-[11px] leading-7 text-white/60">{g.body}</p>
        </div>
      ))}
    </div>
  );
}
