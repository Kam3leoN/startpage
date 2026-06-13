/** User-facing category definition (persisted in localStorage). */
export interface CategoryDef {
  id: string;
  label: string;
}

/** Default categories seeded on first launch. */
export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: "jeux", label: "Jeux" },
  { id: "infos", label: "Infos" },
  { id: "boutiques", label: "Boutiques" },
  { id: "divertissement", label: "Divertissement" },
  { id: "dev", label: "Dev" },
];

/** Strips HTML-like fragments from a category label. */
export function sanitizeCategoryLabel(label: string): string {
  return label.replace(/<[^>]*>/g, "").trim();
}

/** Category id used on favorites and shortcuts. */
export type Category = string;

export const DEFAULT_CATEGORY_ID = "infos";

/** Builds a stable slug from a user label. */
export function slugifyCategoryLabel(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `cat-${crypto.randomUUID().slice(0, 8)}`;
}
