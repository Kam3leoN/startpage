export type Category = "jeux" | "infos" | "boutiques" | "divertissement" | "dev";

export interface Favorite {
  id: string;
  label: string;
  url: string;
  icon: string;
  tags: Category[];
}

/** Default M3 accent seed — overridable in settings. */
export const DEFAULT_SEED = "#6750A4";

const ICON = (name: string) => `${import.meta.env.BASE_URL}icons/${name}`;

export const FAVORITES: Favorite[] = [
  {
    id: "gmail",
    label: "Gmail",
    url: "https://mail.google.com/",
    icon: ICON("gmail.svg"),
    tags: ["infos"],
  },
  {
    id: "google",
    label: "Google",
    url: "https://www.google.com/",
    icon: ICON("google.svg"),
    tags: ["infos"],
  },
  {
    id: "inbox",
    label: "Inbox",
    url: "https://mail.google.com/",
    icon: ICON("inbox.svg"),
    tags: ["infos"],
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/",
    icon: ICON("github.svg"),
    tags: ["dev"],
  },
  {
    id: "codepen",
    label: "CodePen",
    url: "https://codepen.io/",
    icon: ICON("codepen.svg"),
    tags: ["dev"],
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/",
    icon: ICON("netflix.svg"),
    tags: ["divertissement", "jeux"],
  },
  {
    id: "netflix",
    label: "Netflix",
    url: "https://www.netflix.com/",
    icon: ICON("netflix.svg"),
    tags: ["divertissement", "boutiques", "jeux"],
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/",
    icon: ICON("instagram.svg"),
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

export const CATEGORIES: Category[] = [
  "jeux",
  "infos",
  "boutiques",
  "divertissement",
  "dev",
];
