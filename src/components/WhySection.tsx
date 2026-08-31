"use client";

import { useEffect, useRef, useState } from "react";

/** ورود نرم هنگام اسکرول */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

const CARDS = [
  {
    label: "بدهی شارژ",
    value: "۳۸٪",
    tone: "text-[#f0d080]",
    body: "از واحدهای آپارتمانی دست‌کم یک دورهٔ شارژ عقب‌افتاده دارند — و همین، اولین جرقهٔ اختلاف است.",
  },
  {
    label: "منشأ نارضایتی",
    value: "۶۸٪",
    tone: "text-emerald-300",
    body: "نارضایتی ساکنین از رفتار همسایه و بی‌نظمی مالی می‌آید، نه از متراژ یا نمای ساختمان.",
  },
  {
    label: "اثر بر قیمت",
    value: "تا ۱۲٪",
    tone: "text-sky-300",
    body: "اختلاف قیمت دو واحد مشابه در یک محله، وقتی یکی مدیریت منظم دارد و دیگری ندارد.",
  },
  {
    label: "زمان کشف مشکل",
    value: "۴ ماه",
    tone: "text-rose-300",
    body: "میانگین زمانی که طول می‌کشد خریدار بفهمد وارد چه همسایگی‌ای شده — یعنی خیلی دیر.",
  },
];

export default function WhySection() {
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  return (
    <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
      <div
        ref={head.ref}
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
          head.seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          چرا مُلک‌آی؟
        </span>
        <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
          گران‌ترین اشتباه خریداران ملک، <span className="text-emerald-300">ندیدن همسایه</span> است
        </h2>
        <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
          ۶۸٪ نارضایتی ساکنین آپارتمان‌ها ریشه در رفتار همسایه و بی‌نظمی مالی ساختمان دارد، نه در
          متراژ یا نما. ما این لایهٔ پنهان را قابل اندازه‌گیری کردیم.
        </p>
      </div>

      <div
        ref={body.ref}
        className={`mt-14 grid gap-6 transition-all duration-700 lg:grid-cols-[1fr_1.1fr] ${
          body.seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* تصویر روایت‌گر */}
        <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10">
          <img
            src="/images/sections/community-hallway.webp"
            alt="راهروی مشترک یک مجتمع مسکونی و تعامل همسایگان"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <p className="text-lg font-black text-white">آرامش، گران‌ترین امکاناتِ ساختمان است</p>
            <p className="mt-2 text-xs leading-7 text-white/65">
              استخر و روف‌گاردن را می‌شود ساخت؛ همسایهٔ خوب را باید انتخاب کرد. ما داده‌اش را
              می‌دهیم.
            </p>
          </div>
        </div>

        {/* کارت‌های عدد */}
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="group rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40 hover:bg-[#111a2e]/85"
            >
              <p className="text-xs text-white/50">{c.label}</p>
              <p className={`mt-2 text-3xl font-black ${c.tone}`}>{c.value}</p>
              <p className="mt-3 text-[11px] leading-7 text-white/60">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
