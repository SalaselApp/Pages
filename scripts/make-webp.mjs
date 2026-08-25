/**
 * Generate WebP companions for the production images that actually load in the
 * browser. Originals (approved masters) stay byte-identical on disk; each
 * companion sits beside its source as `<name>.webp`, mirroring the existing
 * hero pattern (`01-hero-logo-glow.png` + `.webp`).
 *
 * Static export ships images verbatim (`images.unoptimized`), so this is the
 * one place their weight can be reduced without touching the masters.
 *
 * Run: node scripts/make-webp.mjs
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "public", "images", "landing");

// Only the PNGs referenced by components. Transparent masters (chains, logo
// backgrounds) keep their alpha channel through the WebP encode.
// `brand/logo.png` is intentionally excluded: at 16K it is already smaller
// than its WebP re-encode, so the PNG stays the better choice.
const SOURCES = [
  "extracted/02-hero-extension-real.png",
  "extracted/04-section-2-rising-chain.png",
  "extracted/07-section-5-clean-chain-background.png",
  "extracted/08-section-8-left-logo-background.png",
  "product-screenshots/home-catalog.png",
  "product-screenshots/series-detail.png",
  "product-screenshots/player-notes.png",
  "product-screenshots/flow-extension-return.png",
  "product-screenshots/flow-extension-panel.png",
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}K`;

let before = 0;
let after = 0;

for (const rel of SOURCES) {
  const src = resolve(ROOT, rel);
  const out = src.replace(/\.png$/, ".webp");

  await sharp(src)
    // quality 82 / effort 6 is a strong size/quality balance; alpha preserved.
    .webp({ quality: 82, effort: 6 })
    .toFile(out);

  const [srcStat, outStat] = await Promise.all([stat(src), stat(out)]);
  before += srcStat.size;
  after += outStat.size;

  const saved = (1 - outStat.size / srcStat.size) * 100;
  console.log(
    `${rel.padEnd(52)} ${kb(srcStat.size).padStart(6)} -> ${kb(outStat.size).padStart(6)}  (-${saved.toFixed(0)}%)`,
  );
}

console.log(
  `\nTotal loaded PNG weight: ${kb(before)} -> ${kb(after)} WebP  (-${((1 - after / before) * 100).toFixed(0)}%)`,
);
