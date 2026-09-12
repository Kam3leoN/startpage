import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry, BirthdayGender } from "../types/birthday";

interface NamePart {
  name: string;
  gender?: BirthdayGender;
  age?: number | null;
}

interface Props {
  entries: NamePart[];
  className?: string;
  nameClassName?: string;
  showAge?: boolean;
}

/** Liste de prénoms joints (« A et B ») avec couleur selon le genre. */
export function BirthdayNameList({
  entries,
  className = "",
  nameClassName = "birthday-name",
  showAge = false,
}: Props) {
  const { t } = useTranslation();
  if (entries.length === 0) return null;

  const parts: ReactNode[] = [];
  entries.forEach((item, index) => {
    if (index > 0) {
      parts.push(
        <span key={`sep-${index}`} className="birthday-name-sep">
          {index === entries.length - 1 ? ` ${t("common.and")} ` : ", "}
        </span>
      );
    }
    const genderClass = item.gender
      ? `${nameClassName} ${nameClassName}--${item.gender}`
      : nameClassName;
    const label =
      showAge && item.age != null
        ? `${item.name} (${item.age})`
        : item.name;
    parts.push(
      <span key={`${item.name}-${index}`} className={genderClass}>
        {label}
      </span>
    );
  });

  return <span className={className}>{parts}</span>;
}

export function entryToNamePart(
  entry: BirthdayEntry,
  age?: number | null
): NamePart {
  return { name: entry.name, gender: entry.gender, age };
}
