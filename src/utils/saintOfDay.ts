import saintsFr from "../data/saintsFr.json";

export interface DaySaints {
  male: string[];
  female: string[];
}

export interface DaySaintsDisplay {
  male: string | null;
  female: string | null;
}

type SaintsMap = Record<string, DaySaints>;

const SAINTS = saintsFr as SaintsMap;

/** Clé MM-JJ pour la recherche dans le calendrier des saints. */
function saintKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

/**
 * Retourne au plus un saint masculin et une sainte féminine pour le jour.
 */
export function getSaintsOfDay(date: Date, locale: string): DaySaintsDisplay | null {
  if (!locale.startsWith("fr")) return null;

  const entry = SAINTS[saintKey(date)];
  if (!entry) return null;

  const male = entry.male[0] ?? null;
  const female = entry.female[0] ?? null;
  if (!male && !female) return null;

  return { male, female };
}
