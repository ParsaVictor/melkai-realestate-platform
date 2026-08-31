"use client";

import { useState, useEffect, useRef } from "react";

interface StatItem {
  value: number;
  suffix: string;
  prefix: string;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
}

const STATS: StatItem[] = [
  {
    value: 12000,
    suffix: "+",
    prefix: "",
    label: "ملک فعال",
    sublabel: "در سراسر تهران و کلانشهرها",
    icon: "🏠",
    color: "text-blue-400",
  },
  {
    value: 500,
    suffix: "+",
    prefix: "",
    label: "ساختمان هوشمند",
    sublabel: "تحت مدیریت سیستم ما",
    icon: "🏢",
    color: "text-[#c9a84c]",
  },
  {
    value: 95,
    suffix: "%",
    prefix: "",
    label: "رضایت کاربران",
    sublabel: "امتیاز از ۱۰۰٪ مشتریان",
    icon: "⭐",
    color: "text-green-400",
  },
  {
    value: 85,
    suffix: "",
    prefix: "",
    label: "محله تهران",
    sublabel: "پوشش کامل محله‌های شهر",
    icon: "📍",
    color: "text-purple-400",
  },
  {
    value: 8,
    suffix: " میلیارد",
    prefix: "",
    label: "حجم معاملات",
    sublabel: "ارزش معاملات انجام‌شده (تومان)",
    icon: "💰",
    color: "text-amber-400",
  },
  {
    value: 24,
    suffix: "/۷",
    prefix: "",
    label: "پشتیبانی",
    sublabel: "ساعت در روز، هفت روز هفته",
    icon: "🛡",
    color: "text-red-400",
  },
];

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

function StatCard({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(stat.value, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="stat-card rounded-2xl p-6 text-center hover:-translate-y-2 transition-all duration-300">
      <div className="text-3xl mb-3 float-animation" style={{ animationDelay: `${Math.random() * 2}s` }}>
        {stat.icon}
      </div>
      <div className={`text-3xl md:text-4xl font-black mb-1 counter-value ${stat.color}`}>
        {stat.prefix}
        {count.toLocaleString("fa-IR")}
        {stat.suffix}
      </div>
      <div className="text-white font-bold text-lg mb-1">{stat.label}</div>
      <div className="text-slate-500 text-xs">{stat.sublabel}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #c9a84c 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            ارقام <span className="gold-text-gradient">واقعی</span>
          </h2>
          <p className="text-slate-500 text-sm">پلتفرم ما در اعداد</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Partner logos / trust bar */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm mb-6">مورد اعتماد بیش از ۵۰,۰۰۰ کاربر در سراسر ایران</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            {["بانک ملی", "بیمه ایران", "ثبت اسناد", "اتحادیه مشاوران", "وزارت مسکن"].map((partner) => (
              <div
                key={partner}
                className="px-5 py-2 border border-white/10 rounded-xl text-sm text-slate-400 hover:opacity-100 transition-opacity"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
