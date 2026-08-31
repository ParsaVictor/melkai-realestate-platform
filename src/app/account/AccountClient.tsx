"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FloatingActions from "@/components/FloatingActions";
import PropertyMiniCard, { type ListedProperty } from "@/components/PropertyMiniCard";
import { properties } from "@/data/properties";
import { useStore } from "@/lib/store";
import { faDigits, money, toman } from "@/lib/format";

const ALL = properties as unknown as ListedProperty[];
const BY_ID = new Map(ALL.map((p) => [p.id, p]));

const ROLE_LABEL: Record<string, string> = {
  buyer: "خریدار / مستأجر",
  owner: "مالک",
  manager: "مدیر ساختمان",
};

/** ساختمان نمونهٔ کاربر — در محصول واقعی از پروفایل ساکن می‌آید */
const MY_BUILDING = {
  name: "برج نیاوران",
  address: "تهران، نیاوران، خیابان دوستان",
  unit: "۳۰۴",
  floor: 3,
  area: 132,
  units: 32,
  neighborScore: 93,
  manager: "فاطمه احمدی",
  managerPhone: "09121110022",
  charge: 3_850_000,
  dueDate: "۱۰ شهریور",
  paid: false,
  fund: 412_000_000,
  collectRate: 97,
};

const ANNOUNCEMENTS = [
  { t: "سرویس دوره‌ای آسانسور", d: "پنجشنبه ۹ تا ۱۳ — آسانسور شرقی خارج از سرویس است.", tag: "فنی", tone: "text-sky-300" },
  { t: "مجمع عمومی سالانه", d: "جمعه ساعت ۱۸، سالن اجتماعات. حضور مالکین الزامی است.", tag: "مهم", tone: "text-rose-300" },
  { t: "تمدید بیمهٔ ساختمان", d: "بیمهٔ آتش‌سوزی برای یک سال دیگر تمدید شد.", tag: "اطلاعیه", tone: "text-emerald-300" },
];

const TABS = [
  { k: "building", label: "ساختمان من", icon: "🏢" },
  { k: "saved", label: "نشان‌شده‌ها", icon: "❤️" },
  { k: "listings", label: "آگهی‌های من", icon: "📋" },
  { k: "profile", label: "پروفایل", icon: "👤" },
] as const;

type TabKey = (typeof TABS)[number]["k"];

export default function AccountClient() {
  const { ready, user, saved, listings, compare, signOut, toggleSaved, toggleCompare, inCompare } = useStore();
  const [tab, setTab] = useState<TabKey>("building");
  const [paid, setPaid] = useState(false);
  const [toast, setToast] = useState("");

  const savedItems = useMemo(
    () => saved.map((id) => BY_ID.get(id)).filter((p): p is ListedProperty => Boolean(p)),
    [saved],
  );

  const pay = () => {
    setPaid(true);
    setToast("شارژ شهریور پرداخت شد — رسید در بخش مالی ثبت شد.");
    setTimeout(() => setToast(""), 3200);
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#0a0e1a]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-32">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/[0.06]" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0e1a]">
        <Navbar />
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
          <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#0d1424] text-4xl">🔐</span>
          <h1 className="text-2xl font-black text-white md:text-3xl">هنوز وارد نشده‌اید</h1>
          <p className="mt-3 text-sm leading-8 text-white/60">
            برای دیدن ساختمان، شارژ ماهانه، نشان‌شده‌ها و آگهی‌هایتان، ابتدا وارد شوید.
          </p>
          <Link href="/login" className="btn-gold mt-7 rounded-xl px-8 py-3.5 text-sm font-black">
            ورود / ثبت‌نام
          </Link>
        </div>
        <FooterSection />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* سربرگ */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-l from-[#c9a84c]/10 to-transparent p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0d080] to-[#c9a84c] text-2xl font-black text-[#0a0e1a]">
              {user.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-xl font-black text-white md:text-2xl">{user.name}</h1>
              <p className="mt-0.5 text-xs text-white/55">
                {ROLE_LABEL[user.role] ?? user.role} · <span dir="ltr">{faDigits(user.phone)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/submit" className="btn-gold rounded-xl px-5 py-2.5 text-sm font-bold">ثبت ملک جدید</Link>
            <button
              onClick={signOut}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white/70 transition-colors hover:border-rose-400/50 hover:text-rose-300"
            >
              خروج
            </button>
          </div>
        </div>

        {/* آمار سریع */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: "نشان‌شده", v: faDigits(saved.length), c: "text-rose-300" },
            { k: "در مقایسه", v: faDigits(compare.length), c: "text-sky-300" },
            { k: "آگهی من", v: faDigits(listings.length), c: "text-[#f0d080]" },
            { k: "امتیاز ساختمانم", v: faDigits(MY_BUILDING.neighborScore), c: "text-emerald-300" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-white/10 bg-[#0d1424]/70 p-4 text-center">
              <p className="text-[11px] text-white/50">{s.k}</p>
              <p className={`mt-1 text-2xl font-black tabular-nums ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* تب‌ها */}
        <div className="mt-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#070b14] p-1.5">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              aria-selected={tab === t.k}
              role="tab"
              className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                tab === t.k
                  ? "bg-gradient-to-l from-[#c9a84c] to-[#f0d080] text-[#0a0e1a]"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span className="ms-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* ── ساختمان من ── */}
          {tab === "building" && (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white">{MY_BUILDING.name}</h2>
                    <p className="mt-1 text-xs text-white/55">{MY_BUILDING.address}</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
                    امتیاز {faDigits(MY_BUILDING.neighborScore)}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { k: "واحد من", v: MY_BUILDING.unit },
                    { k: "طبقه", v: faDigits(MY_BUILDING.floor) },
                    { k: "متراژ", v: `${faDigits(MY_BUILDING.area)} م²` },
                    { k: "کل واحدها", v: faDigits(MY_BUILDING.units) },
                  ].map((x) => (
                    <div key={x.k} className="rounded-xl border border-white/10 bg-[#070b14]/70 p-3 text-center">
                      <p className="text-[10px] text-white/50">{x.k}</p>
                      <p className="mt-1 text-sm font-black text-white">{x.v}</p>
                    </div>
                  ))}
                </div>

                {/* شارژ ماهانه */}
                <div className={`mt-5 rounded-2xl border p-5 ${paid ? "border-emerald-400/30 bg-emerald-400/[0.07]" : "border-amber-400/30 bg-amber-400/[0.07]"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-white/60">شارژ شهریور ۱۴۰۵</p>
                      <p className="mt-1 text-2xl font-black text-white">{money(MY_BUILDING.charge)}</p>
                      <p className="mt-1 text-[11px] text-white/50">
                        {paid ? "پرداخت شد — با تشکر" : `مهلت پرداخت: ${MY_BUILDING.dueDate}`}
                      </p>
                    </div>
                    {paid ? (
                      <span className="rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-5 py-2.5 text-sm font-black text-emerald-300">
                        ✓ تسویه
                      </span>
                    ) : (
                      <button onClick={pay} className="btn-gold rounded-xl px-6 py-3 text-sm font-black">
                        پرداخت شارژ
                      </button>
                    )}
                  </div>
                </div>

                {/* وضعیت مالی ساختمان */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#070b14]/70 p-4">
                    <p className="text-[11px] text-white/50">موجودی صندوق ذخیره</p>
                    <p className="mt-1 text-lg font-black text-[#f0d080]">{toman(MY_BUILDING.fund)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#070b14]/70 p-4">
                    <p className="text-[11px] text-white/50">نرخ وصول شارژ ساختمان</p>
                    <p className="mt-1 text-lg font-black text-emerald-300">{faDigits(MY_BUILDING.collectRate)}٪</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b14]/70 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a84c]/20 text-sm font-black text-[#f0d080]">
                    {MY_BUILDING.manager.charAt(0)}
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] text-white/50">مدیر ساختمان</p>
                    <p className="text-sm font-bold text-white">{MY_BUILDING.manager}</p>
                  </div>
                  <a href={`tel:${MY_BUILDING.managerPhone}`} className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">
                    تماس
                  </a>
                </div>
              </div>

              {/* اعلانات */}
              <div className="rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6">
                <h3 className="text-base font-black text-white">اعلانات ساختمان</h3>
                <div className="mt-4 space-y-3">
                  {ANNOUNCEMENTS.map((a) => (
                    <div key={a.t} className="rounded-2xl border border-white/10 bg-[#070b14]/70 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-white">{a.t}</p>
                        <span className={`text-[10px] font-bold ${a.tone}`}>{a.tag}</span>
                      </div>
                      <p className="mt-2 text-[11px] leading-6 text-white/60">{a.d}</p>
                    </div>
                  ))}
                </div>
                <Link href="/#management" className="mt-4 block rounded-xl border border-white/15 bg-white/[0.05] py-2.5 text-center text-xs font-bold text-white/75 transition-colors hover:text-white">
                  رفتن به پنل کامل مدیریت
                </Link>
              </div>
            </div>
          )}

          {/* ── نشان‌شده‌ها ── */}
          {tab === "saved" && (
            savedItems.length ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-white/60">{faDigits(savedItems.length)} ملک نشان‌شده</p>
                  <Link href="/compare" className="text-xs font-bold text-[#f0d080] hover:text-[#f7e3a8]">
                    رفتن به مقایسه ←
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {savedItems.map((p) => (
                    <PropertyMiniCard
                      key={p.id}
                      property={p}
                      onToggleSaved={() => toggleSaved(p.id)}
                      onToggleCompare={() => toggleCompare(p.id)}
                      saved
                      inCompare={inCompare(p.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty
                icon="🤍"
                title="هنوز ملکی را نشان نکرده‌اید"
                body="روی قلب هر آگهی بزنید تا اینجا ذخیره شود و بعداً راحت مقایسه‌شان کنید."
                href="/#search"
                cta="جستجوی ملک"
              />
            )
          )}

          {/* ── آگهی‌های من ── */}
          {tab === "listings" && (
            listings.length ? (
              <div className="space-y-3">
                {listings.map((l) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1424]/70 p-5">
                    <div>
                      <p className="text-sm font-bold text-white">{String(l.title ?? "آگهی بدون عنوان")}</p>
                      <p className="mt-1 text-[11px] text-white/50">
                        کد رهگیری: <span dir="ltr">{String(l.id)}</span>
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                      {String(l.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon="📋"
                title="هنوز آگهی ثبت نکرده‌اید"
                body="ثبت آگهی رایگان است؛ کمیسیون فقط در صورت فروش موفق محاسبه می‌شود."
                href="/submit"
                cta="ثبت رایگان ملک"
              />
            )
          )}

          {/* ── پروفایل ── */}
          {tab === "profile" && (
            <div className="max-w-xl rounded-3xl border border-white/10 bg-[#0d1424]/70 p-6">
              <h3 className="text-base font-black text-white">اطلاعات حساب</h3>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["نام", user.name],
                  ["شمارهٔ موبایل", faDigits(user.phone)],
                  ["نقش", ROLE_LABEL[user.role] ?? user.role],
                  ["عضویت از", new Date(user.since).toLocaleDateString("fa-IR")],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <dt className="text-white/45">{k}</dt>
                    <dd className="font-bold text-white/85">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 rounded-xl border border-white/10 bg-[#070b14]/70 p-4 text-[11px] leading-6 text-white/55">
                این نسخهٔ نمایشی است و اطلاعات فقط روی همین مرورگر شما ذخیره می‌شود؛
                هیچ داده‌ای به سروری ارسال نمی‌شود.
              </p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border border-emerald-400/40 bg-[#04121a]/95 px-6 py-3 text-sm text-emerald-200 shadow-[0_20px_60px_-20px_rgba(16,185,129,.8)]">
          ✓ {toast}
        </div>
      )}

      <FooterSection />
      <FloatingActions />
    </main>
  );
}

function Empty({ icon, title, body, href, cta }: { icon: string; title: string; body: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-white/12 bg-[#0d1424]/40 px-6 py-16 text-center">
      <span className="mb-4 text-5xl">{icon}</span>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-xs leading-7 text-white/55">{body}</p>
      <Link href={href} className="btn-gold mt-6 rounded-xl px-7 py-3 text-sm font-black">
        {cta}
      </Link>
    </div>
  );
}
