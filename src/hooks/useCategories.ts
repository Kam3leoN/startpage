import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_CATEGORY_ID,
  sanitizeCategoryLabel,
  slugifyCategoryLabel,
  type CategoryDef,
} from "../data/categories";
import { loadCategories, saveCategories } from "../utils/categoryStorage";

function uniqueId(base: string, existing: Set<string>): string {
  let id = base;
  let n = 2;
  while (existing.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

/** CRUD for user-managed shortcut categories (localStorage). */
export function useCategories() {
  const [categories, setCategories] = useState<CategoryDef[]>(() => loadCategories());

  const persist = useCallback((next: CategoryDef[]) => {
    saveCategories(next);
    setCategories(next);
  }, []);

  const labelsById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.label));
    return map;
  }, [categories]);

  const getLabel = useCallback(
    (id: string) => labelsById.get(id) ?? id,
    [labelsById]
  );

  const addCategory = useCallback(
    (label: string): CategoryDef | null => {
      const trimmed = sanitizeCategoryLabel(label);
      if (!trimmed) return null;
      const ids = new Set(categories.map((c) => c.id));
      const id = uniqueId(slugifyCategoryLabel(trimmed), ids);
      const entry: CategoryDef = { id, label: trimmed };
      persist([...categories, entry]);
      return entry;
    },
    [categories, persist]
  );

  const updateCategory = useCallback(
    (id: string, label: string): boolean => {
      const trimmed = sanitizeCategoryLabel(label);
      if (!trimmed) return false;
      const idx = categories.findIndex((c) => c.id === id);
      if (idx < 0) return false;
      const next = categories.map((c) => (c.id === id ? { ...c, label: trimmed } : c));
      persist(next);
      return true;
    },
    [categories, persist]
  );

  const removeCategory = useCallback(
    (id: string): boolean => {
      if (categories.length <= 1) return false;
      persist(categories.filter((c) => c.id !== id));
      return true;
    },
    [categories, persist]
  );

  const moveCategory = useCallback(
    (id: string, delta: -1 | 1): boolean => {
      const idx = categories.findIndex((c) => c.id === id);
      if (idx < 0) return false;
      const target = idx + delta;
      if (target < 0 || target >= categories.length) return false;
      const next = [...categories];
      [next[idx], next[target]] = [next[target], next[idx]];
      persist(next);
      return true;
    },
    [categories, persist]
  );

  const fallbackCategoryId = categories.some((c) => c.id === DEFAULT_CATEGORY_ID)
    ? DEFAULT_CATEGORY_ID
    : categories[0]?.id ?? DEFAULT_CATEGORY_ID;

  return {
    categories,
    getLabel,
    addCategory,
    updateCategory,
    removeCategory,
    moveCategory,
    fallbackCategoryId,
  };
}
