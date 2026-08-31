"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FloatingActions from "@/components/FloatingActions";
import { properties } from "@/data/properties";
import { COMPARE_LIMIT, StoreProvider, useStore } from "@/lib/store";
import {
  CITY_LABEL,
  LISTING_LABEL,
  TYPE_LABEL,
  enDigits,
  faDigits,
  money,
  perMeter,
  scoreTone,
  toman,
} from "@/lib/format";

export type PropertyRow = {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  parking: boolean;
  elevator: boolean;
  storage: boolean;
  balcony: boolean;
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  imageUrl: string;
  neighborScore: number;
  hasCelebNeighbor: boolean;
  celebName: string | null;
  celebProfession: string | null;
  yearBuilt: number;
  featured: boolean;
  viewCount: number;
  agentName: string;
  agentPhone: string;
};

const ALL = properties as unknown as PropertyRow[];

const CARD = "rounded-3xl border border-white/10 bg-[#0d1424]/70 backdrop-blur-md";
const RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]";

const cityFa = (c: string) => CITY_LABEL[c] ?? c;
const faDec = (v: number, d = 1) => faDigits(v.toFixed(d)).replace(".", "٫");
const clampScore = (v: number) => Math.max(58, Math.min(99, Math.round(v)));

/** فاصلهٔ ساختگی اما قطعی: خروجی استاتیک باید بین بیلدها یکسان بماند */
const meters = (m: number) => (m >= 1000 ? `${faDec(m / 1000)} کیلومتر` : `${faDigits(m)} متر`);

/** ضریب برآورد بین ۰٫۹۲ تا ۱٫۰۸ — فقط از شناسه مشتق می‌شود، بدون Math.random */
function valuation(p: PropertyRow) {
  const h = ((p.id * 2654435761) % 4294967296) / 4294967296;
  const estimate = Math.round(p.price * (0.92 + h * 0.16));
  const diff = ((p.price - estimate) / estimate) * 100;
  return { estimate, diff };
}

function subScores(p: PropertyRow) {
  const j = (n: number) => ((p.id * 31 + n * 17) % 11) - 5;
  return [
    { label: "نرخ وصول شارژ", value: clampScore(p.neighborScore + j(1)) },
    { label: "سرعت رفع خرابی", value: clampScore(p.neighborScore + j(2)) },
    { label: "مشارکت در مجمع", value: clampScore(p.neighborScore + j(3)) },
    { label: "سلامت صندوق ذخیره", value: clampScore(p.neighborScore + j(4)) },
  ];
}

function accessPoints(p: PropertyRow) {
  return [
    { label: "ایستگاه مترو", icon: "🚇", m: 250 + ((p.id * 137) % 12) * 70 },
    { label: "مدرسهٔ ابتدایی", icon: "🎒", m: 300 + ((p.id * 211) % 10) * 80 },
    { label: "پارک محله", icon: "🌳", m: 180 + ((p.id * 97) % 9) * 60 },
    { label: "درمانگاه شبانه‌روزی", icon: "🏥", m: 400 + ((p.id * 173) % 11) * 95 },
  ];
}

/* ────────────────────────── ورودی صفحه ────────────────────────── */

export default function PropertyDetail({ id }: { id: number }) {
  // اگر StoreProvider هنوز در layout نصب نشده باشد، خودمان یکی می‌سازیم تا صفحه مستقل هم کار کند
  let hasStore = true;
  try {
    useStore();
  } catch {
    hasStore = false;
  }
  if (hasStore) return <Detail id={id} />;
  return (
    <StoreProvider>
      <Detail id={id} />
    </StoreProvider>
  );
}

/* ────────────────────────── بدنه ────────────────────────── */

function Detail({ id }: { id: number }) {
  const p = useMemo(() => ALL.find((x) => x.id === id) ?? ALL[0], [id]);
  const store = useStore();

  const [active, setActive] = useState(0);
  const [visitOpen, setVisitOpen] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((kind: "ok" | "err", text: string) => {
    setToast({ kind, text });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const shots = useMemo(() => {
    const others = ALL.filter((x) => x.id !== p.id);
    const at = (k: number) => others[(p.id + k) % others.length];
    return [
      { src: p.imageUrl, cap: "نمای کلی" },
      { src: at(3).imageUrl, cap: "نشیمن" },
      { src: at(7).imageUrl, cap: "آشپزخانه" },
      { src: at(11).imageUrl, cap: "نمای بیرونی" },
    ];
  }, [p]);

  // کلیدهای ← → گالری را جابه‌جا می‌کنند
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (visitOpen) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowLeft") setActive((i) => (i + 1) % shots.length);
      else if (e.key === "ArrowRight") setActive((i) => (i - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visitOpen, shots.length]);

  const similar = useMemo(() => {
    const rest = ALL.filter((x) => x.id !== p.id);
    const sameCity = rest.filter((x) => x.city === p.city);
    const sameType = rest.filter((x) => x.city !== p.city && x.propertyType === p.propertyType);
    return [...sameCity, ...sameType, ...rest].filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i).slice(0, 3);
  }, [p]);

  const saved = store.ready && store.isSaved(p.id);
  const compared = store.ready && store.inCompare(p.id);

  const onSave = () => {
    store.toggleSaved(p.id);
    notify("ok", store.isSaved(p.id) ? "از فهرست نشان‌شده‌ها برداشته شد." : "به نشان‌شده‌ها افزوده شد.");
  };

  const onCompare = () => {
    const r = store.toggleCompare(p.id);
    if (!r.ok) notify("err", r.reason ?? `حداکثر ${faDigits(COMPARE_LIMIT)} ملک قابل مقایسه است.`);
    else notify("ok", store.inCompare(p.id) ? "از فهرست مقایسه برداشته شد." : "به فهرست مقایسه افزوده شد.");
  };

  const onShare = async () => {
    const url = window.location.href;
    const payload = { title: p.title, text: `${p.title} — ${toman(p.price)}`, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        /* کاربر لغو کرد یا مرورگر اجازه نداد — می‌رویم سراغ کپی */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      notify("ok", "لینک کپی شد");
    } catch {
      notify("err", "کپی لینک ممکن نشد؛ نشانی صفحه را دستی بردارید.");
    }
  };

  const tone = scoreTone(p.neighborScore);
  const { estimate, diff } = valuation(p);
  const below = diff < 0;

  return (
    <>
      <Navbar />

      <main className="min-h-screen grid-bg pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb p={p} />

          <div className="mt-5 grid gap-6 lg:grid-cols-3">
            {/* ستون اصلی */}
            <div className="space-y-6 lg:col-span-2">
              <Gallery shots={shots} active={active} setActive={setActive} title={p.title} />

              <Header
                p={p}
                saved={!!saved}
                compared={!!compared}
                ready={store.ready}
                onSave={onSave}
                onCompare={onCompare}
                onShare={onShare}
              />

              <Section title="دربارهٔ این ملک" icon="📝">
                <p className="text-sm leading-8 text-slate-300">{p.description}</p>
              </Section>

              <SpecGrid p={p} />

              <ScoreCard p={p} tone={tone} />

              <ValuationCard price={p.price} estimate={estimate} diff={diff} below={below} />

              {p.hasCelebNeighbor && p.celebName ? <CelebCard p={p} /> : null}

              <LocationCard p={p} />
            </div>

            {/* ستون کناری */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <AgentCard p={p} onVisit={() => setVisitOpen(true)} />
              <QuickFacts p={p} />
            </aside>
          </div>

          <SimilarList items={similar} />
        </div>
      </main>

      {visitOpen ? <VisitModal p={p} onClose={() => setVisitOpen(false)} /> : null}
      <Toast toast={toast} />

      <FooterSection />
      <FloatingActions />
    </>
  );
}

/* ────────────────────────── قطعات ────────────────────────── */

function Breadcrumb({ p }: { p: PropertyRow }) {
  return (
    <nav aria-label="مسیر صفحه" className="text-xs text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className={`rounded transition-colors hover:text-[#f0d080] ${RING}`}>
            خانه
          </Link>
        </li>
        <li aria-hidden className="text-slate-600">/</li>
        <li>
          <Link href="/#properties" className={`rounded transition-colors hover:text-[#f0d080] ${RING}`}>
            املاک {cityFa(p.city)}
          </Link>
        </li>
        <li aria-hidden className="text-slate-600">/</li>
        <li aria-current="page" className="max-w-[16rem] truncate text-slate-200">{p.title}</li>
      </ol>
    </nav>
  );
}

function Shot({ src, alt, eager, className }: { src: string; alt: string; eager?: boolean; className: string }) {
  const [bad, setBad] = useState(false);
  if (bad) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-slate-800 to-[#070b14]`} role="img" aria-label={alt}>
        <span className="text-4xl" aria-hidden>🏙️</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setBad(true)}
    />
  );
}

function Gallery({
  shots,
  active,
  setActive,
  title,
}: {
  shots: { src: string; cap: string }[];
  active: number;
  setActive: (i: number) => void;
  title: string;
}) {
  return (
    <section aria-label="گالری تصاویر ملک" className={`${CARD} overflow-hidden`}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070b14]">
        <Shot
          key={shots[active].src}
          src={shots[active].src}
          alt={`${title} — ${shots[active].cap}`}
          eager={active === 0}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <span className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-black/55 px-3 py-1 text-xs font-bold text-slate-100 backdrop-blur-sm">
          {shots[active].cap}
        </span>
        <span className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/55 px-3 py-1 text-xs font-bold tabular-nums text-slate-300 backdrop-blur-sm">
          {faDigits(active + 1)} / {faDigits(shots.length)}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 p-3">
        {shots.map((s, i) => (
          <button
            key={s.src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`نمایش تصویر ${faDigits(i + 1)}: ${s.cap}`}
            aria-current={i === active}
            className={`group relative aspect-[4/3] overflow-hidden rounded-xl border transition-all duration-300 ${RING} ${
              i === active ? "border-[#c9a84c] ring-1 ring-[#c9a84c]/50" : "border-white/10 hover:border-white/30"
            }`}
          >
            <Shot src={s.src} alt={s.cap} className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[10px] font-bold text-slate-200">
              {s.cap}
            </span>
          </button>
        ))}
      </div>

      <p className="px-4 pb-3 text-[11px] text-slate-500">
        با کلیدهای ← و → هم می‌توانید تصاویر را ورق بزنید.
      </p>
    </section>
  );
}

function Header({
  p,
  saved,
  compared,
  ready,
  onSave,
  onCompare,
  onShare,
}: {
  p: PropertyRow;
  saved: boolean;
  compared: boolean;
  ready: boolean;
  onSave: () => void;
  onCompare: () => void;
  onShare: () => void;
}) {
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-3 py-1 text-xs font-black text-[#f0d080]">
          {LISTING_LABEL[p.listingType] ?? "فروش"}
        </span>
        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
          {TYPE_LABEL[p.propertyType] ?? "ملک"}
        </span>
        {p.featured ? (
          <span className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            آگهی ویژه
          </span>
        ) : null}
        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold tabular-nums text-slate-400">
          {faDigits(p.viewCount)} بازدید
        </span>
      </div>

      <h1 className="mt-3 text-2xl font-black leading-relaxed text-white sm:text-3xl">{p.title}</h1>

      <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#c9a84c]" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <path d="M12 21s7-5.3 7-11a7 7 0 10-14 0c0 5.7 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {p.address}
      </p>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <div className="text-3xl font-black gold-text-gradient sm:text-4xl">{toman(p.price)}</div>
          <div className="mt-1 text-xs text-slate-400">
            هر متر مربع: <span className="font-bold text-slate-300">{perMeter(p.price, p.area)}</span>
          </div>
        </div>
        <div className="text-left text-xs text-slate-400">
          <div>
            متراژ: <span className="font-bold text-slate-200">{faDigits(p.area)} متر</span>
          </div>
          <div className="mt-1">
            ساخت: <span className="font-bold text-slate-200">{faDigits(p.yearBuilt)}</span>
          </div>
        </div>
      </div>

      {/* دکمه‌های عمل — تا آماده‌شدن فروشگاه، اسکلتون */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {!ready ? (
          <>
            <div className="h-12 animate-pulse rounded-xl bg-white/5" />
            <div className="h-12 animate-pulse rounded-xl bg-white/5" />
            <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              aria-label={saved ? "برداشتن از نشان‌شده‌ها" : "ذخیره در نشان‌شده‌ها"}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${RING} ${
                saved
                  ? "border-rose-400/50 bg-rose-500/10 text-rose-300"
                  : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path d="M12 20s-7-4.4-7-9.4A4.1 4.1 0 0112 8a4.1 4.1 0 017 2.6c0 5-7 9.4-7 9.4z" />
              </svg>
              {saved ? "ذخیره شد" : "ذخیره"}
            </button>

            <button
              type="button"
              onClick={onCompare}
              aria-pressed={compared}
              aria-label={compared ? "برداشتن از فهرست مقایسه" : "افزودن به فهرست مقایسه"}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${RING} ${
                compared
                  ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                  : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path d="M9 4v16M15 4v16M4 9h5M15 15h5" />
              </svg>
              {compared ? "در فهرست مقایسه" : "افزودن به مقایسه"}
            </button>

            <button
              type="button"
              onClick={onShare}
              aria-label="اشتراک‌گذاری این آگهی"
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-sm font-bold text-slate-200 transition-colors hover:border-white/30 ${RING}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <circle cx="18" cy="5" r="2.6" />
                <circle cx="6" cy="12" r="2.6" />
                <circle cx="18" cy="19" r="2.6" />
                <path d="M8.3 10.8l7.4-4.1M8.3 13.2l7.4 4.1" />
              </svg>
              اشتراک‌گذاری
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <h2 className="mb-4 flex items-center gap-2 text-base font-black text-white">
        <span aria-hidden>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const SPEC_ICONS: Record<string, string> = {
  area: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  bed: "M3 18v-6h18v6M3 12V7h7v5M14 12V9h7v3M3 18v2M21 18v2",
  bath: "M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4zM7 12V6a2 2 0 114 0",
  floor: "M4 20h16M4 20V9l8-5 8 5v11M9 20v-6h6v6",
  year: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  car: "M4 15h16M6 15l1.6-5h8.8L18 15M6.5 18a1.2 1.2 0 100-2.4M17.5 18a1.2 1.2 0 100-2.4",
  box: "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
  balcony: "M4 20h16M6 20v-6h12v6M8 14V6h8v8M10 20v-4M14 20v-4",
  lift: "M6 3h12v18H6zM12 3v18M9 8l1.5-2L12 8M15 16l-1.5 2L12 16",
};

function SpecItem({ icon, label, value, tone }: { icon: string; label: string; value: string; tone?: "on" | "off" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b14]/60 p-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          tone === "off" ? "border-white/10 bg-white/5 text-slate-500" : "border-[#c9a84c]/30 bg-[#c9a84c]/10 text-[#f0d080]"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={icon} />
        </svg>
      </span>
      <div className="min-w-0">
        <div className="text-[11px] text-slate-400">{label}</div>
        <div className={`truncate text-sm font-bold ${tone === "off" ? "text-slate-500" : "text-slate-100"}`}>{value}</div>
      </div>
    </div>
  );
}

function SpecGrid({ p }: { p: PropertyRow }) {
  const yn = (v: boolean) => (v ? "دارد" : "ندارد");
  return (
    <Section title="مشخصات ملک" icon="🧾">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SpecItem icon={SPEC_ICONS.area} label="متراژ" value={`${faDigits(p.area)} متر مربع`} />
        <SpecItem icon={SPEC_ICONS.bed} label="اتاق خواب" value={`${faDigits(p.bedrooms)} خواب`} />
        <SpecItem icon={SPEC_ICONS.bath} label="سرویس بهداشتی" value={`${faDigits(p.bathrooms)} عدد`} />
        <SpecItem icon={SPEC_ICONS.floor} label="طبقه" value={`${faDigits(p.floor)} از ${faDigits(p.totalFloors)}`} />
        <SpecItem icon={SPEC_ICONS.year} label="سال ساخت" value={faDigits(p.yearBuilt)} />
        <SpecItem icon={SPEC_ICONS.car} label="پارکینگ" value={yn(p.parking)} tone={p.parking ? "on" : "off"} />
        <SpecItem icon={SPEC_ICONS.box} label="انباری" value={yn(p.storage)} tone={p.storage ? "on" : "off"} />
        <SpecItem icon={SPEC_ICONS.balcony} label="بالکن" value={yn(p.balcony)} tone={p.balcony ? "on" : "off"} />
        <SpecItem icon={SPEC_ICONS.lift} label="آسانسور" value={yn(p.elevator)} tone={p.elevator ? "on" : "off"} />
      </div>
    </Section>
  );
}

function Gauge({ score, color }: { score: number; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tabular-nums" style={{ color }}>{faDigits(score)}</span>
        <span className="text-[10px] text-slate-400">از ۱۰۰</span>
      </div>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  const t = scoreTone(value);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold tabular-nums" style={{ color: t.color }}>٪{faDigits(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-700"
          style={{ width: `${value}%`, background: t.color }}
        />
      </div>
    </div>
  );
}

function ScoreCard({ p, tone }: { p: PropertyRow; tone: { color: string; label: string } }) {
  const subs = subScores(p);
  return (
    <Section title="امتیاز سلامت همسایگی" icon="🏘️">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-2">
          <Gauge score={p.neighborScore} color={tone.color} />
          <span
            className="rounded-lg border px-3 py-1 text-xs font-black"
            style={{ color: tone.color, borderColor: `${tone.color}55`, background: `${tone.color}14` }}
          >
            وضعیت {tone.label}
          </span>
        </div>

        <div className="w-full flex-1 space-y-3">
          {subs.map((s) => (
            <Meter key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      <p className="mt-5 rounded-2xl border border-white/10 bg-[#070b14]/60 p-4 text-xs leading-7 text-slate-400">
        این امتیاز از رفتار مالی و مشارکتی ساکنان ساختمان در محلهٔ {p.neighborhood} به دست می‌آید؛ هرچه بالاتر باشد،
        احتمال بروز اختلاف بر سر شارژ، تعمیرات و تصمیم‌های مشترک کمتر است.
      </p>
    </Section>
  );
}

function ValuationCard({ price, estimate, diff, below }: { price: number; estimate: number; diff: number; below: boolean }) {
  const lo = estimate * 0.85;
  const hi = estimate * 1.15;
  const pos = (v: number) => Math.max(2, Math.min(98, ((v - lo) / (hi - lo)) * 100));
  const accent = below ? "#34d399" : "#f0d080";

  return (
    <Section title="برآورد ارزش سامانه" icon="📊">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#070b14]/60 p-4">
          <div className="text-[11px] text-slate-400">قیمت آگهی</div>
          <div className="mt-1 text-xl font-black text-white">{toman(price)}</div>
          <div className="mt-1 text-[11px] tabular-nums text-slate-500">{money(price)}</div>
        </div>
        <div className="rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/10 p-4">
          <div className="text-[11px] text-slate-400">برآورد منصفانهٔ سامانه</div>
          <div className="mt-1 text-xl font-black text-[#f0d080]">{toman(estimate)}</div>
          <div className="mt-1 text-[11px] tabular-nums text-slate-500">{money(estimate)}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative h-3 rounded-full bg-gradient-to-l from-rose-500/25 via-white/10 to-emerald-500/25">
          {/* خط برآورد */}
          <span className="absolute -top-1.5 h-6 w-0.5 bg-white/40" style={{ right: "50%" }} aria-hidden />
          {/* نشانگر قیمت آگهی */}
          <span
            className="absolute -top-2 h-7 w-7 rounded-full border-2 shadow-lg"
            style={{ right: `calc(${pos(price)}% - 14px)`, borderColor: accent, background: "#0a0e1a" }}
            aria-hidden
          >
            <span className="absolute inset-1.5 rounded-full" style={{ background: accent }} />
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] tabular-nums text-slate-500">
          <span>{toman(Math.round(lo))}</span>
          <span className="text-slate-400">برآورد سامانه</span>
          <span>{toman(Math.round(hi))}</span>
        </div>
      </div>

      <p
        className="mt-5 rounded-2xl border p-4 text-sm font-bold"
        style={{ color: accent, borderColor: `${accent}44`, background: `${accent}12` }}
        aria-live="polite"
      >
        قیمت این آگهی ٪{faDec(Math.abs(diff))} {below ? "زیر" : "بالای"} برآورد سامانه است.
        <span className="mt-1 block text-[11px] font-medium text-slate-400">
          برآورد بر پایهٔ متراژ، سال ساخت، امتیاز همسایگی و معامله‌های مشابه محله محاسبه شده و جای چانه‌زنی را نشان می‌دهد.
        </span>
      </p>
    </Section>
  );
}

function CelebCard({ p }: { p: PropertyRow }) {
  return (
    <section className={`${CARD} overflow-hidden`}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-2xl" aria-hidden>
          ⭐
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black text-white">همسایهٔ شاخص این ساختمان</h2>
          <p className="mt-1 text-sm text-slate-300">
            <span className="font-black text-[#f0d080]">{p.celebName}</span>
            {p.celebProfession ? <span className="text-slate-400"> — {p.celebProfession}</span> : null}
          </p>
          <p className="mt-2 text-xs leading-7 text-slate-400">
            این اطلاع با رضایت صریح خود ایشان منتشر شده است. شمارهٔ واحد، طبقه و هیچ نشانی دقیقی از محل سکونت ایشان
            نمایش داده نمی‌شود و در بازدید حضوری نیز در اختیار کسی قرار نمی‌گیرد.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#070b14]/60 px-5 py-3 text-[11px] text-slate-500 sm:px-6">
        احترام به حریم خصوصی ساکنان، شرط ماندگاری این بخش است.
      </div>
    </section>
  );
}

function LocationCard({ p }: { p: PropertyRow }) {
  const px = 20 + (Math.abs(p.lng * 100) % 60);
  const py = 20 + (Math.abs(p.lat * 100) % 60);
  const points = accessPoints(p);

  return (
    <Section title="موقعیت و دسترسی‌ها" icon="🗺️">
      <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#070b14]">
        {/* نقشهٔ تزئینی — بدون سرویس بیرونی تا خروجی کاملاً استاتیک بماند */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={`grid-${p.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M8 0H0V8" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${p.id})`} />
          <path d="M0 62 H100" stroke="rgba(201,168,76,.22)" strokeWidth="2.4" />
          <path d="M34 0 V100" stroke="rgba(201,168,76,.16)" strokeWidth="1.8" />
          <path d="M0 26 H100" stroke="rgba(255,255,255,.07)" strokeWidth="1.2" />
          <path d="M72 0 V100" stroke="rgba(255,255,255,.07)" strokeWidth="1.2" />
          <circle cx="18" cy="80" r="9" fill="rgba(16,185,129,.10)" />
          <circle cx="84" cy="34" r="7" fill="rgba(16,185,129,.08)" />
        </svg>

        <div className="absolute" style={{ right: `${px}%`, top: `${py}%`, transform: "translate(50%, -100%)" }}>
          <span className="map-pin flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#c9a84c] bg-[#0a0e1a] shadow-[0_0_24px_rgba(201,168,76,.5)]">
            <span className="h-3 w-3 rounded-full bg-[#c9a84c]" />
          </span>
        </div>

        <div className="absolute bottom-3 right-3 rounded-xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-sm">
          <div className="text-[11px] font-bold text-slate-200">{p.neighborhood}</div>
          <div className="mt-0.5 text-[10px] tabular-nums text-slate-400" dir="ltr">
            {faDigits(p.lat.toFixed(4))} , {faDigits(p.lng.toFixed(4))}
          </div>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {points.map((a) => (
          <li key={a.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#070b14]/60 px-4 py-3">
            <span className="flex items-center gap-2 text-xs text-slate-300">
              <span aria-hidden>{a.icon}</span>
              {a.label}
            </span>
            <span className="text-xs font-bold tabular-nums text-[#f0d080]">{meters(a.m)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-slate-500">فاصله‌ها تقریبی و بر پایهٔ مسیر پیاده محاسبه شده‌اند.</p>
    </Section>
  );
}

function AgentCard({ p, onVisit }: { p: PropertyRow; onVisit: () => void }) {
  const initials = p.agentName.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return (
    <section className={`${CARD} p-5`}>
      <h2 className="mb-4 text-sm font-black text-white">مشاور این آگهی</h2>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 text-base font-black text-[#f0d080]">
          {initials}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-slate-100">{p.agentName}</div>
          <div className="text-[11px] text-slate-400">مشاور املاک مُلک‌آی</div>
        </div>
      </div>

      <a
        href={`tel:${p.agentPhone}`}
        aria-label={`تماس با ${p.agentName}`}
        className={`mt-4 flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/10 text-sm font-black text-emerald-300 transition-colors hover:bg-emerald-500/20 ${RING}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
          <path d="M3 5a2 2 0 012-2h2.6a1 1 0 01.95.68l1.2 3.3a1 1 0 01-.27 1.06l-1.6 1.5a14 14 0 006.1 6.1l1.5-1.6a1 1 0 011.06-.27l3.3 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z" />
        </svg>
        <span dir="ltr" className="tabular-nums">{faDigits(p.agentPhone)}</span>
      </a>

      <button
        type="button"
        onClick={onVisit}
        className={`btn-gold mt-3 h-12 w-full rounded-xl text-sm font-black ${RING}`}
        aria-label="درخواست بازدید از این ملک"
      >
        درخواست بازدید
      </button>

      <p className="mt-3 text-[11px] leading-6 text-slate-500">
        هماهنگی بازدید رایگان است و پیش از تأیید مشاور، هیچ هزینه‌ای دریافت نمی‌شود.
      </p>
    </section>
  );
}

function QuickFacts({ p }: { p: PropertyRow }) {
  const rows: [string, string][] = [
    ["نوع ملک", TYPE_LABEL[p.propertyType] ?? "ملک"],
    ["نوع معامله", LISTING_LABEL[p.listingType] ?? "فروش"],
    ["شهر", cityFa(p.city)],
    ["محله", p.neighborhood],
    ["قیمت هر متر", perMeter(p.price, p.area)],
    ["کد آگهی", faDigits(String(1000 + p.id))],
  ];
  return (
    <section className={`${CARD} p-5`}>
      <h2 className="mb-3 text-sm font-black text-white">خلاصهٔ آگهی</h2>
      <dl className="divide-y divide-white/10 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-slate-400">{k}</dt>
            <dd className="truncate font-bold text-slate-200">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SimilarList({ items }: { items: PropertyRow[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10" aria-label="آگهی‌های مشابه">
      <h2 className="mb-4 text-lg font-black text-white">آگهی‌های مشابه</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Link
            key={s.id}
            href={`/property/${s.id}`}
            className={`${CARD} group overflow-hidden transition-colors hover:border-[#c9a84c]/40 ${RING}`}
            aria-label={`مشاهدهٔ ${s.title}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#070b14]">
              <Shot src={s.imageUrl} alt={s.title} className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105" />
              <span className="absolute top-3 right-3 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-slate-200">
                {LISTING_LABEL[s.listingType] ?? "فروش"}
              </span>
            </div>
            <div className="p-4">
              <div className="truncate text-sm font-black text-slate-100">{s.title}</div>
              <div className="mt-1 truncate text-[11px] text-slate-400">{s.address}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-black text-[#f0d080]">{toman(s.price)}</span>
                <span className="text-[11px] tabular-nums text-slate-400">{faDigits(s.area)} متر</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────── مودال بازدید ────────────────────────── */

function nextDate(days: number) {
  try {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return new Intl.DateTimeFormat("fa-IR").format(d);
  } catch {
    return "";
  }
}

function VisitModal({ p, onClose }: { p: PropertyRow; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const ph = enDigits(phone).replace(/\D/g, "");
    if (n.length < 3) {
      setErr("نام و نام خانوادگی را کامل بنویسید.");
      return;
    }
    if (!/^09\d{9}$/.test(ph)) {
      setErr("شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ آغاز شود.");
      return;
    }
    if (!date.trim()) {
      setErr("تاریخ ترجیحی بازدید را وارد کنید.");
      return;
    }
    setErr("");
    setDone(true);
  };

  const chips = [
    { label: "فردا", v: nextDate(1) },
    { label: "پس‌فردا", v: nextDate(2) },
    { label: "هفتهٔ آینده", v: nextDate(7) },
  ].filter((c) => c.v);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="visit-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1424] p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,.95)] drop-in"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="visit-title" className="text-base font-black text-white">درخواست بازدید</h2>
            <p className="mt-1 truncate text-xs text-slate-400">{p.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجرهٔ درخواست بازدید"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 ${RING}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="mt-6 text-center" aria-live="polite">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-500/10 text-2xl" aria-hidden>
              ✓
            </span>
            <p className="mt-4 text-sm font-black text-emerald-300">درخواست شما ثبت شد</p>
            <p className="mt-2 text-xs leading-7 text-slate-400">
              {p.agentName} تا کمتر از یک روز کاری برای هماهنگی نهایی بازدید با شما تماس می‌گیرد.
            </p>
            <button type="button" onClick={onClose} className={`btn-gold mt-5 h-11 w-full rounded-xl text-sm font-black ${RING}`}>
              بستن
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
            <div>
              <label htmlFor="v-name" className="mb-1.5 block text-xs text-slate-400">نام و نام خانوادگی</label>
              <input
                id="v-name"
                ref={firstRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field text-sm"
                placeholder="مثلاً زهرا رستمی"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="v-phone" className="mb-1.5 block text-xs text-slate-400">شمارهٔ موبایل</label>
              <input
                id="v-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                dir="ltr"
                className="input-field text-sm tabular-nums"
                placeholder="09121234567"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="v-date" className="mb-1.5 block text-xs text-slate-400">تاریخ ترجیحی بازدید</label>
              <input
                id="v-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field text-sm"
                placeholder="۱۴۰۴/۰۶/۲۰"
              />
              {chips.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setDate(c.v)}
                      className={`rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 transition-colors hover:border-[#c9a84c]/40 hover:text-[#f0d080] ${RING}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {err ? (
              <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-300">
                {err}
              </p>
            ) : null}

            <button type="submit" className={`btn-gold h-12 w-full rounded-xl text-sm font-black ${RING}`}>
              ثبت درخواست بازدید
            </button>
            <p className="text-[11px] text-slate-500">این فرم دمو است و اطلاعات شما جایی ارسال نمی‌شود.</p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────── پیام‌ها ────────────────────────── */

function Toast({ toast }: { toast: { kind: "ok" | "err"; text: string } | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[75] flex justify-center px-4" aria-live="polite" aria-atomic="true">
      {toast ? (
        <div
          className={`drop-in rounded-2xl border px-5 py-3 text-xs font-black shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur-md ${
            toast.kind === "ok"
              ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
              : "border-rose-400/50 bg-rose-500/15 text-rose-200"
          }`}
        >
          {toast.text}
        </div>
      ) : null}
    </div>
  );
}
