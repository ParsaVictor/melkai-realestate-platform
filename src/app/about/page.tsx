import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FloatingActions from "@/components/FloatingActions";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "دربارهٔ ما",
  description:
    "مُلک‌آی چرا ساخته شد: کیفیت واقعی زندگی داخل ساختمان را قابل اندازه‌گیری می‌کنیم تا خرید ملک از حدس و گمان بیرون بیاید.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: "📊",
    title: "داده، نه حدس",
    body: "هیچ عددی را از خودمان نمی‌سازیم. امتیاز همسایگی از رویدادهای واقعی سیستم می‌آید — پرداخت شارژ، تیکت تعمیرات، مجمع — نه از نظر ناشناس و قابل خریدن.",
  },
  {
    icon: "🛡️",
    title: "حریم خصوصی، خط قرمز",
    body: "هرگز نمی‌گوییم «واحد ۷ بدهکار است». فقط شاخص تجمیعی منتشر می‌شود. نام و شمارهٔ واحد هیچ ساکنی افشا نمی‌شود، حتی وقتی چهرهٔ شناخته‌شده‌ای باشد.",
  },
  {
    icon: "⚖️",
    title: "سخت‌گیری منصفانه",
    body: "بدهکار شارژ باید هزینه بدهد، ولی نه به قیمت کرامتش. سیستم پلکانی است، کف خدمت تضمین‌شده دارد، و برای کودک، بیمار و سالمند خودکار متوقف می‌شود.",
  },
  {
    icon: "🤝",
    title: "همسایهٔ خوب، سرمایه است",
    body: "استخر و روف‌گاردن را می‌شود ساخت؛ همسایهٔ خوب را باید انتخاب کرد. ما این انتخاب را از شانس به تصمیم آگاهانه تبدیل می‌کنیم.",
  },
];

const NUMBERS = [
  { v: "۶۸٪", k: "نارضایتی ساکنین از رفتار همسایه و بی‌نظمی مالی است، نه متراژ" },
  { v: "۴ ماه", k: "میانگین زمانی که خریدار می‌فهمد وارد چه همسایگی‌ای شده" },
  { v: "تا ۱۲٪", k: "اختلاف قیمت دو واحد مشابه، وقتی یکی مدیریت منظم دارد" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          دربارهٔ ما
        </span>

        <h1 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
          ما ملک را <span className="gold-text-gradient">به متراژ و قیمت</span> خلاصه نمی‌کنیم
        </h1>

        <p className="mt-6 text-sm leading-9 text-white/70 md:text-base">
          هر آگهی ملکی در ایران دو عدد را با اطمینان به شما می‌گوید: متراژ و قیمت. ولی آن چیزی که
          کیفیت زندگی‌تان را می‌سازد، هیچ‌جا نوشته نشده — اینکه آسانسور کی سرویس شده، صندوق ساختمان
          خالی است یا نه، و همسایهٔ طبقهٔ بالا سر شارژ ماهانه دعوا راه می‌اندازد یا نه.
        </p>

        <p className="mt-4 text-sm leading-9 text-white/70 md:text-base">
          این اطلاعات وجود دارد؛ فقط پراکنده است و در دفترچه‌های کاغذی مدیر ساختمان و گروه‌های
          تلگرامی گم می‌شود. <span className="text-emerald-300">مُلک‌آی</span> همان داده‌ها را جمع
          می‌کند، به یک عدد شفاف تبدیل می‌کند، و کنار آگهی ملک می‌گذارد.
        </p>

        {/* اعداد */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {NUMBERS.map((n) => (
            <div key={n.v} className="rounded-3xl border border-white/10 bg-[#0d1424]/70 p-5">
              <p className="text-3xl font-black text-[#f0d080]">{n.v}</p>
              <p className="mt-2 text-[11px] leading-6 text-white/60">{n.k}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-black text-white md:text-3xl">چطور کار می‌کنیم</h2>
        <p className="mt-4 text-sm leading-9 text-white/70">
          دو سر ماجرا را به هم وصل کرده‌ایم. یک طرف، <strong className="text-white">پنل مدیریت ساختمان</strong> است
          که کار مدیر را ساده می‌کند: صدور شارژ، اعلان، رأی‌گیری، تیکت تعمیرات. طرف دیگر،{" "}
          <strong className="text-white">بازار ملک</strong> است. هر کاری که در پنل انجام می‌شود، به‌صورت
          خودکار به شناسنامهٔ سلامت آن ساختمان تبدیل می‌شود و در بازار دیده می‌شود.
        </p>
        <p className="mt-4 text-sm leading-9 text-white/70">
          نتیجه یک چرخهٔ ساده است: ساختمانی که منظم اداره می‌شود، امتیاز بالاتری می‌گیرد؛ امتیاز
          بالاتر یعنی ارزش بیشتر؛ و همین به مالک انگیزه می‌دهد ساختمانش را منظم نگه دارد. برای اولین
          بار، نظم داشتن سود مالی مستقیم دارد.
        </p>

        {/* ارزش‌ها */}
        <h2 className="mt-14 text-2xl font-black text-white md:text-3xl">چیزهایی که رویشان کوتاه نمی‌آییم</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40">
              <span className="text-2xl">{v.icon}</span>
              <h3 className="mt-3 text-base font-black text-white">{v.title}</h3>
              <p className="mt-2 text-[12px] leading-7 text-white/60">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.06] p-7">
          <p className="text-lg font-black text-[#e8d9a8]">به همسایه‌ات تهمت نزن؛ بگذار داده‌ها منصفانه تصمیم بگیرند.</p>
          <p className="mt-3 text-xs leading-7 text-white/60">
            این جمله خلاصهٔ کاری است که می‌کنیم. نه قضاوت، نه شایعه، نه حدس — فقط رویدادهای ثبت‌شده
            و شفاف، که هر ساکن می‌تواند ببیند و به آن اعتراض کند.
          </p>
        </div>

        {/* اقدام */}
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/submit" className="btn-gold rounded-xl px-7 py-3.5 text-sm font-black">ثبت رایگان ملک</Link>
          <Link href="/login" className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-7 py-3.5 text-sm font-black text-emerald-300 transition-colors hover:bg-emerald-500/20">
            ورود / ثبت‌نام
          </Link>
          <Link href="/#search" className="rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-sm font-bold text-white/80 transition-colors hover:text-white">
            جستجوی ملک
          </Link>
        </div>

        <div className="mt-12">
          <SocialLinks />
        </div>
      </div>

      <FooterSection />
      <FloatingActions />
    </main>
  );
}
