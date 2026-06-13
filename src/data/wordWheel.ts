export interface WordWheelItem {
  id: string;
  label: string;
  gradient: string;
  href: string;
}

/** Palette and ids aligned with io.google/2026 puzzle word wheel. */
export const WORD_WHEEL_ITEMS: WordWheelItem[] = [
  {
    id: "alpha",
    label: "Alpha",
    gradient: "linear-gradient(145deg, #e879f9 0%, #fb7185 38%, #f97316 100%)",
    href: "https://io.google/2026/puzzle/play/",
  },
  {
    id: "blocks",
    label: "Blocks",
    gradient: "linear-gradient(160deg, #fde047 0%, #fb923c 52%, #f97316 100%)",
    href: "https://io.google/2026/puzzle/play/",
  },
  {
    id: "google",
    label: "Google",
    gradient: "linear-gradient(165deg, #34d399 0%, #22d3ee 100%)",
    href: "https://google.com",
  },
  {
    id: "android",
    label: "Android",
    gradient: "linear-gradient(155deg, #c084fc 0%, #f472b6 100%)",
    href: "https://android.com",
  },
  {
    id: "chrome",
    label: "Chrome",
    gradient: "linear-gradient(160deg, #60a5fa 0%, #1d4ed8 100%)",
    href: "https://chrome.com",
  },
];
