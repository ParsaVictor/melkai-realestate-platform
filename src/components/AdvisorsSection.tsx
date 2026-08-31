"use client";

import { useState } from "react";
import { faDigits } from "@/lib/format";

type Advisor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  deals: number;
  years: number;
  areas: string[];
  phone: string;
  telegram: string;
  photo: string;
};

const ADVISORS: Advisor[] = [
  {
    id: 1,
    name: "کاوه فرهمند",
    specialty: "برج‌های شمال تهران",
    rating: 4.9,
    deals: 214,
    years: 12,
    areas: ["الهیه", "نیاوران", "زعفرانیه", "فرمانیه"],
    phone: "09121180042",
    telegram: "https://t.me/Parsa_Karkooti",
    photo: "/images/advisors/a-1.webp",
  },
  {
    id: 2,
    name: "امیر رستگار",
    specialty: "تجاری و اداری",
    rating: 4.8,
    deals: 176,
    years: 9,
    areas: ["ونک", "میرداماد", "آرژانتین", "سعادت‌آباد"],
    phone: "09121180043",
    telegram: "https://t.me/Parsa_Karkooti",
    photo: "/images/advisors/a-2.webp",
  },
  {
    id: 3,
    name: "نگار سلطانی",
    specialty: "مشهد و شرق کشور",
    rating: 4.7,
    deals: 143,
    years: 8,
    areas: ["احمدآباد", "هاشمیه", "وکیل‌آباد", "بلوار سجاد"],
    phone: "09121180044",
    telegram: "https://t.me/Parsa_Karkooti",
    photo: "/images/advisors/a-3.webp",
  },
  {
    id: 4,
    name: "سارا مهرآیین",
    specialty: "اجاره و رهن",
    rating: 4.6,
    deals: 308,
    years: 11,
    areas: ["پونک", "جنت‌آباد", "شهرک غرب", "ستارخان"],
    phone: "09121180045",
    telegram: "https://t.me/Parsa_Karkooti",
    photo: "/images/advisors/a-4.webp",
  },
];

/** ۴٫۹ — جداکنندهٔ اعشار فارسی */
const faRating = (n: number) => faDigits(n.toFixed(1)).replace(".", "٫");

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    // dir=ltr تا پرشدن ستاره‌ها از یک لبهٔ ثابت انجام شود
    <div dir="ltr" className="relative inline-flex shrink-0" role="img" aria-label={`امتیاز ${faRating(rating)} از ۵`}>
      <div className="flex gap-0.5 text-white/15">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className="h-3.5 w-3.5" />
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <div className="flex gap-0.5 text-[#f0d080]">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} className="h-3.5 w-3.5" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);

  // عکس‌های مشاوران ممکن است هنوز آپلود نشده باشند؛ جایگزین طلایی با حرف اول نام
  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[#c9a84c]/40 text-2xl font-extrabold text-[#0a0e1a]"
        style={{ background: "linear-gradient(135deg, #f0d080 0%, #c9a84c 55%, #8b6914 100%)" }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`عکس ${name}`}
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 object-cover"
    />
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.68-.36 1.03-.25 1.12.37 2.33.57 3.56.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.32 4.23 12.4c-.658-.204-.67-.658.136-.975l11.57-4.461c.548-.196 1.026.13.854.974z" />
    </svg>
  );
}

function AdvisorCard({ a }: { a: Advisor }) {
  return (
    <article className="group/adv flex flex-col rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#c9a84c]/45 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,.8)] motion-safe:hover:-translate-y-2">
      <div className="flex items-start gap-4">
        <Avatar src={a.photo} name={a.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-100 transition-colors duration-300 group-hover/adv:text-[#f0d080]">
            {a.name}
          </h3>
          <p className="mt-1 truncate text-[13px] text-slate-400">{a.specialty}</p>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={a.rating} />
            <span className="text-xs font-bold text-[#f0d080]">{faRating(a.rating)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-white/10 bg-[#070b14]/70 px-3 py-2.5 text-center">
          <div className="text-lg font-extrabold text-emerald-300">{faDigits(a.deals)}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">معاملهٔ موفق</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#070b14]/70 px-3 py-2.5 text-center">
          <div className="text-lg font-extrabold text-[#f0d080]">{faDigits(a.years)}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">سال سابقه</div>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[11px] text-slate-500">محله‌های تحت پوشش</p>
        <ul className="flex flex-wrap gap-1.5">
          {a.areas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex gap-2 pt-1">
        <a
          href={`tel:${a.phone}`}
          aria-label={`تماس تلفنی با ${a.name}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-3 py-2.5 text-[13px] font-bold text-emerald-300 transition-colors duration-300 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
        >
          <PhoneIcon />
          تماس
        </a>
        <a
          href={a.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`گفتگو با ${a.name} در تلگرام`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#229ED9]/45 bg-[#229ED9]/10 px-3 py-2.5 text-[13px] font-bold text-[#7cc9ec] transition-colors duration-300 hover:bg-[#229ED9]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
        >
          <TelegramIcon />
          تلگرام
        </a>
      </div>
    </article>
  );
}

export default function AdvisorsSection() {
  return (
    <section id="advisors" className="relative overflow-hidden py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/3 h-72 w-72 rounded-full bg-[#c9a84c]/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-1.5 text-xs font-bold text-[#f0d080]">
            مشاوران فروش
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-slate-100 sm:text-4xl">
            <span className="gold-text-gradient">آدم‌هایی</span> که پشت این داده‌ها هستند
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            الگوریتم امتیاز می‌دهد، اما قرارداد را آدم می‌بندد. این چهار نفر محله‌هایشان را خانه‌به‌خانه می‌شناسند و
            پاسخگوی مستقیم شما هستند.
          </p>
          <div className="section-divider mt-6" />
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ADVISORS.map((a) => (
            <AdvisorCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
