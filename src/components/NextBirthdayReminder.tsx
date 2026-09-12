import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import { getNextUpcomingBirthday } from "../utils/weekCelebrations";

interface Props {
  date: Date;
  birthdays: BirthdayEntry[];
}

/**
 * Rappel accueil : prochain anniversaire à souhaiter + jours restants.
 * Invisible tant qu'aucun anniversaire n'est enregistré.
 */
export function NextBirthdayReminder({ date, birthdays }: Props) {
  const { t } = useTranslation();

  const next = useMemo(
    () => getNextUpcomingBirthday(date, birthdays),
    [date, birthdays]
  );

  if (!next) return null;

  const { entry, daysUntil, age, isToday } = next;
  const name = entry.name;
  const withAge = age != null;

  let label: string;
  if (isToday) {
    label = withAge
      ? t("nextBirthday.todayWithAge", { name, age })
      : t("nextBirthday.today", { name });
  } else if (daysUntil === 1) {
    label = withAge
      ? t("nextBirthday.tomorrowWithAge", { name, age })
      : t("nextBirthday.tomorrow", { name });
  } else {
    label = withAge
      ? t("nextBirthday.inDaysWithAge", { name, count: daysUntil, age })
      : t("nextBirthday.inDays", { name, count: daysUntil });
  }

  return (
    <p className="next-birthday" role="status">
      <span className="next-birthday__cake" aria-hidden="true">
        🎂
      </span>
      <span className="next-birthday__text">{label}</span>
    </p>
  );
}
