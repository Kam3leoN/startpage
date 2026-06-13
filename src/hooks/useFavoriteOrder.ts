import { useCallback, useEffect, useMemo, useState } from "react";
import { FAVORITE_ORDER_KEY } from "../config/defaults";
import type { Favorite } from "../data/favorites";

const SEARCH_ID = "search";

function loadOrder(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITE_ORDER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function saveOrder(order: string[]): void {
  localStorage.setItem(FAVORITE_ORDER_KEY, JSON.stringify(order));
}

/** Persists and applies user-defined tile order (search always first). */
export function useFavoriteOrder(favorites: Favorite[]) {
  const [order, setOrder] = useState<string[]>(() => loadOrder());

  useEffect(() => {
    const ids = favorites.map((f) => f.id);
    const idSet = new Set(ids);

    setOrder((prev) => {
      const kept = prev.filter((id) => idSet.has(id));
      const missing = ids.filter((id) => !kept.includes(id));
      let next = [...kept, ...missing];

      if (next.includes(SEARCH_ID)) {
        next = [SEARCH_ID, ...next.filter((id) => id !== SEARCH_ID)];
      }

      const changed = next.length !== prev.length || next.some((id, i) => id !== prev[i]);
      if (changed) saveOrder(next);
      return changed ? next : prev;
    });
  }, [favorites]);

  const orderedFavorites = useMemo(() => {
    const byId = new Map(favorites.map((f) => [f.id, f]));
    const sorted = order.map((id) => byId.get(id)).filter((f): f is Favorite => !!f);
    const rest = favorites.filter((f) => !order.includes(f.id));
    const merged = [...sorted, ...rest];
    if (merged.some((f) => f.id === SEARCH_ID)) {
      return [merged.find((f) => f.id === SEARCH_ID)!, ...merged.filter((f) => f.id !== SEARCH_ID)];
    }
    return merged;
  }, [favorites, order]);

  const moveFavorite = useCallback((id: string, delta: -1 | 1): boolean => {
    if (id === SEARCH_ID) return false;

    let moved = false;
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;

      let target = idx + delta;
      if (prev[0] === SEARCH_ID && target <= 0) target = 1;
      if (target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      moved = true;
      saveOrder(next);
      return next;
    });

    return moved;
  }, []);

  return { orderedFavorites, moveFavorite };
}
