import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-5 w-5" aria-hidden="true">
      <path d="M19 12H5" strokeLinecap="round" />
      <path d="m11 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </svg>
  );
}

const TRUST = [
  {
    label: "ثبت آگهی رایگان",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
      </svg>
    ),
  },
  {
    label: "بدون آگهی جعلی",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1 14-3.5-3.5 1.4-1.4L11 13.2l4.1-4.1 1.4 1.4L11 16Z" />
      </svg>
    ),
  },
  {
    label: "پشتیبانی واقعی",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h2v-8H5v-.2A7 7 0 0 1 19 11v.2h-3V19h2a3 3 0 0 0 3-3v-5a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
];

export default function FinalCTA() {
  return (
    <section id="start" className="relative overflow-hidden py-24 sm:py-28">
      {/* هاله‌های طلایی/زمردی */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-[#0a0e1a] to-[#070b14]" />
        <div className="absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-[#c9a84c]/15 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="grid-bg absolute inset-0 opacity-50" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-[#0d1424]/70 px-6 py-14 text-center backdrop-blur-md sm:px-12 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            رایگان، بدون واسطه، همین امروز
          </span>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-slate-100 sm:text-5xl">
            <span className="gold-text-gradient">همین حالا</span> شروع کنید
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-400 sm:text-base">
            خریدارید و دنبال خانه‌ای هستید که همسایه‌هایش را از قبل بشناسید؟ مالکید و می‌خواهید ملکتان جلوی چشم آدم‌های
            جدی باشد؟ یا ساختمانی را مدیریت می‌کنید و از دفترچهٔ شارژ خسته‌اید؟ جای هر سهٔ شما همین‌جاست.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            {/* ورود / ثبت‌نام — سبز */}
            <Link
              href="/login"
              aria-label="ورود یا ثبت‌نام در سامانه"
              className="group/cta relative flex items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-8 py-4 text-base font-bold text-emerald-300 transition-colors duration-300 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
            >
              {/* درخشش عبوری */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-emerald-200/20 to-transparent transition-transform duration-700 motion-safe:group-hover/cta:translate-x-[420%]"
              />
              <UserIcon />
              ورود / ثبت‌نام
              <span className="transition-transform duration-300 motion-safe:group-hover/cta:-translate-x-1">
                <ArrowIcon />
              </span>
            </Link>

            {/* ثبت رایگان ملک — طلایی */}
            <Link
              href="/submit"
              aria-label="ثبت رایگان آگهی ملک"
              className="btn-gold group/cta flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
            >
              <PlusIcon />
              ثبت رایگان ملک
              <span className="transition-transform duration-300 motion-safe:group-hover/cta:-translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          {/* نشان‌های اعتماد */}
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
            {TRUST.map((t) => (
              <li
                key={t.label}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-slate-300"
              >
                <span className="text-emerald-400">{t.icon}</span>
                {t.label}
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-xs text-slate-500">یا مستقیم با ما حرف بزنید</p>
            <SocialLinks className="mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
