import type { Metadata } from "next";
import SavedClient from "./SavedClient";

export const metadata: Metadata = {
  title: "نشان‌شده‌ها",
  description:
    "ملک‌هایی که در مُلک‌آی نشان کرده‌اید؛ همه در یک صفحه، آمادهٔ بررسی دوباره و مقایسهٔ کنار هم.",
  alternates: { canonical: "/saved" },
  openGraph: {
    title: "نشان‌شده‌ها | مُلک‌آی",
    description: "فهرست ملک‌های نشان‌شدهٔ شما، آمادهٔ مقایسه.",
    url: "/saved",
  },
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return <SavedClient />;
}
