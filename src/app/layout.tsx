import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import ScrollProgress from "@/components/ScrollProgress";

const SITE = "https://amlak-s46a.eshop3.pages.dev";
const TITLE = "مُلک‌آی | خانه را با همسایه‌اش بخر — خرید، فروش و مدیریت هوشمند ملک";
const DESC =
  "قبل از خرید خانه، همسایه‌ات را بشناس. جستجوی هوشمند ملک، ارزش‌گذاری داده‌محور، شاخص سلامت همسایگی و پنل اختصاصی مدیریت ساختمان — همه در یک پلتفرم.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s | مُلک‌آی" },
  description: DESC,
  keywords: [
    "خرید ملک", "فروش آپارتمان", "اجاره خانه", "رهن کامل", "املاک تهران",
    "مدیریت ساختمان", "شارژ ساختمان", "ارزش‌گذاری ملک", "شاخص همسایگی",
    "آپارتمان مشهد", "ملک شیراز", "املاک اصفهان", "املاک تبریز", "املاک کرمانشاه",
  ],
  authors: [{ name: "مُلک‌آی" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE,
    siteName: "مُلک‌آی",
    title: TITLE,
    description: DESC,
    images: [{ url: "/images/hero/tehran-skyline.webp", width: 1200, height: 630, alt: "مُلک‌آی — پلتفرم هوشمند ملک" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/images/hero/tehran-skyline.webp"],
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "مُلک‌آی",
  description: DESC,
  url: SITE,
  image: `${SITE}/images/hero/tehran-skyline.webp`,
  telephone: "+989223688369",
  areaServed: ["تهران", "مشهد", "شیراز", "اصفهان", "کرمانشاه", "تبریز"],
  address: { "@type": "PostalAddress", addressCountry: "IR", addressLocality: "تهران" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/images/hero/tehran-skyline.webp" />
        <meta name="theme-color" content="#0a0e1a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="bg-[#0a0e1a] text-slate-200 antialiased">
        <StoreProvider>
          <ScrollProgress />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
