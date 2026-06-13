export interface WordWheelItem {
  id: string;
  label: string;
  letter: string;
  gradient: string;
  href: string;
}

/** Items with vertical gradients matching the I/O 2026 word wheel palette. */
export const WORD_WHEEL_ITEMS: WordWheelItem[] = [
  {
    id: "alpha",
    label: "Alpha",
    letter: "A",
    gradient: "linear-gradient(180deg, #e879f9 0%, #fb7185 42%, #f97316 100%)",
    href: "https://io.google/2026/puzzle/play/",
  },
  {
    id: "blocks",
    label: "Blocks",
    letter: "▦",
    gradient: "linear-gradient(180deg, #fde047 0%, #fb923c 55%, #f97316 100%)",
    href: "https://io.google/2026/puzzle/play/",
  },
  {
    id: "google",
    label: "Google",
    letter: "G",
    gradient: "linear-gradient(180deg, #38bdf8 0%, #2dd4bf 100%)",
    href: "https://google.com",
  },
  {
    id: "android",
    label: "Android",
    letter: "◐",
    gradient: "linear-gradient(180deg, #c084fc 0%, #f472b6 100%)",
    href: "https://android.com",
  },
  {
    id: "chrome",
    label: "Chrome",
    letter: "◆",
    gradient: "linear-gradient(180deg, #60a5fa 0%, #1e3a8a 100%)",
    href: "https://chrome.com",
  },
];
