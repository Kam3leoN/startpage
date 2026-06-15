import type { CategoryDef } from "../data/categories";
import type { Favorite } from "../data/favorites";
import { DECK_SLOT_COUNT, ROOT_PAGE_ID } from "../config/deck";
import type { DeckPage, DeckSlot, DeckStore } from "../types/deck";
import { createDeckPage, createEmptyDeckStore, upsertPage } from "./deckStorage";

function slotFromFavorite(fav: Favorite): DeckSlot {
  if (fav.action === "search") {
    return {
      id: fav.id,
      kind: "search",
      label: fav.label,
      icon: fav.icon,
    };
  }
  return {
    id: fav.id,
    kind: "link",
    label: fav.label,
    url: fav.url,
    icon: fav.icon,
  };
}

function categorySlot(cat: CategoryDef, targetPageId: string): DeckSlot {
  return {
    id: `cat-${cat.id}`,
    kind: "category",
    label: cat.label,
    targetPageId,
    categoryId: cat.id,
  };
}

export function resolveCategoryPageId(slot: DeckSlot): string | null {
  if (slot.targetPageId) return slot.targetPageId;
  if (slot.categoryId) return `deck-cat-${slot.categoryId}`;
  return null;
}

/** Remplit une page avec des favoris à partir d'un index. */
export function fillPageWithFavorites(page: DeckPage, favorites: Favorite[], startIndex: number): DeckPage {
  const slots = [...page.slots];
  let slotIndex = startIndex;
  for (const fav of favorites) {
    if (slotIndex >= DECK_SLOT_COUNT) break;
    slots[slotIndex] = slotFromFavorite(fav);
    slotIndex += 1;
  }
  return { ...page, slots };
}

/**
 * Construit un deck initial à partir des favoris et catégories (migration Mason → Stream Deck).
 */
export function migrateFavoritesToDeck(
  favorites: Favorite[],
  categories: CategoryDef[]
): DeckStore {
  let store = createEmptyDeckStore();
  let root = { ...store.pages[ROOT_PAGE_ID]! };

  const links = favorites.filter((f) => f.action !== "search");

  let rootSlot = 0;

  for (const cat of categories) {
    const catFavorites = links.filter((f) => f.tags.includes(cat.id));
    if (catFavorites.length === 0) continue;

    const pageId = `deck-cat-${cat.id}`;
    let catPage = createDeckPage(pageId, cat.label, ROOT_PAGE_ID);
    catPage = fillPageWithFavorites(catPage, catFavorites, 0);
    store = upsertPage(store, catPage);

    if (rootSlot < DECK_SLOT_COUNT) {
      root.slots[rootSlot] = categorySlot(cat, pageId);
      rootSlot += 1;
    }
  }

  const categorizedIds = new Set(
    categories.flatMap((cat) =>
      links.filter((f) => f.tags.includes(cat.id)).map((f) => f.id)
    )
  );
  const uncategorized = links.filter((f) => !categorizedIds.has(f.id));

  for (const fav of uncategorized) {
    if (rootSlot >= DECK_SLOT_COUNT) break;
    root.slots[rootSlot] = slotFromFavorite(fav);
    rootSlot += 1;
  }

  store = upsertPage(store, root);
  return store;
}

export const DECK_MIGRATED_KEY = "k3-deck-migrated-v2";

export function isDeckMigrated(): boolean {
  return localStorage.getItem(DECK_MIGRATED_KEY) === "true";
}

export function markDeckMigrated(): void {
  localStorage.setItem(DECK_MIGRATED_KEY, "true");
}
