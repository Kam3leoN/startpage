import {
  DECK_ACTIVE_COLUMN_START,
  DECK_ACTIVE_COLUMNS,
  DECK_GRID_COLUMNS,
  DECK_GRID_ROWS,
  DECK_SLOT_COUNT,
} from "../config/deck";
import type { DeckPage, DeckSlot } from "../types/deck";

export type GridCell =
  | { type: "spacer" }
  | { type: "slot"; slotIndex: number; slot: DeckSlot; colSpan?: number };

/** Cases réservées à la barre de navigation (hors grille). */
export function isNavSystemSlot(slot: DeckSlot | null): boolean {
  if (!slot) return false;
  return slot.kind === "search" || slot.kind === "prev-page" || slot.kind === "next-page";
}

export function findPageNavLinks(page: DeckPage): {
  prevPageId?: string;
  nextPageId?: string;
} {
  let prevPageId: string | undefined;
  let nextPageId: string | undefined;
  for (const slot of page.slots) {
    if (!slot) continue;
    if (slot.kind === "prev-page" && slot.linkedPageId) prevPageId = slot.linkedPageId;
    if (slot.kind === "next-page" && slot.linkedPageId) nextPageId = slot.linkedPageId;
  }
  return { prevPageId, nextPageId };
}

function emptySlot(slotIndex: number): DeckSlot {
  return { id: `empty-${slotIndex}`, kind: "empty" };
}

function slotForGrid(stored: DeckSlot | null, slotIndex: number): DeckSlot {
  if (stored && !isNavSystemSlot(stored)) return stored;
  return emptySlot(slotIndex);
}

/** Grille desktop 12×4 — 8 colonnes actives centrées. */
export function buildGridCellsDesktop(page: DeckPage): GridCell[] {
  const cells: GridCell[] = [];

  for (let row = 0; row < DECK_GRID_ROWS; row++) {
    for (let col = 0; col < DECK_GRID_COLUMNS; col++) {
      const isMargin = col < DECK_ACTIVE_COLUMN_START || col >= DECK_ACTIVE_COLUMN_START + DECK_ACTIVE_COLUMNS;
      if (isMargin) {
        cells.push({ type: "spacer" });
        continue;
      }

      const slotIndex = row * DECK_ACTIVE_COLUMNS + (col - DECK_ACTIVE_COLUMN_START);
      const stored = page.slots[slotIndex] ?? null;
      cells.push({ type: "slot", slotIndex, slot: slotForGrid(stored, slotIndex) });
    }
  }

  return cells;
}

/** Grille mobile 12×8 — 4 colonnes × 8 lignes (span 3). */
export function buildGridCellsMobile(page: DeckPage): GridCell[] {
  const cells: GridCell[] = [];

  for (let slotIndex = 0; slotIndex < DECK_SLOT_COUNT; slotIndex++) {
    const stored = page.slots[slotIndex] ?? null;
    cells.push({
      type: "slot",
      slotIndex,
      slot: slotForGrid(stored, slotIndex),
      colSpan: 3,
    });
  }

  return cells;
}
