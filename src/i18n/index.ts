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
      profile: {
        title: "Profil",
        firstName: "Prénom",
        firstNamePlaceholder: "Votre prénom…",
      },
      greeting: {
        withName: {
          morning: "Bonjour, {{name}} !",
          afternoon: "Bonne après-midi, {{name}} !",
          evening: "Bonne soirée, {{name}} !",
        },
        generic: {
          morning: "Bienvenue",
          afternoon: "Bonne après-midi",
          evening: "Bonne soirée",
        },
      },
      date: {
        todayPrefix: "Aujourd'hui, nous sommes le,",
      },
      clock: {
        title: "Horloge",
        show: "Afficher",
        hide: "Masquer",
        format24: "24 h",
        format12: "12 h",
        withoutSeconds: "HH:MM",
        withSeconds: "HH:MM:SS",
      },
      shortcuts: {
        title: "Raccourcis personnalisés",
        listLabel: "Vos raccourcis",
        addTitle: "Ajouter un raccourci",
        editTitle: "Modifier le raccourci",
        label: "Nom",
        labelPlaceholder: "Ex. Reddit…",
        url: "Adresse web",
        urlPlaceholder: "https://…",
        icon: "Icône (optionnel)",
        iconPlaceholder: "URL d'une image — favicon auto sinon",
        color: "Couleur de la tuile",
        categories: "Catégories",
        add: "Ajouter",
        save: "Enregistrer",
        edit: "Modifier",
        remove: "Supprimer",
        cancel: "Annuler",
        export: "Exporter JSON",
        import: "Importer JSON",
        importOk: "Import réussi",
        importFail: "Fichier JSON invalide",
        errorInvalid: "Nom et URL requis",
      },
      perspective: {
        title: "Perspective",
        subtitle: "Slider 3D K3UI — effet wave",
      },
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
      profile: {
        title: "Profile",
        firstName: "First name",
        firstNamePlaceholder: "Your first name…",
      },
      greeting: {
        withName: {
          morning: "Good morning, {{name}}!",
          afternoon: "Good afternoon, {{name}}!",
          evening: "Good evening, {{name}}!",
        },
        generic: {
          morning: "Welcome",
          afternoon: "Good afternoon",
          evening: "Good evening",
        },
      },
      date: {
        todayPrefix: "Today, we are",
      },
      clock: {
        title: "Clock",
        show: "Show",
        hide: "Hide",
        format24: "24 h",
        format12: "12 h",
        withoutSeconds: "HH:MM",
        withSeconds: "HH:MM:SS",
      },
      shortcuts: {
        title: "Custom shortcuts",
        listLabel: "Your shortcuts",
        addTitle: "Add a shortcut",
        editTitle: "Edit shortcut",
        label: "Name",
        labelPlaceholder: "e.g. Reddit…",
        url: "Web address",
        urlPlaceholder: "https://…",
        icon: "Icon (optional)",
        iconPlaceholder: "Image URL — auto favicon if empty",
        color: "Tile color",
        categories: "Categories",
        add: "Add",
        save: "Save",
        edit: "Edit",
        remove: "Remove",
        cancel: "Cancel",
        export: "Export JSON",
        import: "Import JSON",
        importOk: "Import successful",
        importFail: "Invalid JSON file",
        errorInvalid: "Name and URL are required",
      },
      perspective: {
        title: "Perspective",
        subtitle: "K3UI 3D slider — wave effect",
      },
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
