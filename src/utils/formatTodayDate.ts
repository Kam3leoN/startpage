export interface FormatDateOptions {
  compact?: boolean;
}

/**
 * Formate la partie date seule (sans éphéméride).
 * Long : « Samedi, 13 juin 2026 » — Compact : « Sam, 13 juin 2026 »
 */
export function formatDateLine(
  date: Date,
  locale: string,
  options: FormatDateOptions = {}
): string {
  const { compact = false } = options;

  if (!locale.startsWith("fr")) {
    const lang = locale.startsWith("en") ? "en-US" : locale;
    const formatted = date.toLocaleDateString(lang, {
      weekday: compact ? "short" : "long",
      day: "numeric",
      month: compact ? "short" : "long",
      year: "numeric",
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  const weekday = date.toLocaleDateString("fr-FR", {
    weekday: compact ? "short" : "long",
  });
  const rest = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: compact ? "short" : "long",
    year: "numeric",
  });
  const w = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${w}, ${rest}`;
}
