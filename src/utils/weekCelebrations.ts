import saintsFr from "../data/saintsFr.json";
import type { BirthdayEntry } from "../types/birthday";
import type { DaySaints } from "./saintOfDay";

type SaintsMap = Record<string, DaySaints>;

const SAINTS = saintsFr as SaintsMap;

export interface CelebrationName {
  name: string;
  gender: "male" | "female";
}

export interface WeekDayCelebration {
  date: Date;
  isToday: boolean;
  names: CelebrationName[];
}

export interface WeekBirthday {
  entry: BirthdayEntry;
  date: Date;
  isToday: boolean;
  age: number | null;
}

function saintKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Âge atteint au prochain anniversaire (ex. né en 1981 → 45 ans le 11/10/2026).
 * Retourne null si l'année de naissance est absente ou invalide.
 */
export function getAgeAtNextBirthday(entry: BirthdayEntry, reference: Date): number | null {
  const birthYear = entry.year;
  if (birthYear == null || birthYear < 1) return null;

  const ref = startOfDay(reference);
  const refYear = ref.getFullYear();
  if (birthYear > refYear) return null;

  let nextBirthday = new Date(refYear, entry.month - 1, entry.day);
  if (nextBirthday < ref) {
    nextBirthday = new Date(refYear + 1, entry.month - 1, entry.day);
  }

  const age = nextBirthday.getFullYear() - birthYear;
  return age > 0 ? age : null;
}

/** Retourne les 7 jours de la semaine courante (lundi → dimanche). */
export function getWeekDays(reference: Date): Date[] {
  const ref = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const weekday = ref.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
}

/** Prénoms fêtés pour un jour avec genre (FR uniquement). */
export function getCelebrationNamesForDay(date: Date, locale: string): CelebrationName[] {
  if (!locale.startsWith("fr")) return [];

  const entry = SAINTS[saintKey(date)];
  if (!entry) return [];

  return [
    ...entry.male.map((name) => ({ name, gender: "male" as const })),
    ...entry.female.map((name) => ({ name, gender: "female" as const })),
  ];
}

/** Tous les prénoms fêtés pour un jour (FR uniquement). */
export function getAllSaintsForDay(date: Date, locale: string): string[] {
  return getCelebrationNamesForDay(date, locale).map((item) => item.name);
}

/** Fêtes de la semaine (éphéméride / prénoms). */
export function getWeekCelebrations(reference: Date, locale: string): WeekDayCelebration[] {
  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());

  return getWeekDays(reference).map((date) => ({
    date,
    isToday: isSameDay(date, today),
    names: getCelebrationNamesForDay(date, locale),
  }));
}

/** Anniversaires tombant dans la semaine courante. */
export function getWeekBirthdays(
  reference: Date,
  birthdays: BirthdayEntry[]
): WeekBirthday[] {
  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const weekDays = getWeekDays(reference);
  const result: WeekBirthday[] = [];

  for (const day of weekDays) {
    const month = day.getMonth() + 1;
    const dayOfMonth = day.getDate();

    for (const entry of birthdays) {
      if (entry.month !== month || entry.day !== dayOfMonth) continue;

      result.push({
        entry,
        date: day,
        isToday: isSameDay(day, today),
        age: getAgeAtNextBirthday(entry, day),
      });
    }
  }

  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Anniversaires triés par prochaine occurrence à partir de la date de référence. */
export function sortBirthdaysUpcoming(
  reference: Date,
  birthdays: BirthdayEntry[]
): Array<{ entry: BirthdayEntry; nextDate: Date; isThisWeek: boolean; isToday: boolean; age: number | null }> {
  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const weekDays = getWeekDays(reference);
  const weekKeys = new Set(weekDays.map((d) => `${d.getMonth()}-${d.getDate()}`));

  return birthdays
    .map((entry) => {
      let nextDate = new Date(reference.getFullYear(), entry.month - 1, entry.day);
      if (nextDate < today) {
        nextDate = new Date(reference.getFullYear() + 1, entry.month - 1, entry.day);
      }
      const key = `${entry.month - 1}-${entry.day}`;
      const isThisWeek = weekKeys.has(key);
      const isToday = isSameDay(nextDate, today) || (entry.month === today.getMonth() + 1 && entry.day === today.getDate());
      const age = getAgeAtNextBirthday(entry, reference);
      return { entry, nextDate, isThisWeek, isToday, age };
    })
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
}
