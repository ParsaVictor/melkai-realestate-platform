/** ابزارهای نمایش فارسی — همه‌جای پروژه از همین‌ها استفاده کنید */

export const faDigits = (v: string | number) =>
  String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const enDigits = (v: string) =>
  v.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

/** ۸۵٬۰۰۰٬۰۰۰٬۰۰۰ → «۸۵ میلیارد تومان» */
export function toman(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "توافقی";
  if (n >= 1_000_000_000) {
    const b = n / 1_000_000_000;
    const s = b % 1 === 0 ? String(b) : b.toFixed(1);
    return `${faDigits(s)} میلیارد تومان`;
  }
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const s = m % 1 === 0 ? String(m) : m.toFixed(1);
    return `${faDigits(s)} میلیون تومان`;
  }
  return `${faDigits(n.toLocaleString("en-US"))} تومان`;
}

/** عدد کامل با جداکنندهٔ هزارگان فارسی */
export const money = (n: number) => faDigits(Math.round(n).toLocaleString("en-US")) + " تومان";

export const perMeter = (price: number, area: number) =>
  area > 0 ? money(Math.round(price / area)) : "—";

export const LISTING_LABEL: Record<string, string> = {
  sale: "فروش",
  rent: "اجاره",
  mortgage: "رهن کامل",
};

export const TYPE_LABEL: Record<string, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  office: "دفتر کار",
  shop: "مغازه",
  land: "زمین",
};

export const CITY_LABEL: Record<string, string> = {
  tehran: "تهران",
  mashhad: "مشهد",
  shiraz: "شیراز",
  isfahan: "اصفهان",
  kermanshah: "کرمانشاه",
  tabriz: "تبریز",
};

/** رنگ نشان امتیاز همسایگی */
export function scoreTone(score: number) {
  if (score >= 90) return { color: "#10b981", label: "عالی" };
  if (score >= 80) return { color: "#f0d080", label: "خوب" };
  if (score >= 70) return { color: "#f59e0b", label: "متوسط" };
  return { color: "#fb7185", label: "نیازمند توجه" };
}
