import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
const sw = await page.evaluate(async () => {
  const regs = await navigator.serviceWorker?.getRegistrations?.();
  return {
    hasSW: !!navigator.serviceWorker?.controller,
    regCount: regs?.length ?? 0,
    scopes: regs?.map((r) => r.scope) ?? [],
  };
});
console.log("SW state:", sw);

const data = await page.evaluate(() => ({
  hasSearchBar: !!document.querySelector(".search"),
  favIds: [...document.querySelectorAll("[data-isofilter-id]")].map((el) =>
    el.getAttribute("data-isofilter-id")
  ),
}));

console.log("DOM:", data);
await browser.close();
