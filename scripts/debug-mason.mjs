import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on("console", (m) => console.log("[console]", m.type(), m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.setViewportSize({ width: 1200, height: 900 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(9000);

const state = await page.evaluate(() => {
  const mason = document.querySelector("k3ui-mason");
  const items = mason ? [...mason.querySelectorAll(".fav")] : [];
  const first = items[0];
  const inst = mason && window.K?.Mason?.getInstance?.(mason);

  return {
    k3ready: document.body.classList.contains("k3ui-ready"),
    hasK: !!window.K,
    hasMasonApi: !!window.K?.Mason?.init,
    masonExists: !!mason,
    masonTag: mason?.tagName,
    masonClasses: mason?.className,
    masonInlineHeight: mason?.style.height,
    masonRect: mason ? mason.getBoundingClientRect() : null,
    itemCount: items.length,
    hasInstance: !!inst,
    items: items.slice(0, 12).map((el, i) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        i,
        id: el.getAttribute("data-isofilter-id"),
        label: el.querySelector(".fav__label")?.textContent,
        display: cs.display,
        position: cs.position,
        transform: cs.transform,
        width: Math.round(r.width),
        height: Math.round(r.height),
        left: Math.round(r.left),
        top: Math.round(r.top),
        inline: {
          position: el.style.position,
          transform: el.style.transform,
          width: el.style.width,
          left: el.style.left,
          top: el.style.top,
          display: el.style.display,
        },
        classes: el.className,
      };
    }),
    hiddenCount: items.filter((el) => el.style.display === "none").length,
    stackedSameTop: items.length
      ? items.filter((el) => Math.round(el.getBoundingClientRect().top) === Math.round(items[0].getBoundingClientRect().top)).length
      : 0,
  };
});

fs.writeFileSync("mason-debug.json", JSON.stringify(state, null, 2));
console.log(JSON.stringify(state, null, 2));
await page.screenshot({ path: "mason-debug.png", fullPage: true });
await browser.close();
