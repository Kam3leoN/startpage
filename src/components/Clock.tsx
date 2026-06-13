interface Props {
  hh: string;
  mm: string;
  ss: string;
  showSeconds?: boolean;
  hourFormat?: "12" | "24";
}

/** Single-digit slot with ghost « 8 » for stable Digital-7 width and right alignment. */
function Digit({ value }: { value: string }) {
  return (
    <span className="clock__slot clock__slot--digit">
      <span className="clock__ghost" aria-hidden="true">
        8
      </span>
      <span className="clock__face">{value}</span>
    </span>
  );
}

/** Colon slot with ghost separator at 5% opacity. */
function Colon() {
  return (
    <span className="clock__slot clock__slot--colon">
      <span className="clock__ghost" aria-hidden="true">
        :
      </span>
      <span className="clock__face clock__colon">:</span>
    </span>
  );
}

function digitAt(pair: string, index: 0 | 1): string {
  return pair[index] ?? "0";
}

function formatHourDisplay(hh: string, hourFormat: "12" | "24"): { hours: string; period?: string } {
  const hour = Number.parseInt(hh, 10);
  if (hourFormat === "24" || Number.isNaN(hour)) {
    return { hours: hh };
  }
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return { hours: String(hour12).padStart(2, "0"), period };
}

/** Digital-7 clock with ghost grid — one slot per digit. */
export function Clock({ hh, mm, ss, showSeconds = true, hourFormat = "24" }: Props) {
  const { hours, period } = formatHourDisplay(hh, hourFormat);
  const timeCore = showSeconds ? `${hours}:${mm}:${ss}` : `${hours}:${mm}`;
  const label = period ? `${timeCore} ${period}` : timeCore;

  return (
    <div
      className={`clock${showSeconds ? "" : " clock--no-seconds"}${period ? " clock--12h" : ""}`}
      role="timer"
      aria-live="polite"
      aria-label={label}
    >
      <Digit value={digitAt(hours, 0)} />
      <Digit value={digitAt(hours, 1)} />
      <Colon />
      <Digit value={digitAt(mm, 0)} />
      <Digit value={digitAt(mm, 1)} />
      {showSeconds && (
        <>
          <Colon />
          <Digit value={digitAt(ss, 0)} />
          <Digit value={digitAt(ss, 1)} />
        </>
      )}
      {period && (
        <span className="clock__period" aria-hidden="true">
          {period}
        </span>
      )}
    </div>
  );
}
