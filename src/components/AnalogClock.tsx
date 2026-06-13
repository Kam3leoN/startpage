import { useEffect, useState } from "react";

interface Props {
  date: Date;
  showSeconds?: boolean;
}

/** Horloge analogique SVG — aiguilles animées (materialYouNewTab). */
export function AnalogClock({ date, showSeconds = true }: Props) {
  const [now, setNow] = useState(date);

  useEffect(() => {
    setNow(date);
  }, [date]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const hourAngle = 30 * hours + minutes / 2;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="analog-clock" role="img" aria-hidden="true">
      <svg className="analog-clock__face" viewBox="0 0 300 300" aria-hidden="true">
        <circle className="analog-clock__ring" cx="150" cy="150" r="140" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 150 + Math.sin(angle) * 118;
          const y1 = 150 - Math.cos(angle) * 118;
          const x2 = 150 + Math.sin(angle) * 130;
          const y2 = 150 - Math.cos(angle) * 130;
          return (
            <line
              key={i}
              className="analog-clock__tick"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}
      </svg>
      <div className="analog-clock__hands">
        <span
          className="analog-clock__hand analog-clock__hand--hour"
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />
        <span
          className="analog-clock__hand analog-clock__hand--minute"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />
        {showSeconds && (
          <span
            className="analog-clock__hand analog-clock__hand--second"
            style={{ transform: `rotate(${secondAngle}deg)` }}
          />
        )}
        <span className="analog-clock__center" />
      </div>
    </div>
  );
}
