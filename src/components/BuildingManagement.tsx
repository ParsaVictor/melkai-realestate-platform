"use client";


import { buildingDemo } from "@/data/building";
import { useState } from "react";

interface Resident {
  id: number;
  name: string;
  unitNumber: string | null;
  floor: number | null;
  isPaid: boolean | null;
  debtAmount: number | null;
  phone: string | null;
  isActive: boolean | null;
}

interface Building {
  id: number;
  name: string;
  address: string | null;
  totalUnits: number | null;
  floors: number | null;
  monthlyCharge: number | null;
  adminName: string | null;
}

interface Announcement {
  id: number;
  title: string;
  content: string | null;
  priority: string | null;
  createdAt: string | null;
}

interface BuildingData {
  building: Building;
  residents: Resident[];
  announcements: Announcement[];
}

export default function BuildingManagement() {
  const [buildingData, setBuildingData] = useState<BuildingData | null>(
    buildingDemo as unknown as BuildingData,
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPayment, setShowPayment] = useState<number | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState("");


  const handlePayment = async (residentId: number) => {
    try {
      setBuildingData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          residents: prev.residents.map(r =>
            r.id === residentId ? { ...r, isPaid: true, debtAmount: 0 } : r
          ),
        };
      });
      setShowPayment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const paidCount = buildingData?.residents.filter(r => r.isPaid).length ?? 0;
  const unpaidCount = buildingData?.residents.filter(r => !r.isPaid).length ?? 0;
  const totalDebt = buildingData?.residents.reduce((sum, r) => sum + (r.debtAmount ?? 0), 0) ?? 0;
  const monthlyCharge = buildingData?.building.monthlyCharge ?? 500000;
  const totalMonthly = (buildingData?.building.totalUnits ?? 0) * monthlyCharge;
  const collectedAmount = paidCount * monthlyCharge;

  return (
    <section id="management" className="section-rhythm relative px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse at 30% 50%, #c9a84c 0%, transparent 60%)" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-4">
            <span className="text-[#c9a84c]">🏢</span>
            <span className="text-sm text-[#c9a84c]">پنل مدیریت ساختمان (دمو)</span>
          </div>
          <h2 className="text-3xl font-black leading-tight md:text-5xl">
            <span className="text-white">پنل زندهٔ</span>{" "}
            <span className="gold-text-gradient">مدیریت ساختمان</span>
          </h2>
          <div className="section-divider mb-4"></div>
          <p className="mx-auto max-w-3xl text-sm leading-8 text-white/65 md:text-base">
            همان چیزی که مدیر هر روز با آن کار می‌کند: ساکنین، صورت‌حساب‌ها، اعلان‌ها و
            تیکت‌های تعمیرات — با دادهٔ واقعی و قابل کلیک.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">در حال بارگذاری پنل...</p>
          </div>
        ) : !buildingData ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-400">ساختمانی یافت نشد</p>
          </div>
        ) : (
          <div className="management-panel p-6 md:p-8">
            {/* Building header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{buildingData.building.name}</h3>
                  <p className="text-sm text-slate-400">{buildingData.building.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full status-online"></span>
                    <span className="text-xs text-green-400">سیستم آنلاین</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">مدیر: {buildingData.building.adminName}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="glass px-4 py-2 rounded-xl text-sm text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/10 transition-all">
                  📊 گزارش ماهانه
                </button>
                <button className="btn-gold px-5 py-2 rounded-xl text-sm font-bold">
                  📱 ارسال پیامک
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {[
                { value: "dashboard", label: "داشبورد", icon: "📊" },
                { value: "residents", label: "ساکنین", icon: "👥" },
                { value: "payments", label: "پرداخت‌ها", icon: "💳" },
                { value: "announcements", label: "اعلان‌ها", icon: "📢" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.value
                      ? "tab-active"
                      : "glass text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard tab */}
            {activeTab === "dashboard" && (
              <div>
                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "کل واحدها", value: buildingData.building.totalUnits ?? 0, icon: "🏠", color: "text-blue-400", sub: "واحد" },
                    { label: "پرداخت‌شده", value: paidCount, icon: "✅", color: "text-green-400", sub: "واحد" },
                    { label: "معوقه", value: unpaidCount, icon: "⚠️", color: "text-red-400", sub: "واحد" },
                    { label: "درآمد ماه", value: collectedAmount, icon: "💰", color: "text-[#c9a84c]", sub: "تومان", format: true },
                  ].map((stat) => (
                    <div key={stat.label} className="stat-card rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className={`text-2xl font-black ${stat.color}`}>
                        {stat.format
                          ? `${(stat.value / 1000000).toFixed(1)}م`
                          : stat.value.toLocaleString("fa-IR")}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Collection progress */}
                <div className="glass rounded-2xl p-5 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-white">پیشرفت جمع‌آوری شارژ این ماه</span>
                    <span className="text-sm text-[#c9a84c] font-bold">
                      {totalMonthly > 0 ? Math.round((collectedAmount / totalMonthly) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${totalMonthly > 0 ? (collectedAmount / totalMonthly) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #c9a84c, #f0d080)",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>جمع‌آوری‌شده: {collectedAmount.toLocaleString("fa-IR")} تومان</span>
                    <span>هدف ماه: {totalMonthly.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="glass rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-white mb-4">📋 آخرین فعالیت‌ها</h4>
                  <div className="space-y-2">
                    {[
                      { icon: "✅", text: "محمد رضایی شارژ واحد ۱۰۱ را پرداخت کرد", time: "۵ دقیقه پیش", color: "text-green-400" },
                      { icon: "⚠️", text: "یادآوری شارژ برای واحد ۲۰۱ ارسال شد", time: "۱ ساعت پیش", color: "text-yellow-400" },
                      { icon: "💧", text: "فشار آب واحد ۲۰۱ به ۶۰٪ کاهش یافت", time: "۲ ساعت پیش", color: "text-blue-400" },
                      { icon: "📢", text: "اعلان جلسه هیئت‌مدیره ارسال شد", time: "دیروز", color: "text-[#c9a84c]" },
                    ].map((activity, i) => (
                      <div key={i} className="resident-row flex items-center gap-3 py-2.5">
                        <span className="text-xl">{activity.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm text-slate-300">{activity.text}</div>
                        </div>
                        <div className={`text-xs ${activity.color} whitespace-nowrap`}>{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Residents tab */}
            {activeTab === "residents" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-white/10">
                        <th className="py-3 px-4 text-right">ساکن</th>
                        <th className="py-3 px-4 text-right">واحد</th>
                        <th className="py-3 px-4 text-right">طبقه</th>
                        <th className="py-3 px-4 text-right">وضعیت</th>
                        <th className="py-3 px-4 text-right">بدهی</th>
                        <th className="py-3 px-4 text-right">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildingData.residents.map((resident) => (
                        <tr key={resident.id} className="resident-row">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-sm font-bold text-[#c9a84c]">
                                {resident.name[0]}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">{resident.name}</div>
                                <div className="text-xs text-slate-500">{resident.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-300">{resident.unitNumber}</td>
                          <td className="py-4 px-4 text-sm text-slate-300">طبقه {resident.floor}</td>
                          <td className="py-4 px-4">
                            {resident.isPaid ? (
                              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full">
                                ✅ پرداخت‌شده
                              </span>
                            ) : (
                              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1 rounded-full warning-glow">
                                ⚠️ معوقه
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {(resident.debtAmount ?? 0) > 0 ? (
                              <span className="text-red-400 text-sm font-bold">
                                {(resident.debtAmount ?? 0).toLocaleString("fa-IR")} ت
                              </span>
                            ) : (
                              <span className="text-green-400 text-sm">صفر</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              {!resident.isPaid && (
                                <button
                                  onClick={() => handlePayment(resident.id)}
                                  className="text-xs btn-gold px-3 py-1.5 rounded-lg"
                                >
                                  ثبت پرداخت
                                </button>
                              )}
                              <button className="text-xs glass px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5">
                                پیامک
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments tab */}
            {activeTab === "payments" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="stat-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">💳</span>
                      <h4 className="font-bold text-white">وضعیت شارژ ماه جاری</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">شارژ ماهانه هر واحد</span>
                        <span className="text-[#c9a84c] font-bold">{monthlyCharge.toLocaleString("fa-IR")} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">تعداد پرداخت‌شده</span>
                        <span className="text-green-400 font-bold">{paidCount} واحد</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">تعداد معوقه</span>
                        <span className="text-red-400 font-bold">{unpaidCount} واحد</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-slate-400 text-sm">مجموع بدهی</span>
                        <span className="text-red-400 font-black text-lg">{totalDebt.toLocaleString("fa-IR")} ت</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card rounded-2xl p-6">
                    <h4 className="font-bold text-white mb-4">📈 درآمد ۶ ماه گذشته</h4>
                    <div className="flex items-end gap-2 h-24">
                      {[75, 80, 65, 90, 85, 92].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-lg"
                            style={{
                              height: `${h}%`,
                              background: i === 5
                                ? "linear-gradient(180deg, #c9a84c, #8b6914)"
                                : "rgba(201,168,76,0.2)",
                            }}
                          ></div>
                          <span className="text-[9px] text-slate-500">
                            {["فر", "ارد", "خر", "تیر", "امر", "شهر"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Smart water control */}
                <div className="glass rounded-2xl p-6 border border-blue-500/20">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    💧 کنترل هوشمند آب
                    <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                      خودکار
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {buildingData.residents.map((resident) => (
                      <div key={resident.id} className="flex items-center gap-4 p-3 bg-white/3 rounded-xl">
                        <div className="text-sm font-bold text-white w-32">{resident.name}</div>
                        <div className="text-xs text-slate-400">واحد {resident.unitNumber}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: resident.isPaid ? "100%" : "60%",
                                background: resident.isPaid
                                  ? "linear-gradient(90deg, #10b981, #34d399)"
                                  : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className={`text-xs font-bold ${resident.isPaid ? "text-green-400" : "text-yellow-400"}`}>
                          {resident.isPaid ? "۱۰۰% — طبیعی" : "۶۰% — کاهش‌یافته"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    ⚠️ این سیستم آزمایشی است. در نسخه واقعی، کاهش فشار آب صرفاً پس از اخطار کتبی و مهلت قانونی انجام می‌شود.
                  </p>
                </div>
              </div>
            )}

            {/* Announcements tab */}
            {activeTab === "announcements" && (
              <div>
                <div className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="متن اعلان جدید..."
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      className="input-field flex-1"
                    />
                    <button className="btn-gold px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap">
                      📢 ارسال
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {buildingData.announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-2xl border ${
                        ann.priority === "high"
                          ? "bg-red-500/5 border-red-500/20"
                          : "glass"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{ann.priority === "high" ? "🚨" : "📢"}</span>
                        <div>
                          <div className="font-bold text-white">{ann.title}</div>
                          <div className="text-sm text-slate-400 mt-1">{ann.content}</div>
                          {ann.priority === "high" && (
                            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full mt-2 inline-block">
                              فوری
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
