import { CUSTOM_SHORTCUTS_KEY } from "../config/defaults";
import type { CustomShortcut, CustomShortcutsFile } from "../types/shortcuts";

const JSON_PATH = `${import.meta.env.BASE_URL}data/custom-shortcuts.json`;

const EMPTY_FILE: CustomShortcutsFile = { version: 1, shortcuts: [] };

function parseFile(raw: string): CustomShortcutsFile | null {
  try {
    const data = JSON.parse(raw) as CustomShortcutsFile;
    if (data?.version !== 1 || !Array.isArray(data.shortcuts)) return null;
    return {
      version: 1,
      shortcuts: data.shortcuts.filter(isValidShortcut),
    };
  } catch {
    return null;
  }
}

function isValidShortcut(item: unknown): item is CustomShortcut {
  if (!item || typeof item !== "object") return false;
  const s = item as CustomShortcut;
  return (
    typeof s.id === "string" &&
    typeof s.label === "string" &&
    typeof s.url === "string" &&
    Array.isArray(s.tags)
  );
}

/** Reads shortcuts from localStorage, falling back to the bundled JSON seed. */
export async function loadCustomShortcutsFile(): Promise<CustomShortcutsFile> {
  const cached = localStorage.getItem(CUSTOM_SHORTCUTS_KEY);
  if (cached) {
    const parsed = parseFile(cached);
    if (parsed) return parsed;
  }

  try {
    const res = await fetch(JSON_PATH);
    if (res.ok) {
      const parsed = parseFile(await res.text());
      if (parsed) {
        saveCustomShortcutsFile(parsed);
        return parsed;
      }
    }
  } catch {
    /* offline or missing seed — use empty list */
  }

  return { ...EMPTY_FILE };
}

/** Persists the shortcuts envelope as JSON (read/write mirror of custom-shortcuts.json). */
export function saveCustomShortcutsFile(file: CustomShortcutsFile): void {
  localStorage.setItem(CUSTOM_SHORTCUTS_KEY, JSON.stringify(file, null, 2));
}

/** Triggers a JSON file download for backup or manual editing. */
export function exportCustomShortcutsFile(file: CustomShortcutsFile): void {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "custom-shortcuts.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Parses an imported JSON file and returns the envelope. */
export async function parseImportedShortcutsFile(file: File): Promise<CustomShortcutsFile | null> {
  const text = await file.text();
  return parseFile(text);
}
