"use client";

import { useState } from "react";

const FEATURES = [
  {
    icon: "🤖",
    title: "هوش مصنوعی قیمت‌گذاری",
    description: "سیستم AI ما قیمت هر ملک را بر اساس ۵۰+ فاکتور تحلیل می‌کند: متراژ، موقعیت، سن بنا، همسایه‌ها، و روند بازار.",
    color: "from-blue-500/10 to-blue-800/5",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
    badge: "جدید",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    icon: "🗺",
    title: "نقشه تعاملی هوشمند",
    description: "نقشه پویا با نمایش لحظه‌ای قیمت‌ها، هیت‌مپ محله‌ها، امکانات اطراف و پیشنهاد مسیر رفت‌وآمد.",
    color: "from-green-500/10 to-green-800/5",
    borderColor: "border-green-500/20",
    iconColor: "text-green-400",
    badge: "محبوب",
    badgeColor: "bg-green-500/20 text-green-400",
  },
  {
    icon: "🔔",
    title: "هشدار فرصت‌های استثنائی",
    description: "با تنظیم فیلترهای دقیق، به محض ثبت ملک متناسب با بودجه شما، فوری پیامک دریافت کنید.",
    color: "from-yellow-500/10 to-yellow-800/5",
    borderColor: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    badge: "پرکاربرد",
    badgeColor: "bg-yellow-500/20 text-yellow-400",
  },
  {
    icon: "🛡",
    title: "تأیید هویت و استعلام",
    description: "تأیید هویت دیجیتال مالک، استعلام سند، بررسی بدهی‌های ملک و اطمینان از صحت اطلاعات قبل از معامله.",
    color: "from-purple-500/10 to-purple-800/5",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-400",
    badge: "امن",
    badgeColor: "bg-purple-500/20 text-purple-400",
  },
  {
    icon: "📱",
    title: "اپلیکیشن موبایل",
    description: "تجربه کامل مدیریت ملک و ساختمان در گوشی شما — خرید، اجاره، شارژ، اعلان و کنترل دسترسی همه در یک اپ.",
    color: "from-red-500/10 to-red-800/5",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
    badge: "iOS & Android",
    badgeColor: "bg-red-500/20 text-red-400",
  },
  {
    icon: "📊",
    title: "تحلیل سرمایه‌گذاری",
    description: "محاسبه ROI، نرخ بازگشت اجاره، مقایسه گزینه‌های سرمایه‌گذاری و پیش‌بینی رشد قیمت در ۱۲ ماه آینده.",
    color: "from-teal-500/10 to-teal-800/5",
    borderColor: "border-teal-500/20",
    iconColor: "text-teal-400",
    badge: "حرفه‌ای",
    badgeColor: "bg-teal-500/20 text-teal-400",
  },
  {
    icon: "🌟",
    title: "همسایه VIP",
    description: "فناوری منحصربه‌فرد ما وجود شخصیت‌های مشهور در محدوده ملک را تأیید و ارزش‌گذاری می‌کند.",
    color: "from-[#c9a84c]/10 to-amber-800/5",
    borderColor: "border-[#c9a84c]/20",
    iconColor: "text-[#c9a84c]",
    badge: "انحصاری",
    badgeColor: "bg-[#c9a84c]/20 text-[#c9a84c]",
  },
  {
    icon: "🏗",
    title: "مشاوره ساخت و ساز",
    description: "ارتباط مستقیم با معماران، پیمانکاران و طراحان داخلی. دریافت مشاوره رایگان برای بازسازی و نوسازی.",
    color: "from-orange-500/10 to-orange-800/5",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-400",
    badge: "جدید",
    badgeColor: "bg-orange-500/20 text-orange-400",
  },
];

export default function FeaturesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 opacity-10"
          style={{ background: "radial-gradient(ellipse, #c9a84c 0%, transparent 70%)" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-4">
            <span className="text-[#c9a84c]">⚡</span>
            <span className="text-sm text-[#c9a84c]">قابلیت‌های منحصربه‌فرد</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">چرا</span>{" "}
            <span className="gold-text-gradient">مُلک‌آی؟</span>
          </h2>
          <div className="section-divider mb-4"></div>
          <p className="text-slate-400 max-w-xl mx-auto">
            از جستجوی هوشمند تا مدیریت کامل ساختمان، همه چیز در یک پلتفرم
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`rounded-2xl p-6 border cursor-pointer transition-all duration-400 bg-gradient-to-br ${feature.color} ${feature.borderColor} ${
                hovered === i ? "scale-105 shadow-xl" : "hover:scale-[1.02]"
              }`}
            >
              {/* Icon */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    hovered === i ? "scale-110 rotate-6 transition-transform duration-300" : ""
                  }`}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {feature.icon}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>

              {/* Content */}
              <h3 className={`font-bold text-lg mb-2 ${feature.iconColor}`}>
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>

              {/* Arrow */}
              <div
                className={`mt-4 flex items-center gap-1 text-sm font-semibold transition-all duration-300 ${
                  hovered === i ? feature.iconColor : "text-slate-600"
                }`}
              >
                بیشتر بدانید
                <svg className={`w-4 h-4 transition-transform ${hovered === i ? "translate-x-[-4px]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 glass rounded-3xl p-8 md:p-12 border border-[#c9a84c]/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 gold-gradient opacity-5"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-3xl font-black text-white mb-4">
              آماده‌اید؟{" "}
              <span className="gold-text-gradient">رایگان شروع کنید</span>
            </h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              همین حالا ثبت‌نام کنید و به بیش از ۵۰,۰۰۰ نفر بپیوندید که ملک‌آی را به پلتفرم اول خود تبدیل کرده‌اند
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-gold px-10 py-4 rounded-2xl text-lg font-black">
                🏠 ثبت ملک رایگان
              </button>
              <button className="glass px-10 py-4 rounded-2xl text-lg font-bold text-white border border-white/10 hover:border-[#c9a84c]/30 transition-all duration-300">
                📞 مشاوره رایگان
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
