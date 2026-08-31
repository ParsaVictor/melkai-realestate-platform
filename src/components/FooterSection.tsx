"use client";

const CITIES = [
  { label: "تهران", value: "tehran" },
  { label: "مشهد", value: "mashhad" },
  { label: "شیراز", value: "shiraz" },
  { label: "اصفهان", value: "isfahan" },
  { label: "کرمانشاه", value: "kermanshah" },
  { label: "تبریز", value: "tabriz" },
];

const QUICK_LINKS = [
  { label: "جستجوی ملک", href: "#search" },
  { label: "املاک ویژه", href: "#properties" },
  { label: "پنل مدیریت ساختمان", href: "#management" },
  { label: "شاخص همسایگی", href: "#neighborhood" },
  { label: "همسایگی ارزشمند", href: "#good-neighbors" },
  { label: "امکانات پلتفرم", href: "#features" },
  { label: "دربارهٔ ما", href: "#about-us" },
];

const COMMITMENTS = [
  { label: "احراز هویت و امنیت داده", color: "text-emerald-400", d: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9.5 12l1.8 1.8L15 10" },
  { label: "شفافیت کامل قیمت‌گذاری", color: "text-[#f0d080]", d: "M4 19h16M7 16V9m5 7V5m5 11v-5" },
  { label: "مدیریت منصفانهٔ ساختمان", color: "text-sky-400", d: "M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16M10 8h4M10 12h4M10 16h4" },
  { label: "پشتیبانی واقعی، نه رباتِ بی‌جواب", color: "text-violet-400", d: "M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
];

const PHONE = "09223688369";
const PHONE_FA = "۰۹۲۲۳۶۸۸۳۶۹";
const EMAIL = "1.parsa.karkooti@gmail.com";

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export default function FooterSection() {
  const pickCity = (city: string) => {
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("propertySearch", { detail: { city } }));
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#070b14]">
      {/* هالهٔ ملایم بالای فوتر */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-l from-transparent via-[#c9a84c]/50 to-transparent" />

      {/* ── دربارهٔ ما ── */}
      <div id="about-us" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[#0d1424]/60 p-8 backdrop-blur-md sm:p-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f0d080] to-[#c9a84c] text-lg font-black text-[#0a0e1a]">
              مُ
            </span>
            <h3 className="text-lg font-black text-white">دربارهٔ مُلک‌آی</h3>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm leading-8 text-slate-400">
                مُلک‌آی یک پلتفرم هوشمند املاک و مدیریت ساختمان است که برای اولین بار
                در ایران، <span className="text-[#f0d080]">کیفیت واقعی زندگی داخل ساختمان</span> را
                به یک دادهٔ قابل اندازه‌گیری تبدیل می‌کند. ما باور داریم خرید خانه فقط
                دربارهٔ متراژ و قیمت نیست — بلکه دربارهٔ این است که داخل آن ساختمان
                زندگی کردن چه شکلی است.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-400">
                از جستجوی ملک تا تحویل کلید، و از شارژ ماهانه تا مجمع سالانه،
                همه در یک جا. ما داده‌های واقعی — نظم مالی، سلامت تأسیسات و
                همکاری ساکنین — را جمع‌آوری می‌کنیم تا تصمیم شما آگاهانه باشد.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <h4 className="text-sm font-bold text-white mb-2">چرا مُلک‌آی؟</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>اولین سامانهٔ املاک مبتنی بر دادهٔ واقعی ساختمان</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>بدون آگهی جعلی — احراز هویت مالک و کد رهگیری</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>مدیریت هوشمند شارژ با اجرای تدریجی منصفانه</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>دوقلوی دیجیتال ساختمان برای مدیریت بصری</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>حریم خصوصی کامل ساکنین — بدون افشای اطلاعات شخصی</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 leading-6">
                جملهٔ شعار ما: <span className="text-[#e8d9a8] italic">«ملک را می‌بینی، ساختمان را می‌شناسی.»</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── محتوای اصلی فوتر ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* برند */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0d080] to-[#c9a84c] text-2xl font-black text-[#0a0e1a]">
                مُ
              </span>
              <div>
                <div className="text-xl font-black text-white">مُلک‌آی</div>
                <div className="text-xs text-[#c9a84c]">پلتفرم هوشمند املاک و مدیریت ساختمان</div>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              مُلک‌آی تنها سامانه‌ای است که ملک را به متراژ و قیمت خلاصه نمی‌کند؛ کیفیت واقعی
              زندگی داخل ساختمان — نظم مالی، سلامت تأسیسات و همکاری ساکنین — را به یک عدد شفاف
              تبدیل می‌کند. از جستجو تا تحویل کلید و از شارژ ماهانه تا مجمع سالانه، همه در یک جا.
            </p>

            <p className="mt-4 max-w-md rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/[0.06] px-4 py-3 text-sm leading-7 text-[#e8d9a8]">
              به همسایه‌ات تهمت نزن؛ بگذار داده‌ها منصفانه تصمیم بگیرند.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <img src="/images/namad.svg" alt="نماد اعتماد الکترونیکی" width={78} height={91}
                   className="h-[91px] w-[78px] opacity-90 transition-opacity hover:opacity-100" loading="lazy" />
              <div className="text-xs leading-6 text-slate-500">
                دارای نماد اعتماد الکترونیکی
                <br />
                و درگاه پرداخت امن بانکی
              </div>
            </div>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="group inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-[#c9a84c]">
                    <span className="h-1 w-1 rounded-full bg-[#c9a84c]/60 transition-all group-hover:w-3" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* تعهدهای ما */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">تعهدهای ما</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {COMMITMENTS.map((c) => (
                <li key={c.label} className="flex items-start gap-2">
                  <Icon d={c.d} className={`mt-0.5 h-4 w-4 shrink-0 ${c.color}`} />
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس + شهرها */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">تماس با ما</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Icon d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z M12 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
                <span>تهران، سعادت‌آباد، آپارتمان یاس</span>
              </li>
              <li>
                <a href={`tel:${PHONE}`} className="flex items-center gap-2 transition-colors hover:text-emerald-400">
                  <Icon d="M3 5a2 2 0 012-2h2.6a1 1 0 01.95.68l1.2 3.3a1 1 0 01-.27 1.06l-1.6 1.5a14 14 0 006.1 6.1l1.5-1.6a1 1 0 011.06-.27l3.3 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z" className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="tabular-nums" dir="ltr">{PHONE_FA}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 break-all transition-colors hover:text-[#c9a84c]">
                  <Icon d="M3 7l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" className="h-4 w-4 shrink-0 text-[#c9a84c]" />
                  <span dir="ltr" className="text-xs">{EMAIL}</span>
                </a>
              </li>
              <li>
                <a href="https://t.me/Parsa_Karkooti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-[#229ED9]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-[#229ED9]">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.32 4.23 12.4c-.658-.204-.67-.658.136-.975l11.57-4.461c.548-.196 1.026.13.854.974z" />
                  </svg>
                  <span dir="ltr" className="text-xs">@Parsa_Karkooti</span>
                </a>
              </li>
            </ul>

            <h4 className="mb-3 mt-8 text-sm font-bold text-white">شهرها</h4>
            <p className="mb-3 text-xs text-slate-500">برای دیدن ملک‌های هر شهر کلیک کنید</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => pickCity(c.value)}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/10 hover:text-[#f0d080]"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-right">
          <p className="text-xs text-slate-500">© ۱۴۰۴ مُلک‌آی — تمام حقوق محفوظ است.</p>
          <p className="text-xs text-slate-600">
            ساخته‌شده برای بازار ایران · نسخهٔ نمایشی
          </p>
        </div>
      </div>
    </footer>
  );
}
