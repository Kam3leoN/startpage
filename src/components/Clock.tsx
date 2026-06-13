interface Props {
  hh: string;
  mm: string;
  ss: string;
  showSeconds?: boolean;
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

/** Digital-7 clock with ghost grid — one slot per digit. */
export function Clock({ hh, mm, ss, showSeconds = true }: Props) {
  const label = showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;

  return (
    <div
      className={`clock${showSeconds ? "" : " clock--no-seconds"}`}
      role="timer"
      aria-live="polite"
      aria-label={label}
    >
      <Digit value={digitAt(hh, 0)} />
      <Digit value={digitAt(hh, 1)} />
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
    </div>
  );
}
