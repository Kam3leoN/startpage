import { useCallback, useEffect, useState } from "react";
import type { BirthdayEntry } from "../types/birthday";
import {
  ensureBirthdaysStorageFormat,
  loadBirthdaysFromStorage,
  saveBirthdaysToStorage,
} from "../utils/birthdaysStorage";

/** Gestion des anniversaires personnalisés (persistance localStorage `k3-birthdays`). */
export function useBirthdays() {
  const [birthdays, setBirthdaysState] = useState<BirthdayEntry[]>(() => {
    ensureBirthdaysStorageFormat();
    return loadBirthdaysFromStorage();
  });

  const setBirthdays = useCallback((entries: BirthdayEntry[]) => {
    setBirthdaysState(entries);
    saveBirthdaysToStorage(entries);
  }, []);

  const reloadBirthdays = useCallback(() => {
    setBirthdaysState(loadBirthdaysFromStorage());
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "k3-birthdays") {
        reloadBirthdays();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reloadBirthdays]);

  const addBirthday = useCallback(
    (input: Omit<BirthdayEntry, "id">) => {
      const trimmed = input.name.trim();
      if (!trimmed || input.day < 1 || input.day > 31 || input.month < 1 || input.month > 12) {
        return null;
      }

      const entry: BirthdayEntry = {
        id: crypto.randomUUID(),
        name: trimmed,
        day: input.day,
        month: input.month,
        year: input.year,
      };

      let created: BirthdayEntry | null = null;
      setBirthdaysState((prev) => {
        const next = [...prev, entry];
        saveBirthdaysToStorage(next);
        created = entry;
        return next;
      });
      return created;
    },
    []
  );

  const removeBirthday = useCallback((id: string) => {
    setBirthdaysState((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBirthdaysToStorage(next);
      return next;
    });
  }, []);

  const updateBirthday = useCallback(
    (id: string, patch: Partial<Pick<BirthdayEntry, "name" | "day" | "month" | "year">>) => {
      let updated = false;
      setBirthdaysState((prev) => {
        const next = prev.map((entry) => {
          if (entry.id !== id) return entry;
          const day = patch.day ?? entry.day;
          const month = patch.month ?? entry.month;
          if (day < 1 || day > 31 || month < 1 || month > 12) return entry;
          updated = true;
          return {
            ...entry,
            name: patch.name != null ? patch.name.trim() : entry.name,
            day,
            month,
            year: patch.year !== undefined ? patch.year : entry.year,
          };
        });
        if (updated) saveBirthdaysToStorage(next);
        return next;
      });
      return updated;
    },
    []
  );

  return { birthdays, setBirthdays, addBirthday, removeBirthday, updateBirthday, reloadBirthdays };
}
