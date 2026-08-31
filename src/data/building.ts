/**
 * دادهٔ پنل مدیریت ساختمان (دمو).
 * قبلاً از /api/buildings/1 می‌آمد؛ حالا استاتیک است تا در خروجی static
 * بدون درخواست شبکه و بدون تأخیر بارگذاری شود.
 * نام‌ها ساختگی‌اند و هیچ ارتباطی با اشخاص واقعی ندارند.
 */

export const buildingDemo = {
  building: {
    id: 1,
    name: "برج نیاوران",
    address: "تهران، نیاوران، خیابان دوستان، پلاک ۱۴",
    totalUnits: 32,
    floors: 8,
    monthlyCharge: 3_850_000,
    adminName: "فاطمه احمدی",
  },
  residents: [
    { id: 1, name: "مهدی رضایی", unitNumber: "۱۰۱", floor: 1, isPaid: true, debtAmount: 0, phone: "09121111110", isActive: true },
    { id: 2, name: "سارا محمدی", unitNumber: "۱۰۲", floor: 1, isPaid: false, debtAmount: 1_500_000, phone: "09121111112", isActive: true },
    { id: 3, name: "بهنام کریمی", unitNumber: "۱۰۳", floor: 1, isPaid: true, debtAmount: 0, phone: "09121111113", isActive: true },
    { id: 4, name: "نگار موسوی", unitNumber: "۲۰۱", floor: 2, isPaid: false, debtAmount: 2_400_000, phone: "09121111114", isActive: true },
    { id: 5, name: "امیر تهرانی", unitNumber: "۲۰۲", floor: 2, isPaid: true, debtAmount: 0, phone: "09121111115", isActive: true },
    { id: 6, name: "فاطمه احمدی", unitNumber: "۲۰۳", floor: 2, isPaid: true, debtAmount: 0, phone: "09121111116", isActive: true },
    { id: 7, name: "حسین نوری", unitNumber: "۳۰۱", floor: 3, isPaid: false, debtAmount: 4_200_000, phone: "09121111117", isActive: true },
    { id: 8, name: "مریم سلطانی", unitNumber: "۳۰۲", floor: 3, isPaid: true, debtAmount: 0, phone: "09121111118", isActive: true },
    { id: 9, name: "بهرام کاویانی", unitNumber: "۳۰۳", floor: 3, isPaid: true, debtAmount: 0, phone: "09121111119", isActive: true },
    { id: 10, name: "الهام قاسمی", unitNumber: "۴۰۱", floor: 4, isPaid: false, debtAmount: 900_000, phone: "09121111120", isActive: true },
    { id: 11, name: "کاوه اسدی", unitNumber: "۴۰۲", floor: 4, isPaid: true, debtAmount: 0, phone: "09121111121", isActive: true },
    { id: 12, name: "پریسا وفایی", unitNumber: "۴۰۳", floor: 4, isPaid: true, debtAmount: 0, phone: "09121111122", isActive: true },
  ],
  announcements: [
    {
      id: 1,
      title: "قطعی آب گرم روز پنجشنبه",
      content: "به دلیل سرویس دورهٔ‌ای موتورخانه، آب گرم پنجشنبه از ساعت ۹ تا ۱۳ قطع خواهد بود.",
      priority: "high",
      createdAt: "1405-06-01T09:00:00.000Z",
    },
    {
      id: 2,
      title: "مجمع عمومی سالانه",
      content: "مجمع عمومی ساختمان جمعه ساعت ۱۸ در سالن اجتماعات برگزار می‌شود. حضور همهٔ مالکین الزامی است.",
      priority: "high",
      createdAt: "1405-05-28T12:00:00.000Z",
    },
    {
      id: 3,
      title: "سرویس آسانسور انجام شد",
      content: "سرویس دوره‌ای آسانسور توسط شرکت مجاز انجام و تأییدیهٔ استاندارد تمدید شد.",
      priority: "normal",
      createdAt: "1405-05-20T10:00:00.000Z",
    },
    {
      id: 4,
      title: "یادآوری شارژ شهریور",
      content: "مهلت پرداخت شارژ شهریورماه تا دهم ماه است. لطفاً از طریق پنل اقدام کنید.",
      priority: "normal",
      createdAt: "1405-06-02T08:00:00.000Z",
    },
  ],
} as const;

export default buildingDemo;
