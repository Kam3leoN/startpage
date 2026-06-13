import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  fr: {
    translation: {
      app: { title: "Page de démarrage" },
      search: { placeholder: "Rechercher sur le Web…", voice: "Recherche vocale" },
      filters: {
        all: "Tous",
        jeux: "Jeux",
        infos: "Infos",
        boutiques: "Boutiques",
        divertissement: "Divertissement",
        dev: "</dev>",
      },
      theme: {
        title: "Thème",
        light: "Clair",
        dark: "Sombre",
        system: "Système",
        auto: "Auto (heure)",
        color: "Couleur d'accent",
      },
      lang: { label: "Langue", fr: "Français", en: "English" },
      footer: "StartPage — Material 3 Expressive",
      a11y: { openMenu: "Ouvrir le menu", settings: "Réglages" },
    },
  },
  en: {
    translation: {
      app: { title: "Start page" },
      search: { placeholder: "Search the Web…", voice: "Voice search" },
      filters: {
        all: "All",
        jeux: "Games",
        infos: "News",
        boutiques: "Shops",
        divertissement: "Entertainment",
        dev: "</dev>",
      },
      theme: {
        title: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        auto: "Auto (time)",
        color: "Accent color",
      },
      lang: { label: "Language", fr: "Français", en: "English" },
      footer: "StartPage — Material 3 Expressive",
      a11y: { openMenu: "Open menu", settings: "Settings" },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "k3-lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
