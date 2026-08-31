import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import FloatingActions from "@/components/FloatingActions";
import SubmitClient from "./SubmitClient";

export const metadata: Metadata = {
  title: "ثبت آگهی ملک",
  description:
    "ملک خود را در شش گام ثبت کنید: نوع معامله، موقعیت، مشخصات، قیمت‌گذاری هوشمند بر پایهٔ دادهٔ محله، تصاویر و انتخاب پلن انتشار.",
  alternates: { canonical: "/submit" },
  openGraph: {
    title: "ثبت آگهی ملک | مُلک‌آی",
    description: "قیمت‌گذاری هوشمند بر پایهٔ دادهٔ واقعی محله — ثبت آگهی رایگان با کمیسیون فقط هنگام فروش موفق.",
    url: "/submit",
  },
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0a0e1a]">
      <Navbar />
      <SubmitClient />
      <FooterSection />
      <FloatingActions />
    </main>
  );
}
