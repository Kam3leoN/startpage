import type { DeckSlot, DeckSlotAction } from "../types/deck";

export type DeckCallbackHandler = () => void;

const handlers = new Map<string, DeckCallbackHandler>();

/** Enregistre un handler nommé pour les cases `callback`. */
export function registerDeckCallback(id: string, handler: DeckCallbackHandler): void {
  handlers.set(id, handler);
}

/** Exécute un handler enregistré. */
export function runDeckCallback(id: string): boolean {
  const fn = handlers.get(id);
  if (!fn) return false;
  fn();
  return true;
}

/** Liste des callbacks disponibles (pour l'éditeur). */
export function listDeckCallbackIds(): string[] {
  return Array.from(handlers.keys());
}

/** Résout l'action effective d'une case. */
export function resolveSlotAction(slot: DeckSlot): DeckSlotAction | null {
  if (slot.action) return slot.action;
  if (slot.kind === "search") return { type: "search" };
  if (slot.kind === "switch" && slot.switchId) {
    return { type: "switch", switchId: slot.switchId };
  }
  if (slot.url) return { type: "url", url: slot.url };
  return null;
}

/** Construit un DeckSlot lien/raccourci depuis l'éditeur. */
export function slotFromEditorValues(
  id: string,
  values: {
    label: string;
    icon?: string;
    monogram?: string;
    slotVisual?: DeckSlot["slotVisual"];
    backgroundColor?: string;
    action: DeckSlotAction;
  }
): DeckSlot {
  const base = {
    id,
    label: values.label.trim(),
    icon: values.icon,
    monogram: values.monogram,
    slotVisual: values.slotVisual,
    backgroundColor: values.backgroundColor,
    action: values.action,
  };

  switch (values.action.type) {
    case "search":
      return { ...base, kind: "search" };
    case "switch":
      return {
        ...base,
        kind: "switch",
        switchId: values.action.switchId ?? id,
      };
    case "callback":
      return { ...base, kind: "link", url: undefined };
    case "url":
    default:
      return {
        ...base,
        kind: "link",
        url: values.action.url,
      };
  }
}
