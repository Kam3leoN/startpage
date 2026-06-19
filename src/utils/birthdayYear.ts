/**
 * Année de naissance issue du datepicker (jour + mois + année).
 */
export function resolveBirthYearFromDate(birthdayDate: Date): number | undefined {
  const currentYear = new Date().getFullYear();
  const y = birthdayDate.getFullYear();
  if (!Number.isFinite(y) || y < 1 || y > currentYear) return undefined;
  return y;
}

/** Normalise une année lue depuis le stockage. */
export function coerceBirthYear(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}
