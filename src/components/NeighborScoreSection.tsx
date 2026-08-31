"use client";

import { useEffect, useRef, useState } from "react";

const FACTORS = [
  { label: "نظم پرداخت شارژ", weight: 25, score: 96, color: "#10b981" },
  { label: "سلامت صندوق ذخیره", weight: 15, score: 88, color: "#34d399" },
  { label: "نگهداری فنی و آسانسور", weight: 20, score: 94, color: "#c9a84c" },
  { label: "کیفیت مدیریت", weight: 15, score: 91, color: "#f0d080" },
  { label: "همزیستی ساکنین", weight: 15, score: 90, color: "#38bdf8" },
  { label: "رفاه و امکانات", weight: 10, score: 97, color: "#a78bfa" },
];

const TOTAL = 93;

/** عکس‌های همسایگی — مثل صفحهٔ اول، آرام عوض می‌شوند */
const NB_SLIDES = [
  { src: "/images/sections/nb-1.webp", alt: "همسایگان در حال گفت‌وگو در فضای مشترک ساختمان" },
  { src: "/images/sections/nb-2.webp", alt: "جمع ساکنین در نشست ساختمان" },
  { src: "/images/sections/community-hallway.webp", alt: "راهروی مشترک مجتمع مسکونی" },
];

const faNum = (v: number | string) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

export default function NeighborScoreSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [score, setScore] = useState(0);
  const [nb, setNb] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600);
      setScore(Math.round(TOTAL * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setNb((n) => (n + 1) % NB_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const R = 72;
  const C = 2 * Math.PI * R;

  return (
    <section
      id="neighbor-score"
      className="relative overflow-hidden border-y border-white/10 bg-white/[0.015] py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,.10),transparent_60%)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mx-auto max-w-3xl text-center transition-all duration-700 ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            موتور شمارهٔ ۱
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            امتیاز همسایگی <span className="gold-text-gradient">Neighbor Score</span>
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
            ترکیبی از داده‌های واقعی پرداخت شارژ، نظرات احرازشدهٔ ساکنین، سابقهٔ اختلافات، کیفیت
            مدیریت و نرخ جابه‌جایی — نه نظرات ناشناس و قابل دستکاری.
          </p>
        </div>

        <div className={`mt-14 grid gap-6 transition-all duration-700 lg:grid-cols-[0.9fr_1.1fr] ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {/* گیج امتیاز */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20">
            {NB_SLIDES.map((im, i) => (
              <img
                key={im.src}
                src={im.src}
                alt={i === nb ? im.alt : ""}
                aria-hidden={i !== nb}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === nb ? 0.45 : 0,
                  transition: "opacity 1400ms cubic-bezier(.4,0,.2,1)",
                }}
              />
            ))}
            <div className="relative flex flex-col items-center bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/80 to-[#0a0e1a]/40 p-8 pt-24">
              <div className="relative inline-flex h-40 w-40 items-center justify-center">
                <svg width="160" height="160" className="-rotate-90" aria-hidden>
                  <circle cx="80" cy="80" r={R} stroke="rgba(255,255,255,.09)" strokeWidth="9" fill="none" />
                  <circle
                    cx="80" cy="80" r={R} stroke="#10b981" strokeWidth="9" strokeLinecap="round" fill="none"
                    strokeDasharray={C}
                    strokeDashoffset={C - (C * score) / 100}
                    style={{ transition: "stroke-dashoffset .3s linear", filter: "drop-shadow(0 0 10px rgba(16,185,129,.65))" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white tabular-nums">{faNum(score)}</span>
                  <span className="text-[11px] text-white/55">از ۱۰۰</span>
                </div>
              </div>

              <p className="mt-5 text-sm font-black text-emerald-300">امتیاز همسایگی — برج نیاوران</p>
              <p className="mt-1 text-[11px] text-white/55">۳۲ واحد · دادهٔ ۱۲ ماه گذشته</p>

              <div className="mt-5 grid w-full grid-cols-3 gap-2">
                {[
                  { k: "نرخ وصول", v: "۹۷٪" },
                  { k: "میانگین رفع خرابی", v: "۱.۸ روز" },
                  { k: "مشارکت در مجمع", v: "۸۴٪" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-white/10 bg-[#070b14]/70 p-2 text-center">
                    <p className="text-[10px] text-white/50">{s.k}</p>
                    <p className="mt-0.5 text-sm font-black text-[#f0d080]">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* تفکیک عوامل */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 backdrop-blur-md md:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">این عدد از کجا می‌آید؟</h3>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
                ۶ محور · وزن‌دار
              </span>
            </div>
            <p className="mt-2 text-xs leading-7 text-white/55">
              همهٔ محورها از رویدادهای سیستمی محاسبه می‌شوند، نه از ورودی دستی مدیر — پس
              دست‌کاری‌شدنی نیست.
            </p>

            <div className="mt-6 space-y-4">
              {FACTORS.map((f, i) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/75">
                      {f.label}
                      <span className="mr-2 text-[10px] text-white/40">وزن {faNum(f.weight)}٪</span>
                    </span>
                    <span className="font-black tabular-nums" style={{ color: f.color }}>
                      {faNum(f.score)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: seen ? `${f.score}%` : "0%",
                        background: f.color,
                        transition: `width 1s cubic-bezier(.22,1,.36,1) ${i * 90}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#070b14]/70 p-4">
              <p className="text-[11px] leading-7 text-white/60">
                <span className="font-bold text-emerald-300">حریم خصوصی:</span> هیچ‌وقت نشان نمی‌دهیم
                «واحد ۷ بدهکار است». فقط شاخص تجمیعی منتشر می‌شود. اگر ساختمانی کمتر از ۳ ماه داده یا
                کمتر از ۵ واحد داشته باشد، به‌جای عدد می‌نویسیم «داده کافی نیست».
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
