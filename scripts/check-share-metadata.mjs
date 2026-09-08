import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

// Run after `npm run build`: checks the HTML a crawler sees without JavaScript.
for (const route of ["", "ar/", "en/"]) {
  const html = await readFile(`out/${route}index.html`, "utf8");
  for (const key of ["og:image", "twitter:image"]) {
    assert.ok(
      html.includes(`${key}" content="https://pages.salasel.app/og-share.jpg"`),
      `/${route} must expose the landing site's share image in static HTML`,
    );
  }
  assert.ok(html.includes('property="og:image:width" content="1200"'));
  assert.ok(html.includes('property="og:image:height" content="630"'));
}

const image = await readFile("out/og-share.jpg");
assert.equal(image.readUInt16BE(0), 0xffd8, "Share image must be a JPEG");
assert.ok((await stat("out/og-share.jpg")).size < 500_000);
console.log("Root, Arabic, and English share metadata and exported JPEG verified.");
