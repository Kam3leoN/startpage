import type { DeckSlot } from "../types/deck";

/** Cases déplaçables par drag (catégories et raccourcis). */
export function isDeckSlotDraggable(slot: DeckSlot): boolean {
  return slot.kind === "category" || slot.kind === "link" || slot.kind === "switch";
}

export const DECK_SLOT_DRAG_MIME = "application/x-deck-slot-index";
