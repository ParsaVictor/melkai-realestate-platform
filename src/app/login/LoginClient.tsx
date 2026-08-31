"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import AuthShell from "@/components/auth/AuthShell";
import OtpOrbitInput, { normalizeDigits, type OtpStatus } from "@/components/auth/OtpOrbitInput";
import { StoreProvider, useStore, type DemoUser } from "@/lib/store";
import { faDigits } from "@/lib/format";

type Role = DemoUser["role"];
type Step = "phone" | "otp" | "profile" | "done";

const DEMO_CODE = "1234";
const RESEND_SECONDS = 60;

const STEPS: { key: Step; label: string }[] = [
  { key: "phone", label: "شماره موبایل" },
  { key: "otp", label: "کد تأیید" },
  { key: "profile", label: "پروفایل" },
];

const ROLES: { key: Role; label: string; hint: string; d: string }[] = [
  { key: "buyer", label: "خریدار", hint: "دنبال خانه‌ام", d: "M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2z" },
  { key: "owner", label: "مالک", hint: "ملک دارم", d: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M10 11h4" },
  { key: "manager", label: "مدیر ساختمان", hint: "برج مدیریت می‌کنم", d: "M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" },
];

const ROLE_LABEL: Record<Role, string> = { buyer: "خریدار", owner: "مالک", manager: "مدیر ساختمان" };

/** فقط ارقام لاتین را نگه می‌دارد و به ۱۱ رقم می‌بُرد */
function cleanPhone(raw: string) {
  return normalizeDigits(raw).replace(/\D/g, "").slice(0, 11);
}

function phoneError(phone: string): string | null {
  if (!phone) return "شمارهٔ موبایل را وارد کنید.";
  if (!phone.startsWith("09")) return "شمارهٔ موبایل باید با ۰۹ شروع شود.";
  if (phone.length !== 11) return `شمارهٔ موبایل باید ۱۱ رقم باشد؛ الان ${faDigits(phone.length)} رقم است.`;
  return null;
}

const FIELD =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus-visible:border-[#c9a84c] focus-visible:bg-[#c9a84c]/5 focus-visible:ring-2 focus-visible:ring-[#c9a84c]/30";

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1424]";

/**
 * اگر StoreProvider بالای درخت نصب باشد از همان استفاده می‌کنیم و اگر نه،
 * فقط برای این صفحه یکی می‌سازیم. این‌طور صفحه هم مستقل کار می‌کند و هم
 * بعد از نصب Provider در layout، دو نسخهٔ جدا از فروشگاه ساخته نمی‌شود.
 * useContext همیشه یک‌بار اجرا می‌شود، پس ترتیب هوک‌ها ثابت می‌ماند.
 */
export default function LoginClient() {
  let hasStore = true;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useStore();
  } catch {
    hasStore = false;
  }

  if (!hasStore) {
    return (
      <StoreProvider>
        <LoginFlow />
      </StoreProvider>
    );
  }
  return <LoginFlow />;
}

function LoginFlow() {
  const { ready, user, signIn, signOut } = useStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [phoneMsg, setPhoneMsg] = useState<string | null>(null);

  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameMsg, setNameMsg] = useState<string | null>(null);

  // تایمرهای دمو را هنگام unmount پاک می‌کنیم تا روی صفحهٔ رفته setState نزنند
  const timers = useRef<number[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // شمارش معکوس ارسال مجدد
  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, seconds]);

  function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    const err = phoneError(phone);
    setPhoneMsg(err);
    if (err) return;
    setOtp("");
    setOtpStatus("idle");
    setOtpMsg(null);
    setSeconds(RESEND_SECONDS);
    setStep("otp");
  }

  const verify = useCallback(
    (code: string) => {
      setOtpStatus("checking");
      setOtpMsg(null);
      later(() => {
        if (code === DEMO_CODE) {
          setOtpStatus("success");
          later(() => setStep("profile"), 950);
        } else {
          setOtpStatus("error");
          setOtpMsg("کد وارد‌شده درست نیست. برای دمو کد ۱۲۳۴ را بزنید.");
          later(() => {
            setOtp("");
            setOtpStatus("idle");
          }, 1500);
        }
      }, 1100);
    },
    [later],
  );

  function resend() {
    if (seconds > 0) return;
    setOtp("");
    setOtpStatus("idle");
    setOtpMsg(null);
    setSeconds(RESEND_SECONDS);
  }

  function submitProfile(e: React.FormEvent) {
    e.preventDefault();
    const first = firstName.trim();
    const last = lastName.trim();
    if (first.length < 2) {
      setNameMsg("نام باید دست‌کم ۲ حرف باشد.");
      return;
    }
    if (last.length < 2) {
      setNameMsg("نام خانوادگی باید دست‌کم ۲ حرف باشد.");
      return;
    }
    setNameMsg(null);
    signIn({ name: `${first} ${last}`, phone, role, since: new Date().toISOString() });
    setStep("done");
  }

  const stepIndex = Math.max(0, STEPS.findIndex((s) => s.key === step));

  const shellTitle = step === "done" ? "خوش آمدید" : user ? "حساب کاربری شما" : "ورود به مُلک‌آی";
  const shellSubtitle =
    step === "done"
      ? "حساب دمو ساخته شد. از اینجا می‌توانید کارتان را شروع کنید."
      : user
        ? "شما وارد شده‌اید. برای ورود با شمارهٔ دیگر، ابتدا خارج شوید."
        : "با شمارهٔ موبایل وارد شوید — بدون رمز عبور، در سه گام کوتاه.";

  return (
    <>
      <Navbar />

      <AuthShell eyebrow="حساب کاربری" title={shellTitle} subtitle={shellSubtitle}>
        {!ready ? (
          <LoginSkeleton />
        ) : step === "done" && user ? (
          <SuccessPanel name={user.name} />
        ) : user ? (
          <AccountPanel user={user} onSignOut={signOut} />
        ) : (
          <>
            <StepBar current={stepIndex} />

            {step === "phone" && (
              <form onSubmit={submitPhone} noValidate className="mt-6 space-y-5">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-200">
                    شمارهٔ موبایل
                  </label>
                  <input
                    id="phone"
                    dir="ltr"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={phone ? faDigits(phone) : ""}
                    onChange={(e) => {
                      setPhone(cleanPhone(e.target.value));
                      if (phoneMsg) setPhoneMsg(null);
                    }}
                    aria-invalid={phoneMsg ? true : undefined}
                    aria-describedby={phoneMsg ? "phone-error" : "phone-hint"}
                    className={`${FIELD} text-center text-lg font-bold tracking-[0.2em]`}
                  />
                  {phoneMsg ? (
                    <p id="phone-error" role="alert" className="mt-2 text-xs font-bold text-rose-400">
                      {phoneMsg}
                    </p>
                  ) : (
                    <p id="phone-hint" className="mt-2 text-xs text-slate-500">
                      کد تأیید به همین شماره پیامک می‌شود.
                    </p>
                  )}
                </div>

                <fieldset>
                  <legend className="mb-2 block text-sm font-bold text-slate-200">با چه نقشی وارد می‌شوید؟</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => {
                      const active = role === r.key;
                      return (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRole(r.key)}
                          aria-pressed={active}
                          aria-label={`نقش ${r.label} — ${r.hint}`}
                          className={`${RING} flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-all duration-200 motion-safe:hover:-translate-y-0.5 ${
                            active
                              ? "border-[#c9a84c]/70 bg-[#c9a84c]/10 text-[#f0d080]"
                              : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25"
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                            aria-hidden="true"
                          >
                            <path d={r.d} />
                          </svg>
                          <span className="text-xs font-bold leading-tight">{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <button type="submit" className={`btn-gold ${RING} w-full rounded-xl py-3 text-sm`}>
                  دریافت کد تأیید
                </button>
              </form>
            )}

            {step === "otp" && (
              <div className="mt-6 space-y-5">
                <p className="text-center text-sm text-slate-400">
                  کد چهار رقمی به{" "}
                  <span dir="ltr" className="font-bold text-[#f0d080]">
                    {faDigits(phone)}
                  </span>{" "}
                  پیامک شد.
                </p>

                <OtpOrbitInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={verify}
                  status={otpStatus}
                  length={4}
                />

                <p className="text-center text-xs text-slate-500">
                  کد دمو: <span className="font-black text-[#c9a84c]">۱۲۳۴</span>
                </p>

                {otpMsg && (
                  <p role="alert" className="text-center text-xs font-bold text-rose-400">
                    {otpMsg}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-xs">
                  {seconds > 0 ? (
                    <span className="text-slate-500">
                      ارسال مجدد کد تا {faDigits(seconds)} ثانیهٔ دیگر
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={resend}
                      className={`${RING} rounded-lg px-2 py-1 font-bold text-[#c9a84c] underline-offset-4 hover:underline`}
                    >
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === "profile" && (
              <form onSubmit={submitProfile} noValidate className="mt-6 space-y-5">
                <p className="text-center text-sm text-slate-400">
                  شماره تأیید شد. فقط نامتان مانده تا حساب کامل شود.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="mb-2 block text-sm font-bold text-slate-200">
                      نام
                    </label>
                    <input
                      id="first-name"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (nameMsg) setNameMsg(null);
                      }}
                      placeholder="پارسا"
                      className={FIELD}
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="mb-2 block text-sm font-bold text-slate-200">
                      نام خانوادگی
                    </label>
                    <input
                      id="last-name"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (nameMsg) setNameMsg(null);
                      }}
                      placeholder="کارکوتی"
                      className={FIELD}
                    />
                  </div>
                </div>

                {nameMsg && (
                  <p role="alert" className="text-xs font-bold text-rose-400">
                    {nameMsg}
                  </p>
                )}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
                  <Row label="شماره" value={faDigits(phone)} ltr />
                  <Row label="نقش" value={ROLE_LABEL[role]} />
                </div>

                <button type="submit" className={`btn-gold ${RING} w-full rounded-xl py-3 text-sm`}>
                  ساخت حساب و ورود
                </button>
              </form>
            )}

            {step !== "phone" && (
              <button
                type="button"
                onClick={() => {
                  if (step === "otp") {
                    setStep("phone");
                    setOtp("");
                    setOtpStatus("idle");
                    setOtpMsg(null);
                  } else {
                    setOtp("");
                    setOtpStatus("idle");
                    setOtpMsg(null);
                    setSeconds(RESEND_SECONDS);
                    setStep("otp");
                  }
                }}
                disabled={otpStatus === "checking" || otpStatus === "success"}
                className={`${RING} mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2.5 text-xs font-bold text-slate-400 transition-colors hover:border-white/25 hover:text-slate-200 disabled:opacity-40`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
                بازگشت به مرحلهٔ قبل
              </button>
            )}
          </>
        )}
      </AuthShell>

      <FooterSection />
    </>
  );
}

/* ───────────────────────── اجزای کوچک ───────────────────────── */

function StepBar({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="مراحل ورود">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.key} className="flex-1" aria-current={active ? "step" : undefined}>
            <div
              className={`h-1 rounded-full transition-colors duration-500 ${
                done ? "bg-emerald-400/70" : active ? "bg-[#c9a84c]" : "bg-white/10"
              }`}
            />
            <p
              className={`mt-2 text-center text-[11px] font-bold transition-colors duration-300 ${
                active ? "text-[#f0d080]" : done ? "text-emerald-300/80" : "text-slate-600"
              }`}
            >
              {faDigits(i + 1)}. {s.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-500">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className="font-bold text-slate-200">
        {value}
      </span>
    </div>
  );
}

function SuccessPanel({ name }: { name: string }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-emerald-300" aria-hidden="true">
          <path d="M4 12.5 9.5 18 20 6" />
        </svg>
      </div>

      <p className="text-lg font-extrabold text-white">
        {name} عزیز، خوش آمدید!
      </p>
      <p className="text-sm text-slate-400">حسابتان ساخته شد. از کجا شروع می‌کنید؟</p>

      <div className="grid gap-2.5">
        <a href="/#search" className={`btn-gold ${RING} rounded-xl py-3 text-center text-sm`}>
          جستجوی ملک
        </a>
        <Link
          href="/saved"
          className={`${RING} rounded-xl border border-white/10 bg-white/[0.03] py-3 text-center text-sm font-bold text-slate-200 transition-colors hover:border-[#c9a84c]/50 hover:text-[#f0d080]`}
        >
          نشان‌شده‌های من
        </Link>
        <Link
          href="/submit"
          className={`${RING} rounded-xl border border-emerald-400/50 bg-emerald-500/10 py-3 text-center text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20`}
        >
          ثبت ملک
        </Link>
      </div>
    </div>
  );
}

function AccountPanel({ user, onSignOut }: { user: DemoUser; onSignOut: () => void }) {
  const since = new Date(user.since);
  const sinceText = Number.isNaN(since.getTime())
    ? user.since
    : faDigits(since.toLocaleDateString("fa-IR-u-ca-persian"));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9a84c]/50 bg-[#c9a84c]/10 text-lg font-black text-[#f0d080]"
        >
          {user.name.trim().charAt(0) || "؟"}
        </div>
        <div className="min-w-0">
          <p className="truncate font-extrabold text-white">{user.name}</p>
          <p dir="ltr" className="text-left text-xs text-slate-400">
            {faDigits(user.phone)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs">
        <Row label="نقش" value={ROLE_LABEL[user.role]} />
        <Row label="عضو از" value={sinceText} />
      </div>

      <div className="grid gap-2.5">
        <a href="/#search" className={`btn-gold ${RING} rounded-xl py-3 text-center text-sm`}>
          جستجوی ملک
        </a>
        <Link
          href="/saved"
          className={`${RING} rounded-xl border border-white/10 bg-white/[0.03] py-3 text-center text-sm font-bold text-slate-200 transition-colors hover:border-[#c9a84c]/50 hover:text-[#f0d080]`}
        >
          نشان‌شده‌های من
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className={`${RING} rounded-xl border border-rose-400/40 bg-rose-500/10 py-3 text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/20`}
        >
          خروج از حساب
        </button>
      </div>
    </div>
  );
}

/** تا وقتی localStorage خوانده نشده، اسکلتون هم‌شکل نشان می‌دهیم تا hydration نلغزد */
function LoginSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="h-4 w-28 rounded bg-white/10" />
      <div className="h-12 rounded-xl bg-white/5" />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[76px] rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-12 rounded-xl bg-white/10" />
      <span className="sr-only">در حال بارگذاری فرم ورود</span>
    </div>
  );
}
