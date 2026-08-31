"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { faDigits, toman } from "@/lib/format";

/**
 * کیف کارت‌های بانکی — سه کارت که داخل جیب چرمی نشسته‌اند و با hover/focus باز می‌شوند.
 * صحنه ۴۲۰ پیکسل ارتفاع دارد تا بازشدن کامل کارت‌ها از کادر بیرون نزند.
 * جابه‌جایی‌ها با style درون‌خطی محاسبه می‌شوند (نه کلاس) تا ترتیب اولویت CSS
 * بین «hover روی صحنه» و «hover روی خود کارت» قطعی و قابل پیش‌بینی بماند.
 */

export type WalletCardData = {
  id: string;
  label: string;
  bank: string;
  /** ۱۶ رقم بدون فاصله */
  digits: string;
  balance: number;
  expiry: string;
  gradient: string;
};

export const DEMO_CARDS: WalletCardData[] = [
  {
    id: "card-mellat",
    label: "کارت اعتباری",
    bank: "بانک ملت",
    digits: "6104337712450098",
    balance: 18_400_000,
    expiry: "07/08",
    gradient: "bg-gradient-to-bl from-indigo-500 via-violet-700 to-slate-900",
  },
  {
    id: "card-saman",
    label: "کارت همراه",
    bank: "بانک سامان",
    digits: "6219861044120031",
    balance: 7_250_000,
    expiry: "05/07",
    gradient: "bg-gradient-to-bl from-emerald-400 via-emerald-700 to-[#062b22]",
  },
  {
    id: "card-gold",
    label: "کارت طلایی مُلک‌آی",
    bank: "بانک ملی ایران",
    digits: "6037991123456789",
    balance: 64_900_000,
    expiry: "11/09",
    gradient: "bg-gradient-to-bl from-[#f0d080] via-[#c9a84c] to-[#6b4f10]",
  },
];

function Chip() {
  return (
    <span
      aria-hidden
      className="relative block h-6 w-8 overflow-hidden rounded-[5px] bg-gradient-to-br from-yellow-100 via-amber-300 to-yellow-600 shadow-inner"
    >
      <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-black/30" />
      <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-black/30" />
      <span className="absolute inset-y-1 left-[30%] w-px bg-black/20" />
      <span className="absolute inset-y-1 left-[70%] w-px bg-black/20" />
    </span>
  );
}

function Contactless() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="opacity-80"
      aria-hidden
    >
      <path d="M8.5 15.5a5 5 0 010-7" />
      <path d="M5.5 18a9 9 0 010-12" />
      <path d="M11.5 13a2 2 0 010-2" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <line x1="3" y1="3" x2="21" y2="21" /> : null}
    </svg>
  );
}

const group4 = (d: string) => (d.match(/.{1,4}/g) ?? []).join(" ");

type Props = {
  cards?: WalletCardData[];
  holderName?: string;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export default function WalletCards({ cards = DEMO_CARDS, holderName = "کاربر مهمان", selectedId = null, onSelect }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const total = cards.reduce((s, c) => s + c.balance, 0);
  const n = cards.length;

  return (
    <div dir="rtl" className="flex flex-col items-center">
      <div
        className="relative h-[420px] w-[300px] select-none"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          setOpen(false);
          setHovered(null);
        }}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={() => setOpen(false)}
      >
        {/* هالهٔ طلایی پشت کیف */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-[#c9a84c]/20 blur-3xl"
        />

        {/* پشت جیب */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 z-[5] h-[200px] w-[290px] -translate-x-1/2 rounded-t-[22px] rounded-b-[60px] bg-[#070b14] shadow-[inset_0_25px_35px_rgba(0,0,0,0.6)]"
        />

        {cards.map((card, i) => {
          const isSelected = selectedId === card.id;
          const isHovered = hovered === card.id;
          const isFront = i === n - 1;

          // موقعیت استراحت: هر کارت ۳۴ پیکسل بالاتر از کارت جلویی‌اش
          const rest = 96 + (n - 1 - i) * 34;
          const fanY = -(88 - i * 36);
          const fanR = i === 0 ? -6 : i === 1 ? 3 : 0;

          let transform = isFront ? "scale(1.02)" : "none";
          if (open) transform = `translateY(${fanY}px) rotate(${fanR}deg)`;
          if (isSelected) transform = "translateY(-78px) scale(1.03)";
          if (isHovered) transform = "translateY(-86px) scale(1.05)";

          const style: CSSProperties = {
            bottom: rest,
            zIndex: isHovered ? 50 : isSelected ? 45 : 10 + i * 5,
            transform,
            transformOrigin: "bottom center",
            transition: reduce ? "none" : "transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease",
          };

          const shell = `absolute left-[18px] h-[150px] w-[264px] rounded-2xl p-4 text-right text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_-6px_22px_rgba(0,0,0,0.45)] ${card.gradient} ${
            isSelected ? "ring-2 ring-[#f0d080] ring-offset-2 ring-offset-[#0a0e1a]" : ""
          } ${onSelect ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]" : ""}`;

          const body = (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(115deg,rgba(255,255,255,0.2)_0%,transparent_38%)]"
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <span className="block text-[13px] font-bold leading-tight">{card.label}</span>
                    <span className="block text-[10px] opacity-75">{card.bank}</span>
                  </div>
                  <span className="flex items-center gap-2">
                    <Contactless />
                    <Chip />
                  </span>
                </div>

                <p dir="ltr" className="text-center text-[13px] font-semibold tracking-[3px] text-white/85">
                  {revealed ? faDigits(group4(card.digits)) : "•••• •••• •••• ••••"}
                </p>

                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[9px] opacity-70">دارندهٔ کارت</span>
                    <span className="block truncate text-[11px] font-semibold">{holderName}</span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] opacity-70">
                      انقضا {revealed ? faDigits(card.expiry) : "••/••"}
                    </span>
                    <span className="block text-[13px] font-black">
                      {revealed ? toman(card.balance) : "••••••"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          );

          if (!onSelect) {
            return (
              <motion.div
                key={card.id}
                initial={reduce ? false : { y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className={shell}
                style={style}
              >
                {body}
              </motion.div>
            );
          }

          return (
            <motion.button
              key={card.id}
              type="button"
              initial={reduce ? false : { y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={() => onSelect(card.id)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(card.id)}
              onBlur={() => setHovered(null)}
              aria-pressed={isSelected}
              aria-label={`انتخاب ${card.label} ${card.bank} با شمارهٔ منتهی به ${faDigits(card.digits.slice(-4))}`}
              className={shell}
              style={style}
            >
              {body}
            </motion.button>
          );
        })}

        {/* جلوی جیب */}
        <div
          className="absolute bottom-0 left-1/2 z-40 h-[160px] w-[290px] -translate-x-1/2 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
          onMouseEnter={() => setHovered(null)}
        >
          <svg className="h-full w-full" viewBox="0 0 280 160" fill="none" aria-hidden>
            <path
              d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
              fill="#070b14"
            />
            <path
              d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
              stroke="rgba(201,168,76,0.45)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </svg>

          <div className="absolute inset-x-0 top-[38px] z-50 flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-black tracking-wide gold-text-gradient">
              {revealed ? toman(total) : "✱✱✱✱✱✱"}
            </span>
            <span className="text-[11px] font-medium text-slate-400">موجودی کل کیف پول</span>
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-pressed={revealed}
              aria-label={revealed ? "پنهان‌کردن موجودی و شمارهٔ کارت‌ها" : "نمایش موجودی و شمارهٔ کارت‌ها"}
              className="mt-1 grid h-11 w-11 place-items-center rounded-full border border-[#c9a84c]/50 text-[#f0d080] transition hover:bg-[#c9a84c]/10 motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080]"
            >
              <EyeIcon off={!revealed} />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-1 text-center text-xs text-slate-500">
        {onSelect ? "برای انتخاب، روی کارت بزنید" : "برای دیدن کارت‌ها نشانگر را روی کیف ببرید"}
      </p>
    </div>
  );
}
