import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("./out");
fs.mkdirSync(OUT, { recursive: true });

const SIZES = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1210x650", width: 1210, height: 650 },
  { name: "390x844", width: 390, height: 844 },
];

const PAGES = [
  { name: "accueil", oldUrl: "http://localhost:8090/index.html#accueil", newUrl: "http://localhost:3000/" },
  { name: "portfolio", oldUrl: "http://localhost:8090/index.html#portfolio", newUrl: "http://localhost:3000/portfolio" },
  { name: "services", oldUrl: "http://localhost:8090/index.html#services", newUrl: "http://localhost:3000/services" },
  { name: "blog", oldUrl: "http://localhost:8090/index.html#blog", newUrl: "http://localhost:3000/blog" },
  { name: "article", oldUrl: "http://localhost:8090/index.html#article-2", newUrl: "http://localhost:3000/blog/2" },
  { name: "contact", oldUrl: "http://localhost:8090/index.html#contact", newUrl: "http://localhost:3000/contact" },
];

async function shoot(browser, url, size) {
  const ctx = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  // let preloader logic settle (sessionStorage check / safety timeouts)
  await page.waitForTimeout(1200);
  // force lazy images to load by scrolling through the full page
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ fullPage: true });
  await ctx.close();
  return PNG.sync.read(buf);
}

function diffImages(a, b, outPath) {
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width, height });
  const crop = (img) => {
    if (img.width === width && img.height === height) return img.data;
    const out = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) {
      img.data.copy(out, y * width * 4, y * img.width * 4, y * img.width * 4 + width * 4);
    }
    return out;
  };
  const aData = crop(a);
  const bData = crop(b);
  const mismatched = pixelmatch(aData, bData, diff.data, width, height, { threshold: 0.12 });
  fs.writeFileSync(outPath, PNG.sync.write(diff));
  const total = width * height;
  return {
    mismatched,
    total,
    pct: (mismatched / total) * 100,
    dimMismatch: a.width !== b.width || a.height !== b.height,
    oldDim: `${a.width}x${a.height}`,
    newDim: `${b.width}x${b.height}`,
  };
}

const browser = await chromium.launch();
const results = [];

for (const pageDef of PAGES) {
  for (const size of SIZES) {
    const oldPng = await shoot(browser, pageDef.oldUrl, size);
    const newPng = await shoot(browser, pageDef.newUrl, size);
    const base = `${pageDef.name}_${size.name}`;
    fs.writeFileSync(path.join(OUT, `${base}_old.png`), PNG.sync.write(oldPng));
    fs.writeFileSync(path.join(OUT, `${base}_new.png`), PNG.sync.write(newPng));
    const diff = diffImages(oldPng, newPng, path.join(OUT, `${base}_diff.png`));
    results.push({ page: pageDef.name, size: size.name, ...diff });
    console.log(
      `${base}: ${diff.pct.toFixed(3)}% diff${diff.dimMismatch ? `  [DIM MISMATCH old=${diff.oldDim} new=${diff.newDim}]` : ""}`
    );
  }
}

await browser.close();
fs.writeFileSync(path.resolve("./results.json"), JSON.stringify(results, null, 2));

const flagged = results.filter((r) => r.pct > 0.5 || r.dimMismatch);
console.log("\n--- SUMMARY ---");
console.log(`${results.length} comparisons, ${flagged.length} over 0.5% or with dimension mismatch`);
for (const f of flagged) {
  console.log(`FLAG ${f.page} ${f.size}: ${f.pct.toFixed(3)}%${f.dimMismatch ? " DIM MISMATCH" : ""}`);
}
