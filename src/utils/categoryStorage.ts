import { CATEGORIES_STORAGE_KEY } from "../config/defaults";
import { DEFAULT_CATEGORIES, sanitizeCategoryLabel, type CategoryDef } from "../data/categories";

function normalizeCategory(item: CategoryDef): CategoryDef | null {
  let label = sanitizeCategoryLabel(item.label);
  if (item.id === "dev" && !label) label = "Dev";
  if (!label) return null;
  return { id: item.id, label };
}

function parseCategories(raw: string): CategoryDef[] | null {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;
    const items = data
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const c = item as CategoryDef;
        if (typeof c.id !== "string" || typeof c.label !== "string" || !c.id) return null;
        return normalizeCategory(c);
      })
      .filter((item): item is CategoryDef => !!item);
    return items.length ? items : null;
  } catch {
    return null;
  }
}

/** Loads persisted categories or seeds defaults. */
export function loadCategories(): CategoryDef[] {
  const cached = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (cached) {
    const parsed = parseCategories(cached);
    if (parsed) {
      saveCategories(parsed);
      return parsed;
    }
  }
  saveCategories(DEFAULT_CATEGORIES);
  return [...DEFAULT_CATEGORIES];
}

/** Persists the category list. */
export function saveCategories(categories: CategoryDef[]): void {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories, null, 2));
}
