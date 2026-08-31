// audit-links.mjs — بررسی خروجی static: لینک‌های شکسته، تصاویر گمشده، دکمه‌های بی‌عمل
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

const walk = (d, acc = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};

const files = walk(OUT);
const htmls = files.filter((f) => f.endsWith(".html"));
const assets = new Set(files.map((f) => "/" + path.relative(OUT, f).replace(/\\/g, "/")));

const pageExists = (href) => {
  const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "");
  if (clean === "") return true;
  return assets.has(`${clean}.html`) || assets.has(`${clean}/index.html`) || assets.has(clean);
};

let brokenLinks = 0;
let brokenImgs = 0;
let deadButtons = 0;
const problems = [];
const internalHrefs = new Set();
const imgSrcs = new Set();

for (const f of htmls) {
  const rel = "/" + path.relative(OUT, f).replace(/\\/g, "/");
  const html = fs.readFileSync(f, "utf8");

  for (const m of html.matchAll(/href="(\/[^"#][^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith("//") || href.startsWith("/_next/")) continue;
    internalHrefs.add(href);
    if (/\.(webp|jpg|png|svg|json|xml|txt|ico|css|js)$/i.test(href)) {
      if (!assets.has(href)) { brokenLinks++; problems.push(`${rel}  →  asset گمشده: ${href}`); }
    } else if (!pageExists(href)) {
      brokenLinks++;
      problems.push(`${rel}  →  صفحهٔ گمشده: ${href}`);
    }
  }

  for (const m of html.matchAll(/<img[^>]+src="(\/[^"]+)"/g)) {
    const src = m[1];
    if (src.startsWith("/_next/")) continue;
    imgSrcs.add(src);
    if (!assets.has(src)) { brokenImgs++; problems.push(`${rel}  →  تصویر گمشده: ${src}`); }
  }

  // دکمه‌هایی که نه onClick دارند نه type=submit — در HTML استاتیک قابل تشخیص نیست،
  // ولی دکمهٔ بدون هیچ متن/aria-label را می‌شود گرفت
  for (const m of html.matchAll(/<button([^>]*)>([\s\S]{0,80}?)<\/button>/g)) {
    const attrs = m[1];
    const inner = m[2].replace(/<[^>]+>/g, "").trim();
    if (!inner && !/aria-label=/.test(attrs)) {
      deadButtons++;
      problems.push(`${rel}  →  دکمهٔ بدون برچسب`);
    }
  }
}

console.log(`صفحات: ${htmls.length}`);
console.log(`لینک داخلی یکتا: ${internalHrefs.size}`);
console.log(`تصویر یکتا: ${imgSrcs.size}`);
console.log(`لینک شکسته: ${brokenLinks}`);
console.log(`تصویر گمشده: ${brokenImgs}`);
console.log(`دکمهٔ بدون برچسب: ${deadButtons}`);

if (problems.length) {
  console.log("\n— مشکلات —");
  for (const p of [...new Set(problems)].slice(0, 40)) console.log("  " + p);
  if (problems.length > 40) console.log(`  … و ${problems.length - 40} مورد دیگر`);
} else {
  console.log("\n✓ هیچ لینک شکسته یا تصویر گمشده‌ای پیدا نشد.");
}

console.log("\n— مسیرهای داخلی —");
for (const h of [...internalHrefs].sort()) console.log("  " + h);
