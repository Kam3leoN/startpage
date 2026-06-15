import type { DeckPage, DeckStore } from "../types/deck";
import { createDeckPage, upsertPage } from "./deckStorage";
import { DRAFT_BANK_PAGE_ID, ROOT_PAGE_ID } from "../config/deck";

/** Page bank avec au moins une catégorie ou un raccourci. */
export function isPopulatedBankPage(page: DeckPage | undefined): boolean {
  if (!page) return false;
  return page.slots.some(
    (slot) => slot && (slot.kind === "category" || slot.kind === "link" || slot.kind === "switch")
  );
}

/** Identifiants des pages racine (banks Stream Deck), dans l'ordre. */
export function getBankPageIds(store: DeckStore): string[] {
  const ids = store.bankPageIds?.filter((id) => Boolean(store.pages[id]));
  if (ids && ids.length > 0) return ids;
  return [store.rootPageId];
}

/** Banks ayant au moins un raccourci ou une catégorie. */
export function getPopulatedBankPageIds(store: DeckStore): string[] {
  return getBankPageIds(store).filter((id) => isPopulatedBankPage(store.pages[id]));
}

/** Assure qu'au moins la page racine est enregistrée comme bank. */
export function normalizeBankPageIds(store: DeckStore): DeckStore {
  const ids = getBankPageIds(store);
  if (store.bankPageIds?.length === ids.length) return store;
  return { ...store, bankPageIds: ids };
}

/** Retire les banks vides (sauf racine). */
export function pruneEmptyBankPages(store: DeckStore): DeckStore {
  const ids = getBankPageIds(store).filter((id) => {
    if (id === store.rootPageId) return true;
    return isPopulatedBankPage(store.pages[id]);
  });
  if (ids.length === store.bankPageIds?.length) return store;
  return { ...store, bankPageIds: ids };
}


/** Persiste une page bank brouillon (premier contenu catégorie/raccourci). */
export function commitDraftBankPage(
  store: DeckStore,
  draftPage: DeckPage
): { store: DeckStore; pageId: string } {
  const ids = [...getBankPageIds(store)];
  const pageId = `deck-bank-${Date.now()}`;
  const title = `Page ${ids.length + 1}`;
  const page = { ...draftPage, id: pageId, title };
  let next = upsertPage(store, page);
  ids.push(pageId);
  next = { ...next, bankPageIds: ids };
  return { store: next, pageId };
}

/** Page bank peuplée précédente dans l'ordre des banks. */
export function resolvePrevBankId(store: DeckStore, bankPageId: string): string | null {
  const populated = getPopulatedBankPageIds(store);
  const index = populated.indexOf(bankPageId);
  if (index > 0) return populated[index - 1] ?? null;
  return null;
}

/** Page bank peuplée suivante dans l'ordre des banks. */
export function resolveNextPopulatedBankId(store: DeckStore, bankPageId: string): string | null {
  const populated = getPopulatedBankPageIds(store);
  const index = populated.indexOf(bankPageId);
  if (index >= 0 && index < populated.length - 1) return populated[index + 1] ?? null;
  return null;
}

export function canGoPrevBank(store: DeckStore, bankPageId: string): boolean {
  return resolvePrevBankId(store, bankPageId) !== null;
}

/** Crée une page bank brouillon vide (mémoire uniquement). */
export function createDraftBankPage(store: DeckStore): DeckPage {
  const populated = getPopulatedBankPageIds(store);
  const title = `Page ${Math.max(populated.length, getBankPageIds(store).length) + 1}`;
  return createDeckPage(DRAFT_BANK_PAGE_ID, title, ROOT_PAGE_ID);
}
