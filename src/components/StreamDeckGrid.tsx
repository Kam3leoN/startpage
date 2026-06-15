import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DECK_GRID_COLUMNS,
  DECK_GRID_ROWS,
  DECK_MOBILE_MEDIA,
  DECK_MOBILE_ROWS,
} from "../config/deck";
import { useDeckSlotDrag } from "../hooks/useDeckSlotDrag";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { DeckPage, DeckSlot } from "../types/deck";
import {
  buildGridCellsDesktop,
  buildGridCellsMobile,
} from "../utils/deckGridCells";
import { isDeckSlotDraggable } from "../utils/deckSlotDrag";
import { DeckNavBar } from "./DeckNavBar";
import { DeckSlotButton, type DeckSlotActions } from "./DeckSlotButton";

interface Props {
  page: DeckPage;
  bankPagination: { current: number; total: number };
  isOnHome: boolean;
  canGoPrevBank: boolean;
  k3ready: boolean;
  onSearchClick: () => void;
  onNavigatePage: (pageId: string) => void;
  onNavigateLinkedPage: (pageId: string) => void;
  onNavigateHome: () => void;
  onNavigatePrevBank: () => void;
  onNavigateNextBank: () => void;
  onExecuteSlot: (slot: DeckSlot) => void;
  onMenuAction: (actionId: string, slotIndex: number, slot: DeckSlot) => void;
  onReorderSlots: (fromIndex: number, toIndex: number) => void;
}

/**
 * Grille Stream Deck + barre de navigation sous la grille.
 */
export function StreamDeckGrid({
  page,
  bankPagination,
  isOnHome,
  canGoPrevBank,
  k3ready,
  onSearchClick,
  onNavigatePage,
  onNavigateLinkedPage,
  onNavigateHome,
  onNavigatePrevBank,
  onNavigateNextBank,
  onExecuteSlot,
  onMenuAction,
  onReorderSlots,
}: Props) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(DECK_MOBILE_MEDIA);

  const {
    dragIndex,
    dropIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
  } = useDeckSlotDrag(onReorderSlots);

  const cells = useMemo(
    () => (isMobile ? buildGridCellsMobile(page) : buildGridCellsDesktop(page)),
    [page, isMobile]
  );

  const actions: DeckSlotActions = useMemo(
    () => ({
      onSearch: onSearchClick,
      onNavigatePage,
      onNavigateBack: onNavigateHome,
      onNavigateLinked: onNavigateLinkedPage,
      onExecuteSlot,
    }),
    [onSearchClick, onNavigatePage, onNavigateLinkedPage, onNavigateHome, onExecuteSlot]
  );

  const gridRows = isMobile ? DECK_MOBILE_ROWS : DECK_GRID_ROWS;

  return (
    <section
      className="deck-section"
      aria-label={t("deck.gridLabel", { title: page.title })}
    >
      <div className="deck-grid-wrap">
        <div
          className={`deck-grid${k3ready ? " deck-grid--ready" : ""}${isMobile ? " deck-grid--mobile" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${DECK_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          }}
        >
        {cells.map((cell, index) => {
          if (cell.type === "spacer") {
            return <div key={`spacer-${index}`} className="deck-grid__spacer" aria-hidden />;
          }

          const slot = cell.slot;
          const draggable = isDeckSlotDraggable(slot);
          const isDragging = dragIndex === cell.slotIndex;
          const isDropTarget =
            dropIndex === cell.slotIndex && dragIndex !== null && dropIndex !== dragIndex;

          return (
            <div
              key={`slot-${cell.slotIndex}-${slot.id}`}
              className={[
                "deck-grid__cell",
                draggable ? "deck-grid__cell--draggable" : "",
                isDragging ? "deck-grid__cell--dragging" : "",
                isDropTarget ? "deck-grid__cell--drop-target" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={cell.colSpan ? { gridColumn: `span ${cell.colSpan}` } : undefined}
              draggable={draggable}
              onDragStart={draggable ? (e) => handleDragStart(e, cell.slotIndex) : undefined}
              onDragEnd={draggable ? handleDragEnd : undefined}
              onDragOver={(e) => handleDragOver(e, cell.slotIndex)}
              onDragEnter={(e) => handleDragEnter(e, cell.slotIndex)}
              aria-grabbed={draggable ? isDragging : undefined}
              aria-dropeffect={dragIndex !== null ? "move" : undefined}
              aria-label={
                draggable
                  ? t("deck.dragSlot", { label: slot.label ?? t("deck.emptySlot") })
                  : undefined
              }
            >
              <DeckSlotButton
                slot={slot}
                slotIndex={cell.slotIndex}
                pageId={page.id}
                k3ready={k3ready}
                actions={actions}
                onMenuAction={(actionId) => onMenuAction(actionId, cell.slotIndex, slot)}
              />
            </div>
          );
        })}
        </div>
      </div>

      <DeckNavBar
        isOnHome={isOnHome}
        canGoPrev={canGoPrevBank}
        pageCurrent={bankPagination.current}
        pageTotal={bankPagination.total}
        k3ready={k3ready}
        onSearch={onSearchClick}
        onHome={onNavigateHome}
        onPrevPage={onNavigatePrevBank}
        onNextPage={onNavigateNextBank}
      />
    </section>
  );
}
