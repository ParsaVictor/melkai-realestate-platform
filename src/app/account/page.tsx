import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "پنل کاربری",
  description: "ساختمان من، نشان‌شده‌ها، آگهی‌های ثبت‌شده و وضعیت شارژ — همه در یک جا.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountClient />;
}
