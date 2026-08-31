"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { enDigits, faDigits } from "@/lib/format";

export type OtpStatus = "idle" | "checking" | "success" | "error";

/** ارقام فارسی و عربی را لاتین می‌کند تا اعتبارسنجی همیشه روی یک شکل انجام شود */
export function normalizeDigits(raw: string): string {
  return enDigits(raw).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** کمی از هدف جلو می‌زند و برمی‌گردد — حس «جا افتادن» می‌دهد، نه چرخش خطی */
const BRAKE = "cubic-bezier(0.34, 1.42, 0.32, 1)";
const POP = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** همهٔ انیمیشن‌ها با Web Animations API اجرا می‌شوند؛ پس هیچ CSS سراسری لازم نیست */
const canMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * ورودی کد تأیید: با کامل شدن کد، رقم‌ها دور مرکز می‌چرخند و در هسته جمع می‌شوند،
 * حلقه هنگام «بررسی» می‌چرخد و در پایان ✓ سبز یا ✗ قرمز با موج ظاهر می‌شود.
 *
 * این کامپوننت هیچ‌وقت خودش کد را نمی‌سنجد؛ فقط `status` را نمایش می‌دهد.
 */
export default function OtpOrbitInput({
  value,
  onChange,
  onComplete,
  status,
  length = 4,
  disabled = false,
  autoFocus = true,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  status: OtpStatus;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const digits = useMemo(
    () => Array.from({ length }, (_, i) => value[i] ?? ""),
    [value, length],
  );

  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const ringRef = useRef<SVGSVGElement | null>(null);
  const hubRef = useRef<HTMLSpanElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const checkRef = useRef<SVGPathElement | null>(null);
  const crossRef = useRef<SVGPathElement | null>(null);

  const firedRef = useRef(false);
  const collapsedRef = useRef(false);

  const editable = status === "idle" && !disabled;

  const pop = useCallback((index: number) => {
    if (!canMotion()) return;
    slotRefs.current[index]?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.16)", offset: 0.45 }, { transform: "scale(1)" }],
      { duration: 260, easing: POP },
    );
  }, []);

  // فوکوس اولیه روی نخستین خانهٔ خالی
  useEffect(() => {
    if (!autoFocus) return;
    const first = Math.min(value.length, length - 1);
    inputRefs.current[first]?.focus();
    // فقط یک‌بار هنگام mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // کد کامل شد → یک‌بار به بالادست خبر بده. برگشت به idle دوباره مسلحش می‌کند.
  useEffect(() => {
    if (value.length < length) {
      firedRef.current = false;
      return;
    }
    if (status === "idle" && !firedRef.current) {
      firedRef.current = true;
      onComplete?.(value);
    }
  }, [value, length, status, onComplete]);

  // چرخش حلقه در حالت بررسی
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || status !== "checking" || !canMotion()) return;
    const spin = ring.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
      duration: 1150,
      iterations: Infinity,
      easing: "linear",
    });
    return () => spin.cancel();
  }, [status]);

  // با شروع بررسی، رقم‌ها دور هسته می‌چرخند و در آن فرو می‌روند
  useEffect(() => {
    if (status !== "checking" || collapsedRef.current) return;
    collapsedRef.current = true;
    if (!canMotion()) return;

    const hub = hubRef.current;
    if (!hub) return;
    const hubBox = hub.getBoundingClientRect();
    const hubX = hubBox.left + hubBox.width / 2;
    const hubY = hubBox.top + hubBox.height / 2;

    slotRefs.current.forEach((slot, index) => {
      if (!slot) return;
      const box = slot.getBoundingClientRect();
      // مبدأ چرخش را روی هسته می‌بریم تا rotate ساده یک دایرهٔ دقیق بکشد
      slot.style.transformOrigin = `${hubX - box.left}px ${hubY - box.top}px`;
      slot.animate(
        [
          { transform: "rotate(0deg) scale(1)", opacity: 1, offset: 0 },
          { transform: "rotate(430deg) scale(0.22)", opacity: 1, offset: 0.85 },
          { transform: "rotate(450deg) scale(0)", opacity: 0, offset: 1 },
        ],
        { duration: 640, delay: index * 45, easing: BRAKE, fill: "forwards" },
      );
    });
  }, [status]);

  // حکم نهایی: خط آیکون کشیده می‌شود، آیکون با کمی جهش می‌آید و موج بیرون می‌زند
  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    if (!canMotion()) return;

    const path = status === "success" ? checkRef.current : crossRef.current;
    const runs: Animation[] = [];

    if (path) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      runs.push(
        path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
          duration: 400,
          delay: 70,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }),
      );
    }

    const icon = iconRef.current?.animate(
      [
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.3)", opacity: 1, offset: 0.6 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 460, easing: POP, fill: "both" },
    );
    if (icon) runs.push(icon);

    const bounce = hubRef.current?.animate(
      [{ transform: "scale(0.82)" }, { transform: "scale(1.2)", offset: 0.55 }, { transform: "scale(1)" }],
      { duration: 400, easing: POP },
    );
    if (bounce) runs.push(bounce);

    const ripple = rippleRef.current?.animate(
      [
        { transform: "scale(0.7)", opacity: 0.85 },
        { transform: "scale(2.7)", opacity: 0 },
      ],
      { duration: 720, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    if (ripple) runs.push(ripple);

    return () => runs.forEach((a) => a.cancel());
  }, [status]);

  // برگشت به idle (تلاش دوباره): خانه‌ها را سر جایشان برگردان
  useEffect(() => {
    if (status !== "idle") return;
    collapsedRef.current = false;
    slotRefs.current.forEach((slot) => {
      if (!slot) return;
      slot.getAnimations().forEach((a) => a.cancel());
      slot.style.transformOrigin = "";
    });
  }, [status]);

  function commit(next: string[]) {
    onChange(next.join("").slice(0, length));
  }

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    commit(next);
  }

  function fillFrom(index: number, chars: string) {
    const next = digits.slice();
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    commit(next);
    for (let i = index; i < cursor; i++) {
      window.setTimeout(() => pop(i), (i - index) * 45);
    }
    const focusAt = Math.min(cursor, length - 1);
    window.setTimeout(() => inputRefs.current[focusAt]?.focus(), 0);
  }

  function handleChange(index: number, raw: string) {
    if (!editable) return;
    const clean = normalizeDigits(raw).replace(/\D/g, "");

    if (!clean) {
      setDigit(index, "");
      return;
    }
    if (clean.length === 1) {
      setDigit(index, clean);
      pop(index);
      if (index < length - 1) inputRefs.current[index + 1]?.focus();
      return;
    }
    // دو رقمی یعنی کاربر روی رقم موجود تایپ کرده؛ بیشتر یعنی چسباندن یا تکمیل خودکار پیامک
    const previous = digits[index];
    if (clean.length === 2 && previous) {
      const typed = clean[0] === previous ? clean[1] : clean[0];
      setDigit(index, typed);
      pop(index);
      if (index < length - 1) inputRefs.current[index + 1]?.focus();
      return;
    }
    fillFrom(index, clean);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (!editable) return;

    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        setDigit(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }
    if (e.key === "Delete") {
      e.preventDefault();
      setDigit(index, "");
      return;
    }
    // ردیف همیشه ltr است، پس چپ یعنی خانهٔ قبلی و راست یعنی بعدی
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      inputRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      inputRefs.current[length - 1]?.focus();
    }
  }

  function handlePaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    if (!editable) return;
    const text = normalizeDigits(e.clipboardData.getData("text")).replace(/\D/g, "");
    if (!text) return;
    e.preventDefault();
    fillFrom(index, text);
  }

  const ringTone =
    status === "success"
      ? "text-emerald-400"
      : status === "error"
        ? "text-rose-400"
        : status === "checking"
          ? "text-[#c9a84c]"
          : "text-white/20";

  const hubTone =
    status === "success"
      ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-300"
      : status === "error"
        ? "border-rose-400/70 bg-rose-500/10 text-rose-300"
        : status === "checking"
          ? "border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#f0d080]"
          : "border-white/15 bg-white/5 text-white/35";

  const statusText =
    status === "checking"
      ? "در حال بررسی کد تأیید"
      : status === "success"
        ? "کد تأیید درست بود"
        : status === "error"
          ? "کد تأیید نادرست بود"
          : "";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg
          ref={ringRef}
          viewBox="0 0 100 100"
          className={`absolute inset-0 h-full w-full transition-colors duration-300 ${ringTone}`}
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={status === "idle" || status === "checking" ? "2 8" : undefined}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {(status === "success" || status === "error") && (
          <span
            ref={rippleRef}
            aria-hidden="true"
            className={`pointer-events-none absolute h-10 w-10 rounded-full border opacity-0 ${
              status === "success" ? "border-emerald-400" : "border-rose-400"
            }`}
          />
        )}

        <span
          ref={hubRef}
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${hubTone}`}
        >
          {status === "success" && (
            <span ref={iconRef} className="flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  ref={checkRef}
                  d="M4 12.5 9.5 18 20 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          {status === "error" && (
            <span ref={iconRef} className="flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  ref={crossRef}
                  d="M6 6 18 18M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
        </span>
      </div>

      <div dir="ltr" className="flex justify-center gap-2.5" role="group" aria-label="کد تأیید چهار رقمی">
        {digits.map((digit, i) => (
          <div
            key={i}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
          >
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              value={digit ? faDigits(digit) : ""}
              disabled={!editable}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              onFocus={(e) => e.currentTarget.select()}
              aria-label={`رقم ${faDigits(i + 1)} از ${faDigits(length)}`}
              className="h-14 w-12 rounded-2xl border border-white/10 bg-white/5 text-center text-2xl font-black text-[#f0d080] outline-none transition-all duration-200 focus-visible:border-[#c9a84c] focus-visible:bg-[#c9a84c]/10 focus-visible:ring-2 focus-visible:ring-[#c9a84c]/40 disabled:opacity-70"
            />
          </div>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {statusText}
      </p>
    </div>
  );
}
