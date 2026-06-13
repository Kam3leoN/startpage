export type Category = "jeux" | "infos" | "boutiques" | "divertissement" | "dev";

export interface Favorite {
  id: string;          // used for the colored tile background (data-tile)
  label: string;
  url: string;
  icon: string;        // filename in /icons or a glyph
  tags: Category[];
}

export interface Profile {
  key: string;
  label: string;
  /** Seed color (M3 source) used to generate the whole scheme for this profile. */
  seed: string;
  favorites: Favorite[];
}

const ICON = (name: string) => `${import.meta.env.BASE_URL}icons/${name}`;

const FAV = {
  gmail: { id: "gmail", label: "Gmail", url: "https://mail.google.com/", icon: ICON("gmail.svg") },
  google: { id: "google", label: "Google", url: "https://www.google.com/", icon: ICON("google.svg") },
  youtube: { id: "youtube", label: "YouTube", url: "https://www.youtube.com/", icon: ICON("netflix.svg") },
  netflix: { id: "netflix", label: "Netflix", url: "https://www.netflix.com/", icon: ICON("netflix.svg") },
  github: { id: "gitHub", label: "GitHub", url: "https://github.com/", icon: ICON("github.svg") },
  codepen: { id: "codepen", label: "CodePen", url: "https://codepen.io/", icon: ICON("codepen.svg") },
  instagram: { id: "instagram", label: "Instagram", url: "https://instagram.com/", icon: ICON("instagram.svg") },
  inbox: { id: "inbox", label: "Inbox", url: "https://mail.google.com/", icon: ICON("inbox.svg") },
  tele: { id: "tele_loisirs", label: "Télé Loisirs", url: "https://www.programme-tv.net/programme/toutes-les-chaines/", icon: ICON("tele_loisirs.svg") },
} as const;

export const PROFILES: Profile[] = [
  {
    key: "accueil",
    label: "Accueil",
    seed: "#B3261E",
    favorites: [
      { ...FAV.gmail, tags: ["infos"] },
      { ...FAV.tele, tags: ["divertissement"] },
      { ...FAV.youtube, tags: ["divertissement"] },
      { ...FAV.google, tags: ["infos"] },
      { ...FAV.github, tags: ["dev"] },
      { ...FAV.codepen, tags: ["dev"] },
    ],
  },
  {
    key: "cedric",
    label: "Cédric",
    seed: "#0B57D0",
    favorites: [
      { ...FAV.gmail, tags: ["infos"] },
      { ...FAV.youtube, tags: ["divertissement"] },
      { ...FAV.tele, tags: ["divertissement"] },
      { ...FAV.github, tags: ["dev"] },
      { ...FAV.codepen, tags: ["dev"] },
      { ...FAV.google, tags: ["infos"] },
      { ...FAV.netflix, tags: ["boutiques", "divertissement"] },
    ],
  },
  {
    key: "celine",
    label: "Céline",
    seed: "#B3261E",
    favorites: [
      { ...FAV.gmail, tags: ["infos"] },
      { ...FAV.inbox, tags: ["infos"] },
      { ...FAV.tele, tags: ["divertissement"] },
      { ...FAV.instagram, tags: ["divertissement"] },
      { ...FAV.netflix, tags: ["divertissement", "boutiques"] },
    ],
  },
  {
    key: "enfants",
    label: "Enfants",
    seed: "#E8A800",
    favorites: [
      { ...FAV.youtube, tags: ["jeux", "divertissement"] },
      { ...FAV.netflix, tags: ["jeux", "divertissement"] },
      { ...FAV.tele, tags: ["jeux"] },
    ],
  },
];

export const CATEGORIES: Category[] = [
  "jeux",
  "infos",
  "boutiques",
  "divertissement",
  "dev",
];
