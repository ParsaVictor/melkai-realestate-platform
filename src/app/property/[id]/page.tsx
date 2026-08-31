import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import { LISTING_LABEL, TYPE_LABEL, faDigits, toman } from "@/lib/format";
import PropertyDetail from "./PropertyDetail";
import type { PropertyRow } from "./PropertyDetail";

const SITE = "https://amlak-s46a.eshop3.pages.dev";
const ALL = properties as unknown as PropertyRow[];

// خروجی کاملاً استاتیک: فقط همین ۱۷ شناسه ساخته می‌شود
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL.map((p) => ({ id: String(p.id) }));
}

const findById = (id: string) => ALL.find((p) => String(p.id) === id);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = findById(id);
  if (!p) return { title: "آگهی یافت نشد" };

  const kind = `${LISTING_LABEL[p.listingType] ?? "فروش"} ${TYPE_LABEL[p.propertyType] ?? "ملک"}`;
  const title = `${p.title} — ${kind} در ${p.neighborhood}`;
  const description = `${kind} ${faDigits(p.area)} متری با ${faDigits(p.bedrooms)} خواب در ${p.address} — ${toman(
    p.price,
  )}. امتیاز سلامت همسایگی ${faDigits(p.neighborScore)} از ۱۰۰ و برآورد ارزش سامانه در صفحهٔ آگهی.`;

  return {
    title,
    description,
    alternates: { canonical: `/property/${p.id}` },
    openGraph: {
      type: "article",
      locale: "fa_IR",
      url: `${SITE}/property/${p.id}`,
      siteName: "مُلک‌آی",
      title,
      description,
      images: [{ url: p.imageUrl, width: 1200, height: 630, alt: p.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [p.imageUrl] },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = findById(id);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: `${SITE}/property/${p.id}`,
    image: `${SITE}${p.imageUrl}`,
    inLanguage: "fa-IR",
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address,
      addressLocality: p.city,
      addressCountry: "IR",
    },
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "IRR",
      availability: "https://schema.org/InStock",
      url: `${SITE}/property/${p.id}`,
      businessFunction:
        p.listingType === "sale" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
    },
    numberOfRooms: p.bedrooms,
    numberOfBathroomsTotal: p.bathrooms,
    floorLevel: String(p.floor),
    floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" },
    yearBuilt: p.yearBuilt,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "پارکینگ", value: p.parking },
      { "@type": "LocationFeatureSpecification", name: "آسانسور", value: p.elevator },
      { "@type": "LocationFeatureSpecification", name: "انباری", value: p.storage },
      { "@type": "LocationFeatureSpecification", name: "بالکن", value: p.balcony },
    ],
    broker: { "@type": "RealEstateAgent", name: p.agentName, telephone: p.agentPhone },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PropertyDetail id={p.id} />
    </>
  );
}
