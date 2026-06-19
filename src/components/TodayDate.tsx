import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDateLine } from "../utils/formatTodayDate";

interface Props {
  date: Date;
  compactDate?: boolean;
}

/** Date du jour (ligne unique, sans éphéméride — voir carte « Cette semaine »). */
export function TodayDate({ date, compactDate = false }: Props) {
  const { i18n } = useTranslation();

  const dateLine = useMemo(
    () => formatDateLine(date, i18n.language, { compact: compactDate }),
    [date, i18n.language, compactDate]
  );

  return (
    <div className="clock__date">
      <p className="clock__date-line">{dateLine}</p>
    </div>
  );
}
