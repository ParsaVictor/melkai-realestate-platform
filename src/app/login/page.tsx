import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "ورود و ثبت‌نام",
  description:
    "ورود به مُلک‌آی با شمارهٔ موبایل و کد تأیید — بدون رمز عبور. نشان‌شده‌ها، مقایسه و ثبت ملک با یک حساب.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginClient />;
}
