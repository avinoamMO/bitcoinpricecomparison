/**
 * Generate PWA icons as minimal valid SVG files wrapped in a data URI,
 * then convert to PNG using Next.js ImageResponse at build time.
 *
 * Since we can't easily generate PNGs without native dependencies,
 * this script creates SVG icons in the public/icons/ directory.
 * The manifest.json references these SVG files.
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");

function createIconSvg(size, maskable = false) {
  // Safe area for maskable icons is the inner 80% circle
  const padding = maskable ? size * 0.1 : 0;
  const bgSize = size;
  const fontSize = maskable ? size * 0.45 : size * 0.55;
  const borderRadius = maskable ? 0 : size * 0.18;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${bgSize}" height="${bgSize}" viewBox="0 0 ${bgSize} ${bgSize}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F7931A"/>
      <stop offset="100%" style="stop-color:#E8850F"/>
    </linearGradient>
  </defs>
  <rect width="${bgSize}" height="${bgSize}" rx="${borderRadius}" fill="#0a0a0a"/>
  <rect x="${padding}" y="${padding}" width="${bgSize - padding * 2}" height="${bgSize - padding * 2}" rx="${borderRadius}" fill="url(#bg)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="${fontSize}" fill="white">B</text>
</svg>`;
}

const icons = [
  { name: "icon-192.svg", size: 192, maskable: false },
  { name: "icon-512.svg", size: 512, maskable: false },
  { name: "icon-maskable-192.svg", size: 192, maskable: true },
  { name: "icon-maskable-512.svg", size: 512, maskable: true },
];

for (const icon of icons) {
  const svg = createIconSvg(icon.size, icon.maskable);
  const path = join(iconsDir, icon.name);
  writeFileSync(path, svg);
  console.log(`Generated: ${path}`);
}

console.log("\nDone! Update manifest.json icon references to use .svg extension.");
