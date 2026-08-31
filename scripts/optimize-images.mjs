// optimize-images.mjs — تبدیل تصاویر به WebP با اندازهٔ مناسب هر کاربرد
// اجرا: node scripts/optimize-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");

/** برای هر پوشه: حداکثر عرض و کیفیت */
const RULES = [
  { dir: "hero", width: 1800, quality: 70 },
  { dir: "sections", width: 1280, quality: 72 },
  { dir: "properties", width: 900, quality: 74 },
  { dir: "stock", width: 1100, quality: 72 },
  { dir: "generated", width: 1280, quality: 72 },
];

const walk = (d, acc = []) => {
  if (!fs.existsSync(d)) return acc;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jpe?g|png)$/i.test(e.name)) acc.push(p);
  }
  return acc;
};

let before = 0;
let after = 0;
const report = [];

for (const rule of RULES) {
  const dir = path.join(ROOT, rule.dir);
  for (const file of walk(dir)) {
    const out = file.replace(/\.(jpe?g|png)$/i, ".webp");
    const srcSize = fs.statSync(file).size;
    try {
      const meta = await sharp(file).metadata();
      const w = Math.min(rule.width, meta.width || rule.width);
      await sharp(file)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: rule.quality, effort: 5 })
        .toFile(out);
      const dstSize = fs.statSync(out).size;
      before += srcSize;
      after += dstSize;
      report.push({
        file: path.relative(ROOT, out).replace(/\\/g, "/"),
        w,
        kb: Math.round(dstSize / 1024),
        saved: Math.round((1 - dstSize / srcSize) * 100),
      });
    } catch (e) {
      report.push({ file: path.relative(ROOT, file), error: e.message.slice(0, 60) });
    }
  }
}

report.sort((a, b) => (b.kb ?? 0) - (a.kb ?? 0));
for (const r of report) {
  if (r.error) console.log(`  ✗ ${r.file} — ${r.error}`);
  else console.log(`  ${String(r.kb).padStart(4)}KB  ${String(r.w).padStart(4)}w  −${r.saved}%  ${r.file}`);
}
console.log(
  `\nمجموع: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB  (کاهش ${Math.round((1 - after / before) * 100)}٪)`,
);
