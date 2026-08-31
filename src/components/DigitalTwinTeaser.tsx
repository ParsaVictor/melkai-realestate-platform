"use client";

/**
 * نسخهٔ نمایشی (teaser) بخش «دوقلوی دیجیتال».
 * این ریپو صرفاً یک نمونه‌کار عمومی است؛ کد منبع این کامپوننت خاص (و چند
 * ماژول دیگر از پنل مدیریت هوشمند ساختمان) در این نسخه قرار داده نشده تا
 * اطلاعات پروژهٔ کارفرما محفوظ بماند. رندر زنده و تعاملی همین بخش را می‌توان
 * در دموی آنلاین دید؛ برای دسترسی به سورس کامل کافی است پیام بدهید.
 */
export default function DigitalTwinTeaser() {
  return (
    <section className="section-rhythm" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="inline-block rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-1 text-xs font-medium text-[#c9a84c]">
          دوقلوی دیجیتال ساختمان
        </span>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          نمای ایزومتریک تعاملی، زنده از وضعیت واقعی ساختمان
        </h2>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          این ضبط، تعامل واقعی با برج در نسخهٔ دموی زنده است — چرخش، تغییر زاویهٔ دید و
          کلیک روی هر واحد. چون این بخش از ماژول اختصاصی مدیریت ساختمان است، سورس‌کدش
          را در این نمونه‌کار عمومی نگذاشتیم؛ اگر برایتان جالب بود، با خوشحالی
          دسترسی کامل را برایتان فراهم می‌کنیم.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/digital-twin-demo.gif"
            alt="نمای ضبط‌شده از دوقلوی دیجیتال تعاملی برج — چرخش، زاویهٔ دید و جزئیات واحدها"
            className="w-full"
            loading="lazy"
          />
        </div>

        <a
          href="#contact"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition hover:bg-[#d9b95c]"
        >
          می‌خواهید سورس کامل و دموی کامل را ببینید؟ پیام بدهید
        </a>
      </div>
    </section>
  );
}
