"use client";

import { useState } from "react";

const CITIES = [
  { value: "tehran", label: "تهران" },
  { value: "mashhad", label: "مشهد" },
  { value: "shiraz", label: "شیراز" },
  { value: "isfahan", label: "اصفهان" },
  { value: "kermanshah", label: "کرمانشاه" },
  { value: "tabriz", label: "تبریز" },
];

const NEIGHBORHOODS: Record<string, string[]> = {
  tehran: ["الهیه", "نیاوران", "زعفرانیه", "جردن", "ونک", "سعادت‌آباد", "شهرک غرب", "ولنجک"],
  mashhad: ["احمدآباد", "وکیل‌آباد", "هاشمیه", "سجاد", "قاسم‌آباد", "الهیه"],
  shiraz: ["معالی‌آباد", "قصردشت", "عفیف‌آباد", "فرهنگ‌شهر", "زرگری", "چمران"],
  isfahan: ["مرداویج", "سعادت‌آباد", "خانه اصفهان", "ملک‌شهر", "کاوه", "چهارباغ"],
  kermanshah: ["الهیه", "شهرک ژاندارمری", "دولت‌آباد", "طاق‌بستان"],
  tabriz: ["ولیعصر", "ائل‌گلی", "رشدیه", "باغمیشه", "زعفرانیه"],
};

const PROPERTY_TYPES = [
  { value: "all", label: "همه انواع" },
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "office", label: "دفتر کار" },
  { value: "shop", label: "مغازه" },
  { value: "land", label: "زمین" },
];

const LISTING_TYPES = [
  { value: "sale", label: "خرید" },
  { value: "rent", label: "اجاره" },
  { value: "mortgage", label: "رهن کامل" },
  { value: "all", label: "همه" },
];

const ROOMS = [
  { value: "", label: "فرقی ندارد" },
  { value: "1", label: "۱ خوابه" },
  { value: "2", label: "۲ خوابه" },
  { value: "3", label: "۳ خوابه" },
  { value: "4", label: "۴ خوابه" },
  { value: "5", label: "۵ خوابه و بیشتر" },
];

function NumField({ value, onChange, placeholder, unit, id }: {
  value: string; onChange: (v: string) => void; placeholder: string; unit: string; id: string;
}) {
  const pretty = value ? Number(value).toLocaleString("fa-IR") : "";
  return (
    <div className="relative">
      <input
        id={id}
        inputMode="numeric"
        value={pretty}
        onChange={(e) => onChange(e.target.value.replace(/[^\d۰-۹]/g, "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))))}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-[#070b14] py-2.5 pr-3 pl-12 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/25"
      />
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
        {unit}
      </span>
    </div>
  );
}

const fieldCls =
  "w-full rounded-xl border border-white/15 bg-[#070b14] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/25";
const labelCls = "mb-1.5 block text-[11px] font-semibold text-slate-400";

export default function SearchSection({ embedded = false }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState("sale");
  const [city, setCity] = useState("tehran");
  const [searchText, setSearchText] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [rooms, setRooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [celebFilter, setCelebFilter] = useState(false);

  const activeCount =
    [rooms, minArea, maxArea, minPrice, maxPrice].filter(Boolean).length + (celebFilter ? 1 : 0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("search", searchText);
    if (city) params.set("city", city);
    if (activeTab !== "all") params.set("listingType", activeTab);
    if (propertyType !== "all") params.set("propertyType", propertyType);
    if (rooms) params.set("bedrooms", rooms);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (celebFilter) params.set("celebNeighbor", "true");
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("propertySearch", { detail: Object.fromEntries(params) }));
  };

  const reset = () => {
    setRooms(""); setMinArea(""); setMaxArea(""); setMinPrice(""); setMaxPrice(""); setCelebFilter(false);
  };

  const card = (
    <div className="rounded-3xl border border-white/12 bg-[#0d1424]/92 p-4 shadow-[0_30px_90px_-35px_rgba(0,0,0,.95)] backdrop-blur-xl md:p-5">
      <div className="mb-4 flex gap-1 rounded-xl border border-white/10 bg-[#070b14] p-1" role="tablist" aria-label="نوع معامله">
        {LISTING_TYPES.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={activeTab === t.value}
            onClick={() => setActiveTab(t.value)}
            className={`flex-1 rounded-lg px-2 py-2 text-[13px] font-bold transition-all duration-300 ${
              activeTab === t.value
                ? "bg-gradient-to-l from-[#c9a84c] to-[#f0d080] text-[#0a0e1a] shadow-[0_6px_18px_-6px_rgba(201,168,76,.85)]"
                : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="f-city" className={labelCls}>شهر</label>
          <select id="f-city" value={city} onChange={(e) => setCity(e.target.value)} className={fieldCls}>
            {CITIES.map((c) => <option key={c.value} value={c.value} className="bg-[#0a0e1a]">{c.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-type" className={labelCls}>نوع ملک</label>
          <select id="f-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={fieldCls}>
            {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value} className="bg-[#0a0e1a]">{t.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="f-q" className={labelCls}>محله یا کلیدواژه</label>
        <input
          id="f-q"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="مثلاً الهیه، نوساز، نزدیک مترو…"
          className={fieldCls}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(NEIGHBORHOODS[city] ?? []).slice(0, 6).map((n) => (
          <button
            key={n}
            onClick={() => setSearchText(n)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-200 ${
              searchText === n
                ? "border-[#c9a84c] bg-[#c9a84c]/20 text-[#f0d080]"
                : "border-white/12 bg-white/[0.04] text-slate-400 hover:border-[#c9a84c]/50 hover:text-white"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* فیلتر پیشرفته — بالای دکمهٔ جستجو */}
      <button
        onClick={() => setShowAdvanced((v) => !v)}
        aria-expanded={showAdvanced}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/[0.05] px-4 py-2.5 text-[13px] font-bold text-slate-200 transition-all hover:border-[#c9a84c]/60 hover:bg-white/[0.1] hover:text-white"
      >
        فیلتر پیشرفته
        {activeCount > 0 && (
          <span className="rounded-full bg-[#c9a84c] px-1.5 py-0.5 text-[10px] font-black text-[#0a0e1a]">
            {activeCount.toLocaleString("fa-IR")}
          </span>
        )}
        <svg className={`h-4 w-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}
             fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showAdvanced && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-[#070b14]/80 p-4">
          <div className="grid gap-3">
            <div>
              <label htmlFor="f-rooms" className={labelCls}>تعداد اتاق خواب</label>
              <select id="f-rooms" value={rooms} onChange={(e) => setRooms(e.target.value)} className={fieldCls}>
                {ROOMS.map((r) => <option key={r.value} value={r.value} className="bg-[#0a0e1a]">{r.label}</option>)}
              </select>
            </div>
            <div>
              <span className={labelCls}>زیربنا — از چند متر تا چند متر؟</span>
              <div className="grid grid-cols-2 gap-2">
                <NumField id="f-min-area" value={minArea} onChange={setMinArea} placeholder="از" unit="متر" />
                <NumField id="f-max-area" value={maxArea} onChange={setMaxArea} placeholder="تا" unit="متر" />
              </div>
            </div>
            <div>
              <span className={labelCls}>بودجه — از چه قیمتی تا چه قیمتی؟</span>
              <div className="grid grid-cols-2 gap-2">
                <NumField id="f-min-price" value={minPrice} onChange={setMinPrice} placeholder="از" unit="تومان" />
                <NumField id="f-max-price" value={maxPrice} onChange={setMaxPrice} placeholder="تا" unit="تومان" />
              </div>
            </div>
          </div>

          <label className="mt-3 flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition-colors hover:border-[#c9a84c]/40">
            <input type="checkbox" checked={celebFilter} onChange={(e) => setCelebFilter(e.target.checked)} className="h-4 w-4 accent-[#c9a84c]" />
            <span className="text-[12px] text-slate-200">
              فقط ساختمان‌های دارای <span className="font-bold text-[#c9a84c]">ساکن شاخص تأییدشده</span>
            </span>
          </label>

          {activeCount > 0 && (
            <button onClick={reset} className="mt-2 w-full py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:text-white">
              پاک کردن فیلترها
            </button>
          )}
        </div>
      )}

      <button
        onClick={handleSearch}
        className="btn-gold mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-base font-black"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        جستجوی ملک
      </button>

      <p className="mt-2.5 text-center text-[11px] text-slate-500">
        رایگان · بدون ثبت‌نام · فقط آگهی‌های تأییدشده
      </p>
    </div>
  );

  if (embedded) return card;

  return (
    <section id="search" className="relative z-20 mx-4 mt-6 max-w-3xl pb-4 md:mx-auto" aria-label="جستجوی ملک">
      {card}
    </section>
  );
}
