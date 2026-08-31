import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export default function PropertyNotFound() {
  return (
    <>
      <Navbar />
      <main className="grid-bg flex min-h-[70vh] items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d1424]/70 p-8 text-center backdrop-blur-md">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-3xl" aria-hidden>
            🔍
          </span>
          <h1 className="mt-5 text-xl font-black text-white">این آگهی پیدا نشد</h1>
          <p className="mt-3 text-sm leading-8 text-slate-400">
            ممکن است آگهی حذف شده باشد یا نشانی صفحه درست وارد نشده باشد. می‌توانید از فهرست املاک، ملک دلخواهتان را
            دوباره پیدا کنید.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#properties"
              className="btn-gold flex h-12 items-center justify-center rounded-xl px-6 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
            >
              دیدن فهرست املاک
            </Link>
            <Link
              href="/"
              className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-bold text-slate-200 transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
