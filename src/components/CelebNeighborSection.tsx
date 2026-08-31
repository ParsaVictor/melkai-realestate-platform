"use client";

import { useState, useEffect, useRef } from "react";

/** بخش «همسایگی ارزشمند» — بدون افشای هویت افراد */

const NEIGHBOR_STRENGTHS = [
  {
    icon: "⭐",
    title: "همسایهٔ نمونه",
    subtitle: "نرخ وصول شارژ بالای ۹۵٪",
    count: "۱۲ واحد",
    color: "from-amber-500/20 to-amber-700/10",
    border: "border-amber-400/25",
    accent: "#f0d080",
  },
  {
    icon: "🤝",
    title: "همکاری فعال در مجمع",
    subtitle: "مشارکت مستمر در تصمیم‌گیری‌ها",
    count: "۸ واحد",
    color: "from-emerald-500/20 to-emerald-700/10",
    border: "border-emerald-400/25",
    accent: "#10b981",
  },
  {
    icon: "🏗️",
    title: "نگهدارندهٔ تأسیسات",
    subtitle: "به‌روز نگه‌داشتن سرویس آسانسور و موتورخانه",
    count: "۶ واحد",
    color: "from-sky-500/20 to-sky-700/10",
    border: "border-sky-400/25",
    accent: "#38bdf8",
  },
  {
    icon: "🌿",
    title: "الگوی آرامش",
    subtitle: "صفر شکایت و رعایت کامل حریم خصوصی",
    count: "۱۵ واحد",
    color: "from-violet-500/20 to-violet-700/10",
    border: "border-violet-400/25",
    accent: "#a78bfa",
  },
];

const STATS = [
  { label: "میانگین نرخ وصول", value: "۹۳٪", icon: "💰" },
  { label: "رضایت از مدیریت", value: "۸۸٪", icon: "👥" },
  { label: "مشارکت در مجمع", value: "۷۶٪", icon: "🗳️" },
  { label: "حل اختلاف بدون شکایت", value: "۹۱٪", icon: "🕊️" },
];

const TESTIMONIALS = [
  {
    text: "خوشحالم که قبل از نقل‌مکان تونستم امتیاز همسایگی رو ببینم. الان ۸ ماهه اینجا زندگی می‌کنم و واقعاً آرامش دارم.",
    name: "یکی از ساکنین",
    badge: "ساکن جدید",
    color: "text-emerald-400",
  },
  {
    text: "وقتی دیدم ۹۷٪ شارژ به‌موقع پرداخت میشه، فهمیدم اینجا آدم‌های منظمی زندگی می‌کنن.",
    name: "یکی از مالکین",
    badge: "مالک",
    color: "text-[#f0d080]",
  },
  {
    text: "مدیر ساختمان با پنل هوشمند خیلی راحت‌تر شارژ جمع می‌کنه و ما هم شفافیت می‌بینیم.",
    name: "هیئت مدیره",
    badge: "مدیریت",
    color: "text-sky-400",
  },
];

export default function CelebNeighborSection() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
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

  return (
    <section id="good-neighbors" className="relative overflow-hidden py-24 md:py-28">
      {/* پس‌زمینه */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,76,.08),transparent_70%)]" />
        <div className="grid-bg absolute inset-0 opacity-30" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* هدر */}
        <div className={`mx-auto max-w-3xl text-center transition-all duration-700 ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-1.5 text-xs font-bold text-[#f0d080]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
            ویژگی منحصربه‌فرد
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            همسایگی <span className="gold-text-gradient">ارزشمند</span>
          </h2>
          <div className="section-divider mt-4" />
          <p className="mt-4 text-sm leading-8 text-white/65 md:text-base">
            ارزش واقعی یک ساختمان به همسایه‌هایش است. سامانهٔ مُلک‌آی با داده‌های واقعی
            — نظم مالی، مشارکت در مجمع، نگهداری تأسیسات و رعایت حریم — نشان می‌دهد
            هر ساختمان چه همسایه‌هایی دارد. <span className="font-bold text-white/80">بدون افشای هویت</span>، فقط ارزش.
          </p>
        </div>

        {/* آمار کلیدی */}
        <div className={`mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 transition-all duration-700 delay-200 ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-[#0d1424]/70 p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-[#c9a84c]/30 hover:-translate-y-1"
            >
              <span className="text-2xl">{s.icon}</span>
              <div className="mt-2 text-2xl font-black text-[#f0d080]">{s.value}</div>
              <div className="mt-1 text-[11px] text-white/50">{s.label}</div>
            </div>
          ))}
        </div>

        {/* کارت‌های ویژگی همسایگی */}
        <div className={`mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 transition-all duration-700 delay-300 ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {NEIGHBOR_STRENGTHS.map((ns, i) => (
            <div
              key={ns.title}
              onClick={() => setActive(i)}
              className={`group cursor-pointer rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 ${ns.color} ${ns.border} ${
                active === i ? "scale-[1.02] shadow-lg shadow-black/30" : "hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ background: `${ns.accent}20`, border: `1px solid ${ns.accent}40` }}>
                  {ns.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white">{ns.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{ns.subtitle}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${ns.accent}20`, color: ns.accent }}>
                      {ns.count}
                    </span>
                    <span className="text-[11px] text-white/40">فعال در این ساختمان</span>
                  </div>
                </div>
              </div>

              {/* نوار پیشرفت ملایم */}
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: seen ? `${70 + i * 8}%` : "0%",
                    background: ns.accent,
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* نقل‌قول‌های ناشناس */}
        <div className={`mx-auto mt-14 max-w-5xl transition-all duration-700 delay-500 ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <h3 className="text-center text-lg font-bold text-white/80 mb-6">صدای واقعی ساکنین</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#0d1424]/70 p-5 backdrop-blur-md"
              >
                <div className="mb-3 text-lg text-[#c9a84c]">❝</div>
                <p className="text-sm leading-7 text-white/70">{t.text}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/10" />
                  <div>
                    <div className="text-xs font-bold text-white/70">{t.name}</div>
                    <div className={`text-[10px] ${t.color}`}>{t.badge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* حریم خصوصی */}
        <div className={`mx-auto mt-10 max-w-3xl rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/[0.04] p-5 text-center transition-all duration-700 delay-[600ms] ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <span className="text-lg">🔒</span>
          <p className="mt-2 text-sm leading-7 text-[#e8d9a8]">
            <span className="font-bold">تعهد ما به حریم خصوصی:</span> هیچ‌وقت هویت یا اطلاعات شخصی
            همسایه‌ها فاش نمی‌شود. فقط شاخص‌های تجمیعی و ناشناس منتشر می‌شود تا حق انتخاب
            آگاهانهٔ شما تضمین شود.
          </p>
        </div>
      </div>
    </section>
  );
}
