export interface WordWheelItem {
  id: string;
  label: string;
  letter: string;
  gradient: string;
  href: string;
}

/** Demo items inspired by the I/O 2026 puzzle word-wheel carousel. */
export const WORD_WHEEL_ITEMS: WordWheelItem[] = [
  {
    id: "alpha",
    label: "Alpha",
    letter: "A",
    gradient: "linear-gradient(135deg, #ff6b4a 0%, #c084fc 55%, #818cf8 100%)",
    href: "https://io.google/2026/puzzle/play/",
  },
  {
    id: "blocks",
    label: "Blocks",
    letter: "B",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
    href: "https://io.google/2026/puzzle/play/",
  },
  {
    id: "google",
    label: "Google",
    letter: "G",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #14b8a6 100%)",
    href: "https://google.com",
  },
  {
    id: "android",
    label: "Android",
    letter: "D",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    href: "https://android.com",
  },
  {
    id: "chrome",
    label: "Chrome",
    letter: "C",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
    href: "https://chrome.com",
  },
];
