"use client";


import Link from "next/link";
import { useStore } from "@/lib/store";
import PropertyQuickView from "@/components/PropertyQuickView";
import { useState, useEffect } from "react";
import type { Property } from "@/db/schema";

interface Props {
  properties: Property[];
  loading: boolean;
}

function formatPrice(price: number | null, listingType: string | null) {
  if (!price) return "توافقی";
  if (listingType === "rent") {
    return `${(price / 1000000).toFixed(0)} میلیون / ماه`;
  }
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} میلیارد تومان`;
  }
  return `${(price / 1000000).toFixed(0)} میلیون تومان`;
}

function PropertyCard({ property, onView }: { property: Property; onView: (id: number) => void }) {
  const { isSaved, toggleSaved, inCompare, toggleCompare, ready } = useStore();
  const liked = ready && isSaved(property.id);
  const [cmpMsg, setCmpMsg] = useState("");
  const [imgError, setImgError] = useState(false);

  const listingBadge = {
    sale: { label: "فروش", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    rent: { label: "اجاره", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    mortgage: { label: "رهن کامل", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  }[property.listingType ?? "sale"] ?? { label: "فروش", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };

  const propertyIcons = {
    apartment: "🏢",
    villa: "🏡",
    office: "🏬",
    shop: "🏪",
    land: "🌍",
  };

  return (
    <div className="property-card rounded-3xl overflow-hidden">
      {/* Image */}
      <div className="relative h-56 overflow-hidden group">
        {!imgError && property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-6xl">
              {propertyIcons[property.propertyType ?? "apartment"]}
            </span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>

        {/* Badges top */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${listingBadge.color}`}>
            {listingBadge.label}
          </span>
          {property.hasCelebNeighbor && (
            <span
              className="celeb-badge flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold text-white"
              title="این ساختمان ساکن شاخصِ تأییدشده دارد — هویت و واحد افشا نمی‌شود"
            >
              ⭐ ساکن شاخص
            </span>
          )}
          {property.featured && (
            <span className="bg-[#c9a84c]/20 border border-[#c9a84c]/50 px-3 py-1 rounded-lg text-xs font-bold text-[#c9a84c]">
              🔥 ویژه
            </span>
          )}
        </div>

        {/* Like button */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleSaved(property.id); }}
            aria-pressed={liked}
            aria-label={liked ? "حذف از نشان‌شده‌ها" : "نشان‌کردن این ملک"}
            title={liked ? "حذف از نشان‌شده‌ها" : "نشان‌کردن"}
            className="glass flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          >
            <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              const r = toggleCompare(property.id);
              if (!r.ok && r.reason) { setCmpMsg(r.reason); setTimeout(() => setCmpMsg(""), 2600); }
            }}
            aria-pressed={ready && inCompare(property.id)}
            aria-label="افزودن به مقایسه"
            title="افزودن به مقایسه"
            className={`glass flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all duration-300 hover:scale-110 ${
              ready && inCompare(property.id) ? "text-[#f0d080]" : "text-slate-300"
            }`}
          >
            ⇄
          </button>
        </div>
        {cmpMsg && (
          <div className="absolute inset-x-3 top-16 z-10 rounded-lg bg-rose-500/90 px-3 py-1.5 text-center text-[11px] text-white">
            {cmpMsg}
          </div>
        )}

        {/* View count */}
        <div className="absolute bottom-3 left-3 glass px-2 py-1 rounded-lg text-xs text-slate-300 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {(property.viewCount ?? 0).toLocaleString("fa-IR")}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-white text-lg mb-2 leading-tight line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-slate-400 mb-3">
          <svg className="w-4 h-4 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.neighborhood} - {property.city}</span>
        </div>

        {/* نشان ساکن شاخص — بدون نام و بدون شمارهٔ واحد (حریم خصوصی ساکنین) */}
        {property.hasCelebNeighbor && (
          <div className="celeb-badge mb-3 inline-flex items-center gap-2 rounded-lg px-2.5 py-1">
            <span className="text-sm">🌟</span>
            <span className="text-[11px] font-bold text-white">ساکن شاخص تأییدشده</span>
          </div>
        )}

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "📐", value: `${property.area} م²`, label: "متراژ" },
            { icon: "🛏", value: `${property.bedrooms} خواب`, label: "اتاق" },
            { icon: "🏗", value: `طبقه ${property.floor}`, label: "طبقه" },
          ].map((spec) => (
            <div key={spec.label} className="bg-white/3 rounded-xl p-2 text-center">
              <div className="text-sm mb-0.5">{spec.icon}</div>
              <div className="text-xs font-bold text-white">{spec.value}</div>
              <div className="text-[10px] text-slate-400">{spec.label}</div>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="mb-3 hidden flex-wrap gap-2 xl:flex">
          {property.parking && <span className="tag-badge">🚗 پارکینگ</span>}
          {property.elevator && <span className="tag-badge">🛗 آسانسور</span>}
          {property.balcony && <span className="tag-badge">🌿 بالکن</span>}
          {property.storage && <span className="tag-badge">📦 انباری</span>}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">قیمت</div>
            <div className="text-[#c9a84c] font-black text-lg">
              {formatPrice(property.price, property.listingType)}
            </div>
          </div>
          <button
            onClick={() => onView(property.id)}
            className="btn-gold rounded-xl px-5 py-2.5 text-sm font-bold"
            aria-label={`پیش‌نمایش ${property.title}`}
          >
            مشاهده
          </button>
        </div>

        {/* Agent */}
        {property.agentName && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-xs text-[#c9a84c] font-bold">
              {property.agentName[0]}
            </div>
            <span className="text-xs text-slate-400">{property.agentName}</span>
            <a
              href={`tel:${property.agentPhone}`}
              className="mr-auto text-xs text-[#c9a84c] hover:text-[#f0d080] transition-colors flex items-center gap-1"
            >
              📞 تماس
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="property-card rounded-3xl overflow-hidden">
      <div className="h-56 shimmer bg-slate-800"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-800 rounded shimmer"></div>
        <div className="h-4 bg-slate-800 rounded shimmer w-2/3"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 bg-slate-800 rounded shimmer"></div>
          <div className="h-14 bg-slate-800 rounded shimmer"></div>
          <div className="h-14 bg-slate-800 rounded shimmer"></div>
        </div>
        <div className="h-10 bg-slate-800 rounded shimmer"></div>
      </div>
    </div>
  );
}

export default function FeaturedProperties({ properties, loading }: Props) {
  const [quickId, setQuickId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filteredProps, setFilteredProps] = useState<Property[]>(properties);

  useEffect(() => {
    setFilteredProps(properties);
  }, [properties]);

  useEffect(() => {
    const handleSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      fetch(`/api/properties?${new URLSearchParams(detail)}`)
        .then(r => r.json())
        .then(data => setFilteredProps(data.properties || []));
    };
    window.addEventListener("propertySearch", handleSearch);
    return () => window.removeEventListener("propertySearch", handleSearch);
  }, []);

  const tabs = [
    { value: "all", label: "همه" },
    { value: "sale", label: "فروش" },
    { value: "rent", label: "اجاره" },
    { value: "mortgage", label: "رهن کامل" },
    { value: "featured", label: "⭐ ویژه" },
    { value: "celeb", label: "🌟 ساکن شاخص" },
  ];

  const displayed = filteredProps.filter(p => {
    if (filter === "all") return true;
    if (filter === "featured") return p.featured;
    if (filter === "celeb") return p.hasCelebNeighbor;
    return p.listingType === filter;
  });

  return (
    <section id="properties" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-4">
          <span className="text-[#c9a84c] text-sm">🏠</span>
          <span className="text-sm text-[#c9a84c]">آخرین ملک‌های ثبت‌شده</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          <span className="gold-text-gradient">ملک‌های</span>{" "}
          <span className="text-white">برگزیده</span>
        </h2>
        <div className="section-divider mb-4"></div>
        <p className="text-slate-400 max-w-lg mx-auto">
          بهترین فرصت‌های سرمایه‌گذاری در محله‌های برتر تهران
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              filter === tab.value
                ? "tab-active"
                : "glass text-slate-400 hover:text-white hover:border-[#c9a84c]/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="mr-auto text-sm text-slate-500 flex items-center">
          {displayed.length} ملک پیدا شد
        </div>
      </div>

      {/* Properties grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🏚</div>
          <h3 className="text-xl text-slate-400 mb-2">ملکی یافت نشد</h3>
          <p className="text-slate-500">فیلترها را تغییر دهید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(showAll ? displayed : displayed.slice(0, 3)).map((property) => (
            <PropertyCard key={property.id} property={property} onView={setQuickId} />
          ))}
        </div>
      )}

      {/* Load more */}
      {displayed.length > 3 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="glass inline-block rounded-xl border border-[#c9a84c]/20 px-8 py-3 text-sm font-semibold text-[#c9a84c] transition-all duration-300 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5"
          >
            {showAll
              ? "نمایش کمتر"
              : `مشاهدهٔ همهٔ ${displayed.length.toLocaleString("fa-IR")} آگهی`}
          </button>
        </div>
      )}
      <PropertyQuickView id={quickId} onClose={() => setQuickId(null)} />

    </section>
  );
}
