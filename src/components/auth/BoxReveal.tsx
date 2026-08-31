"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * تا قبل از mount مقدار false است تا نشانه‌گذاری سرور و کلاینت یکی بماند؛
 * بعد از آن اگر کاربر کاهش حرکت خواسته باشد، مدت انیمیشن‌ها صفر می‌شود.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && reduced === true;
}

/**
 * پردهٔ طلایی روی متن می‌نشیند و به سمت چپ کنار می‌رود تا متن از راست
 * (جهت خواندن فارسی) آشکار شود.
 */
export default function BoxReveal({
  children,
  delay = 0,
  duration = 0.45,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const still = useReducedMotionSafe();
  const d = still ? 0 : duration;
  const wait = still ? 0 : delay;

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d, delay: wait + d * 0.45, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <motion.span
        aria-hidden
        initial={{ x: "0%" }}
        animate={{ x: "-101%" }}
        transition={{ duration: d, delay: wait, ease: "easeIn" }}
        style={{ position: "absolute", inset: "2px 0", zIndex: 20, borderRadius: 8 }}
        className="block bg-gradient-to-l from-[#8b6914] via-[#c9a84c] to-[#f0d080]"
      />
    </div>
  );
}
