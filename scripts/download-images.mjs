/**
 * Image Download Script
 * Run: npm run fetch:images
 * 
 * This script downloads all stock images listed in src/data/image-sources.ts
 * and saves them to the correct local paths.
 */

import { createWriteStream, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const IMAGE_SOURCES = [
  {
    filename: "pexels-interior-luxury-1.jpg",
    localPath: "public/images/stock/pexels-interior-luxury-1.jpg",
    downloadUrl: "https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    title: "اتاق نشیمن لوکس",
  },
  {
    filename: "pexels-interior-openplan.jpg",
    localPath: "public/images/stock/pexels-interior-openplan.jpg",
    downloadUrl: "https://images.pexels.com/photos/8135496/pexels-photo-8135496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    title: "اتاق نشیمن طرح باز",
  },
  {
    filename: "pexels-interior-minimal.jpg",
    localPath: "public/images/stock/pexels-interior-minimal.jpg",
    downloadUrl: "https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    title: "اتاق نشیمن مینیمال",
  },
  {
    filename: "pexels-interior-modern.jpg",
    localPath: "public/images/stock/pexels-interior-modern.jpg",
    downloadUrl: "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    title: "اتاق نشیمن مدرن",
  },
  {
    filename: "pexels-tehran-building.jpg",
    localPath: "public/images/stock/pexels-tehran-building.jpg",
    downloadUrl: "https://images.pexels.com/photos/12598504/pexels-photo-12598504.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    title: "ساختمان مدرن تهران",
  },
  {
    filename: "pexels-city-night.jpg",
    localPath: "public/images/stock/pexels-city-night.jpg",
    downloadUrl: "https://images.pexels.com/photos/8461634/pexels-photo-8461634.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    title: "شهر در شب",
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = join(ROOT, destPath);
    const dir = dirname(fullPath);
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const file = createWriteStream(fullPath);
    const protocol = url.startsWith("https") ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(fullPath);
      });
    }).on("error", (err) => {
      file.close();
      reject(err);
    });
  });
}

async function main() {
  console.log("🖼  Downloading stock images...\n");

  for (const img of IMAGE_SOURCES) {
    const fullPath = join(ROOT, img.localPath);
    
    if (existsSync(fullPath)) {
      console.log(`⏭  Already exists: ${img.filename}`);
      continue;
    }

    try {
      console.log(`⬇️  Downloading: ${img.title}`);
      console.log(`   From: ${img.downloadUrl}`);
      await downloadFile(img.downloadUrl, img.localPath);
      console.log(`✅  Saved: ${img.localPath}\n`);
    } catch (err) {
      console.error(`❌  Failed to download ${img.filename}:`, err.message);
    }
  }

  console.log("\n🎉 Image download complete!");
  console.log("\nFiles saved to:");
  IMAGE_SOURCES.forEach(img => console.log(`  - ${img.localPath}`));
}

main();
