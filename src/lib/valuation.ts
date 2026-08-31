/**
 * موتور برآورد قیمت ملک — کاملاً خالص (بدون Date، بدون شبکه، بدون localStorage)
 * تا هم روی static export قابل اجرا باشد و هم خروجی‌اش تکرارپذیر بماند.
 *
 * منطق: پایهٔ قیمت متری از میانهٔ دادهٔ واقعی همان محله می‌آید؛ اگر محله دادهٔ فروش
 * نداشت از میانهٔ شهر و در نهایت از میانهٔ کشوری استفاده می‌شود. سپس ضرایب سن بنا،
 * طبقه، امکانات، متراژ و امتیاز همسایگی به‌صورت ضربی اعمال می‌شوند.
 */

import { properties } from "@/data/properties";
import { faDigits } from "@/lib/format";

/** سال جاری شمسی — ثابت نگه داشته شده تا تابع estimate خالص بماند */
export const CURRENT_JALALI_YEAR = 1405;

export type PropertyType = "apartment" | "villa" | "office" | "shop" | "land";
export type ListingType = "sale" | "rent" | "mortgage";
export type Basis = "neighborhood" | "city" | "country";

export type ValuationInput = {
  city: string;
  neighborhood: string;
  propertyType: PropertyType;
  listingType: ListingType;
  area: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  parking?: boolean;
  storage?: boolean;
  balcony?: boolean;
  elevator?: boolean;
  renovated?: boolean;
  /** اگر ندهید از امتیاز ثبت‌شدهٔ همان محله استفاده می‌شود */
  neighborScore?: number;
};

export type Factor = { label: string; effectPct: number };

export type Valuation = {
  low: number;
  fair: number;
  high: number;
  perMeter: number;
  factors: Factor[];
  confidence: number;
  /** اطلاعات کمکی برای نمایش «چرا این عدد؟» */
  basis: Basis;
  samples: number;
  basePerMeter: number;
};

export const CITIES = ["تهران", "مشهد", "شیراز", "اصفهان", "کرمانشاه", "تبریز"] as const;

/**
 * شاخص نوع ملک نسبت به آپارتمان. دادهٔ فروشِ دفتر/مغازه/زمین در نمونه نداریم،
 * پس این‌ها ثابت کارشناسی‌اند؛ ویلا از خود داده درآمده (~۰٫۸ متری آپارتمان).
 */
const TYPE_INDEX: Record<PropertyType, number> = {
  apartment: 1,
  villa: 0.8,
  office: 1.1,
  shop: 1.75,
  land: 0.55,
};

/** tilt = جایگاه محله نسبت به میانهٔ شهر؛ فقط وقتی محله دادهٔ مستقیم ندارد اثر می‌گذارد */
const HOODS: Record<string, { name: string; tilt: number }[]> = {
  تهران: [
    { name: "الهیه", tilt: 1 },
    { name: "نیاوران", tilt: 1 },
    { name: "زعفرانیه", tilt: 1 },
    { name: "جردن", tilt: 1 },
    { name: "ولنجک", tilt: 1 },
    { name: "شهرک غرب", tilt: 1 },
    { name: "فرمانیه", tilt: 1.05 },
    { name: "اقدسیه", tilt: 1.0 },
    { name: "پاسداران", tilt: 1.02 },
    { name: "دروس", tilt: 0.98 },
    { name: "میرداماد", tilt: 0.96 },
    { name: "ونک", tilt: 0.95 },
    { name: "سعادت‌آباد", tilt: 0.92 },
    { name: "تجریش", tilt: 0.9 },
    { name: "یوسف‌آباد", tilt: 0.78 },
  ],
  مشهد: [
    { name: "احمدآباد", tilt: 1 },
    { name: "وکیل‌آباد", tilt: 1 },
    { name: "سجاد", tilt: 1.12 },
    { name: "هاشمیه", tilt: 1.05 },
    { name: "فرهنگ", tilt: 1.0 },
    { name: "الهیه", tilt: 0.95 },
    { name: "کوهسنگی", tilt: 0.9 },
  ],
  شیراز: [
    { name: "معالی‌آباد", tilt: 1 },
    { name: "قصردشت", tilt: 1 },
    { name: "عفیف‌آباد", tilt: 1.08 },
    { name: "فرهنگ‌شهر", tilt: 1.0 },
    { name: "زرگری", tilt: 0.95 },
    { name: "قدوسی غربی", tilt: 0.9 },
  ],
  اصفهان: [
    { name: "مرداویج", tilt: 1 },
    { name: "چهارباغ", tilt: 1.05 },
    { name: "آبشار", tilt: 1.02 },
    { name: "خانهٔ اصفهان", tilt: 0.8 },
    { name: "کاوه", tilt: 0.75 },
    { name: "ملک‌شهر", tilt: 0.72 },
  ],
  کرمانشاه: [
    { name: "الهیه", tilt: 1 },
    { name: "طاق‌بستان", tilt: 1.05 },
    { name: "شهرک تعاون", tilt: 0.95 },
    { name: "فرهنگیان", tilt: 0.9 },
    { name: "مسکن", tilt: 0.85 },
    { name: "دولت‌آباد", tilt: 0.7 },
  ],
  تبریز: [
    { name: "ائل‌گلی", tilt: 1 },
    { name: "رشدیه", tilt: 1.05 },
    { name: "ولیعصر", tilt: 0.95 },
    { name: "باغمیشه", tilt: 0.9 },
    { name: "منظریه", tilt: 0.88 },
    { name: "ابوریحان", tilt: 0.8 },
  ],
};

export const NEIGHBORHOODS: Record<string, string[]> = Object.fromEntries(
  Object.entries(HOODS).map(([city, list]) => [city, list.map((h) => h.name)]),
);

// ── استخراج پایه‌ها از دادهٔ واقعی ───────────────────────────────────────────

type RawProp = {
  city: string;
  neighborhood: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  area: number;
  neighborScore: number;
};

const RAW = properties as unknown as RawProp[];

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * هر نمونه به «معادل آپارتمان» نرمال می‌شود، وگرنه محله‌ای که تنها آگهی‌اش ویلاست
 * (مثل نیاوران) پایهٔ متری‌اش را پایین‌تر از واقع نشان می‌دهد.
 */
type Row = { city: string; hood: string; listing: ListingType; perMeter: number };

const ROWS: Row[] = RAW.filter((p) => p.area > 0).map((p) => ({
  city: p.city,
  hood: p.neighborhood,
  listing: p.listingType,
  perMeter: p.price / p.area / TYPE_INDEX[p.propertyType],
}));

const SALE_ROWS = ROWS.filter((r) => r.listing === "sale");
const GLOBAL_SALE = median(SALE_ROWS.map((r) => r.perMeter)) || 120_000_000;

/** نسبت اجاره/رهن به قیمت فروش — از میانهٔ داده درمی‌آید تا با بازار همین دمو بخواند */
function ratioOf(listing: ListingType, fallback: number): number {
  const xs = ROWS.filter((r) => r.listing === listing).map((r) => r.perMeter);
  return xs.length ? median(xs) / GLOBAL_SALE : fallback;
}

const LISTING_RATIO: Record<ListingType, number> = {
  sale: 1,
  rent: ratioOf("rent", 0.005),
  mortgage: ratioOf("mortgage", 0.18),
};

const CITY_ROWS = new Map<string, number[]>();
const HOOD_ROWS = new Map<string, number[]>();
const HOOD_SCORE = new Map<string, number>();

for (const r of SALE_ROWS) {
  const c = CITY_ROWS.get(r.city) ?? [];
  c.push(r.perMeter);
  CITY_ROWS.set(r.city, c);

  const k = `${r.city}|${r.hood}`;
  const h = HOOD_ROWS.get(k) ?? [];
  h.push(r.perMeter);
  HOOD_ROWS.set(k, h);
}

for (const p of RAW) HOOD_SCORE.set(`${p.city}|${p.neighborhood}`, p.neighborScore);

function tiltOf(city: string, hood: string): number {
  return HOODS[city]?.find((h) => h.name === hood)?.tilt ?? 1;
}

/** امتیاز همسایگی محله: اگر در داده هست همان، وگرنه از جایگاه محله برآورد می‌شود */
export function hoodScore(city: string, hood: string): number {
  const known = HOOD_SCORE.get(`${city}|${hood}`);
  if (known) return known;
  const est = Math.round(76 + (tiltOf(city, hood) - 0.7) * 30);
  return Math.min(95, Math.max(74, est));
}

/** گرد کردن به سه رقم معنادار تا عدد برآورد، دقتی بیش از واقع وانمود نکند */
function roundSig(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 0;
  const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 2));
  return Math.round(v / mag) * mag;
}

// ── تابع اصلی ────────────────────────────────────────────────────────────────

export function estimate(input: ValuationInput): Valuation {
  const area = Math.max(1, Math.round(input.area || 0));
  const type = input.propertyType;
  const listing = input.listingType;

  const hoodRows = HOOD_ROWS.get(`${input.city}|${input.neighborhood}`) ?? [];
  const cityRows = CITY_ROWS.get(input.city) ?? [];

  let base: number;
  let basis: Basis;
  let samples: number;
  let tilt = 1;

  if (hoodRows.length) {
    base = median(hoodRows);
    basis = "neighborhood";
    samples = hoodRows.length;
  } else if (cityRows.length) {
    base = median(cityRows);
    basis = "city";
    samples = cityRows.length;
    tilt = tiltOf(input.city, input.neighborhood);
  } else {
    base = GLOBAL_SALE;
    basis = "country";
    samples = SALE_ROWS.length;
    tilt = tiltOf(input.city, input.neighborhood);
  }

  const factors: Factor[] = [];
  const push = (label: string, pct: number) => {
    if (Math.abs(pct) >= 0.5) factors.push({ label, effectPct: Math.round(pct * 10) / 10 });
  };

  // جایگاه محله (فقط وقتی پایه از شهر آمده)
  push(`جایگاه محلهٔ ${input.neighborhood} در ${input.city}`, (tilt - 1) * 100);

  // سن بنا
  const built = input.yearBuilt ?? CURRENT_JALALI_YEAR;
  const age = Math.max(0, CURRENT_JALALI_YEAR - built);
  if (type !== "land") {
    const ageEffect = age <= 1 ? 7 : age <= 3 ? 3 : age <= 7 ? 0 : age <= 12 ? -6 : age <= 20 ? -13 : -20;
    const ageLabel = age <= 1 ? "نوساز (کمتر از یک سال)" : `سن بنا: ${faDigits(age)} سال`;
    push(ageLabel, ageEffect);

    if (input.renovated) push("بازسازی‌شده", age > 7 ? 6 : 2);
  }

  // طبقه — فقط برای ملک‌های طبقاتی معنا دارد
  const floor = input.floor ?? 1;
  const totalFloors = Math.max(input.totalFloors ?? 1, floor || 1);
  if (type === "apartment" || type === "office") {
    if (floor <= 0) push("واحد همکف", -5);
    else if (floor > 3 && !input.elevator) push("طبقهٔ بالا بدون آسانسور", -12);
    else if (floor === totalFloors && floor > 2) push("طبقهٔ آخر با اشراف", 4);
    else if (floor / totalFloors >= 0.4) push("طبقهٔ میانی به بالا", 2);
  }

  // امکانات
  if (type !== "land") {
    push(input.parking ? "پارکینگ اختصاصی" : "بدون پارکینگ", input.parking ? 7 : -7);
    if (totalFloors >= 4 && (type === "apartment" || type === "office")) {
      push(input.elevator ? "آسانسور" : "بدون آسانسور", input.elevator ? 4 : -6);
    }
    push(input.storage ? "انباری" : "بدون انباری", input.storage ? 2 : -2);
    if (input.balcony) push("بالکن / تراس", 2);
  }

  // متراژ — واحد کوچک متری گران‌تر و واحد بسیار بزرگ متری ارزان‌تر است
  const areaEffect = area < 55 ? 6 : area <= 120 ? 0 : area <= 200 ? -2 : area <= 350 ? -5 : -9;
  push(`متراژ ${faDigits(area)} متر`, areaEffect);

  // امتیاز همسایگی
  const score = input.neighborScore ?? hoodScore(input.city, input.neighborhood);
  const scoreEffect = Math.max(-12, Math.min(12, (score - 85) * 0.9));
  push(`امتیاز همسایگی ${faDigits(score)}`, scoreEffect);

  const multiplier = factors.reduce((m, f) => m * (1 + f.effectPct / 100), 1);
  const rawPerMeter = base * TYPE_INDEX[type] * LISTING_RATIO[listing] * multiplier;
  const fair = roundSig(rawPerMeter * area);

  // اطمینان: هرچه نمونهٔ نزدیک‌تر و بیشتر، بازه تنگ‌تر
  let confidence =
    basis === "neighborhood" ? (samples >= 2 ? 0.86 : 0.74) : basis === "city" ? (samples >= 2 ? 0.64 : 0.56) : 0.42;
  const hasDirectListingData = ROWS.some((r) => r.city === input.city && r.listing === listing);
  if (listing !== "sale" && !hasDirectListingData) confidence -= 0.06;
  if (area > 400 || area < 35) confidence -= 0.05;
  confidence = Math.round(Math.min(0.92, Math.max(0.35, confidence)) * 100) / 100;

  const spread = 0.2 - confidence * 0.11;

  return {
    low: roundSig(fair * (1 - spread)),
    fair,
    high: roundSig(fair * (1 + spread)),
    perMeter: Math.round(fair / area),
    factors,
    confidence,
    basis,
    samples,
    basePerMeter: Math.round(base * TYPE_INDEX[type] * LISTING_RATIO[listing]),
  };
}

// ── داوری قیمت پیشنهادی کاربر ────────────────────────────────────────────────

export type Verdict = {
  tone: "over" | "above" | "fair" | "under";
  title: string;
  detail: string;
};

/** قیمت وارد‌شدهٔ کاربر را با بازهٔ برآورد می‌سنجد و پیام مهربان فارسی می‌دهد */
export function priceVerdict(userPrice: number, v: Valuation, perMeterText: string): Verdict {
  if (userPrice > v.high * 1.15) {
    return {
      tone: "over",
      title: "احتمال فروش کندتر",
      detail: `قیمت شما بیش از ۱۵٪ بالاتر از سقف برآورد ماست. میانگین بازار این محله حدود ${perMeterText} برای هر متر است — با این عدد آگهی دیده می‌شود ولی معمولاً دیرتر به نتیجه می‌رسد.`,
    };
  }
  if (userPrice > v.high) {
    return {
      tone: "above",
      title: "کمی بالاتر از بازار",
      detail: `کمی بالاتر از سقف برآورد است، اما در محدودهٔ چانه‌زنی می‌گنجد. متری ${perMeterText} میانگین این محله است.`,
    };
  }
  if (userPrice < v.low * 0.85) {
    return {
      tone: "under",
      title: "زیر قیمت",
      detail: `این عدد به‌طور محسوسی پایین‌تر از کف برآورد است. اگر عجله ندارید، پیشنهاد می‌کنیم دست‌کم تا کف بازه بالا بیایید — متری ${perMeterText}.`,
    };
  }
  return {
    tone: "fair",
    title: "در بازهٔ منصفانه",
    detail: "قیمت شما با برآورد بازار هم‌خوان است؛ شانس خوبی برای جذب خریدار جدی دارید.",
  };
}
