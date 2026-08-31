// build-properties.mjs — ساخت دیتاست املاک دمو (۱۷ آگهی، ۶ شهر)
// اجرا: node scripts/build-properties.mjs
import fs from "node:fs";
import path from "node:path";

/** [عنوان, نوع, معامله, قیمت(تومان), متراژ, خواب, حمام, طبقه, کل‌طبقات, محله, شهر, lat, lng, سال, امتیازهمسایگی, مشهور?] */
const RAW = [
  ["آپارتمان لوکس در الهیه", "apartment", "sale", 85_000_000_000, 320, 4, 3, 12, 15, "الهیه", "تهران", 35.8147, 51.4273, 1401, 94, ["علی کریمی", "ستارهٔ فوتبال"]],
  ["ویلای مدرن در نیاوران", "villa", "sale", 150_000_000_000, 600, 6, 4, 1, 2, "نیاوران", "تهران", 35.8147, 51.4473, 1398, 91, ["مهناز افشار", "بازیگر سینما"]],
  ["آپارتمان بازسازی‌شده زعفرانیه", "apartment", "sale", 62_000_000_000, 180, 3, 2, 7, 10, "زعفرانیه", "تهران", 35.7947, 51.4173, 1400, 96, null],
  ["پنت‌هاوس جردن با نمای شهر", "apartment", "sale", 98_000_000_000, 260, 4, 3, 18, 18, "جردن", "تهران", 35.7712, 51.4189, 1402, 89, ["رضا صادقی", "خواننده"]],
  ["رهن کامل سعادت‌آباد", "apartment", "mortgage", 3_200_000_000, 125, 2, 2, 5, 9, "سعادت‌آباد", "تهران", 35.7861, 51.3702, 1399, 87, null],
  ["اجارهٔ اداری در ونک", "office", "rent", 145_000_000, 210, 0, 2, 6, 12, "ونک", "تهران", 35.7575, 51.4100, 1397, 82, null],
  ["آپارتمان نوساز شهرک غرب", "apartment", "sale", 47_500_000_000, 148, 3, 2, 8, 14, "شهرک غرب", "تهران", 35.7594, 51.3688, 1403, 92, null],
  ["واحد دوخوابه ولنجک", "apartment", "sale", 54_000_000_000, 160, 2, 2, 4, 8, "ولنجک", "تهران", 35.8072, 51.4021, 1401, 90, null],
  ["مغازهٔ تجاری تجریش", "shop", "rent", 320_000_000, 85, 0, 1, 1, 3, "تجریش", "تهران", 35.8046, 51.4265, 1395, 78, null],
  ["آپارتمان احمدآباد مشهد", "apartment", "sale", 18_500_000_000, 135, 3, 2, 6, 10, "احمدآباد", "مشهد", 36.2972, 59.5836, 1400, 88, null],
  ["واحد لوکس وکیل‌آباد", "apartment", "sale", 24_000_000_000, 175, 3, 2, 9, 12, "وکیل‌آباد", "مشهد", 36.3122, 59.5245, 1402, 91, null],
  ["آپارتمان معالی‌آباد شیراز", "apartment", "sale", 15_800_000_000, 128, 2, 2, 5, 8, "معالی‌آباد", "شیراز", 29.6222, 52.4890, 1399, 85, null],
  ["ویلای باغ قصردشت", "villa", "sale", 42_000_000_000, 420, 5, 3, 1, 2, "قصردشت", "شیراز", 29.6402, 52.4757, 1396, 83, null],
  ["آپارتمان مرداویج اصفهان", "apartment", "sale", 16_200_000_000, 140, 3, 2, 4, 7, "مرداویج", "اصفهان", 32.6205, 51.6680, 1401, 89, null],
  ["رهن و اجاره چهارباغ", "apartment", "rent", 68_000_000, 96, 2, 1, 3, 6, "چهارباغ", "اصفهان", 32.6572, 51.6676, 1394, 76, null],
  ["آپارتمان الهیهٔ کرمانشاه", "apartment", "sale", 9_400_000_000, 118, 2, 1, 3, 6, "الهیه", "کرمانشاه", 34.3277, 47.0778, 1400, 84, null],
  ["واحد ائل‌گلی تبریز", "apartment", "sale", 13_600_000_000, 132, 3, 2, 7, 11, "ائل‌گلی", "تبریز", 38.0455, 46.3402, 1402, 87, null],
];

const AGENTS = [
  ["امیر محمدی", "09121234567"],
  ["سارا احمدی", "09131234567"],
  ["پیمان رستمی", "09141234567"],
  ["نگار کاظمی", "09151234567"],
];

const DESCS = {
  apartment: "آپارتمانی با نورگیری عالی، پنجره‌های دوجداره و دسترسی مناسب به مترو و مراکز خرید. ساختمان دارای مدیریت فعال و صندوق ذخیرهٔ سالم است.",
  villa: "ویلای دوبلکس با حیاط اختصاصی، فضای سبز و پارکینگ چند خودرو. مناسب خانواده‌هایی که آرامش و حریم خصوصی برایشان اولویت است.",
  office: "واحد اداری با موقعیت تجاری عالی، آسانسور اختصاصی و پارکینگ. مناسب دفاتر شرکتی و استارتاپ‌ها.",
  shop: "مغازه با بر مناسب و پیاده‌روی پررفت‌وآمد، مناسب کسب‌وکارهای خرده‌فروشی و خدماتی.",
  land: "زمین با موقعیت مناسب و امکان ساخت طبق ضوابط شهرداری.",
};

const rows = RAW.map((r, i) => {
  const [title, propertyType, listingType, price, area, bedrooms, bathrooms, floor, totalFloors,
         neighborhood, city, lat, lng, yearBuilt, neighborScore, celeb] = r;
  const agent = AGENTS[i % AGENTS.length];
  return {
    id: i + 1,
    title,
    description: DESCS[propertyType],
    propertyType,
    listingType,
    status: "available",
    price,
    area,
    bedrooms,
    bathrooms,
    floor,
    totalFloors,
    parking: i % 7 !== 3,
    elevator: totalFloors > 2,
    storage: i % 5 !== 2,
    balcony: i % 4 !== 1,
    address: `${city}، ${neighborhood}`,
    neighborhood,
    city,
    lat,
    lng,
    imageUrl: `/images/properties/prop-${(i % 17) + 1}.webp`,
    neighborScore,
    // فقط نشانِ «ساکن شاخص تأییدشده» — هویت و حرفه هرگز ذخیره یا منتشر نمی‌شود
    hasCelebNeighbor: Boolean(celeb),
    celebName: null,
    celebProfession: null,
    yearBuilt,
    featured: i < 6,
    viewCount: 400 + ((i * 337) % 2100),
    agentName: agent[0],
    agentPhone: agent[1],
  };
});

const out = path.join(process.cwd(), "src", "data", "properties.ts");
fs.writeFileSync(
  out,
  `// تولید خودکار — scripts/build-properties.mjs\n` +
    `// دادهٔ دموی آگهی‌ها (${rows.length} مورد، ۶ شهر)\n\n` +
    `export type DemoProperty = (typeof properties)[number];\n\n` +
    `export const properties = ${JSON.stringify(rows, null, 2)} as const;\n\n` +
    `export default properties;\n`,
);

console.log(`نوشته شد: ${rows.length} آگهی`);
console.log("شهرها:", [...new Set(rows.map((r) => r.city))].join("، "));
console.log("نوع معامله:", JSON.stringify(rows.reduce((a, r) => ((a[r.listingType] = (a[r.listingType] || 0) + 1), a), {})));
