import type { ReactNode } from "react";
import { faDigits } from "@/lib/format";

/* ── آیکون‌ها: SVG درون‌خطی، بدون وابستگی خارجی ── */

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.32 4.23 12.4c-.658-.204-.67-.658.136-.975l11.57-4.461c.548-.196 1.026.13.854.974z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.68-.36 1.03-.25 1.12.37 2.33.57 3.56.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ── داده ── */

export type SocialItem = {
  id: string;
  href: string;
  label: string;
  aria: string;
  color: string;
  icon: ReactNode;
};

export const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "telegram",
    href: "https://t.me/Parsa_Karkooti",
    label: "تلگرام",
    aria: "تلگرام — گفت‌وگوی مستقیم با پشتیبانی",
    color: "#229ED9",
    icon: <TelegramIcon />,
  },
  {
    id: "email",
    href: "mailto:1.parsa.karkooti@gmail.com",
    label: "ایمیل",
    aria: "ایمیل — ارسال پیام به تیم پشتیبانی",
    color: "#EA4335",
    icon: <EmailIcon />,
  },
  {
    id: "phone",
    href: "tel:09223688369",
    label: "تلفن",
    aria: `تلفن — تماس مستقیم با شمارهٔ ${faDigits("09223688369")}`,
    color: "#10b981",
    icon: <PhoneIcon />,
  },
  {
    id: "whatsapp",
    href: "https://wa.me/989223688369",
    label: "واتس‌اپ",
    aria: "واتس‌اپ — ارسال پیام در واتس‌اپ",
    color: "#25D366",
    icon: <WhatsAppIcon />,
  },
];

/* ── هندسهٔ سه اندازه؛ کلاس‌ها کامل نوشته شده‌اند تا Tailwind آن‌ها را ببیند ── */

type Size = "sm" | "md" | "lg";

const GEOMETRY: Record<
  Size,
  { tile: string; icon: string; ghosts: string[]; main: string; label: string }
> = {
  sm: {
    tile: "h-10 w-10",
    icon: "h-4 w-4",
    label: "text-[10px]",
    ghosts: [
      "",
      "motion-safe:group-hover/sl:translate-x-[3px] motion-safe:group-hover/sl:-translate-y-[3px]",
      "motion-safe:group-hover/sl:translate-x-[6px] motion-safe:group-hover/sl:-translate-y-[6px]",
      "motion-safe:group-hover/sl:translate-x-[9px] motion-safe:group-hover/sl:-translate-y-[9px]",
    ],
    main: "motion-safe:group-hover/sl:translate-x-[12px] motion-safe:group-hover/sl:-translate-y-[12px]",
  },
  md: {
    tile: "h-12 w-12",
    icon: "h-5 w-5",
    label: "text-[11px]",
    ghosts: [
      "",
      "motion-safe:group-hover/sl:translate-x-[4px] motion-safe:group-hover/sl:-translate-y-[4px]",
      "motion-safe:group-hover/sl:translate-x-[8px] motion-safe:group-hover/sl:-translate-y-[8px]",
      "motion-safe:group-hover/sl:translate-x-[12px] motion-safe:group-hover/sl:-translate-y-[12px]",
    ],
    main: "motion-safe:group-hover/sl:translate-x-[16px] motion-safe:group-hover/sl:-translate-y-[16px]",
  },
  lg: {
    tile: "h-14 w-14",
    icon: "h-6 w-6",
    label: "text-xs",
    ghosts: [
      "",
      "motion-safe:group-hover/sl:translate-x-[5px] motion-safe:group-hover/sl:-translate-y-[5px]",
      "motion-safe:group-hover/sl:translate-x-[10px] motion-safe:group-hover/sl:-translate-y-[10px]",
      "motion-safe:group-hover/sl:translate-x-[15px] motion-safe:group-hover/sl:-translate-y-[15px]",
    ],
    main: "motion-safe:group-hover/sl:translate-x-[20px] motion-safe:group-hover/sl:-translate-y-[20px]",
  },
};

const GHOST_OPACITY = [
  "group-hover/sl:opacity-20",
  "group-hover/sl:opacity-40",
  "group-hover/sl:opacity-60",
  "group-hover/sl:opacity-80",
];

/** تیره‌کردن رنگ برای گرادیان کاشی — بدون وابستگی به کتابخانه */
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 0xff) + amt);
  const b = clamp((n & 0xff) + amt);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

const isExternal = (href: string) => href.startsWith("http");

export interface SocialLinksProps {
  items?: SocialItem[];
  size?: Size;
  className?: string;
  /** برچسب فارسی برای کل فهرست (خوانده‌شده توسط صفحه‌خوان) */
  ariaLabel?: string;
}

export default function SocialLinks({
  items = SOCIAL_ITEMS,
  size = "md",
  className = "",
  ariaLabel = "راه‌های ارتباط با ما",
}: SocialLinksProps) {
  const g = GEOMETRY[size];

  return (
    <ul
      aria-label={ariaLabel}
      className={`flex flex-wrap items-start justify-center gap-x-9 gap-y-10 overflow-x-clip pt-5 pb-9 ${className}`}
    >
      {items.map((item) => {
        const external = isExternal(item.href);
        return (
          <li key={item.id}>
            <a
              href={item.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={item.aria}
              className={`group/sl relative block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#f0d080] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] ${g.tile}`}
            >
              {/* کاشی: چرخش + skew در هاور */}
              <span
                className={`relative block h-full w-full transition-transform duration-300 motion-safe:group-hover/sl:[transform:rotate(-35deg)_skew(20deg)]`}
              >
                {/* ۴ لایهٔ «روح» با تأخیر پلکانی */}
                {g.ghosts.map((shift, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    style={{ borderColor: item.color, transitionDelay: `${i * 60}ms` }}
                    className={`absolute inset-0 rounded-xl border opacity-0 transition-all duration-300 ${GHOST_OPACITY[i]} ${shift}`}
                  />
                ))}

                {/* کاشی اصلی */}
                <span
                  style={{
                    background: `linear-gradient(45deg, ${item.color} 0%, ${shade(
                      item.color,
                      -22,
                    )} 55%, ${item.color} 100%)`,
                  }}
                  className={`absolute inset-0 grid place-items-center rounded-xl text-white shadow-lg shadow-black/40 transition-all duration-300 group-hover/sl:shadow-xl ${g.main}`}
                >
                  <span className={g.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                </span>
              </span>

              {/* برچسب فارسی: از پایین بالا می‌آید */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap font-medium text-slate-400 opacity-0 transition-all duration-300 group-hover/sl:text-slate-200 group-hover/sl:opacity-100 motion-safe:translate-y-2 motion-safe:group-hover/sl:translate-y-0 ${g.label}`}
              >
                {item.label}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
