import type { Category } from "../data/favorites";

/** Persisted custom shortcut entry (stored in JSON). */
export interface CustomShortcut {
  id: string;
  label: string;
  url: string;
  icon?: string;
  tags: Category[];
}

/** On-disk / localStorage JSON envelope. */
export interface CustomShortcutsFile {
  version: 1;
  shortcuts: CustomShortcut[];
}
