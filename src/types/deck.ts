/** Action exécutable d'une case Stream Deck. */
export type DeckSlotActionType = "url" | "search" | "switch" | "callback";

export interface DeckSlotAction {
  type: DeckSlotActionType;
  /** URL pour type `url`. */
  url?: string;
  /** ID interrupteur pour type `switch`. */
  switchId?: string;
  /** ID handler enregistré pour type `callback`. */
  callbackId?: string;
}

/** Type de contenu d'une case Stream Deck (32 slots par page). */
export type DeckSlotKind =
  | "empty"
  | "link"
  | "category"
  | "switch"
  | "search"
  | "prev-page"
  | "next-page";

/** Mode d'affichage visuel d'une case (icône ou initiales). */
export type DeckSlotVisual = "icon" | "monogram";

/** Une case de la grille 8×4 (31 utiles + retour en sous-page). */
export interface DeckSlot {
  id: string;
  kind: DeckSlotKind;
  label?: string;
  url?: string;
  icon?: string;
  /** Dossier / catégorie — ouvre `targetPageId`. */
  targetPageId?: string;
  /** ID catégorie persistée (CategoryDef.id). */
  categoryId?: string;
  /** Interrupteur On/Off persisté. */
  switchId?: string;
  /** Page liée pour prev-page / next-page. */
  linkedPageId?: string;
  /** Couleur de fond (hex). */
  backgroundColor?: string;
  /** Initiales affichées (1–2 caractères). */
  monogram?: string;
  /** Affichage prioritaire lorsque icône et initiales coexistent. */
  slotVisual?: DeckSlotVisual;
  /** Action explicite (prioritaire sur kind/url legacy). */
  action?: DeckSlotAction;
}

/** Page de raccourcis (comme une « bank » Stream Deck / Companion). */
export interface DeckPage {
  id: string;
  title: string;
  parentPageId?: string | null;
  slots: (DeckSlot | null)[];
}

/** Persistance localStorage du deck. */
export interface DeckStore {
  version: 2;
  rootPageId: string;
  /** Pages racine ordonnées (bank 1, 2, 3…). */
  bankPageIds?: string[];
  pages: Record<string, DeckPage>;
}

/** Données éditeur — icône, label, couleur, action. */
export interface DeckSlotEditorValues {
  label: string;
  icon?: string;
  monogram?: string;
  slotVisual?: DeckSlotVisual;
  backgroundColor?: string;
  action: DeckSlotAction;
}

/** Données éditeur catégorie. */
export interface DeckCategoryEditorValues {
  label: string;
  icon?: string;
  monogram?: string;
  slotVisual?: DeckSlotVisual;
  backgroundColor?: string;
}
