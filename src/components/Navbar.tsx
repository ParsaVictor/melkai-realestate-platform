"use client";


import Link from "next/link";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, ready } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#properties", label: "ملک‌ها" },
    { href: "#neighborhoods", label: "محله‌ها" },
    { href: "#management", label: "مدیریت هوشمند" },
    { href: "#features", label: "امکانات" },
    { href: "#about-us", label: "درباره ما" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" aria-label="مُلک‌آی — بازگشت به صفحهٔ اصلی" className="flex items-center gap-3 rounded-xl transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a84c]">
            <div className="relative">
              <img src="/images/logo.svg" alt="نشان مُلک‌آی" width={44} height={44} className="h-11 w-11 glow-gold rounded-xl" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#c9a84c] status-online"></div>
            </div>
            <div>
              <div className="font-black text-xl gold-text-gradient">مُلک‌آی</div>
              <div className="text-[10px] text-slate-400 -mt-1">پلتفرم هوشمند املاک</div>
            </div>
            <img src="/images/namad.svg" alt="نماد اعتماد الکترونیکی" width={30} height={35}
                 className="ms-2 hidden h-[35px] w-[30px] opacity-85 transition-opacity hover:opacity-100 lg:block" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 hover:text-[#c9a84c] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-[#c9a84c] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/saved" aria-label="نشان‌شده‌های من"
              className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-slate-300 transition-all hover:border-[#c9a84c]/50 hover:text-white">
              ♥
            </Link>
            <Link href={ready && user ? "/account" : "/login"}
              className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200">
              {ready && user ? "پنل کاربری" : "ورود"}
            </Link>
            <Link href="/submit" className="btn-gold rounded-xl px-5 py-2 text-sm">
              ثبت ملک
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl glass text-[#c9a84c]"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass rounded-2xl mb-4 p-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm text-slate-300 hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 rounded-xl transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href={ready && user ? "/account" : "/login"} className="flex-1 rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-center text-sm font-bold text-emerald-300">
                {ready && user ? "پنل کاربری" : "ورود"}
              </Link>
              <Link href="/submit" className="btn-gold flex-1 rounded-xl px-5 py-2 text-center text-sm">
                ثبت ملک
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
