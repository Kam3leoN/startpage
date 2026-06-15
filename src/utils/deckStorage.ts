import { DECK_SLOT_COUNT, DECK_STORAGE_KEY, ROOT_PAGE_ID } from "../config/deck";
import type { DeckPage, DeckSlot, DeckStore } from "../types/deck";

function emptySlots(): (DeckSlot | null)[] {
  return Array.from({ length: DECK_SLOT_COUNT }, () => null);
}

/** Crée une page vide. */
export function createDeckPage(id: string, title: string, parentPageId?: string | null): DeckPage {
  return {
    id,
    title,
    parentPageId: parentPageId ?? null,
    slots: emptySlots(),
  };
}

/** Store vide avec page racine. */
export function createEmptyDeckStore(): DeckStore {
  const root = createDeckPage(ROOT_PAGE_ID, "Home");
  return {
    version: 2,
    rootPageId: ROOT_PAGE_ID,
    pages: { [ROOT_PAGE_ID]: root },
  };
}

function isValidSlot(value: unknown): value is DeckSlot {
  if (!value || typeof value !== "object") return false;
  const slot = value as DeckSlot;
  return typeof slot.id === "string" && typeof slot.kind === "string";
}

function normalizePage(page: DeckPage): DeckPage {
  const slots = [...(page.slots ?? [])];
  while (slots.length < DECK_SLOT_COUNT) slots.push(null);
  return {
    ...page,
    slots: slots.slice(0, DECK_SLOT_COUNT),
  };
}

function parseStore(raw: string): DeckStore | null {
  try {
    const data = JSON.parse(raw) as DeckStore;
    if (data?.version !== 2 || !data.pages || typeof data.rootPageId !== "string") return null;
    const pages: Record<string, DeckPage> = {};
    for (const [id, page] of Object.entries(data.pages)) {
      if (!page || typeof page !== "object") continue;
      pages[id] = normalizePage({
        id,
        title: typeof page.title === "string" ? page.title : id,
        parentPageId: page.parentPageId ?? null,
        slots: Array.isArray(page.slots)
          ? page.slots.map((s) => (s && isValidSlot(s) ? s : null))
          : emptySlots(),
      });
    }
    if (!pages[data.rootPageId]) return null;
    const bankPageIds = Array.isArray(data.bankPageIds)
      ? data.bankPageIds.filter((id): id is string => typeof id === "string" && Boolean(pages[id]))
      : undefined;
    return { version: 2, rootPageId: data.rootPageId, bankPageIds, pages };
  } catch {
    return null;
  }
}

/** Charge le deck depuis localStorage. */
export function loadDeckStore(): DeckStore | null {
  const raw = localStorage.getItem(DECK_STORAGE_KEY);
  if (!raw) return null;
  return parseStore(raw);
}

/** Persiste le deck. */
export function saveDeckStore(store: DeckStore): void {
  localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(store));
}

/** Premier index libre sur une page (-1 si pleine). */
export function findFirstEmptySlotIndex(page: DeckPage, startAt = 0): number {
  const from = Math.max(0, startAt);
  for (let i = from; i < DECK_SLOT_COUNT; i++) {
    if (!page.slots[i]) return i;
  }
  return -1;
}

/** Insère un slot au premier emplacement libre. */
export function insertSlotOnPage(page: DeckPage, slot: DeckSlot, startAt = 0): DeckPage {
  const index = findFirstEmptySlotIndex(page, startAt);
  if (index < 0) return page;
  const slots = [...page.slots];
  slots[index] = slot;
  return { ...page, slots };
}

/** Met à jour une page dans le store. */
export function upsertPage(store: DeckStore, page: DeckPage): DeckStore {
  return {
    ...store,
    pages: { ...store.pages, [page.id]: normalizePage(page) },
  };
}
