import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

export interface DraggablePosition {
  x: number;
  y: number;
}

interface Options {
  storageKey: string;
  defaultPosition: DraggablePosition;
}

function readPosition(key: string, fallback: DraggablePosition): DraggablePosition {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as DraggablePosition;
    if (typeof parsed.x === "number" && typeof parsed.y === "number") return parsed;
  } catch {
    /* ignore */
  }
  return fallback;
}

function clampPosition(x: number, y: number, width: number, height: number): DraggablePosition {
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  return {
    x: Math.min(Math.max(margin, x), maxX),
    y: Math.min(Math.max(margin, y), maxY),
  };
}

/**
 * Position fixe déplaçable par poignée (pointer events), persistée en localStorage.
 */
export function useDraggablePosition({ storageKey, defaultPosition }: Options) {
  const [position, setPosition] = useState<DraggablePosition>(() =>
    readPosition(storageKey, defaultPosition)
  );
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const persist = useCallback(
    (pos: DraggablePosition) => {
      localStorage.setItem(storageKey, JSON.stringify(pos));
    },
    [storageKey]
  );

  const onDragHandlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const el = elementRef.current;
      if (!el) return;

      dragOffset.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [position.x, position.y]
  );

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (event: PointerEvent) => {
      const el = elementRef.current;
      const rect = el?.getBoundingClientRect();
      const width = rect?.width ?? 280;
      const height = rect?.height ?? 200;
      const next = clampPosition(
        event.clientX - dragOffset.current.x,
        event.clientY - dragOffset.current.y,
        width,
        height
      );
      setPosition(next);
    };

    const onPointerUp = () => {
      setDragging(false);
      setPosition((current) => {
        const el = elementRef.current;
        const rect = el?.getBoundingClientRect();
        const clamped = clampPosition(
          current.x,
          current.y,
          rect?.width ?? 280,
          rect?.height ?? 200
        );
        persist(clamped);
        return clamped;
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [dragging, persist]);

  useEffect(() => {
    const onResize = () => {
      setPosition((current) => {
        const el = elementRef.current;
        const rect = el?.getBoundingClientRect();
        const clamped = clampPosition(
          current.x,
          current.y,
          rect?.width ?? 280,
          rect?.height ?? 200
        );
        persist(clamped);
        return clamped;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [persist]);

  return {
    elementRef,
    position,
    dragging,
    onDragHandlePointerDown,
  };
}
