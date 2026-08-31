"use client";

import { useState } from "react";

const NEIGHBORHOODS = [
  {
    name: "الهیه",
    avgPrice: "۳۵۰ میلیون",
    priceUnit: "هر متر",
    count: 234,
    trend: "+۱۲%",
    trendUp: true,
    emoji: "👑",
    description: "گران‌ترین و مرفه‌ترین محله تهران",
    color: "from-yellow-600/20 to-amber-900/20",
    borderColor: "border-yellow-500/20",
    badge: "VIP",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    celebrities: 12,
  },
  {
    name: "نیاوران",
    avgPrice: "۲۸۰ میلیون",
    priceUnit: "هر متر",
    count: 187,
    trend: "+۸%",
    trendUp: true,
    emoji: "🌿",
    description: "سرسبزترین محله شمال تهران",
    color: "from-green-600/20 to-green-900/20",
    borderColor: "border-green-500/20",
    badge: "طبیعی",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    celebrities: 8,
  },
  {
    name: "زعفرانیه",
    avgPrice: "۳۱۰ میلیون",
    priceUnit: "هر متر",
    count: 156,
    trend: "+۱۵%",
    trendUp: true,
    emoji: "💎",
    description: "ترکیب مدرنیته و طبیعت",
    color: "from-blue-600/20 to-blue-900/20",
    borderColor: "border-blue-500/20",
    badge: "لوکس",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    celebrities: 10,
  },
  {
    name: "جردن",
    avgPrice: "۲۴۰ میلیون",
    priceUnit: "هر متر",
    count: 298,
    trend: "+۶%",
    trendUp: true,
    emoji: "🏙",
    description: "مرکز تجاری و رفاهی پایتخت",
    color: "from-purple-600/20 to-purple-900/20",
    borderColor: "border-purple-500/20",
    badge: "تجاری",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    celebrities: 6,
  },
  {
    name: "سعادت‌آباد",
    avgPrice: "۱۸۰ میلیون",
    priceUnit: "هر متر",
    count: 412,
    trend: "+۴%",
    trendUp: true,
    emoji: "🏘",
    description: "محله خانوادگی با دسترسی عالی",
    color: "from-teal-600/20 to-teal-900/20",
    borderColor: "border-teal-500/20",
    badge: "خانوادگی",
    badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    celebrities: 3,
  },
  {
    name: "ونک",
    avgPrice: "۲۱۰ میلیون",
    priceUnit: "هر متر",
    count: 325,
    trend: "+۹%",
    trendUp: true,
    emoji: "🚇",
    description: "با بهترین دسترسی حمل‌ونقل",
    color: "from-red-600/20 to-red-900/20",
    borderColor: "border-red-500/20",
    badge: "حمل‌ونقل",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    celebrities: 4,
  },
];

export default function NeighborhoodSection() {
  const [activeNeighborhood, setActiveNeighborhood] = useState(0);
  const [sortBy, setSortBy] = useState("price");

  const selected = NEIGHBORHOODS[activeNeighborhood];

  return (
    <section id="neighborhoods" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/generated/neighborhood-map.webp"
          alt="Map"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0a0e1a 0%, rgba(10,14,26,0.7) 50%, #0a0e1a 100%)" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-4">
            <span className="text-[#c9a84c]">📍</span>
            <span className="text-sm text-[#c9a84c]">کاوش محله‌ها</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">بهترین</span>{" "}
            <span className="gold-text-gradient">محله‌های تهران</span>
          </h2>
          <div className="section-divider mb-4"></div>
          <p className="text-slate-400 max-w-lg mx-auto">
            تحلیل هوشمند قیمت، روند بازار و کیفیت زندگی در هر محله
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Neighborhood list */}
          <div className="space-y-3">
            {NEIGHBORHOODS.map((n, i) => (
              <div
                key={n.name}
                onClick={() => setActiveNeighborhood(i)}
                className={`neighborhood-card p-4 cursor-pointer transition-all duration-300 ${
                  activeNeighborhood === i
                    ? `bg-gradient-to-r ${n.color} border border-[#c9a84c]/30 scale-[1.02]`
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{n.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{n.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${n.badgeColor}`}>
                        {n.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{n.count} ملک موجود</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{n.avgPrice}</div>
                    <div
                      className={`text-xs font-semibold ${n.trendUp ? "text-green-400" : "text-red-400"}`}
                    >
                      {n.trend} این ماه
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Selected neighborhood details */}
          <div className="lg:col-span-2">
            <div className={`glass rounded-3xl p-8 border ${selected.borderColor} bg-gradient-to-br ${selected.color}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selected.emoji}</div>
                  <div>
                    <h3 className="text-3xl font-black text-white">{selected.name}</h3>
                    <p className="text-slate-400 text-sm">{selected.description}</p>
                  </div>
                </div>
                <button className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
                  مشاهده ملک‌ها
                </button>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "میانگین قیمت", value: selected.avgPrice, sub: selected.priceUnit, icon: "💰" },
                  { label: "ملک موجود", value: selected.count.toString(), sub: "ملک", icon: "🏠" },
                  { label: "رشد ماهانه", value: selected.trend, sub: "نسبت به قبل", icon: "📈" },
                  { label: "سلبریتی‌ها", value: `+${selected.celebrities}`, sub: "همسایه مشهور", icon: "⭐" },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                    <div className="text-[10px] text-slate-500">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Amenities heatmap */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-300 mb-3">امکانات محله</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { name: "مدرسه", score: 90, icon: "🏫" },
                    { name: "بیمارستان", score: 85, icon: "🏥" },
                    { name: "پارک", score: 95, icon: "🌳" },
                    { name: "مترو", score: 70, icon: "🚇" },
                    { name: "مرکز خرید", score: 88, icon: "🛍" },
                    { name: "رستوران", score: 92, icon: "🍽" },
                  ].map((item) => (
                    <div key={item.name} className="text-center p-3 bg-white/5 rounded-xl">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-xs text-slate-300 mb-1">{item.name}</div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.score}%`,
                            background: "linear-gradient(90deg, #c9a84c, #f0d080)",
                          }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-[#c9a84c] mt-1">{item.score}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price trend chart (visual) */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">روند قیمت ۶ ماه گذشته</h4>
                <div className="flex items-end gap-2 h-16">
                  {[65, 70, 68, 75, 80, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          background: i === 5
                            ? "linear-gradient(180deg, #c9a84c, #8b6914)"
                            : "rgba(201,168,76,0.2)",
                        }}
                      ></div>
                      <span className="text-[9px] text-slate-500">
                        {["فر", "اردی", "خر", "تیر", "امر", "شهر"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
