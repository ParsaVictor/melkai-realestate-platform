<div align="center">

# مُلک‌آی · Melkai

### پلتفرم هوشمند املاک ایران — خرید، فروش، رهن، اجاره و برآورد قیمت با هوش مصنوعی

**AI-powered Persian real estate platform — search, valuation, comparison, and listing wizard.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Status](https://img.shields.io/badge/status-private_preview-blueviolet)]()

### 🌐 [**مشاهدهٔ دموی زنده → amlak-s46a.eshop3.pages.dev**](https://amlak-s46a.eshop3.pages.dev/)

</div>

---

## ✨ چیست

**مُلک‌آی** یک وب‌اپلیکیشن حرفه‌ای برای بازار املاک ایران است که با **Next.js 16 (App Router)**، **TypeScript strict**، **Tailwind CSS v4** و **Framer Motion** ساخته شده. تمرکز محصول روی چیزی است که سایت‌های آگهی‌گرا ندارند: **برآورد قیمت با موتور واقعی**، **مقایسهٔ ساختاریافتهٔ چند ملک** و **ثبت‌نام هوشمند** — نه فقط لیست خشک آگهی.

این ریپو **نمونه‌کار خصوصی** است. اگر می‌خواهید نسخهٔ کامل، سورس کامل، یا پیاده‌سازی اختصاصی برای کسب‌وکار خودتان داشته باشید — [تماس بگیرید](#-تماس).

## 🏙️ دموی زنده

<div align="center">

### 👉 [amlak-s46a.eshop3.pages.dev](https://amlak-s46a.eshop3.pages.dev/) 👈

**۲۴ صفحه · ۱۷ آگهی نمونه · ۶ شهر · ۰ لینک شکسته · موبایل و دسکتاپ**

</div>

---

## 🎯 امکانات کلیدی

### 🔍 جستجوی چندلایه
شهر، نوع معامله (خرید/رهن/اجاره)، نوع ملک، محلهٔ وابسته به شهر، تعداد اتاق، بازهٔ متراژ، بازهٔ قیمت، فیلترهای پیشرفته، شمارندهٔ فیلتر فعال.

### 💰 موتور برآورد قیمت (`src/lib/valuation.ts`)
تابع خالص `estimate()` — بدون شبکه، بدون تصادف، قابل تست.
پایهٔ قیمت متری از دادهٔ محله، ضرایب سن بنا (‎+۷٪ تا ‎−۲۰٪)، بازسازی، طبقه، پارکینگ، آسانسور، انباری، بالکن، متراژ و امتیاز همسایگی.
خروجی: **بازهٔ کم / منصفانه / زیاد**، قیمت متری، عوامل مؤثر با درصد اثر، درجهٔ اطمینان.
`priceVerdict()` قیمت کاربر را می‌سنجد و «گران‌قیمت» یا «زیر قیمت» را برچسب می‌زند.

### ⚖️ مقایسهٔ حرفه‌ای تا ۴ ملک
دو تب کلی و جزئی، نشان «بهترین» روی هر معیار، جدول ۱۷ ردیفه، دکمهٔ «فقط تفاوت‌ها»، خروجی CSV.

### 📝 ویزارد ثبت آگهی ۶ گامی
نوع معامله → موقعیت → مشخصات → **قیمت‌گذاری هوشمند** (اتصال به موتور برآورد) → تصاویر → پلن انتشار (رایگان / نردبان / ویژه) با کارت‌های کیف پول انیمیشنی و رسید.

### 🔐 ورود سه‌مرحله‌ای با OTP
موبایل + نقش → کد تأیید (انیمیشن چرخش رقم‌ها، حلقهٔ بررسی) → پروفایل. کد دموی `۱۲۳۴`.

### 💾 نشان‌شده‌ها و پنل کاربری
ذخیرهٔ ملک با قلب، صفحهٔ `/saved` با حالت خالی طراحی‌شده، پنل کاربری چهارتب برای مدیریت.

### 📄 صفحهٔ جزئیات ملک
گالری با کلید جهت، مشخصات آیکون‌دار، کارت امتیاز همسایگی، برآورد ارزش در برابر قیمت آگهی، نقشهٔ محله و دسترسی‌ها، آگهی‌های مشابه، JSON-LD برای سئو.

### 🏗️ ماژول مدیریت هوشمند ساختمان *(نسخهٔ خصوصی)*
دوقلوی دیجیتال سه‌بعدی، اجرای تدریجی شارژ با کف سخت‌افزاری، پنل مدیریت زنده، اعلانات و رأی‌گیری — این ماژول در دموی زنده قابل مشاهده و تعامل است، اما به‌دلیل ملاحظات کارفرما **سورس‌کد بخش دوقلوی دیجیتال در این ریپو منتشر نشده**. برای دسترسی به نسخهٔ کامل، پیام بدهید.

---

## 🎨 تجربهٔ کاربری

- **نوار پیشرفت اسکرول** بالای صفحه + ناوبری ۱۰ بخشی کنار دسکتاپ
- **ریتم اسکرول**: `scroll-snap: y proximity` + `scroll-padding-top` + `content-visibility`
- **تصاویر**: همه WebP — کاهش ۶۲٪ حجم نسبت به JPG (۵٫۸MB → ۲٫۲MB)
- **دسترس‌پذیری**: `aria-label` فارسی روی همهٔ دکمه‌ها، احترام به `prefers-reduced-motion`
- **سئو**: metadata کامل، OpenGraph، Twitter card، canonical، JSON-LD نوع `RealEstateAgent`
- **RTL کامل**: تایپوگرافی فارسی، اعداد فارسی، طرح راست‌به‌چپ

## 🧱 استک فنی

| لایه | تکنولوژی |
|---|---|
| فریمورک | Next.js 16 (App Router, Server Components, Static Export) |
| زبان | TypeScript 5.9 (strict) |
| استایل | Tailwind CSS v4 + `@tailwindcss/postcss` |
| انیمیشن | Framer Motion 13 |
| دیتابیس (اختیاری) | PostgreSQL + Drizzle ORM |
| آیکون | Lucide React |
| کاروسل | Swiper 14 |
| میزبانی | Cloudflare Pages |

## 📁 ساختار پروژه

```
melkai-realestate-platform/
├── src/
│   ├── app/                     # صفحات App Router (RTL, فارسی)
│   │   ├── page.tsx             # صفحهٔ اصلی — ۱۶ بخش روایی
│   │   ├── property/[id]/       # جزئیات هر ملک (۱۷ SSG)
│   │   ├── login/               # ورود سه‌مرحله‌ای با OTP
│   │   ├── submit/              # ویزارد ثبت آگهی ۶ گامی
│   │   ├── saved/               # نشان‌شده‌ها
│   │   ├── compare/             # مقایسهٔ تا ۴ ملک
│   │   ├── account/             # پنل کاربری چهارتب
│   │   └── about/               # دربارهٔ ما
│   ├── components/              # ۲۶ کامپوننت (Hero, Search, Comparison, ...)
│   ├── lib/
│   │   ├── valuation.ts         # موتور برآورد قیمت
│   │   ├── store.tsx            # مدیریت state سبک
│   │   └── format.ts            # فرمت‌کنندهٔ عدد و قیمت
│   ├── data/                    # دیتاست ۱۷ آگهی + دادهٔ محله
│   └── db/                      # اسکیمای Drizzle (اختیاری)
├── public/                      # تصاویر WebP، لوگو، فاوآیکون
├── scripts/
│   ├── audit-links.mjs          # ممیزی لینک شکسته و تصویر گمشده
│   ├── optimize-images.mjs      # تبدیل به WebP
│   └── build-properties.mjs     # بازتولید دیتاست
└── FEATURES.md                  # فهرست کامل امکانات و اندازه‌گیری‌ها
```

## 🚀 اجرای محلی

```bash
git clone https://github.com/ParsaVictor/melkai-realestate-platform.git
cd melkai-realestate-platform
npm install
cp .env.local.example .env.local   # مقداردهی DATABASE_URL اختیاری
npm run dev                         # http://localhost:3000
```

برای build استاتیک (خروجی Cloudflare Pages):

```bash
npm run build
node scripts/audit-links.mjs      # صفر لینک شکسته، صفر تصویر گمشده
```

## 📊 وضعیت

```
صفحات: ۲۴          کامپوننت: ۲۶         خطوط کد src: ۱۲٬۶۶۸
حجم خروجی: ۶٫۵MB   تصاویر: ۴۷ (۲٫۵MB)   لینک شکسته: ۰
```

جزئیات بیشتر در [`FEATURES.md`](./FEATURES.md).

## 🔒 دربارهٔ این نسخه

این ریپو **preview خصوصی** است و برای معرفی توانمندی پلتفرم منتشر شده. برخی ماژول‌های اختصاصی — از جمله سورس‌کد کامل دوقلوی دیجیتال سه‌بعدی و منطق موتور اجرای تدریجی شارژ — به‌دلیل ملاحظات کارفرما در این نسخه قرار نگرفته‌اند، اما در دموی زنده به‌صورت کامل قابل مشاهده و تعامل‌اند.

اگر مایل به یکی از این موارد هستید:
- 🔧 پیاده‌سازی نسخهٔ اختصاصی برای کسب‌وکار شما
- 🔓 دسترسی به سورس کامل و ماژول‌های نمایش‌داده‌نشده
- 🎓 مشاوره یا همکاری فنی

خوشحال می‌شوم پیام‌تان را ببینم.

---

## 📞 تماس

<div align="center">

| کانال | آدرس |
|---|---|
| 📱 تلفن | [۰۹۲۲۳۶۸۸۳۶۹](tel:+989223688369) |
| ✈️ تلگرام | [@Parsa_Karkooti](https://t.me/Parsa_Karkooti) |
| ✉️ ایمیل | [1.parsa.karkooti@gmail.com](mailto:1.parsa.karkooti@gmail.com) |
| 🌐 دموی زنده | [amlak-s46a.eshop3.pages.dev](https://amlak-s46a.eshop3.pages.dev/) |

</div>

---

<div align="center">

**Built with ❤️ in Tehran · Persian real estate deserves better tools.**

`#nextjs` `#typescript` `#tailwindcss` `#real-estate` `#persian` `#rtl` `#cloudflare-pages`

</div>
