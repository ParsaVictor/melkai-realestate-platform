import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "مقایسهٔ ملک‌ها",
  description:
    "تا چهار ملک را کنار هم بگذارید و قیمت، قیمت هر متر، متراژ، امکانات و امتیاز همسایگی‌شان را ردیف‌به‌ردیف مقایسه کنید.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "مقایسهٔ ملک‌ها | مُلک‌آی",
    description: "قیمت، متراژ، امکانات و امتیاز همسایگی — کنار هم و شفاف.",
    url: "/compare",
  },
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return <CompareClient />;
}
