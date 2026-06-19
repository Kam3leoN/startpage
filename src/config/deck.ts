/** Grille 12 colonnes — colonnes 1–2 et 11–12 vides pour centrer le bloc 8×4. */
export const DECK_GRID_COLUMNS = 12;

/** Colonnes actives (3 → 10 en base 1). */
export const DECK_ACTIVE_COLUMN_START = 2;

export const DECK_ACTIVE_COLUMNS = 8;

export const DECK_GRID_ROWS = 4;

export const DECK_SLOT_COUNT = DECK_ACTIVE_COLUMNS * DECK_GRID_ROWS;

/** Layout mobile : 4×8, chaque case span 3 colonnes sur 12. */
export const DECK_MOBILE_MEDIA = "(max-width: 720px)";
export const DECK_MOBILE_ROWS = 8;
export const DECK_MOBILE_COLUMNS = 4;
export const DECK_MOBILE_COL_SPAN = 3;

export const ROOT_PAGE_ID = "deck-root";

/** Identifiant éphémère — page bank brouillon (non persistée tant qu'elle est vide). */
export const DRAFT_BANK_PAGE_ID = "__deck-draft-bank__";

/** Identifiant éphémère — sous-page catégorie brouillon. */
export const DRAFT_CATEGORY_PAGE_ID = "__deck-draft-category__";

/** Cases réservées prev/next dans une page catégorie (ligne 4). */
export const DECK_CATEGORY_NAV_PREV_SLOT = 30;
export const DECK_CATEGORY_NAV_NEXT_SLOT = 31;

/** localStorage key — deck Stream Deck. */
export const DECK_STORAGE_KEY = "k3-deck-store";

/** Préfixe des états switch. */
export const DECK_SWITCH_KEY_PREFIX = "k3-deck-switch-";
