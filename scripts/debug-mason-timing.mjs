import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 900 });
await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });

for (const ms of [0, 300, 600, 1000, 2000, 5000]) {
  if (ms) await page.waitForTimeout(ms);
  const snap = await page.evaluate((waitMs) => {
    const items = [...document.querySelectorAll("k3ui-mason .fav")];
    const rects = items.map((el) => Math.round(el.getBoundingClientRect().left));
    const uniqueLeft = new Set(rects).size;
    const computedTransforms = items.slice(0, 3).map((el) => getComputedStyle(el).transform);
    return { ms: waitMs, count: items.length, uniqueLeft, rects: rects.slice(0, 5), computedTransforms };
  }, ms);
  console.log(JSON.stringify(snap));
}

await browser.close();
