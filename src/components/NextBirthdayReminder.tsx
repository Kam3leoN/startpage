import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import { getNextUpcomingBirthdayGroup } from "../utils/weekCelebrations";
import { BirthdayNameList, entryToNamePart } from "./BirthdayNameList";

interface Props {
  date: Date;
  birthdays: BirthdayEntry[];
}

/**
 * Rappel accueil : prochain(s) anniversaire(s) à souhaiter + jours restants.
 * Plusieurs prénoms le même jour sont listés ensemble (colorés par genre).
 */
export function NextBirthdayReminder({ date, birthdays }: Props) {
  const { t } = useTranslation();

  const group = useMemo(
    () => getNextUpcomingBirthdayGroup(date, birthdays),
    [date, birthdays]
  );

  if (!group) return null;

  const { items, daysUntil, isToday } = group;
  const names = items.map((item) => entryToNamePart(item.entry, item.age));
  const single = items.length === 1 ? items[0] : null;
  const withAge = single?.age != null;

  let prefix: string;
  let suffix: string;

  if (isToday) {
    prefix = t("nextBirthday.prefixToday");
    suffix = withAge
      ? t("nextBirthday.suffixTodayWithAge", { age: single.age })
      : t("nextBirthday.suffixToday");
  } else if (daysUntil === 1) {
    prefix = t("nextBirthday.prefix");
    suffix = withAge
      ? t("nextBirthday.suffixTomorrowWithAge", { age: single.age })
      : t("nextBirthday.suffixTomorrow");
  } else {
    prefix = t("nextBirthday.prefix");
    suffix = withAge
      ? t("nextBirthday.suffixInDaysWithAge", { count: daysUntil, age: single.age })
      : t("nextBirthday.suffixInDays", { count: daysUntil });
  }

  return (
    <p className="next-birthday" role="status">
      <span className="next-birthday__cake" aria-hidden="true">
        🎂
      </span>
      <span className="next-birthday__text">
        {prefix}
        <BirthdayNameList
          entries={names}
          showAge={items.length > 1}
          nameClassName="next-birthday__name"
        />
        {suffix}
      </span>
    </p>
  );
}
