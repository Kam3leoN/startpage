/**
 * Diagnostic pagination sous-pages catégorie.
 * Usage: node scripts/test-deck-category-nav.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:5175";

function buildCategorySubPageStore() {
  const slots = (items) => {
    const s = Array(32).fill(null);
    items.forEach(([i, slot]) => {
      s[i] = slot;
    });
    return s;
  };

  const rootId = "deck-root";
  const catId = "deck-cat-dev";
  const sub2Id = "deck-cat-dev-2";
  const sub3Id = "deck-cat-dev-3";

  return {
    version: 2,
    rootPageId: rootId,
    bankPageIds: [rootId],
    pages: {
      [rootId]: {
        id: rootId,
        title: "Home",
        parentPageId: null,
        slots: slots([
          [
            0,
            {
              id: "cat-dev",
              kind: "category",
              label: "Dev",
              targetPageId: catId,
              categoryId: "dev",
            },
          ],
        ]),
      },
      [catId]: {
        id: catId,
        title: "Dev",
        parentPageId: rootId,
        slots: slots([
          [0, { id: "s1", kind: "link", label: "Sub 1", action: { type: "url", url: "https://example.com/1" } }],
          [
            31,
            { id: "nav-next", kind: "next-page", label: "Next", linkedPageId: sub2Id },
          ],
        ]),
      },
      [sub2Id]: {
        id: sub2Id,
        title: "Dev 2",
        parentPageId: catId,
        slots: slots([
          [0, { id: "s2", kind: "link", label: "Sub 2", action: { type: "url", url: "https://example.com/2" } }],
          [
            30,
            { id: "nav-prev", kind: "prev-page", label: "Prev", linkedPageId: catId },
          ],
          [
            31,
            { id: "nav-next2", kind: "next-page", label: "Next", linkedPageId: sub3Id },
          ],
        ]),
      },
      [sub3Id]: {
        id: sub3Id,
        title: "Dev 3",
        parentPageId: catId,
        slots: slots([
          [0, { id: "s3", kind: "link", label: "Sub 3", action: { type: "url", url: "https://example.com/3" } }],
          [
            30,
            { id: "nav-prev3", kind: "prev-page", label: "Prev", linkedPageId: sub2Id },
          ],
        ]),
      },
    },
  };
}

async function readState(page) {
  return page.evaluate(() => {
    const chip = document.querySelector(".deck-page-chip");
    return {
      chipText: chip?.textContent?.trim() ?? null,
      shortcutLabels: [...document.querySelectorAll(".deck-slot__label")].map((el) => el.textContent?.trim()),
    };
  });
}

async function clickNav(page, which) {
  const labelRe = which === "prev" ? /Page préc|Prev page/i : /Page suiv|Next page/i;
  const all = page.locator(".deck-nav button");
  const count = await all.count();
  for (let i = 0; i < count; i++) {
    const b = all.nth(i);
    const aria = await b.getAttribute("aria-label");
    if (aria && labelRe.test(aria)) {
      await b.click();
      await page.waitForTimeout(400);
      return;
    }
  }
  throw new Error(`Bouton ${which} introuvable`);
}

async function clickCategory(page) {
  await page.locator(".deck-slot", { hasText: "Dev" }).first().click();
  await page.waitForTimeout(400);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.addInitScript((store) => {
  localStorage.setItem("k3-deck-store", JSON.stringify(store));
  localStorage.setItem("k3-deck-migrated-v2", "true");
  localStorage.setItem("k3-show-favorites", "true");
}, buildCategorySubPageStore());
const page = await context.newPage();

try {
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(".deck-nav", { timeout: 20000 });
  await page.waitForTimeout(3000);

  const failures = [];
  const steps = [];

  steps.push({ name: "home", ...(await readState(page)) });
  await clickCategory(page);
  steps.push({ name: "cat-1", ...(await readState(page)) });

  await clickNav(page, "next");
  steps.push({ name: "cat-2", ...(await readState(page)) });

  await clickNav(page, "next");
  steps.push({ name: "cat-3", ...(await readState(page)) });

  await clickNav(page, "prev");
  steps.push({ name: "cat-2-again", ...(await readState(page)) });

  await clickNav(page, "prev");
  steps.push({ name: "cat-1-again", ...(await readState(page)) });

  if (steps[1].shortcutLabels?.[0] !== "Sub 1") failures.push("cat-1: mauvais contenu");
  if (steps[1].chipText !== "1/3") failures.push(`cat-1: chip attendu 1/3, reçu ${steps[1].chipText}`);
  if (steps[2].shortcutLabels?.[0] !== "Sub 2") failures.push("cat-2: navigation next échouée");
  if (steps[2].chipText !== "2/3") failures.push(`cat-2: chip attendu 2/3, reçu ${steps[2].chipText}`);
  if (steps[3].shortcutLabels?.[0] !== "Sub 3") failures.push("cat-3: navigation next échouée");
  if (steps[4].shortcutLabels?.[0] !== "Sub 2") failures.push("prev vers cat-2");
  if (steps[5].shortcutLabels?.[0] !== "Sub 1") failures.push("prev vers cat-1");

  console.log(JSON.stringify({ base: BASE, failures, steps }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error("FAIL:", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
