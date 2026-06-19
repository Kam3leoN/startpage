const EPHEMERIS_ICONS = {
  male: "./assets/icons/ephemeris/male.png",
  female: "./assets/icons/ephemeris/female.png",
} as const;

export type EphemerisGender = keyof typeof EPHEMERIS_ICONS;

interface Props {
  kind: EphemerisGender;
  label: string;
  className?: string;
}

/** Silhouette genre (PNG teintée via mask CSS) — saint / sainte. */
export function EphemerisGenderIcon({ kind, label, className = "" }: Props) {
  return (
    <span
      className={`clock__ephemeris-icon clock__ephemeris-icon--${kind} ${className}`.trim()}
      style={{
        WebkitMaskImage: `url(${EPHEMERIS_ICONS[kind]})`,
        maskImage: `url(${EPHEMERIS_ICONS[kind]})`,
      }}
      role="img"
      aria-label={label}
    />
  );
}
