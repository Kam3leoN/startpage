import { useCallback, useEffect, useState } from "react";
import type { CategoryDef } from "../data/categories";
import type { Favorite } from "../data/favorites";
import { DRAFT_BANK_PAGE_ID, DRAFT_CATEGORY_PAGE_ID, ROOT_PAGE_ID } from "../config/deck";
import type { DeckCategoryEditorValues, DeckPage, DeckSlot, DeckSlotEditorValues, DeckStore } from "../types/deck";
import {
  fillPageWithFavorites,
  isDeckMigrated,
  markDeckMigrated,
  migrateFavoritesToDeck,
  resolveCategoryPageId,
} from "../utils/deckMigrate";
import {
  createDeckPage,
  findFirstEmptySlotIndex,
  loadDeckStore,
  saveDeckStore,
  upsertPage,
} from "../utils/deckStorage";
import { resolveSlotAction, runDeckCallback, slotFromEditorValues } from "../utils/deckCallbacks";
import {
  commitDraftBankPage,
  isPopulatedBankPage,
  normalizeBankPageIds,
  pruneEmptyBankPages,
} from "../utils/deckPageBanks";
import {
  commitDraftCategorySubPage,
  isPopulatedCategorySubPage,
} from "../utils/deckCategoryPages";
import {
  canNavigatePrev,
  getCategoryRootId,
  getDeckPageIndicator,
  resolveCategoryAnchorPageId,
  resolveLinkedCategoryNav,
  resolveNextNavStep,
  resolvePrevNavStep,
  type DeckNavView,
} from "../utils/deckPageNav";
import { toggleDeckSwitch } from "../utils/deckSwitchStorage";
import type { CustomShortcut } from "../types/shortcuts";

interface InitOptions {
  favorites: Favorite[];
  categories: CategoryDef[];
}

/** Navigation bank + brouillon + sous-pages catégorie (état atomique). */
type DeckNavState = DeckNavView;

const INITIAL_NAV: DeckNavState = {
  bankPageId: ROOT_PAGE_ID,
  draftPage: null,
  subPageStack: [],
  draftCategoryPage: null,
};

function setPageSlot(pageId: string, store: DeckStore, slotIndex: number, slot: DeckSlot | null): DeckStore {
  const page = store.pages[pageId];
  if (!page) return store;
  const slots = [...page.slots];
  slots[slotIndex] = slot;
  return upsertPage(store, { ...page, slots });
}

function slotFromShortcut(shortcut: CustomShortcut): DeckSlot {
  return slotFromEditorValues(shortcut.id, {
    label: shortcut.label,
    icon: shortcut.icon,
    action: { type: "url", url: shortcut.url },
  });
}

function applyPageSlot(page: DeckPage, slotIndex: number, slot: DeckSlot | null): DeckPage {
  const slots = [...page.slots];
  slots[slotIndex] = slot;
  return { ...page, slots };
}

function resolveCurrentPageId(nav: DeckNavState): string {
  if (nav.subPageStack.length > 0) {
    if (nav.draftCategoryPage) return DRAFT_CATEGORY_PAGE_ID;
    return nav.subPageStack[nav.subPageStack.length - 1] ?? nav.bankPageId;
  }
  if (nav.draftPage) return DRAFT_BANK_PAGE_ID;
  return nav.bankPageId;
}

/**
 * État du deck Stream Deck : pages, navigation, CRUD des cases.
 */
export function useDeckGrid({ favorites, categories }: InitOptions) {
  const [store, setStore] = useState<DeckStore>(() => {
    const existing = loadDeckStore();
    const base = existing
      ? normalizeBankPageIds(existing)
      : normalizeBankPageIds(migrateFavoritesToDeck(favorites, categories));
    return pruneEmptyBankPages(base);
  });

  const [nav, setNav] = useState<DeckNavState>(INITIAL_NAV);

  useEffect(() => {
    if (loadDeckStore() || isDeckMigrated()) return;
    const migrated = migrateFavoritesToDeck(favorites, categories);
    const normalized = pruneEmptyBankPages(normalizeBankPageIds(migrated));
    setStore(normalized);
    saveDeckStore(normalized);
    markDeckMigrated();
  }, [favorites, categories]);

  useEffect(() => {
    const timer = window.setTimeout(() => saveDeckStore(store), 0);
    return () => window.clearTimeout(timer);
  }, [store]);

  const currentPageId = resolveCurrentPageId(nav);
  const isDraftBank = nav.draftPage !== null && nav.subPageStack.length === 0;
  const isDraftCategory = nav.draftCategoryPage !== null && nav.subPageStack.length > 0;
  const currentPage =
    isDraftCategory && nav.draftCategoryPage
      ? nav.draftCategoryPage
      : isDraftBank && nav.draftPage
        ? nav.draftPage
        : store.pages[currentPageId] ?? store.pages[store.rootPageId]!;
  const bankPagination = getDeckPageIndicator(store, nav);
  const isOnHome =
    nav.bankPageId === store.rootPageId && !isDraftBank && nav.subPageStack.length === 0;

  const navigateToPage = useCallback((pageId: string) => {
    setNav((prev) => ({ ...prev, subPageStack: [pageId], draftCategoryPage: null }));
  }, []);

  const navigateToLinkedPage = useCallback((linkedPageId: string) => {
    setNav((prev) => resolveLinkedCategoryNav(prev, linkedPageId));
  }, []);

  const navigateHome = useCallback(() => {
    setNav({
      bankPageId: store.rootPageId,
      draftPage: null,
      subPageStack: [],
      draftCategoryPage: null,
    });
  }, [store.rootPageId]);

  const navigateBack = useCallback(() => {
    setNav((prev) => {
      if (prev.draftCategoryPage) {
        return { ...prev, draftCategoryPage: null };
      }
      if (prev.subPageStack.length > 0) {
        return {
          ...prev,
          subPageStack: prev.subPageStack.slice(0, -1),
          draftCategoryPage: null,
        };
      }
      return prev;
    });
  }, []);

  const navigateToBank = useCallback((bankPageId: string) => {
    setNav({ bankPageId, draftPage: null, subPageStack: [], draftCategoryPage: null });
  }, []);

  const navigatePrevBank = useCallback(() => {
    setNav((prev) => resolvePrevNavStep(store, prev) ?? prev);
  }, [store]);

  const navigateNextBank = useCallback(() => {
    setNav((prev) => resolveNextNavStep(store, prev) ?? prev);
  }, [store]);

  const commitDraftCategoryUpdate = useCallback(
    (updatedPage: DeckPage): string => {
      const anchorId = resolveCategoryAnchorPageId(nav);
      if (!anchorId || !nav.draftCategoryPage) return DRAFT_CATEGORY_PAGE_ID;

      if (!isPopulatedCategorySubPage(updatedPage)) {
        setNav((prev) => (prev.draftCategoryPage ? { ...prev, draftCategoryPage: updatedPage } : prev));
        return DRAFT_CATEGORY_PAGE_ID;
      }

      const rootId = getCategoryRootId(store, anchorId);
      const { store: nextStore, pageId } = commitDraftCategorySubPage(
        store,
        updatedPage,
        rootId,
        anchorId
      );
      setStore(nextStore);
      setNav((prev) => ({
        ...prev,
        draftCategoryPage: null,
        subPageStack: [...prev.subPageStack.slice(0, -1), pageId],
      }));
      return pageId;
    },
    [nav, store]
  );

  const commitDraftPageUpdate = useCallback(
    (updatedPage: DeckPage): string => {
      if (!isPopulatedBankPage(updatedPage)) {
        setNav((prev) => (prev.draftPage ? { ...prev, draftPage: updatedPage } : prev));
        return DRAFT_BANK_PAGE_ID;
      }

      const { store: nextStore, pageId } = commitDraftBankPage(store, updatedPage);
      setStore(pruneEmptyBankPages(nextStore));
      setNav({ bankPageId: pageId, draftPage: null, subPageStack: [], draftCategoryPage: null });
      return pageId;
    },
    [store]
  );

  const updateStore = useCallback((next: DeckStore) => {
    setStore(pruneEmptyBankPages(next));
  }, []);

  const openCategoryPage = useCallback(
    (slot: DeckSlot) => {
      const pageId = resolveCategoryPageId(slot);
      if (!pageId) return;

      const existing = store.pages[pageId];
      const hasShortcuts = existing?.slots.slice(1).some((s) => s !== null);

      if (existing && hasShortcuts) {
        navigateToPage(pageId);
        return;
      }

      let nextStore = store;
      let page = existing;

      if (!page) {
        page = createDeckPage(pageId, slot.label ?? pageId, currentPageId);
        nextStore = upsertPage(nextStore, page);
      }

      if (!hasShortcuts && slot.categoryId) {
        const catFavorites = favorites.filter(
          (f) => f.action !== "search" && f.tags.includes(slot.categoryId!)
        );
        if (catFavorites.length > 0) {
          page = fillPageWithFavorites(page, catFavorites, 0);
          nextStore = upsertPage(nextStore, page);
        }
      }

      if (nextStore !== store) setStore(nextStore);
      navigateToPage(pageId);
    },
    [store, currentPageId, favorites, navigateToPage]
  );

  const executeSlot = useCallback(
    (slot: DeckSlot) => {
      if (slot.kind === "category") {
        openCategoryPage(slot);
        return;
      }

      if (slot.kind === "prev-page" || slot.kind === "next-page") {
        if (slot.linkedPageId) navigateToLinkedPage(slot.linkedPageId);
        return;
      }

      const action = resolveSlotAction(slot);
      if (!action) return;

      switch (action.type) {
        case "url":
          if (action.url) window.open(action.url, "_blank", "noopener,noreferrer");
          break;
        case "search":
          window.dispatchEvent(new CustomEvent("startpage:open-search"));
          break;
        case "switch":
          if (action.switchId) toggleDeckSwitch(action.switchId);
          break;
        case "callback":
          if (action.callbackId) runDeckCallback(action.callbackId);
          break;
        default:
          break;
      }
    },
    [openCategoryPage, navigateToLinkedPage]
  );

  const assignShortcutAt = useCallback(
    (slotIndex: number, values: DeckSlotEditorValues, existingId?: string) => {
      const id = existingId ?? `slot-${Date.now()}`;
      const slot = slotFromEditorValues(id, values);

      if (isDraftCategory && nav.draftCategoryPage) {
        commitDraftCategoryUpdate(applyPageSlot(nav.draftCategoryPage, slotIndex, slot));
        return;
      }

      if (isDraftBank && nav.draftPage) {
        commitDraftPageUpdate(applyPageSlot(nav.draftPage, slotIndex, slot));
        return;
      }

      updateStore(setPageSlot(currentPageId, store, slotIndex, slot));
    },
    [
      isDraftBank,
      isDraftCategory,
      nav.draftPage,
      nav.draftCategoryPage,
      commitDraftPageUpdate,
      commitDraftCategoryUpdate,
      currentPageId,
      store,
      updateStore,
    ]
  );

  const assignCategoryAt = useCallback(
    (
      slotIndex: number,
      values: DeckCategoryEditorValues,
      category: CategoryDef,
      existingPageId?: string
    ) => {
      const catPageId = existingPageId ?? `deck-cat-${category.id}`;
      const slot: DeckSlot = {
        id: `cat-${category.id}`,
        kind: "category",
        label: values.label,
        icon: values.icon,
        monogram: values.monogram,
        slotVisual: values.slotVisual,
        backgroundColor: values.backgroundColor,
        targetPageId: catPageId,
        categoryId: category.id,
      };

      if (isDraftBank && nav.draftPage) {
        const updated = applyPageSlot(nav.draftPage, slotIndex, slot);
        if (!isPopulatedBankPage(updated)) {
          setNav((prev) => ({ ...prev, draftPage: updated }));
          return;
        }

        const { store: committedStore, pageId: bankPageId } = commitDraftBankPage(store, updated);
        let next = committedStore;
        if (!next.pages[catPageId]) {
          next = upsertPage(next, createDeckPage(catPageId, values.label, bankPageId));
        } else {
          next = upsertPage(next, {
            ...next.pages[catPageId]!,
            title: values.label,
            parentPageId: bankPageId,
          });
        }
        setStore(pruneEmptyBankPages(next));
        setNav({ bankPageId, draftPage: null, subPageStack: [], draftCategoryPage: null });
        return;
      }

      let next = store;
      if (!next.pages[catPageId]) {
        next = upsertPage(next, createDeckPage(catPageId, values.label, currentPageId));
      } else {
        next = upsertPage(next, {
          ...next.pages[catPageId]!,
          title: values.label,
        });
      }

      next = setPageSlot(currentPageId, next, slotIndex, slot);
      updateStore(next);
    },
    [isDraftBank, nav.draftPage, currentPageId, store, updateStore]
  );

  const clearSlotAt = useCallback(
    (slotIndex: number) => {
      const slot = currentPage.slots[slotIndex];

      if (isDraftCategory && nav.draftCategoryPage) {
        setNav((prev) =>
          prev.draftCategoryPage
            ? { ...prev, draftCategoryPage: applyPageSlot(prev.draftCategoryPage, slotIndex, null) }
            : prev
        );
        return;
      }

      if (isDraftBank && nav.draftPage) {
        setNav((prev) =>
          prev.draftPage
            ? { ...prev, draftPage: applyPageSlot(prev.draftPage, slotIndex, null) }
            : prev
        );
        return;
      }

      let next = setPageSlot(currentPageId, store, slotIndex, null);

      if (slot?.kind === "category" && slot.targetPageId) {
        const { [slot.targetPageId]: _removed, ...restPages } = next.pages;
        next = { ...next, pages: restPages };
      }

      updateStore(next);
    },
    [currentPage, isDraftBank, isDraftCategory, nav.draftPage, nav.draftCategoryPage, currentPageId, store, updateStore]
  );

  const addShortcutToCurrentPage = useCallback(
    (shortcut: CustomShortcut) => {
      const slot = slotFromShortcut(shortcut);
      const page =
        isDraftCategory && nav.draftCategoryPage
          ? nav.draftCategoryPage
          : isDraftBank && nav.draftPage
            ? nav.draftPage
            : store.pages[currentPageId];
      if (!page || findFirstEmptySlotIndex(page, 0) < 0) return false;

      const index = findFirstEmptySlotIndex(page, 0)!;

      if (isDraftCategory && nav.draftCategoryPage) {
        commitDraftCategoryUpdate(applyPageSlot(nav.draftCategoryPage, index, slot));
        return true;
      }

      if (isDraftBank && nav.draftPage) {
        commitDraftPageUpdate(applyPageSlot(nav.draftPage, index, slot));
        return true;
      }

      updateStore(setPageSlot(currentPageId, store, index, slot));
      return true;
    },
    [isDraftBank, isDraftCategory, nav.draftPage, nav.draftCategoryPage, commitDraftPageUpdate, commitDraftCategoryUpdate, store, currentPageId, updateStore]
  );

  const reorderSlotsAt = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      if (isDraftCategory && nav.draftCategoryPage) {
        const page = nav.draftCategoryPage;
        const fromSlot = page.slots[fromIndex];
        if (!fromSlot || fromSlot.kind === "empty") return;

        const slots = [...page.slots];
        const toSlot = slots[toIndex] ?? null;
        slots[toIndex] = fromSlot;
        slots[fromIndex] = toSlot;
        commitDraftCategoryUpdate({ ...page, slots });
        return;
      }

      if (isDraftBank && nav.draftPage) {
        const page = nav.draftPage;
        const fromSlot = page.slots[fromIndex];
        if (!fromSlot || fromSlot.kind === "empty") return;

        const slots = [...page.slots];
        const toSlot = slots[toIndex] ?? null;
        slots[toIndex] = fromSlot;
        slots[fromIndex] = toSlot;
        commitDraftPageUpdate({ ...page, slots });
        return;
      }

      const page = store.pages[currentPageId];
      if (!page) return;

      const fromSlot = page.slots[fromIndex];
      if (!fromSlot || fromSlot.kind === "empty") return;

      const slots = [...page.slots];
      const toSlot = slots[toIndex] ?? null;
      slots[toIndex] = fromSlot;
      slots[fromIndex] = toSlot;
      updateStore(upsertPage(store, { ...page, slots }));
    },
    [
      isDraftBank,
      isDraftCategory,
      nav.draftPage,
      nav.draftCategoryPage,
      commitDraftPageUpdate,
      commitDraftCategoryUpdate,
      currentPageId,
      store,
      updateStore,
    ]
  );

  const pageStack = isDraftBank
    ? [DRAFT_BANK_PAGE_ID]
    : nav.subPageStack.length > 0
      ? [nav.bankPageId, ...nav.subPageStack]
      : [nav.bankPageId];

  return {
    store,
    currentPage,
    currentPageId,
    pageStack,
    bankPagination,
    isOnHome,
    navigateToPage,
    navigateToLinkedPage,
    navigateHome,
    navigateBack,
    navigateToBank,
    navigatePrevBank,
    navigateNextBank,
    canGoPrevBank: canNavigatePrev(store, nav),
    executeSlot,
    assignShortcutAt,
    assignCategoryAt,
    clearSlotAt,
    addShortcutToCurrentPage,
    reorderSlotsAt,
    updateStore,
  };
}
