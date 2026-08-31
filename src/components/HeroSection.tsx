"use client";

import { useState, useEffect } from "react";
import SearchSection from "./SearchSection";

/** پس‌زمینه‌های چرخشی — فایل‌ها داخل خودِ پروژه‌اند (public/images/hero) */
const SLIDES = [
  { src: "/images/hero/tehran-skyline.webp", alt: "نمای شهری تهران", tag: "تهران، بام شهر" },
  { src: "/images/hero/tehran-sunset.webp", alt: "غروب بر فراز برج‌های تهران", tag: "غروب زعفرانیه" },
  { src: "/images/hero/apartment-building.webp", alt: "نمای بیرونی مجتمع مسکونی", tag: "مجتمع مسکونی" },
  { src: "/images/hero/balcony-building.webp", alt: "بالکن‌های ساختمان مدرن", tag: "معماری معاصر" },
  { src: "/images/hero/tehran-building-1.webp", alt: "ساختمان مسکونی در تهران", tag: "الهیه" },
  { src: "/images/hero/white-building.webp", alt: "نمای سفید برج مسکونی", tag: "برج نیاوران" },
];

const ROTATING = [
  "همسایه‌ات را قبل از خانه‌ات بشناس",
  "شارژ ساختمان، هوشمند و عادلانه",
  "پنل اختصاصی برای هر ساختمان",
  "ارزش‌گذاری داده‌محور، نه حدس و گمان",
];

/** نشانه‌های اعتماد — کاهش ریسک ادراک‌شده، نه تکرار آمار پایین صفحه */
const TRUST = [
  { icon: "✓", label: "مالکیت احراز شده" },
  { icon: "🔒", label: "بدون آگهی جعلی" },
  { icon: "📄", label: "کد رهگیری رسمی" },
];

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [rot, setRot] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    const id = setInterval(() => setRot((r) => (r + 1) % ROTATING.length), 2800);
    return () => clearInterval(id);
  }, []);

  const fade = (d: string) =>
    `transition-all duration-700 ${d} ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-12 pt-20 md:pb-16 md:pt-20"
      aria-label="معرفی پلتفرم"
    >
      {/* ── پس‌زمینهٔ چرخشی ── */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((s, i) => {
          // فقط اسلاید فعلی، قبلی و بعدی در DOM بمانند تا هر ۶ عکس هم‌زمان دانلود نشوند
          const next = (slide + 1) % SLIDES.length;
          const prev = (slide - 1 + SLIDES.length) % SLIDES.length;
          if (i !== slide && i !== next && i !== prev) return null;
          return (
            <div
              key={s.src}
              className="absolute inset-0"
              style={{ opacity: i === slide ? 1 : 0, transition: "opacity 1800ms cubic-bezier(.4,0,.2,1)" }}
              aria-hidden={i !== slide}
            >
              <img
                src={s.src}
                alt={i === slide ? s.alt : ""}
                width={1800}
                height={1013}
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding={i === 0 ? "sync" : "async"}
                className={`h-full w-full object-cover ${i === slide ? "slide-active" : ""}`}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0a0e1a]/96 via-[#0a0e1a]/72 to-[#0a0e1a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-[#0a0e1a]/70" />
        <div className="grid-bg absolute inset-0 opacity-[0.12]" />
      </div>

      {/* ── محتوا: دو ستون ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          {/* راست: پیام — روی موبایل فرزندانش مستقیماً مرتب می‌شوند */}
          <div className="contents lg:block">
            <div className="order-1 lg:order-none">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#0a0e1a]/80 px-4 py-1.5 backdrop-blur-md ${fade("delay-0")}`}>
              <span className="status-online h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
              <span className="text-[13px] font-medium text-[#e8d9a8]">
                اولین پلتفرم هوشمند ملک و مدیریت ساختمان در ایران
              </span>
            </div>

            <h1
              className={`font-black leading-[1.14] ${fade("delay-100")}`}
              style={{ fontSize: "clamp(2.1rem, 4.4vw, 4rem)" }}
            >
              <span className="block text-white" style={{ textShadow: "0 6px 40px rgba(0,0,0,.95)" }}>
                خانه می‌خری یا<span className="text-emerald-300"> همسایه</span>؟
              </span>
              <span className="relative mt-2 block h-[1.45em] overflow-hidden">
                <span
                  key={rot}
                  className="drop-in gold-text-gradient hero-text-shadow block font-black"
                  style={{ fontSize: "clamp(1.15rem, 2.2vw, 2rem)" }}
                >
                  {ROTATING[rot]}
                </span>
              </span>
            </h1>
            </div>

            <div className="order-2 lg:order-none">
            <p className={`mt-0 max-w-xl text-[13px] leading-7 text-white/75 md:text-[15px] md:leading-9 lg:mt-5 ${fade("delay-200")}`}>
              گران‌ترین ملکِ بهترین محله هم اگر همسایهٔ ناهماهنگ داشته باشد، آرامش و ارزش خود را از
              دست می‌دهد. مُلک‌آی اولین پلتفرمی است که{" "}
              <span className="text-emerald-300">کیفیت همسایگی</span>،
              <span className="text-amber-200"> انضباط مالی ساختمان</span> و
              <span className="text-sky-300"> مدیریت هوشمند تأسیسات</span> را وارد معادلهٔ قیمت می‌کند.
            </p>

            {/* نشانه‌های اعتماد */}
            <div className={`mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 ${fade("delay-300")}`}>
              {TRUST.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5 text-[12px] text-slate-300">
                  <span className="text-emerald-400">{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </div>

            {/* CTA ثانویه — اقدام اصلی داخل کارت جستجوست */}
            <div className={`mt-6 ${fade("delay-500")}`}>
              <a
                href="#management"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#f0d080] transition-colors hover:text-[#f7e3a8]"
              >
                <span aria-hidden>🏢</span>
                مدیر ساختمانی؟ پنل اختصاصی‌ات را ببین
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
            </div>
            </div>
          </div>

          {/* چپ: کارت جستجو — روی موبایل بلافاصله بعد از تیتر */}
          <div className={`order-3 lg:order-none ${fade("delay-300")}`}>
            <div id="search" className="scroll-mt-24">
              <SearchSection embedded />
            </div>
          </div>
        </div>
      </div>

      {/* برچسب محل عکس + نشانگر اسلاید */}
      <div className="absolute bottom-[3.6rem] left-6 z-30 hidden items-center gap-3 md:flex">
        <span className="rounded-full border border-white/15 bg-[#0a0e1a]/80 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-md">
          📍 {SLIDES[slide].tag}
        </span>
        <div className="flex gap-1.5" role="tablist" aria-label="تصاویر پس‌زمینه">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              role="tab"
              aria-selected={i === slide}
              aria-label={s.alt}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-6 bg-[#c9a84c]" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>

      {/* نوار اخبار — چسبیده به کف هیرو */}
      <div className="group absolute bottom-0 left-0 right-0 z-30 overflow-hidden border-t border-[#c9a84c]/30 bg-[#0a0e1a]/95 py-2 backdrop-blur-md">
        <div className="scroll-text flex whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[0, 1].map((k) => (
            <span key={k} className="inline-flex items-center text-[13px] text-[#e8d9a8]" aria-hidden={k === 1}>
              {[
                "آپارتمان ۱۸۵ متری الهیه — شاخص همسایگی ۹۴",
                "ویلای دوبلکس نیاوران — صندوق ذخیره سالم",
                "پنت‌هاوس جردن — نرخ وصول شارژ ۱۰۰٪",
                "رهن کامل سعادت‌آباد — بدون بدهی مشاعات",
                "اجارهٔ ونک — مدیریت فعال و شفاف",
                "زعفرانیه — سرویس آسانسور به‌روز",
              ].map((item) => (
                <span key={item} className="mx-6 inline-flex items-center gap-2">
                  <span className="text-[#c9a84c]">◆</span>
                  <span className="font-medium">{item}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
