/**
 * Diagnostic navigation banks Stream Deck.
 * Usage: node scripts/test-deck-nav.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:5175";

function buildMultiPageStore() {
  const slots = (items) => {
    const s = Array(32).fill(null);
    items.forEach(([i, slot]) => {
      s[i] = slot;
    });
    return s;
  };
  const link = (id, label) => ({
    id,
    kind: "link",
    label,
    action: { type: "url", url: "https://example.com" },
  });
  const rootId = "deck-root";
  const page2Id = "deck-bank-test-2";
  const page3Id = "deck-bank-test-3";
  return {
    version: 2,
    rootPageId: rootId,
    bankPageIds: [rootId, page2Id, page3Id],
    pages: {
      [rootId]: {
        id: rootId,
        title: "Home",
        parentPageId: null,
        slots: slots([[0, link("r1", "Root shortcut")]]),
      },
      [page2Id]: {
        id: page2Id,
        title: "Page 2",
        parentPageId: rootId,
        slots: slots([[0, link("p2", "Page 2 shortcut")]]),
      },
      [page3Id]: {
        id: page3Id,
        title: "Page 3",
        parentPageId: rootId,
        slots: slots([[0, link("p3", "Page 3 shortcut")]]),
      },
    },
  };
}

async function readState(page) {
  return page.evaluate(() => {
    const section = document.querySelector(".deck-section");
    const chip = document.querySelector(".deck-page-chip");
    return {
      chipText: chip?.textContent?.trim() ?? null,
      gridLabel: section?.getAttribute("aria-label") ?? null,
      prevDisabled: document.querySelector('.deck-nav button[aria-label*="Page préc"], .deck-nav button[aria-label*="Prev page"]')?.disabled ?? null,
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

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.addInitScript((store) => {
  localStorage.setItem("k3-deck-store", JSON.stringify(store));
  localStorage.setItem("k3-deck-migrated-v2", "true");
  localStorage.setItem("k3-show-favorites", "true");
}, buildMultiPageStore());
const page = await context.newPage();

try {
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(".deck-nav", { timeout: 20000 });
  await page.waitForTimeout(4000);

  const failures = [];
  const snap = async (name) => ({ name, ...(await readState(page)) });

  const steps = [await snap("home")];

  await clickNav(page, "next");
  steps.push(await snap("page-2"));

  await clickNav(page, "next");
  steps.push(await snap("page-3"));

  await clickNav(page, "next");
  const draft = await snap("draft");
  steps.push(draft);

  await clickNav(page, "prev");
  steps.push(await snap("prev-from-draft"));

  await clickNav(page, "prev");
  steps.push(await snap("page-2-again"));

  await clickNav(page, "prev");
  steps.push(await snap("home-again"));

  if (steps[0].shortcutLabels?.[0] !== "Root shortcut") failures.push("home: mauvais contenu");
  if (steps[1].shortcutLabels?.[0] !== "Page 2 shortcut") failures.push("page-2: navigation next échouée");
  if (steps[2].shortcutLabels?.[0] !== "Page 3 shortcut") failures.push("page-3: navigation next échouée");
  if (draft.prevDisabled !== false) failures.push("draft: prev désactivé");
  if ((draft.shortcutLabels?.length ?? 0) !== 0) failures.push("draft: grille non vide");
  if (steps[4].shortcutLabels?.[0] !== "Page 3 shortcut") failures.push("prev-from-draft: doit revenir page 3");
  if (steps[5].shortcutLabels?.[0] !== "Page 2 shortcut") failures.push("prev page-2");
  if (steps[6].shortcutLabels?.[0] !== "Root shortcut") failures.push("prev home");

  console.log(JSON.stringify({ base: BASE, failures, steps }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (err) {
  console.error("FAIL:", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
