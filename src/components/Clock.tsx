interface Props {
  hh: string;
  mm: string;
  ss: string;
}

/** Two-digit slot with ghost « 88 » underneath for stable Digital-7 alignment. */
function DigitPair({ value }: { value: string }) {
  return (
    <span className="clock__slot">
      <span className="clock__ghost" aria-hidden="true">
        88
      </span>
      <span className="clock__face">{value}</span>
    </span>
  );
}

/** Colon slot with ghost separator at 10% opacity. */
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

/** Digital-7 clock with ghost 88:88:88 grid for consistent digit width. */
export function Clock({ hh, mm, ss }: Props) {
  return (
    <div className="clock" role="timer" aria-live="polite" aria-label={`${hh}:${mm}:${ss}`}>
      <DigitPair value={hh} />
      <Colon />
      <DigitPair value={mm} />
      <Colon />
      <DigitPair value={ss} />
    </div>
  );
}
