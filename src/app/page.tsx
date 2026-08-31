"use client";

import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import WhySection from "@/components/WhySection";
import NeighborScoreSection from "@/components/NeighborScoreSection";
import { EnforcementIntro, EnforcementGuarantees } from "@/components/EnforcementIntro";
import DigitalTwinTeaser from "@/components/DigitalTwinTeaser";
import BuildingManagement from "@/components/BuildingManagement";
import FeaturedProperties from "@/components/FeaturedProperties";
import CelebNeighborSection from "@/components/CelebNeighborSection";
import NeighborhoodSection from "@/components/NeighborhoodSection";
import ComparisonSection from "@/components/ComparisonSection";
import ResidentVoices from "@/components/ResidentVoices";
import RoadmapSection from "@/components/RoadmapSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import AdvisorsSection from "@/components/AdvisorsSection";
import FinalCTA from "@/components/FinalCTA";
import FooterSection from "@/components/FooterSection";
import SmartManagementSection from "@/components/SmartManagementSection";
import FloatingActions from "@/components/FloatingActions";
import type { Property } from "@/db/schema";
import { properties as staticProperties } from "@/data/properties";

const properties = staticProperties as unknown as Property[];

/** پوستهٔ هر بخش: ریتم یکسان، درز نرم، و snap ملایم روی دسکتاپ */
function Band({
  children,
  seam = true,
  defer = true,
}: {
  children: React.ReactNode;
  seam?: boolean;
  defer?: boolean;
}) {
  return (
    <div
      className={`snap-section ${seam ? "section-seam" : ""} ${defer ? "defer-paint" : ""}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="snap-root min-h-screen overflow-x-hidden bg-[#0a0e1a]">
      <Navbar />

      {/* ۱ — قلاب + جستجو */}
      <div className="snap-section">
        <HeroSection />
      </div>

      {/* ۲ — مسئله */}
      <Band seam={false}>
        <WhySection />
      </Band>

      {/* ۳ — موتور شمارهٔ ۱ */}
      <Band>
        <NeighborScoreSection />
      </Band>

      {/* ۴ — موتور شمارهٔ ۲ */}
      <Band>
        <section id="smart" className="section-rhythm">
          <EnforcementIntro />
          <div className="mt-12">
            <SmartManagementSection />
          </div>
          <EnforcementGuarantees />
        </section>
      </Band>

      {/* ۵ — دوقلوی دیجیتال (نسخهٔ نمایشی — سورس در ریپوی نمونه‌کار نیست) */}
      <Band>
        <DigitalTwinTeaser />
      </Band>

      {/* ۶ — پنل مدیریت */}
      <Band>
        <BuildingManagement />
      </Band>

      {/* ۷ — بازار */}
      <Band>
        <FeaturedProperties properties={properties} loading={false} />
      </Band>
      <Band>
        <CelebNeighborSection />
      </Band>
      <Band>
        <NeighborhoodSection />
      </Band>

      {/* ۸ — اثبات و اعتماد */}
      <Band>
        <ComparisonSection />
      </Band>
      <Band>
        <ResidentVoices />
      </Band>

      {/* ۹ — امکانات، ارقام، مسیر */}
      <Band>
        <FeaturesSection />
      </Band>
      <Band>
        <StatsSection />
      </Band>
      <Band>
        <RoadmapSection />
      </Band>

      {/* ۱۰ — آدم‌ها و اقدام نهایی */}
      <Band>
        <AdvisorsSection />
      </Band>
      <Band>
        <FinalCTA />
      </Band>

      <FooterSection />
      <FloatingActions />
    </main>
  );
}
