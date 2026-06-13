import { DEFAULT_CATEGORIES, type Category } from "./categories";

export type { Category };

export interface Favorite {
  id: string;
  label: string;
  url: string;
  icon: string;
  tags: Category[];
  /** User-defined shortcut appended after built-in favorites. */
  custom?: boolean;
  /** Opens in-app search overlay instead of navigating. */
  action?: "search";
}
/** Default M3 accent seed — overridable in settings. */
export const DEFAULT_SEED = "#6750A4";

const ICON = (name: string) => `${import.meta.env.BASE_URL}icons/${name}`;

export const FAVORITES: Favorite[] = [
  {
    id: "search",
    label: "Search",
    url: "#",
    icon: ICON("search.svg"),
    tags: ["infos"],
    action: "search",
  },
  {
    id: "gmail",
    label: "Gmail",
    url: "https://mail.google.com/",
    icon: ICON("gmail.png"),
    tags: ["infos"],
  },
  {
    id: "outlook",
    label: "Outlook",
    url: "https://outlook.live.com/",
    icon: ICON("outlook.png"),
    tags: ["infos"],
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/",
    icon: ICON("github.png"),
    tags: ["dev"],
  },
  {
    id: "codepen",
    label: "CodePen",
    url: "https://codepen.io/",
    icon: ICON("codepen.png"),
    tags: ["dev"],
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/",
    icon: ICON("youtube.svg"),
    tags: ["divertissement", "jeux"],
  },
  {
    id: "netflix",
    label: "Netflix",
    url: "https://www.netflix.com/",
    icon: ICON("netflix.png"),
    tags: ["divertissement", "boutiques", "jeux"],
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/",
    icon: ICON("instagram.png"),
    tags: ["divertissement"],
  },
  {
    id: "tele_loisirs",
    label: "Télé Loisirs",
    url: "https://www.programme-tv.net/programme/toutes-les-chaines/",
    icon: ICON("tele_loisirs.svg"),
    tags: ["divertissement", "jeux"],
  },
];

/** @deprecated Use useCategories() — kept for static tag references. */
export const CATEGORIES: Category[] = DEFAULT_CATEGORIES.map((c) => c.id);