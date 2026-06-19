import { BIRTHDAYS_STORAGE_KEY } from "../config/defaults";
import type { BirthdayEntry } from "../types/birthday";
import { coerceBirthYear } from "./birthdayYear";

export interface BirthdaysFile {
  version: 1;
  birthdays: BirthdayEntry[];
}

const EMPTY_FILE: BirthdaysFile = { version: 1, birthdays: [] };

function isValidEntry(item: unknown): item is BirthdayEntry {
  if (!item || typeof item !== "object") return false;
  const entry = item as BirthdayEntry;
  return (
    typeof entry.id === "string" &&
    typeof entry.name === "string" &&
    typeof entry.day === "number" &&
    typeof entry.month === "number"
  );
}

function normalizeBirthday(entry: BirthdayEntry): BirthdayEntry {
  const y = coerceBirthYear(entry.year);
  if (y == null) {
    const { year: _removed, ...rest } = entry;
    return rest as BirthdayEntry;
  }
  const currentYear = new Date().getFullYear();
  if (y >= currentYear) {
    const { year: _removed, ...rest } = entry;
    return rest as BirthdayEntry;
  }
  return { ...entry, year: y };
}

function parseEntries(raw: unknown): BirthdayEntry[] {
  if (Array.isArray(raw)) {
    return raw.filter(isValidEntry).map(normalizeBirthday);
  }
  if (raw && typeof raw === "object") {
    const file = raw as BirthdaysFile;
    if (file.version === 1 && Array.isArray(file.birthdays)) {
      return file.birthdays.filter(isValidEntry).map(normalizeBirthday);
    }
  }
  return [];
}

/** Charge les anniversaires depuis localStorage (`k3-birthdays`). */
export function loadBirthdaysFromStorage(): BirthdayEntry[] {
  try {
    const raw = localStorage.getItem(BIRTHDAYS_STORAGE_KEY);
    if (!raw) return [...EMPTY_FILE.birthdays];
    return parseEntries(JSON.parse(raw) as unknown);
  } catch {
    return [...EMPTY_FILE.birthdays];
  }
}

/** Persiste les anniversaires dans localStorage. */
export function saveBirthdaysToStorage(entries: BirthdayEntry[]): boolean {
  try {
    const payload: BirthdaysFile = { version: 1, birthdays: entries };
    localStorage.setItem(BIRTHDAYS_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("[birthdaysStorage] Échec de la sauvegarde localStorage", error);
    return false;
  }
}

/** Migre l'ancien format (tableau brut) vers l'enveloppe versionnée si nécessaire. */
export function ensureBirthdaysStorageFormat(): void {
  saveBirthdaysToStorage(loadBirthdaysFromStorage());
}
