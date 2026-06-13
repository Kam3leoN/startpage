import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDateLine } from "../utils/formatTodayDate";
import { getSaintsOfDay } from "../utils/saintOfDay";

const EPHEMERIS_ICONS = {
  male: "./assets/icons/ephemeris/male.png",
  female: "./assets/icons/ephemeris/female.png",
} as const;

interface Props {
  date: Date;
  compactDate?: boolean;
  showEphemeris?: boolean;
}

interface GenderIconProps {
  kind: keyof typeof EPHEMERIS_ICONS;
  label: string;
}

/** Icône genre (silhouette PNG teintée via mask CSS). */
function GenderIcon({ kind, label }: GenderIconProps) {
  return (
    <span
      className={`clock__ephemeris-icon clock__ephemeris-icon--${kind}`}
      style={{
        WebkitMaskImage: `url(${EPHEMERIS_ICONS[kind]})`,
        maskImage: `url(${EPHEMERIS_ICONS[kind]})`,
      }}
      role="img"
      aria-label={label}
    />
  );
}

/** Date du jour + éphéméride (1 saint · 1 sainte max). */
export function TodayDate({ date, compactDate = false, showEphemeris = true }: Props) {
  const { i18n } = useTranslation();

  const dateLine = useMemo(
    () => formatDateLine(date, i18n.language, { compact: compactDate }),
    [date, i18n.language, compactDate]
  );

  const saints = useMemo(
    () => (showEphemeris ? getSaintsOfDay(date, i18n.language) : null),
    [date, i18n.language, showEphemeris]
  );

  const showSaintLine = saints && (saints.male || saints.female);

  return (
    <div className="clock__date">
      <p className="clock__date-line">{dateLine}</p>
      {showSaintLine && (
        <p className="clock__ephemeris">
          {saints.male && (
            <span
              className="clock__ephemeris-entry clock__ephemeris-entry--male"
              title={`Saint ${saints.male}`}
            >
              <GenderIcon kind="male" label="Saint" />
              <span className="clock__ephemeris-name">{saints.male}</span>
            </span>
          )}
          {saints.male && saints.female && (
            <span className="clock__ephemeris-sep" aria-hidden="true">
              {" · "}
            </span>
          )}
          {saints.female && (
            <span
              className="clock__ephemeris-entry clock__ephemeris-entry--female"
              title={`Sainte ${saints.female}`}
            >
              <GenderIcon kind="female" label="Sainte" />
              <span className="clock__ephemeris-name">{saints.female}</span>
            </span>
          )}
        </p>
      )}
    </div>
  );
}
