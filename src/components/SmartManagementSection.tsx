"use client";

import { useState } from "react";

export default function SmartManagementSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "💧",
      title: "کنترل هوشمند آب",
      description: "سیستم خودکار کنترل فشار آب بر اساس وضعیت پرداخت شارژ. در صورت بدهی، فشار آب به‌تدریج کاهش می‌یابد تا پرداخت انجام شود.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      status: "فعال در ۱۲۰ ساختمان",
      points: [
        "کاهش تدریجی فشار (نه قطع کامل)",
        "اعلان خودکار به ساکن",
        "بازگشت فوری پس از پرداخت",
        "قابل تنظیم برای هر ساختمان",
      ],
    },
    {
      icon: "📊",
      title: "داشبورد مدیر ساختمان",
      description: "پنل جامع مدیریت که همه اطلاعات ساکنین، پرداخت‌ها، شکایات و اعلان‌ها را در یک نگاه نشان می‌دهد.",
      color: "text-[#c9a84c]",
      bgColor: "bg-[#c9a84c]/10",
      borderColor: "border-[#c9a84c]/20",
      status: "در حال استفاده توسط ۵۰۰+ مدیر",
      points: [
        "نمودار پرداخت‌های ماهانه",
        "مدیریت شکایات آنلاین",
        "ارسال پیامک دسته‌جمعی",
        "گزارش مالی ماهانه",
      ],
    },
    {
      icon: "🔔",
      title: "اطلاع‌رسانی خودکار",
      description: "ارسال پیامک، نوتیفیکیشن و ایمیل به ساکنین برای اعلان‌های مهم، یادآوری شارژ و رویدادهای ساختمان.",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      status: "بیش از ۱M پیام ارسالی",
      points: [
        "یادآوری شارژ ماهانه",
        "هشدار اضطراری فوری",
        "اعلان رویدادهای ساختمان",
        "گزارش‌های دوره‌ای",
      ],
    },
    {
      icon: "🔧",
      title: "سیستم تعمیرات",
      description: "ثبت و پیگیری درخواست‌های تعمیرات با اولویت‌بندی هوشمند و تخصیص خودکار به پیمانکاران.",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      status: "۳۰۰۰+ درخواست رفع‌شده",
      points: [
        "ثبت آنلاین درخواست",
        "پیگیری real-time وضعیت",
        "تخصیص خودکار به متخصص",
        "رتبه‌بندی کیفیت خدمات",
      ],
    },
    {
      icon: "🔐",
      title: "کنترل دسترسی",
      description: "مدیریت هوشمند دسترسی به درهای ساختمان، پارکینگ و آسانسور با کد اختصاصی یا اثر انگشت.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      status: "امنیت ۹۹.۹%",
      points: [
        "کد دسترسی اختصاصی",
        "دوربین هوشمند لابی",
        "کنترل آسانسور",
        "ثبت تردد ساکنین",
      ],
    },
  ];

  const selected = features[activeFeature];

  return (
    <section className="section-rhythm relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="/images/generated/building-admin.webp"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.85)" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-4">
            <span className="w-2 h-2 rounded-full status-online"></span>
            <span className="text-sm text-[#c9a84c]">هوش مصنوعی + مدیریت ساختمان</span>
          </div>
          <h2 className="mb-4 text-3xl font-black leading-tight md:text-5xl">
            <span className="text-white">مدیر ساختمانِ</span>{" "}
            <span className="gold-text-gradient">همیشه بیدار</span>
          </h2>
          <div className="section-divider mb-4"></div>
          <p className="mx-auto max-w-3xl text-sm leading-8 text-white/65 md:text-base">
            انتخاب مدیر، اختلاف بر سر پول، فراموشی تعمیرات و بی‌نظمی — همه با یک پنل اختصاصی برای
            هر ساختمان حل می‌شود؛ کاملاً قابل شخصی‌سازی برای ساکنین و قوانین همان ساختمان.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Feature list */}
          <div className="space-y-3">
            {features.map((feat, i) => (
              <button
                key={i}
                onClick={() => setActiveFeature(i)}
                className={`w-full text-right p-5 rounded-2xl border transition-all duration-300 ${
                  activeFeature === i
                    ? `${feat.bgColor} ${feat.borderColor} scale-[1.02]`
                    : "glass hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{feat.icon}</span>
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${activeFeature === i ? feat.color : "text-white"}`}>
                      {feat.title}
                    </div>
                    <div className="text-xs text-slate-500">{feat.status}</div>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeFeature === i ? `rotate-90 ${feat.color}` : "text-slate-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Feature detail */}
          <div className={`glass rounded-3xl p-8 border ${selected.borderColor}`} key={activeFeature}>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-2xl ${selected.bgColor} border ${selected.borderColor} flex items-center justify-center text-3xl pulse-gold`}
              >
                {selected.icon}
              </div>
              <div>
                <h3 className={`text-2xl font-black ${selected.color}`}>{selected.title}</h3>
                <span className="text-xs glass px-3 py-1 rounded-full text-slate-400">
                  {selected.status}
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">{selected.description}</p>

            {/* Features list */}
            <ul className="space-y-3 mb-6">
              {selected.points.map((point, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full ${selected.bgColor} border ${selected.borderColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <svg className={`w-3 h-3 ${selected.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-300">{point}</span>
                </li>
              ))}
            </ul>

            {/* Mock UI element */}
            <div className={`${selected.bgColor} border ${selected.borderColor} rounded-2xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400">نمونه عملکرد سیستم</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="space-y-2">
                {activeFeature === 0 && (
                  <>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">واحد ۲۰۱ - خانم محمدی</span>
                      <span className="text-red-400">⚠️ بدهی: ۱.۵ م</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">فشار آب واحد ۲۰۱</span>
                      <span className="text-yellow-400">کاهش به ۶۰%</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">پیامک ارسال‌شده</span>
                      <span className="text-green-400">✓ تحویل داده شد</span>
                    </div>
                  </>
                )}
                {activeFeature === 1 && (
                  <>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">کل ساکنین</span>
                      <span className="text-[#c9a84c]">۲۴ نفر</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">پرداخت‌شده این ماه</span>
                      <span className="text-green-400">۲۰ واحد ✓</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">معوقه</span>
                      <span className="text-red-400">۴ واحد ✗</span>
                    </div>
                  </>
                )}
                {activeFeature === 2 && (
                  <>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">📱 پیامک امروز</span>
                      <span className="text-green-400">۲۴ ارسال</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">📧 ایمیل هفته</span>
                      <span className="text-blue-400">۲۴ تحویل</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">🔔 نوتیفیکیشن</span>
                      <span className="text-[#c9a84c]">۱۸/۲۴ بازشده</span>
                    </div>
                  </>
                )}
                {activeFeature === 3 && (
                  <>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">درخواست واحد ۵۰۳</span>
                      <span className="text-yellow-400">در صف</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">آب‌کشی پارکینگ</span>
                      <span className="text-green-400">✓ انجام شد</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">تعمیر آسانسور</span>
                      <span className="text-orange-400">در حال انجام</span>
                    </div>
                  </>
                )}
                {activeFeature === 4 && (
                  <>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">ورود لابی</span>
                      <span className="text-green-400">✓ خانم کریمی ۱۴:۲۳</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">پارکینگ</span>
                      <span className="text-green-400">۱۸ از ۲۴ پر</span>
                    </div>
                    <div className="flex justify-between text-xs p-2 bg-black/20 rounded-lg">
                      <span className="text-slate-400">دوربین لابی</span>
                      <span className="text-blue-400">⦿ آنلاین</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${selected.bgColor} border ${selected.borderColor} ${selected.color} hover:scale-[1.02]`}>
              بیشتر بدانید →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
