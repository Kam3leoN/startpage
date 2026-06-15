import { useCallback, useRef, useState } from "react";
import { DECK_SLOT_DRAG_MIME } from "../utils/deckSlotDrag";

/**
 * Drag & drop des cases — même pattern que le composant K3UI List (HTML5 + indicateurs visuels).
 */
export function useDeckSlotDrag(onReorder: (fromIndex: number, toIndex: number) => void) {
  const dragIndexRef = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLElement>, slotIndex: number) => {
    dragIndexRef.current = slotIndex;
    setDragIndex(slotIndex);
    setDropIndex(slotIndex);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DECK_SLOT_DRAG_MIME, String(slotIndex));
    event.dataTransfer.setData("text/plain", String(slotIndex));

    const preview = event.currentTarget.querySelector(".deck-slot") as HTMLElement | null;
    if (preview) {
      event.dataTransfer.setDragImage(preview, preview.offsetWidth / 2, preview.offsetHeight / 2);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    const from = dragIndexRef.current;
    const to = dropIndex;
    if (from !== null && to !== null && from !== to) {
      onReorder(from, to);
    }
    dragIndexRef.current = null;
    setDragIndex(null);
    setDropIndex(null);
  }, [dropIndex, onReorder]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>, slotIndex: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragIndexRef.current !== null && dragIndexRef.current !== slotIndex) {
      setDropIndex(slotIndex);
    }
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLElement>, slotIndex: number) => {
    event.preventDefault();
    if (dragIndexRef.current !== null) {
      setDropIndex(slotIndex);
    }
  }, []);

  return {
    dragIndex,
    dropIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
  };
}
