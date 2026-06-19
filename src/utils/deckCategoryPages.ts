import {
  DECK_CATEGORY_NAV_NEXT_SLOT,
  DECK_CATEGORY_NAV_PREV_SLOT,
  DRAFT_CATEGORY_PAGE_ID,
} from "../config/deck";
import type { DeckPage, DeckStore } from "../types/deck";
import { findPageNavLinks, isNavSystemSlot } from "./deckGridCells";
import { createDeckPage, upsertPage } from "./deckStorage";

function pageHasContent(page: DeckPage | undefined): boolean {
  if (!page) return false;
  return page.slots.some(
    (slot) => slot && !isNavSystemSlot(slot) && slot.kind !== "empty"
  );
}

function countCategoryPages(store: DeckStore, categoryRootId: string): number {
  const root = store.pages[categoryRootId];
  const children = Object.values(store.pages).filter(
    (p) => p.parentPageId === categoryRootId && pageHasContent(p)
  );
  const total = (pageHasContent(root) ? 1 : 0) + children.length;
  return Math.max(total, 1);
}

/** Page sous-catégorie avec au moins un raccourci ou switch. */
export function isPopulatedCategorySubPage(page: DeckPage | undefined): boolean {
  if (!page) return false;
  return page.slots.some((slot) => slot && (slot.kind === "link" || slot.kind === "switch"));
}

function navSlot(
  pageId: string,
  kind: "prev-page" | "next-page",
  linkedPageId: string
) {
  return {
    id: `nav-${kind}-${pageId}`,
    kind,
    linkedPageId,
  } as const;
}

/** Met à jour les slots prev/next d'une page catégorie. */
export function applyCategoryPageNavSlots(
  page: DeckPage,
  prevPageId?: string,
  nextPageId?: string
): DeckPage {
  const slots = [...page.slots];

  if (prevPageId) {
    slots[DECK_CATEGORY_NAV_PREV_SLOT] = navSlot(page.id, "prev-page", prevPageId);
  }

  if (nextPageId) {
    slots[DECK_CATEGORY_NAV_NEXT_SLOT] = navSlot(page.id, "next-page", nextPageId);
  }

  return { ...page, slots };
}

/** Relie deux pages consécutives d'une catégorie (prev/next). */
export function linkCategorySubPages(
  store: DeckStore,
  prevPageId: string,
  nextPageId: string
): DeckStore {
  const prevPage = store.pages[prevPageId];
  const nextPage = store.pages[nextPageId];
  if (!prevPage || !nextPage) return store;

  const prevLinks = findPageNavLinks(prevPage);
  const nextLinks = findPageNavLinks(nextPage);

  let next = upsertPage(
    store,
    applyCategoryPageNavSlots(prevPage, prevLinks.prevPageId, nextPageId)
  );
  next = upsertPage(
    next,
    applyCategoryPageNavSlots(nextPage, prevPageId, nextLinks.nextPageId)
  );
  return next;
}

/** Crée une sous-page catégorie brouillon (mémoire uniquement). */
export function createDraftCategorySubPage(store: DeckStore, categoryRootId: string): DeckPage {
  const root = store.pages[categoryRootId];
  const title = `${root?.title ?? "Page"} ${countCategoryPages(store, categoryRootId) + 1}`;
  return createDeckPage(DRAFT_CATEGORY_PAGE_ID, title, categoryRootId);
}

/** Persiste une sous-page catégorie brouillon et la relie à la page précédente. */
export function commitDraftCategorySubPage(
  store: DeckStore,
  draftPage: DeckPage,
  categoryRootId: string,
  afterPageId: string
): { store: DeckStore; pageId: string } {
  const pageId = `${categoryRootId}-sub-${Date.now()}`;
  const page = { ...draftPage, id: pageId, parentPageId: categoryRootId };
  let next = upsertPage(store, page);
  next = linkCategorySubPages(next, afterPageId, pageId);
  return { store: next, pageId };
}
