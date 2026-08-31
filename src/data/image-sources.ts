export interface ImageSource {
  filename: string;
  localPath: string;
  title: string;
  usage: string;
  type: "stock" | "ai-generated" | "placeholder";
  photographer?: string;
  sourceUrl?: string;
  downloadUrl?: string;
  license: string;
  width?: number;
  height?: number;
}

export const IMAGE_SOURCES: ImageSource[] = [
  // AI Generated Images (stored locally in /public/images/generated/)
  {
    filename: "hero-bg.jpg",
    localPath: "/images/generated/hero-bg.webp",
    title: "تصویر هیرو - افق شهر تهران در شب",
    usage: "بخش هیرو اصلی سایت (HeroSection)",
    type: "ai-generated",
    license: "تولیدشده با هوش مصنوعی - استفاده آزاد در این پروژه",
    width: 1200,
    height: 627,
  },
  {
    filename: "building-3d.jpg",
    localPath: "/images/generated/building-3d.webp",
    title: "تصویر ساختمان هوشمند سه‌بعدی",
    usage: "بخش ویژگی‌های پلتفرم (FeaturesSection)",
    type: "ai-generated",
    license: "تولیدشده با هوش مصنوعی - استفاده آزاد در این پروژه",
    width: 1200,
    height: 627,
  },
  {
    filename: "neighborhood-map.jpg",
    localPath: "/images/generated/neighborhood-map.webp",
    title: "نقشه تعاملی هوشمند محله‌های تهران",
    usage: "بخش محله‌های برتر (NeighborhoodSection)",
    type: "ai-generated",
    license: "تولیدشده با هوش مصنوعی - استفاده آزاد در این پروژه",
    width: 1200,
    height: 627,
  },
  {
    filename: "building-admin.jpg",
    localPath: "/images/generated/building-admin.webp",
    title: "داشبورد مدیریت هوشمند ساختمان",
    usage: "بخش مدیریت هوشمند (SmartManagementSection)",
    type: "ai-generated",
    license: "تولیدشده با هوش مصنوعی - استفاده آزاد در این پروژه",
    width: 1200,
    height: 627,
  },
  // Stock Photos from Pexels (used via URL - can be downloaded with script)
  {
    filename: "pexels-interior-luxury-1.jpg",
    localPath: "/images/stock/pexels-interior-luxury-1.webp",
    title: "اتاق نشیمن لوکس با لوستر",
    usage: "کارت ملک - آپارتمان الهیه",
    type: "stock",
    photographer: "Max Vakhtbovych",
    sourceUrl: "https://www.pexels.com/photo/sofa-in-living-room-8135492/",
    downloadUrl: "https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    license: "Pexels License - Free for commercial use, no attribution required",
    width: 1200,
    height: 627,
  },
  {
    filename: "pexels-interior-openplan.jpg",
    localPath: "/images/stock/pexels-interior-openplan.webp",
    title: "اتاق نشیمن طرح باز مدرن",
    usage: "کارت ملک - ویلا نیاوران",
    type: "stock",
    photographer: "Max Vakhtbovych",
    sourceUrl: "https://www.pexels.com/photo/a-clean-open-plan-interior-design-8135496/",
    downloadUrl: "https://images.pexels.com/photos/8135496/pexels-photo-8135496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    license: "Pexels License - Free for commercial use, no attribution required",
    width: 1200,
    height: 627,
  },
  {
    filename: "pexels-interior-minimal.jpg",
    localPath: "/images/stock/pexels-interior-minimal.webp",
    title: "اتاق نشیمن مینیمالیستی",
    usage: "کارت ملک - آپارتمان زعفرانیه",
    type: "stock",
    photographer: "Max Vakhtbovych",
    sourceUrl: "https://www.pexels.com/photo/minimalist-interior-design-of-living-room-7546323/",
    downloadUrl: "https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    license: "Pexels License - Free for commercial use, no attribution required",
    width: 1200,
    height: 627,
  },
  {
    filename: "pexels-interior-modern.jpg",
    localPath: "/images/stock/pexels-interior-modern.webp",
    title: "اتاق نشیمن مدرن با آشپزخانه باز",
    usage: "کارت ملک - پنت‌هاوس جردن",
    type: "stock",
    photographer: "Max Vakhtbovych",
    sourceUrl: "https://www.pexels.com/photo/an-interior-of-a-living-room-8089172/",
    downloadUrl: "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    license: "Pexels License - Free for commercial use, no attribution required",
    width: 1200,
    height: 627,
  },
  {
    filename: "pexels-tehran-building.jpg",
    localPath: "/images/stock/pexels-tehran-building.webp",
    title: "ساختمان طراحی مدرن تهران",
    usage: "کارت ملک - آپارتمان سعادت‌آباد",
    type: "stock",
    photographer: "Mahdi Bafande",
    sourceUrl: "https://www.pexels.com/photo/a-modernly-designed-building-12598504/",
    downloadUrl: "https://images.pexels.com/photos/12598504/pexels-photo-12598504.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    license: "Pexels License - Free for commercial use, no attribution required",
    width: 1200,
    height: 627,
  },
  {
    filename: "pexels-city-night.jpg",
    localPath: "/images/stock/pexels-city-night.webp",
    title: "نمای هوایی شهر در شب",
    usage: "کارت ملک - آپارتمان ونک",
    type: "stock",
    photographer: "Arash Mesri",
    sourceUrl: "https://www.pexels.com/photo/aerial-view-of-city-buildings-during-night-time-8461634/",
    downloadUrl: "https://images.pexels.com/photos/8461634/pexels-photo-8461634.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    license: "Pexels License - Free for commercial use, no attribution required",
    width: 1200,
    height: 627,
  },
];

export default IMAGE_SOURCES;
