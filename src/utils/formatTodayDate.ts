/**
 * Formats today's date for the hero line.
 * FR: « Aujourd'hui, nous sommes le, samedi 13 juin 2026 »
 */
export function formatTodayDate(date: Date, locale: string, prefix: string): string {
  const lang = locale.startsWith("en") ? "en-US" : "fr-FR";
  const formatted = date.toLocaleDateString(lang, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${prefix} ${formatted}`;
}
