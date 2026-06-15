import type { DeckPage, DeckStore } from "../types/deck";
import { DRAFT_BANK_PAGE_ID } from "../config/deck";
import { findPageNavLinks, isNavSystemSlot } from "./deckGridCells";
import {
  createDraftBankPage,
  getBankPageIds,
  getPopulatedBankPageIds,
  isPopulatedBankPage,
} from "./deckPageBanks";

export interface DeckNavView {
  bankPageId: string;
  draftPage: DeckPage | null;
  subPageStack: string[];
}

/** Page avec au moins un raccourci, catégorie ou switch (hors navigation système). */
export function pageHasDeckContent(page: DeckPage | undefined): boolean {
  if (!page) return false;
  return page.slots.some(
    (slot) => slot && !isNavSystemSlot(slot) && slot.kind !== "empty"
  );
}

/** Chaîne ordonnée via slots prev-page / next-page. */
export function getLinkedPageSequence(store: DeckStore, startPageId: string): string[] {
  const pages = store.pages;
  if (!pages[startPageId]) return [startPageId];

  let head = startPageId;
  const visitedBack = new Set<string>();
  while (head && !visitedBack.has(head)) {
    visitedBack.add(head);
    const { prevPageId } = findPageNavLinks(pages[head]!);
    if (!prevPageId || !pages[prevPageId]) break;
    head = prevPageId;
  }

  const sequence: string[] = [];
  let current: string | undefined = head;
  const visitedForward = new Set<string>();
  while (current && !visitedForward.has(current)) {
    visitedForward.add(current);
    sequence.push(current);
    const { nextPageId } = findPageNavLinks(pages[current]!);
    current = nextPageId && pages[nextPageId] ? nextPageId : undefined;
  }

  return sequence.length > 0 ? sequence : [startPageId];
}

/** Racine d'une catégorie (page ouverte depuis un slot category). */
export function getCategoryRootId(store: DeckStore, pageId: string): string {
  const page = store.pages[pageId];
  if (!page?.parentPageId) return pageId;

  const banks = new Set([...getBankPageIds(store), ...getPopulatedBankPageIds(store)]);
  if (banks.has(page.parentPageId)) return pageId;

  const parent = store.pages[page.parentPageId];
  if (!parent) return pageId;
  return getCategoryRootId(store, page.parentPageId);
}

function orderPageIds(store: DeckStore, anchorId: string, ids: string[]): string[] {
  if (ids.length === 0) return [anchorId];

  const linked = getLinkedPageSequence(store, anchorId);
  const ordered: string[] = [];
  for (const id of linked) {
    if (ids.includes(id)) ordered.push(id);
  }
  for (const id of ids) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  return ordered;
}

/** Séquence paginable d'une catégorie : page racine + sous-pages enfants. */
export function getCategoryPageSequence(store: DeckStore, categoryRootId: string): string[] {
  const root = store.pages[categoryRootId];
  if (!root) return [categoryRootId];

  const childIds = Object.values(store.pages)
    .filter((p) => p.parentPageId === categoryRootId && pageHasDeckContent(p))
    .map((p) => p.id);

  const allIds = pageHasDeckContent(root) ? [categoryRootId, ...childIds] : childIds;
  if (allIds.length === 0) return [categoryRootId];
  return orderPageIds(store, categoryRootId, allIds);
}

/** Séquence navigable pour le contexte courant (bank ou sous-pages catégorie). */
export function getNavigationSequence(store: DeckStore, nav: DeckNavView): string[] {
  const isDraftBank = nav.draftPage !== null && nav.subPageStack.length === 0;

  if (nav.subPageStack.length > 0) {
    const currentId = nav.subPageStack[nav.subPageStack.length - 1]!;
    const rootId = getCategoryRootId(store, currentId);
    return getCategoryPageSequence(store, rootId);
  }

  const populated = getPopulatedBankPageIds(store);
  const banks = populated.length > 0 ? populated : [store.rootPageId];
  if (isDraftBank) return [...banks, DRAFT_BANK_PAGE_ID];
  return banks;
}

export function resolveCurrentNavPageId(nav: DeckNavView): string {
  if (nav.subPageStack.length > 0) {
    return nav.subPageStack[nav.subPageStack.length - 1] ?? nav.bankPageId;
  }
  if (nav.draftPage) return DRAFT_BANK_PAGE_ID;
  return nav.bankPageId;
}

/** Indicateur chip — bank ou sous-pages catégorie. */
export function getDeckPageIndicator(
  store: DeckStore,
  nav: DeckNavView
): { current: number; total: number } {
  const sequence = getNavigationSequence(store, nav);
  const currentId = resolveCurrentNavPageId(nav);
  const index = sequence.indexOf(currentId);
  const current = index >= 0 ? index + 1 : 1;
  return { current, total: Math.max(sequence.length, 1) };
}

export function canNavigatePrev(store: DeckStore, nav: DeckNavView): boolean {
  return resolvePrevNavStep(store, nav) !== null;
}

export function canNavigateNext(store: DeckStore, nav: DeckNavView): boolean {
  if (nav.draftPage) return false;

  const sequence = getNavigationSequence(store, nav);
  const currentId = resolveCurrentNavPageId(nav);
  const index = sequence.indexOf(currentId);

  if (index >= 0 && index < sequence.length - 1) return true;
  if (nav.subPageStack.length > 0) return false;

  const populated = getPopulatedBankPageIds(store);
  const bankIndex = populated.indexOf(nav.bankPageId);
  return bankIndex < populated.length - 1 || bankIndex === populated.length - 1;
}

export interface DeckNavStep {
  bankPageId: string;
  draftPage: DeckPage | null;
  subPageStack: string[];
}

/** Calcule l'état nav après « page précédente ». */
export function resolvePrevNavStep(store: DeckStore, nav: DeckNavView): DeckNavStep | null {
  if (nav.draftPage) {
    return { ...nav, draftPage: null };
  }

  const sequence = getNavigationSequence(store, nav);
  const currentId = resolveCurrentNavPageId(nav);
  const index = sequence.indexOf(currentId);

  if (nav.subPageStack.length > 0) {
    if (index > 0) {
      return {
        ...nav,
        subPageStack: [...nav.subPageStack.slice(0, -1), sequence[index - 1]!],
      };
    }
    return { ...nav, subPageStack: nav.subPageStack.slice(0, -1) };
  }

  if (index > 0) {
    const bankPageId = sequence[index - 1]!;
    return { bankPageId, draftPage: null, subPageStack: [] };
  }

  return null;
}

/** Calcule l'état nav après « page suivante ». */
export function resolveNextNavStep(store: DeckStore, nav: DeckNavView): DeckNavStep | null {
  if (nav.draftPage) return null;

  const sequence = getNavigationSequence(store, nav);
  const currentId = resolveCurrentNavPageId(nav);
  const index = sequence.indexOf(currentId);

  if (nav.subPageStack.length > 0) {
    if (index >= 0 && index < sequence.length - 1) {
      return {
        ...nav,
        subPageStack: [...nav.subPageStack.slice(0, -1), sequence[index + 1]!],
      };
    }
    return null;
  }

  if (index >= 0 && index < sequence.length - 1) {
    return { bankPageId: sequence[index + 1]!, draftPage: null, subPageStack: [] };
  }

  return { ...nav, draftPage: createDraftBankPage(store) };
}

/** Navigue vers une page liée (prev-page / next-page) dans une catégorie. */
export function resolveLinkedCategoryNav(
  nav: DeckNavView,
  linkedPageId: string
): DeckNavStep {
  if (nav.subPageStack.length === 0) {
    return { ...nav, subPageStack: [linkedPageId] };
  }
  return {
    ...nav,
    subPageStack: [...nav.subPageStack.slice(0, -1), linkedPageId],
  };
}

export { isPopulatedBankPage, getPopulatedBankPageIds };
