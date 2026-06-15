import type { DeckSlot, DeckSlotVisual } from "../types/deck";

/** Première lettre du libellé (défaut sans icône). */
export function defaultMonogramFromLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

/** Normalise une saisie utilisateur (1–2 caractères). */
export function sanitizeMonogram(value: string): string | undefined {
  const trimmed = value.trim().slice(0, 2);
  return trimmed ? trimmed.toUpperCase() : undefined;
}

/** Mode visuel effectif (icône ou initiales). */
export function resolveSlotVisualMode(slot: DeckSlot): DeckSlotVisual {
  if (slot.slotVisual) return slot.slotVisual;
  return slot.icon ? "icon" : "monogram";
}

/** Initiales affichées lorsque le mode visuel est `monogram`. */
export function resolveSlotMonogram(slot: DeckSlot): string | null {
  if (slot.kind === "search") return null;
  if (resolveSlotVisualMode(slot) === "icon" && slot.icon) return null;
  if (slot.monogram) return slot.monogram.slice(0, 2).toUpperCase();
  if (slot.label) return defaultMonogramFromLabel(slot.label);
  return null;
}
