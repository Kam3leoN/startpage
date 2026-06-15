import { useCallback, useEffect, useMemo, useState } from "react";
import type { Category, Favorite } from "../data/favorites";
import type { CustomShortcut, CustomShortcutsFile } from "../types/shortcuts";
import {
  exportCustomShortcutsFile,
  loadCustomShortcutsFile,
  parseImportedShortcutsFile,
  saveCustomShortcutsFile,
} from "../utils/customShortcutsStorage";
import { createShortcutId, customShortcutToFavorite, isValidShortcutInput, normalizeUrl } from "../utils/shortcutHelpers";

export function useCustomShortcuts() {
  const [shortcuts, setShortcuts] = useState<CustomShortcut[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadCustomShortcutsFile().then((file) => {
      if (!cancelled) {
        setShortcuts(file.shortcuts);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: CustomShortcut[]) => {
    const file: CustomShortcutsFile = { version: 1, shortcuts: next };
    saveCustomShortcutsFile(file);
    setShortcuts(next);
  }, []);

  const addShortcut = useCallback(
    (input: Omit<CustomShortcut, "id">): CustomShortcut | null => {
      if (!isValidShortcutInput(input.label, input.url)) return null;
      const tags: Category[] = input.tags.length ? input.tags : ["infos"];
      const entry: CustomShortcut = {
        id: createShortcutId(),
        label: input.label.trim(),
        url: normalizeUrl(input.url),
        icon: input.icon?.trim() || undefined,
        tags,
      };
      persist([...shortcuts, entry]);
      return entry;
    },
    [persist, shortcuts]
  );

  const updateShortcut = useCallback(
    (id: string, input: Omit<CustomShortcut, "id">) => {
      if (!isValidShortcutInput(input.label, input.url)) return false;
      const tags: Category[] = input.tags.length ? input.tags : ["infos"];
      const next = shortcuts.map((s) =>
        s.id === id
          ? {
              ...s,
              label: input.label.trim(),
              url: normalizeUrl(input.url),
              icon: input.icon?.trim() || undefined,
              tags,
            }
          : s
      );
      persist(next);
      return true;
    },
    [persist, shortcuts]
  );

  const removeShortcut = useCallback(
    (id: string) => {
      persist(shortcuts.filter((s) => s.id !== id));
    },
    [persist, shortcuts]
  );

  const reorderShortcut = useCallback(
    (id: string, delta: -1 | 1): boolean => {
      const idx = shortcuts.findIndex((s) => s.id === id);
      if (idx < 0) return false;
      const target = idx + delta;
      if (target < 0 || target >= shortcuts.length) return false;
      const next = [...shortcuts];
      [next[idx], next[target]] = [next[target], next[idx]];
      persist(next);
      return true;
    },
    [persist, shortcuts]
  );

  const exportJson = useCallback(() => {
    exportCustomShortcutsFile({ version: 1, shortcuts });
  }, [shortcuts]);

  const importJson = useCallback(
    async (file: File) => {
      const parsed = await parseImportedShortcutsFile(file);
      if (!parsed) return false;
      persist(parsed.shortcuts);
      return true;
    },
    [persist]
  );

  const favorites = useMemo<Favorite[]>(
    () => shortcuts.map(customShortcutToFavorite),
    [shortcuts]
  );

  return {
    shortcuts,
    favorites,
    ready,
    addShortcut,
    updateShortcut,
    removeShortcut,
    reorderShortcut,
    exportJson,
    importJson,
  };
}
