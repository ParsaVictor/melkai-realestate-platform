"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import BoxReveal, { useReducedMotionSafe } from "./BoxReveal";

/**
 * قاب مشترک صفحه‌های ورود / ثبت‌نام: پس‌زمینهٔ محو شهر، کارت شیشه‌ای،
 * لوگو، عنوان پرده‌ای و پانویس «اتصال امن».
 */
export default function AuthShell({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const still = useReducedMotionSafe();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-6 md:pt-32">
      {/* پس‌زمینهٔ سینمایی — تصویر اصلی صفحه است، پس eager */}
      <img
        src="/images/hero/tehran-skyline.webp"
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-30 blur-[3px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0a0e1a]/75 via-[#0a0e1a]/92 to-[#0a0e1a]"
      />
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[#c9a84c]/12 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: still ? 0 : 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-8">
          <a
            href="/"
            aria-label="بازگشت به صفحهٔ اصلی مُلک‌آی"
            className="mx-auto mb-6 flex w-fit items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1424]"
          >
            <img
              src="/images/logo.svg"
              alt="نشان مُلک‌آی"
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="glow-gold h-12 w-12 rounded-xl"
            />
            <span className="gold-text-gradient text-2xl font-black">مُلک‌آی</span>
          </a>

          {eyebrow && (
            <p className="mb-2 text-center text-[11px] font-black tracking-[0.18em] text-[#c9a84c]">{eyebrow}</p>
          )}

          <BoxReveal>
            <h1 className="text-center text-2xl font-extrabold text-white">{title}</h1>
          </BoxReveal>

          {subtitle && (
            <BoxReveal delay={0.12}>
              <p className="mt-2 text-center text-sm leading-6 text-slate-400">{subtitle}</p>
            </BoxReveal>
          )}

          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true">
            <path d="M12 2a5 5 0 015 5v3h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v3h6V7a3 3 0 00-3-3z" />
          </svg>
          اتصال امن — اطلاعات شما رمزنگاری‌شده منتقل می‌شود
        </p>
      </motion.div>
    </main>
  );
}
