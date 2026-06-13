import { chromium } from "playwright";

const urls = ["http://localhost:5173/", "http://127.0.0.1:4173/"];

for (const url of urls) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(2500);
    const data = await page.evaluate(() => ({
      url: location.href,
      hasSearchBar: !!document.querySelector(".search"),
      favIds: [...document.querySelectorAll("[data-isofilter-id]")].map((el) =>
        el.getAttribute("data-isofilter-id")
      ),
      heroHasForm: !!document.querySelector(".hero form"),
    }));
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(url, "FAILED", e.message);
  }
  await browser.close();
}
