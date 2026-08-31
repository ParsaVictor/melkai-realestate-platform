"use client";

import { useEffect, useRef, useState } from "react";

const faNum = (v: number | string) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

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

const REVIEWS = [
  {
    name: "سارا م.",
    role: "ساکن — برج نیاوران",
    tenure: "۳ سال سکونت",
    score: 5,
    text: "قبلاً سر شارژ هر ماه دعوا بود. حالا همه صورت‌حساب را می‌بینند و کسی نمی‌تواند بگوید «به من نگفتند». نظم ساختمان کاملاً عوض شد.",
    verified: "مالکیت احراز شده",
  },
  {
    name: "امیر ت.",
    role: "خریدار — سعادت‌آباد",
    tenure: "خرید در ۱۴۰۴",
    score: 5,
    text: "دو واحد مشابه با قیمت نزدیک داشتم. امتیاز همسایگی یکی ۹۴ بود و آن یکی ۶۱. همان عدد تصمیمم را عوض کرد و الان خوشحالم.",
    verified: "معاملهٔ ثبت‌شده",
  },
  {
    name: "فاطمه ا.",
    role: "مدیر ساختمان — زعفرانیه",
    tenure: "۱۸ ماه مدیریت",
    score: 4,
    text: "سخت‌ترین بخش مدیریت، پیگیری بدهکارهاست. سیستم خودش یادآوری می‌فرستد و من دیگر مجبور نیستم نقش آدم بده را بازی کنم.",
    verified: "سمت تأییدشده",
  },
  {
    name: "بهرام ک.",
    role: "مالک — الهیه",
    tenure: "۲ واحد اجاره‌ای",
    score: 5,
    text: "از راه دور می‌بینم صندوق ساختمان چقدر دارد، آسانسور کی سرویس شده و مستأجرم شارژ داده یا نه. دیگر لازم نیست به کسی زنگ بزنم.",
    verified: "سند احراز شده",
  },
];

export default function ResidentVoices() {
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  return (
    <section
      id="voices"
      className="relative overflow-hidden border-y border-white/10 bg-white/[0.015] py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,168,76,.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={head.ref}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${head.seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            صدای ساکنین
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            نظرات <span className="gold-text-gradient">احرازشده</span>، نه نظرات ناشناس
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
            فقط کسی می‌تواند دربارهٔ یک ساختمان نظر بدهد که سکونت یا مالکیتش در همان ساختمان تأیید
            شده باشد. برای همین این نظرها روی امتیاز اثر می‌گذارند — و قابل خریدن نیستند.
          </p>
        </div>

        <div ref={body.ref} className="mt-12 grid gap-4 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <figure
              key={r.name}
              className={`rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 backdrop-blur-md transition-all duration-700 hover:-translate-y-1 hover:border-[#c9a84c]/40 ${
                body.seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0d080] to-[#c9a84c] text-base font-black text-[#0a0e1a]">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <figcaption className="text-sm font-black text-white">{r.name}</figcaption>
                    <p className="text-[11px] text-white/50">{r.role} · {r.tenure}</p>
                  </div>
                </div>
                <span className="text-sm text-[#f0d080]" aria-label={`${faNum(r.score)} از ۵`}>
                  {"★".repeat(r.score)}
                  <span className="text-white/20">{"★".repeat(5 - r.score)}</span>
                </span>
              </div>

              <blockquote className="mt-4 text-[13px] leading-8 text-white/75">«{r.text}»</blockquote>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold text-emerald-300">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {r.verified}
              </div>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-white/40">
          نظرات بدون احراز هویت منتشر می‌شوند ولی روی امتیاز همسایگی هیچ اثری ندارند.
        </p>
      </div>
    </section>
  );
}
