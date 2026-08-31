"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import WalletCards, { DEMO_CARDS } from "@/components/WalletCards";
import { useStore, type DraftListing } from "@/lib/store";
import { LISTING_LABEL, TYPE_LABEL, enDigits, faDigits, money, perMeter, scoreTone, toman } from "@/lib/format";
import {
  CITIES,
  CURRENT_JALALI_YEAR,
  NEIGHBORHOODS,
  estimate,
  hoodScore,
  priceVerdict,
  type ListingType,
  type PropertyType,
  type Valuation,
} from "@/lib/valuation";

/* ── ثابت‌ها ───────────────────────────────────────────────────────────── */

const DEFAULT_IMAGE = "/images/properties/prop-7.webp";

const STEPS = [
  { title: "نوع معامله و ملک", hint: "چه ملکی، و برای چه کاری؟" },
  { title: "موقعیت", hint: "شهر، محله و نشانی دقیق" },
  { title: "مشخصات", hint: "متراژ، اتاق و امکانات" },
  { title: "قیمت‌گذاری هوشمند", hint: "برآورد بر پایهٔ دادهٔ محله" },
  { title: "تصاویر و توضیحات", hint: "آگهی را دیدنی کنید" },
  { title: "پلن انتشار", hint: "انتشار و پرداخت" },
];

type PlanId = "free" | "ladder" | "special";

const PLANS: { id: PlanId; name: string; price: number; badge?: string; tagline: string; perks: string[] }[] = [
  {
    id: "free",
    name: "رایگان",
    price: 0,
    badge: "توصیه‌شده",
    tagline: "۰ تومان — کمیسیون فقط هنگام فروش موفق",
    perks: [
      "انتشار نامحدود در فهرست عمومی",
      "نمایش امتیاز همسایگی روی کارت آگهی",
      "گفت‌وگوی مستقیم با متقاضیان",
      "بدون هزینهٔ اولیه؛ ۰٫۵٪ کمیسیون فقط پس از معاملهٔ موفق",
    ],
  },
  {
    id: "ladder",
    name: "نردبان",
    price: 490_000,
    tagline: "هفت روز بالای فهرست محله",
    perks: ["نردبان خودکار روزانه به‌مدت ۷ روز", "نشان «تازه» روی کارت آگهی", "اولویت در جستجوی محله", "گزارش هفتگی بازدید"],
  },
  {
    id: "special",
    name: "ویژه",
    price: 1_200_000,
    tagline: "سی روز دیده‌شدن حداکثری",
    perks: [
      "جایگاه ثابت در «آگهی‌های ویژه» صفحهٔ اصلی",
      "نردبان خودکار روزانه به‌مدت ۳۰ روز",
      "قاب طلایی و نشان ویژه روی کارت",
      "عکاسی حرفه‌ای رایگان (تهران)",
      "مشاور اختصاصی تا پایان معامله",
    ],
  },
];

const LISTING_ICON: Record<ListingType, string> = {
  sale: "M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6zM7.5 7.5h.01",
  rent: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  mortgage: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5zM12 15v2",
};

const TYPE_ICON: Record<PropertyType, string> = {
  apartment: "M3 21h18M5 21V7l7-4 7 4v14M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2",
  villa: "M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6",
  office: "M4 21V4h10v17M14 9h6v12M7 8h3M7 12h3M7 16h3M17 13h1M17 17h1",
  shop: "M3 9l1.5-5h15L21 9M3 9h18M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M9 21v-7h6v7",
  land: "M3 18l6-9 4 5 3-3 5 7zM3 18h18",
};

const INPUT =
  "w-full rounded-xl border border-white/10 bg-[#070b14]/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#c9a84c]/60 focus:ring-2 focus:ring-[#c9a84c]/20";
const CARD = "rounded-3xl border border-white/10 bg-[#0d1424]/70 backdrop-blur-md";

/* ── کمکی‌ها ───────────────────────────────────────────────────────────── */

const digitsOnly = (v: string) => enDigits(v).replace(/[^0-9]/g, "");
const num = (v: string) => Number(digitsOnly(v) || 0);
const faNum = (v: string) => (v ? faDigits(digitsOnly(v)) : "");
const faPrice = (v: string) => (digitsOnly(v) ? faDigits(num(v).toLocaleString("en-US")) : "");

type Form = {
  listingType: ListingType | "";
  propertyType: PropertyType | "";
  city: string;
  neighborhood: string;
  address: string;
  postal: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  parking: boolean;
  storage: boolean;
  balcony: boolean;
  elevator: boolean;
  renovated: boolean;
  price: string;
  title: string;
  description: string;
  plan: PlanId;
};

const EMPTY: Form = {
  listingType: "",
  propertyType: "",
  city: "",
  neighborhood: "",
  address: "",
  postal: "",
  area: "",
  bedrooms: "2",
  bathrooms: "1",
  floor: "1",
  totalFloors: "5",
  yearBuilt: "1400",
  parking: true,
  storage: true,
  balcony: false,
  elevator: true,
  renovated: false,
  price: "",
  title: "",
  description: "",
  plan: "free",
};

type Photo = { id: string; name: string; url: string };

/* ── اجزای کوچک ────────────────────────────────────────────────────────── */

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceCard({
  selected,
  onClick,
  iconPath,
  title,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  iconPath: string;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${title} — ${sub}`}
      className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/60 motion-safe:duration-300 ${
        selected
          ? "border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#f0d080] shadow-[0_0_25px_-8px_rgba(201,168,76,0.6)]"
          : "border-white/10 bg-[#070b14]/60 text-slate-400 hover:border-white/25 hover:text-slate-200"
      }`}
    >
      <Icon d={iconPath} className={`h-7 w-7 motion-safe:transition-transform ${selected ? "scale-110" : "group-hover:scale-105"}`} />
      <span className="text-sm font-bold">{title}</span>
      <span className="text-[11px] leading-4 opacity-70">{sub}</span>
    </button>
  );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/50 ${
        checked ? "border-[#c9a84c]/50 bg-[#c9a84c]/10 text-[#f0d080]" : "border-white/10 bg-[#070b14]/60 text-slate-400 hover:border-white/20"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#c9a84c]" : "bg-white/12"}`}>
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#0a0e1a] motion-safe:transition-all ${checked ? "end-1" : "start-1"}`}
        />
      </span>
    </button>
  );
}

/** نوار بازهٔ قیمت — کف در سمت راست، سقف در سمت چپ (خوانش فارسی) */
function RangeBar({ v, user }: { v: Valuation; user: number }) {
  const lo = user > 0 ? Math.min(v.low, user) : v.low;
  const hi = user > 0 ? Math.max(v.high, user) : v.high;
  const min = lo * 0.92;
  const max = hi * 1.08;
  const pos = (x: number) => Math.max(0, Math.min(100, ((x - min) / (max - min)) * 100));

  return (
    <div className="mt-5">
      <div className="relative h-3 w-full rounded-full bg-white/6">
        <div
          className="absolute inset-y-0 rounded-full bg-gradient-to-l from-emerald-500/70 via-[#c9a84c] to-rose-500/70"
          style={{ insetInlineStart: `${pos(v.low)}%`, width: `${pos(v.high) - pos(v.low)}%` }}
        />
        <span
          className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded-full bg-[#f0d080] shadow-[0_0_12px_rgba(240,208,128,0.9)]"
          style={{ insetInlineStart: `${pos(v.fair)}%` }}
          aria-hidden
        />
        {user > 0 ? (
          <span
            className="absolute -top-2.5 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0a0e1a] text-[10px] font-black text-white"
            style={{ insetInlineStart: `${pos(user)}%` }}
            aria-hidden
          >
            شما
          </span>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-white/10 bg-[#070b14]/60 p-2">
          <div className="text-[11px] text-slate-500">سقف بازار</div>
          <div className="text-sm font-bold text-rose-300">{toman(v.high)}</div>
        </div>
        <div className="rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 p-2">
          <div className="text-[11px] text-[#f0d080]/80">قیمت منصفانه</div>
          <div className="text-sm font-black text-[#f0d080]">{toman(v.fair)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#070b14]/60 p-2">
          <div className="text-[11px] text-slate-500">کف بازار</div>
          <div className="text-sm font-bold text-emerald-300">{toman(v.low)}</div>
        </div>
      </div>
    </div>
  );
}

/* ── ویزارد ────────────────────────────────────────────────────────────── */

export default function SubmitClient() {
  const { ready, user, addListing } = useStore();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [done, setDone] = useState<DraftListing | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const photosRef = useRef<Photo[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // آزادسازی آدرس‌های موقتِ تصویر هنگام ترک صفحه
  useEffect(
    () => () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key as string] ? { ...e, [key as string]: "" } : e));
  };

  const isLand = form.propertyType === "land";
  const hoods = form.city ? (NEIGHBORHOODS[form.city] ?? []) : [];
  const score = form.city && form.neighborhood ? hoodScore(form.city, form.neighborhood) : 0;
  const plan = PLANS.find((p) => p.id === form.plan)!;
  const needsPayment = plan.price > 0;

  const valuation = useMemo<Valuation | null>(() => {
    if (!form.listingType || !form.propertyType || !form.city || !form.neighborhood) return null;
    const area = num(form.area);
    if (area < 10) return null;
    return estimate({
      city: form.city,
      neighborhood: form.neighborhood,
      propertyType: form.propertyType,
      listingType: form.listingType,
      area,
      floor: num(form.floor),
      totalFloors: num(form.totalFloors),
      yearBuilt: num(form.yearBuilt),
      parking: form.parking,
      storage: form.storage,
      balcony: form.balcony,
      elevator: form.elevator,
      renovated: form.renovated,
    });
  }, [form]);

  const userPrice = num(form.price);
  const verdict = valuation && userPrice > 0 ? priceVerdict(userPrice, valuation, perMeter(valuation.fair, num(form.area))) : null;

  /* اعتبارسنجی هر مرحله */
  function validate(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.listingType) e.listingType = "نوع معامله را انتخاب کنید.";
      if (!form.propertyType) e.propertyType = "نوع ملک را انتخاب کنید.";
    }
    if (s === 1) {
      if (!form.city) e.city = "شهر را انتخاب کنید.";
      if (!form.neighborhood) e.neighborhood = "محله را انتخاب کنید.";
      if (form.address.trim().length < 10) e.address = "نشانی را کامل‌تر بنویسید (دست‌کم ۱۰ نویسه).";
      if (digitsOnly(form.postal).length !== 10) e.postal = "کدپستی باید دقیقاً ۱۰ رقم باشد.";
    }
    if (s === 2) {
      const area = num(form.area);
      if (!area) e.area = "متراژ را وارد کنید.";
      else if (area < 15) e.area = "متراژ نمی‌تواند کمتر از ۱۵ متر باشد.";
      else if (area > 20000) e.area = "متراژ واردشده معقول نیست.";
      if (!isLand) {
        const yb = num(form.yearBuilt);
        if (!yb) e.yearBuilt = "سال ساخت را وارد کنید.";
        else if (yb < 1300 || yb > CURRENT_JALALI_YEAR) e.yearBuilt = `سال ساخت باید بین ۱۳۰۰ تا ${faDigits(CURRENT_JALALI_YEAR)} باشد.`;
        const tf = num(form.totalFloors);
        const fl = num(form.floor);
        if (!tf) e.totalFloors = "تعداد کل طبقات را وارد کنید.";
        if (!digitsOnly(form.floor)) e.floor = "طبقه را وارد کنید (۰ برای همکف).";
        else if (tf && fl > tf) e.floor = "طبقهٔ واحد نمی‌تواند از کل طبقات بیشتر باشد.";
        if (!digitsOnly(form.bedrooms)) e.bedrooms = "تعداد خواب را وارد کنید.";
        if (!digitsOnly(form.bathrooms)) e.bathrooms = "تعداد سرویس بهداشتی را وارد کنید.";
      }
    }
    if (s === 3) {
      if (!userPrice) e.price = "قیمت پیشنهادی خود را وارد کنید.";
      else if (userPrice < 1_000_000) e.price = "قیمت واردشده بسیار پایین است.";
    }
    if (s === 4) {
      if (form.title.trim().length < 8) e.title = "عنوان آگهی دست‌کم ۸ نویسه باشد.";
      if (form.description.trim().length < 30) e.description = "توضیحات دست‌کم ۳۰ نویسه باشد تا آگهی جدی دیده شود.";
    }
    if (s === 5) {
      if (needsPayment && !paid) e.payment = "برای این پلن ابتدا پرداخت را کامل کنید.";
    }
    return e;
  }

  function goTo(next: number) {
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function onNext() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;

    if (step === 4 && !form.title.trim()) return;
    if (step < 5) {
      // پیشنهاد عنوان خودکار وقتی کاربر هنوز چیزی ننوشته
      if (step === 3 && !form.title && form.propertyType && form.neighborhood) {
        setForm((f) => ({ ...f, title: `${TYPE_LABEL[f.propertyType]} ${faDigits(num(f.area))} متری در ${f.neighborhood}` }));
      }
      goTo(step + 1);
      return;
    }
    publish();
  }

  function publish() {
    const area = num(form.area);
    const item = addListing({
      title: form.title.trim(),
      description: form.description.trim(),
      propertyType: form.propertyType,
      listingType: form.listingType,
      price: userPrice,
      area,
      bedrooms: isLand ? 0 : num(form.bedrooms),
      bathrooms: isLand ? 0 : num(form.bathrooms),
      floor: isLand ? 0 : num(form.floor),
      totalFloors: isLand ? 0 : num(form.totalFloors),
      parking: form.parking,
      elevator: form.elevator,
      storage: form.storage,
      balcony: form.balcony,
      renovated: form.renovated,
      address: form.address.trim(),
      neighborhood: form.neighborhood,
      city: form.city,
      postalCode: digitsOnly(form.postal),
      yearBuilt: isLand ? 0 : num(form.yearBuilt),
      neighborScore: score,
      imageUrl: DEFAULT_IMAGE,
      photoCount: photos.length,
      plan: plan.id,
      planName: plan.name,
      planPrice: plan.price,
      paidWith: needsPayment ? (DEMO_CARDS.find((c) => c.id === cardId)?.bank ?? "") : "",
      estimate: valuation ? { low: valuation.low, fair: valuation.fair, high: valuation.high, perMeter: valuation.perMeter } : null,
      agentName: user?.name ?? "کاربر مهمان",
      agentPhone: user?.phone ?? "",
    });
    setDone(item);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function startPayment() {
    if (!cardId || paying || paid) return;
    setPaying(true);
    setErrors((e) => ({ ...e, payment: "" }));
    timerRef.current = setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 1500);
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).slice(0, Math.max(0, 6 - photos.length));
    const next = picked.map((f, i) => ({
      id: `${Date.now()}-${i}-${f.size}`,
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setPhotos((p) => [...p, ...next]);
    e.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((p) => {
      const target = p.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return p.filter((x) => x.id !== id);
    });
  }

  function reset() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setForm(EMPTY);
    setCardId(null);
    setPaid(false);
    setPaying(false);
    setDone(null);
    goTo(0);
  }

  /* اسکلتون تا خوانده‌شدن localStorage — تا رندر سرور و کلاینت یکی بماند */
  if (!ready) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <div className={`${CARD} p-8`}>
          <div className="h-6 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded-lg bg-white/5" />
          <div className="mt-8 h-2 w-full animate-pulse rounded-full bg-white/5" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
          <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  /* ── صفحهٔ موفقیت ── */
  if (done) {
    const preview = photos[0]?.url ?? DEFAULT_IMAGE;
    return (
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <div className={`${CARD} overflow-hidden p-6 sm:p-10 motion-safe:drop-in`}>
          <div className="flex flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-emerald-400/50 bg-emerald-500/10 text-emerald-300">
              <Icon d="M20 6 9 17l-5-5" className="h-8 w-8" />
            </span>
            <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-black outline-none sm:text-3xl">
              <span className="gold-text-gradient">آگهی شما ثبت شد</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              کارشناسان ما تا حداکثر ۲۴ ساعت آگهی را بازبینی و منتشر می‌کنند.
            </p>

            <div className="mt-5 rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-6 py-3">
              <div className="text-[11px] text-[#f0d080]/80">کد رهگیری</div>
              <div dir="ltr" className="text-xl font-black tracking-widest text-[#f0d080]">
                {faDigits(String(done.id))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-[160px_1fr]">
            <img
              src={preview}
              alt={`تصویر آگهی ${form.title}`}
              loading="lazy"
              decoding="async"
              className="h-32 w-full rounded-2xl border border-white/10 object-cover sm:h-full"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-100">{form.title}</h2>
              <p className="mt-1 text-xs text-slate-500">
                {form.city}، {form.neighborhood} — {form.address}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <SummaryRow label="نوع معامله" value={LISTING_LABEL[form.listingType || "sale"]} />
                <SummaryRow label="نوع ملک" value={TYPE_LABEL[form.propertyType || "apartment"]} />
                <SummaryRow label="متراژ" value={`${faDigits(num(form.area))} متر`} />
                <SummaryRow label="قیمت" value={toman(userPrice)} />
                <SummaryRow label="امتیاز همسایگی" value={faDigits(score)} />
                <SummaryRow label="پلن انتشار" value={plan.price ? `${plan.name} — ${money(plan.price)}` : "رایگان"} />
              </dl>
              <p className="mt-4 rounded-xl border border-white/10 bg-[#070b14]/60 p-3 text-xs leading-6 text-slate-400">
                وضعیت: <span className="text-slate-200">{done.status}</span>
                {plan.id === "free" ? " — انتشار رایگان است و در صورت فروش، ۰٫۵٪ کمیسیون از معامله محاسبه می‌شود." : ""}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/dashboard"
              className="btn-gold flex-1 rounded-xl px-6 py-3 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080]"
            >
              مشاهدهٔ آگهی‌های من
            </a>
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/50"
            >
              ثبت آگهی جدید
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ── ویزارد ── */
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
      <header className="mb-6 text-center">
        <p className="text-xs font-bold tracking-widest text-[#c9a84c]">ثبت آگهی</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          ملک‌تان را <span className="gold-text-gradient">هوشمند</span> قیمت بگذارید
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
          شش گام کوتاه؛ در گام چهارم برآورد قیمت را بر پایهٔ دادهٔ واقعی همان محله می‌بینید — با فهرست عواملی که عدد را ساخته‌اند.
        </p>
      </header>

      <div className={`${CARD} p-5 sm:p-8`}>
        {/* نوار پیشرفت */}
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-between text-xs">
            <span className="font-bold text-slate-300">
              گام {faDigits(step + 1)} از {faDigits(STEPS.length)}
            </span>
            <span className="text-slate-500">{faDigits(Math.round(progress))}٪ تکمیل</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-white/8"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="پیشرفت ثبت آگهی"
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#8b6914] via-[#c9a84c] to-[#f0d080] motion-safe:transition-[width] motion-safe:duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="mt-4 flex flex-wrap gap-1.5">
            {STEPS.map((s, i) => {
              const state = i === step ? "now" : i < step ? "done" : "todo";
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => (i < step ? goTo(i) : undefined)}
                    disabled={i >= step}
                    aria-current={i === step ? "step" : undefined}
                    aria-label={`گام ${faDigits(i + 1)}: ${s.title}`}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/50 ${
                      state === "now"
                        ? "border-[#c9a84c]/60 bg-[#c9a84c]/15 text-[#f0d080]"
                        : state === "done"
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          : "border-white/10 bg-transparent text-slate-600"
                    }`}
                  >
                    {faDigits(i + 1)}. {s.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-black text-slate-100 outline-none">
          {STEPS[step].title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{STEPS[step].hint}</p>

        <div className="mt-6 motion-safe:drop-in" key={step}>
          {/* ── گام ۱ ── */}
          {step === 0 && (
            <div className="space-y-7">
              {!user && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/8 px-4 py-3">
                  <p className="text-sm text-emerald-200">برای ثبت آگهی بهتر است وارد شوید تا آگهی به حساب شما بچسبد.</p>
                  <a
                    href="/login"
                    className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    ورود به حساب
                  </a>
                </div>
              )}

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-300">نوع معامله</legend>
                <div className="grid grid-cols-3 gap-3">
                  {(["sale", "rent", "mortgage"] as ListingType[]).map((t) => (
                    <ChoiceCard
                      key={t}
                      selected={form.listingType === t}
                      onClick={() => set("listingType", t)}
                      iconPath={LISTING_ICON[t]}
                      title={LISTING_LABEL[t]}
                      sub={t === "sale" ? "انتقال سند" : t === "rent" ? "رهن و اجارهٔ ماهانه" : "بدون اجارهٔ ماهانه"}
                    />
                  ))}
                </div>
                {errors.listingType ? (
                  <p role="alert" className="mt-2 text-xs font-medium text-rose-400">
                    {errors.listingType}
                  </p>
                ) : null}
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-300">نوع ملک</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {(["apartment", "villa", "office", "shop", "land"] as PropertyType[]).map((t) => (
                    <ChoiceCard
                      key={t}
                      selected={form.propertyType === t}
                      onClick={() => set("propertyType", t)}
                      iconPath={TYPE_ICON[t]}
                      title={TYPE_LABEL[t]}
                      sub={
                        t === "apartment"
                          ? "واحد مسکونی"
                          : t === "villa"
                            ? "ویلایی و دوبلکس"
                            : t === "office"
                              ? "اداری و کارگاه"
                              : t === "shop"
                                ? "تجاری و مغازه"
                                : "زمین و کلنگی"
                      }
                    />
                  ))}
                </div>
                {errors.propertyType ? (
                  <p role="alert" className="mt-2 text-xs font-medium text-rose-400">
                    {errors.propertyType}
                  </p>
                ) : null}
              </fieldset>
            </div>
          )}

          {/* ── گام ۲ ── */}
          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="شهر" htmlFor="city" error={errors.city}>
                <select
                  id="city"
                  className={INPUT}
                  value={form.city}
                  aria-invalid={!!errors.city}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, city: e.target.value, neighborhood: "" }));
                    setErrors((x) => ({ ...x, city: "", neighborhood: "" }));
                  }}
                >
                  <option value="">انتخاب کنید…</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="محله"
                htmlFor="hood"
                error={errors.neighborhood}
                hint={form.city ? undefined : "ابتدا شهر را انتخاب کنید."}
              >
                <select
                  id="hood"
                  className={INPUT}
                  value={form.neighborhood}
                  disabled={!form.city}
                  aria-invalid={!!errors.neighborhood}
                  onChange={(e) => set("neighborhood", e.target.value)}
                >
                  <option value="">{form.city ? "انتخاب کنید…" : "—"}</option>
                  {hoods.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </Field>

              {score > 0 && (
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b14]/60 px-4 py-3">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-black"
                      style={{ color: scoreTone(score).color, background: `${scoreTone(score).color}1a` }}
                    >
                      {faDigits(score)}
                    </span>
                    <p className="text-xs leading-6 text-slate-400">
                      امتیاز همسایگی {form.neighborhood}: <span className="font-bold text-slate-200">{scoreTone(score).label}</span> — این
                      امتیاز روی برآورد قیمت گام چهارم اثر می‌گذارد.
                    </p>
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <Field label="نشانی" htmlFor="address" error={errors.address} hint="خیابان، کوچه و پلاک — نشانی دقیق فقط به متقاضیان تأییدشده نشان داده می‌شود.">
                  <input
                    id="address"
                    className={INPUT}
                    value={form.address}
                    aria-invalid={!!errors.address}
                    placeholder="مثال: خیابان فرشته، کوچهٔ بیدار، پلاک ۱۲"
                    onChange={(e) => set("address", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="کدپستی" htmlFor="postal" error={errors.postal} hint="۱۰ رقم، بدون خط تیره">
                <input
                  id="postal"
                  className={`${INPUT} tracking-[4px]`}
                  inputMode="numeric"
                  value={faNum(form.postal)}
                  aria-invalid={!!errors.postal}
                  placeholder="۱۹۶۵۸۴۳۲۱۰"
                  onChange={(e) => set("postal", digitsOnly(e.target.value).slice(0, 10))}
                />
              </Field>
            </div>
          )}

          {/* ── گام ۳ ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="متراژ (متر مربع)" htmlFor="area" error={errors.area}>
                  <input
                    id="area"
                    className={INPUT}
                    inputMode="numeric"
                    value={faNum(form.area)}
                    aria-invalid={!!errors.area}
                    placeholder="۱۲۰"
                    onChange={(e) => set("area", digitsOnly(e.target.value).slice(0, 6))}
                  />
                </Field>

                {!isLand && (
                  <>
                    <Field label="اتاق خواب" htmlFor="bedrooms" error={errors.bedrooms}>
                      <input
                        id="bedrooms"
                        className={INPUT}
                        inputMode="numeric"
                        value={faNum(form.bedrooms)}
                        aria-invalid={!!errors.bedrooms}
                        onChange={(e) => set("bedrooms", digitsOnly(e.target.value).slice(0, 2))}
                      />
                    </Field>
                    <Field label="سرویس بهداشتی" htmlFor="bathrooms" error={errors.bathrooms}>
                      <input
                        id="bathrooms"
                        className={INPUT}
                        inputMode="numeric"
                        value={faNum(form.bathrooms)}
                        aria-invalid={!!errors.bathrooms}
                        onChange={(e) => set("bathrooms", digitsOnly(e.target.value).slice(0, 2))}
                      />
                    </Field>
                    <Field label="طبقه" htmlFor="floor" error={errors.floor} hint="۰ یعنی همکف">
                      <input
                        id="floor"
                        className={INPUT}
                        inputMode="numeric"
                        value={faNum(form.floor)}
                        aria-invalid={!!errors.floor}
                        onChange={(e) => set("floor", digitsOnly(e.target.value).slice(0, 2))}
                      />
                    </Field>
                    <Field label="تعداد کل طبقات" htmlFor="totalFloors" error={errors.totalFloors}>
                      <input
                        id="totalFloors"
                        className={INPUT}
                        inputMode="numeric"
                        value={faNum(form.totalFloors)}
                        aria-invalid={!!errors.totalFloors}
                        onChange={(e) => set("totalFloors", digitsOnly(e.target.value).slice(0, 2))}
                      />
                    </Field>
                    <Field label="سال ساخت (شمسی)" htmlFor="yearBuilt" error={errors.yearBuilt}>
                      <input
                        id="yearBuilt"
                        className={INPUT}
                        inputMode="numeric"
                        value={faNum(form.yearBuilt)}
                        aria-invalid={!!errors.yearBuilt}
                        placeholder="۱۴۰۰"
                        onChange={(e) => set("yearBuilt", digitsOnly(e.target.value).slice(0, 4))}
                      />
                    </Field>
                  </>
                )}
              </div>

              {isLand ? (
                <p className="rounded-2xl border border-white/10 bg-[#070b14]/60 p-4 text-xs leading-6 text-slate-400">
                  برای زمین، متراژ و موقعیت کافی است؛ باقی مشخصات ساختمانی نمایش داده نمی‌شود.
                </p>
              ) : (
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-slate-300">امکانات</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Switch label="پارکینگ" checked={form.parking} onChange={(v) => set("parking", v)} />
                    <Switch label="انباری" checked={form.storage} onChange={(v) => set("storage", v)} />
                    <Switch label="بالکن" checked={form.balcony} onChange={(v) => set("balcony", v)} />
                    <Switch label="آسانسور" checked={form.elevator} onChange={(v) => set("elevator", v)} />
                    <Switch label="بازسازی‌شده" checked={form.renovated} onChange={(v) => set("renovated", v)} />
                  </div>
                </fieldset>
              )}
            </div>
          )}

          {/* ── گام ۴ — قیمت‌گذاری هوشمند ── */}
          {step === 3 && (
            <div className="space-y-6">
              {!valuation ? (
                <p className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                  برای برآورد قیمت، ابتدا شهر، محله و متراژ را در گام‌های قبل کامل کنید.
                </p>
              ) : (
                <>
                  <div className="rounded-2xl border border-[#c9a84c]/25 bg-[#070b14]/60 p-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">برآورد مُلک‌آی برای این ملک</p>
                        <p className="mt-1 text-3xl font-black gold-text-gradient">{toman(valuation.fair)}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          هر متر مربع: <span className="font-bold text-slate-200">{money(valuation.perMeter)}</span>
                        </p>
                      </div>
                      <div className="text-left">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
                          اطمینان {faDigits(Math.round(valuation.confidence * 100))}٪
                        </span>
                        <p className="mt-2 max-w-[15rem] text-[11px] leading-5 text-slate-500">
                          {valuation.basis === "neighborhood"
                            ? `پایهٔ محاسبه: ${faDigits(valuation.samples)} آگهی ثبت‌شده در ${form.neighborhood}`
                            : valuation.basis === "city"
                              ? `دادهٔ مستقیمی از ${form.neighborhood} نداشتیم؛ پایه، میانگین ${faDigits(valuation.samples)} آگهی ${form.city} است.`
                              : "پایه، میانگین کشوری آگهی‌هاست."}
                        </p>
                      </div>
                    </div>

                    <RangeBar v={valuation} user={userPrice} />
                  </div>

                  <details className="group rounded-2xl border border-white/10 bg-[#070b14]/60 p-5" open>
                    <summary className="cursor-pointer list-none text-sm font-bold text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/50">
                      چرا این عدد؟ <span className="text-xs font-normal text-slate-500">({faDigits(valuation.factors.length)} عامل مؤثر)</span>
                    </summary>
                    <ul className="mt-3 text-sm">
                      {[...valuation.factors]
                        .sort((a, b) => Math.abs(b.effectPct) - Math.abs(a.effectPct))
                        .map((f) => (
                          <li key={f.label} className="flex items-center justify-between gap-3 border-b border-white/5 py-2 last:border-0">
                            <span className="text-slate-300">{f.label}</span>
                            <span
                              dir="ltr"
                              className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${
                                f.effectPct >= 0 ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"
                              }`}
                            >
                              {f.effectPct >= 0 ? "▲" : "▼"} {faDigits(Math.abs(f.effectPct))}٪
                            </span>
                          </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-[11px] leading-5 text-slate-500">
                      برآورد ماشینی است و جای کارشناسی حضوری را نمی‌گیرد؛ عدد نهایی را خودتان تعیین می‌کنید.
                    </p>
                  </details>

                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Field
                      label={form.listingType === "rent" ? "اجارهٔ ماهانهٔ پیشنهادی شما (تومان)" : "قیمت پیشنهادی شما (تومان)"}
                      htmlFor="price"
                      error={errors.price}
                    >
                      <input
                        id="price"
                        className={`${INPUT} text-lg font-bold`}
                        inputMode="numeric"
                        value={faPrice(form.price)}
                        aria-invalid={!!errors.price}
                        placeholder={faDigits(valuation.fair.toLocaleString("en-US"))}
                        onChange={(e) => set("price", digitsOnly(e.target.value).slice(0, 15))}
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() => set("price", String(valuation.fair))}
                      className="h-[46px] rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-4 text-sm font-bold text-[#f0d080] transition hover:bg-[#c9a84c]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/50"
                    >
                      استفاده از قیمت منصفانه
                    </button>
                  </div>

                  {verdict ? (
                    <div
                      role="status"
                      className={`rounded-2xl border p-4 text-sm leading-7 ${
                        verdict.tone === "over"
                          ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
                          : verdict.tone === "above"
                            ? "border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#f0d080]"
                            : verdict.tone === "under"
                              ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
                              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                      }`}
                    >
                      <p className="font-bold">{verdict.title}</p>
                      <p className="mt-1 opacity-90">{verdict.detail}</p>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}

          {/* ── گام ۵ ── */}
          {step === 4 && (
            <div className="space-y-5">
              <Field label="عنوان آگهی" htmlFor="title" error={errors.title} hint="کوتاه، دقیق و بدون علامت تعجب — مثال: آپارتمان ۱۴۰ متری نوساز در سجاد">
                <input
                  id="title"
                  className={INPUT}
                  value={form.title}
                  aria-invalid={!!errors.title}
                  maxLength={80}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>

              <Field
                label="توضیحات"
                htmlFor="description"
                error={errors.description}
                hint={`${faDigits(form.description.trim().length)} نویسه نوشته‌اید — دست‌کم ۳۰ نویسه لازم است.`}
              >
                <textarea
                  id="description"
                  rows={5}
                  className={`${INPUT} resize-y leading-7`}
                  value={form.description}
                  aria-invalid={!!errors.description}
                  maxLength={1200}
                  placeholder="از نورگیری، بازسازی، دسترسی‌ها و وضعیت مدیریت ساختمان بنویسید…"
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>

              <div>
                <span className="mb-2 block text-sm font-medium text-slate-300">تصاویر ملک</span>
                <div className="rounded-2xl border border-dashed border-white/15 bg-[#070b14]/60 p-5 text-center">
                  <label
                    htmlFor="photos"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-2.5 text-sm font-bold text-[#f0d080] transition hover:bg-[#c9a84c]/20 focus-within:ring-2 focus-within:ring-[#c9a84c]/50"
                  >
                    <Icon d="M12 5v14M5 12h14" className="h-4 w-4" />
                    افزودن تصویر
                  </label>
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={onFiles}
                    aria-describedby="photos-note"
                  />
                  <p id="photos-note" className="mt-3 text-xs text-slate-500">
                    در نسخهٔ دمو تصاویر فقط پیش‌نمایش می‌شوند و جایی آپلود نمی‌شوند. حداکثر ۶ تصویر.
                  </p>
                </div>

                {photos.length > 0 ? (
                  <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {photos.map((p) => (
                      <li key={p.id} className="relative">
                        <img
                          src={p.url}
                          alt={`پیش‌نمایش ${p.name}`}
                          loading="lazy"
                          decoding="async"
                          className="h-20 w-full rounded-xl border border-white/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          aria-label={`حذف تصویر ${p.name}`}
                          className="absolute -top-2 -left-2 grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-[#0a0e1a] text-rose-300 transition hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                        >
                          <Icon d="M18 6 6 18M6 6l12 12" className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">
                    تصویری انتخاب نکرده‌اید؛ می‌توانید ادامه دهید — آگهی با تصویر پیش‌فرض منتشر می‌شود.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── گام ۶ ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-3">
                {PLANS.map((p) => {
                  const active = form.plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        set("plan", p.id);
                        setPaid(false);
                        setPaying(false);
                        setErrors((e) => ({ ...e, payment: "" }));
                      }}
                      aria-pressed={active}
                      className={`flex h-full flex-col rounded-2xl border p-5 text-right transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/60 ${
                        active
                          ? "border-[#c9a84c]/60 bg-[#c9a84c]/10 shadow-[0_0_30px_-10px_rgba(201,168,76,0.7)]"
                          : "border-white/10 bg-[#070b14]/60 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-lg font-black ${active ? "text-[#f0d080]" : "text-slate-200"}`}>{p.name}</span>
                        {p.badge ? (
                          <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            {p.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xl font-black text-slate-100">{p.price ? money(p.price) : "۰ تومان"}</p>
                      <p className="mt-1 text-xs text-slate-400">{p.tagline}</p>
                      <ul className="mt-4 space-y-2 text-xs leading-6 text-slate-400">
                        {p.perks.map((perk) => (
                          <li key={perk} className="flex gap-2">
                            <span className={active ? "text-[#f0d080]" : "text-emerald-400"} aria-hidden>
                              ✓
                            </span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {!needsPayment ? (
                <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-200">
                  آگهی شما رایگان منتشر می‌شود؛ در صورت فروش، ۰٫۵٪ کمیسیون از معامله محاسبه می‌شود.
                </p>
              ) : paid ? (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-emerald-400/50 bg-emerald-500/10 text-emerald-300">
                      <Icon d="M20 6 9 17l-5-5" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-emerald-200">پرداخت با موفقیت انجام شد</p>
                      <p className="text-xs text-emerald-300/80">رسید زیر را برای پیگیری نگه دارید.</p>
                    </div>
                  </div>
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <SummaryRow label="پلن" value={plan.name} />
                    <SummaryRow label="مبلغ" value={money(plan.price)} />
                    <SummaryRow label="کارت" value={DEMO_CARDS.find((c) => c.id === cardId)?.bank ?? "—"} />
                    <SummaryRow label="کد پیگیری پرداخت" value={faDigits(String(plan.price).slice(0, 4) + "۸۲۷۴۹")} />
                  </dl>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
                  <WalletCards holderName={user?.name ?? "کاربر مهمان"} selectedId={cardId} onSelect={setCardId} />

                  <div className="rounded-2xl border border-white/10 bg-[#070b14]/60 p-5">
                    <h3 className="text-sm font-bold text-slate-200">تسویهٔ پلن {plan.name}</h3>
                    <dl className="mt-3 grid gap-2 text-sm">
                      <SummaryRow label="مبلغ پلن" value={money(plan.price)} />
                      <SummaryRow label="مالیات بر ارزش افزوده" value="۰ تومان (دمو)" />
                      <SummaryRow label="کارت انتخاب‌شده" value={DEMO_CARDS.find((c) => c.id === cardId)?.label ?? "انتخاب نشده"} />
                    </dl>

                    <button
                      type="button"
                      onClick={startPayment}
                      disabled={!cardId || paying}
                      className="btn-gold mt-5 w-full rounded-xl px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080]"
                    >
                      {paying ? "در حال پردازش…" : `پرداخت ${money(plan.price)}`}
                    </button>

                    {paying ? (
                      <div role="status" aria-live="polite" className="mt-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                          <div className="h-full w-1/3 rounded-full bg-gradient-to-l from-[#8b6914] via-[#c9a84c] to-[#f0d080] motion-safe:animate-[scrollText_1.2s_linear_infinite]" />
                        </div>
                        <p className="mt-2 text-center text-xs text-slate-400">در حال اتصال به درگاه امن…</p>
                      </div>
                    ) : null}

                    {!cardId ? <p className="mt-3 text-xs text-slate-500">برای فعال‌شدن دکمهٔ پرداخت، یکی از کارت‌ها را انتخاب کنید.</p> : null}
                    {errors.payment ? (
                      <p role="alert" className="mt-3 text-xs font-medium text-rose-400">
                        {errors.payment}
                      </p>
                    ) : null}
                    <p className="mt-4 text-[11px] leading-5 text-slate-600">
                      این یک درگاه نمایشی است؛ هیچ تراکنش واقعی و هیچ اطلاعات بانکی‌ای ثبت یا ارسال نمی‌شود.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ناوبری */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/50"
          >
            بازگشت
          </button>

          <button type="button" onClick={onNext} className="btn-gold rounded-xl px-7 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080]">
            {step === STEPS.length - 1 ? "ثبت نهایی آگهی" : "مرحلهٔ بعد"}
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/3 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm font-bold text-slate-200">{value}</dd>
    </div>
  );
}
