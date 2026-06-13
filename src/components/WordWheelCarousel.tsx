import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WORD_WHEEL_ITEMS, type WordWheelItem } from "../data/wordWheel";

const COUNT = WORD_WHEEL_ITEMS.length;

/** Circular offset in [-half, half] for carousel positioning. */
function getOffset(index: number, active: number, total: number): number {
  let diff = index - active;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
}

interface CardStyle {
  transform: string;
  opacity: number;
  zIndex: number;
  pointerEvents: "auto" | "none";
}

function cardStyle(offset: number): CardStyle {
  const abs = Math.abs(offset);

  if (abs > 2) {
    return {
      transform: "translate(-50%, -50%) translateX(0) translateZ(-220px) rotateY(0deg) scale(0.5)",
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none",
    };
  }

  const translateX = offset * 148;
  const translateZ = offset === 0 ? 48 : -abs * 72;
  const rotateY = offset * -42;
  const scale = offset === 0 ? 1 : abs === 1 ? 0.84 : 0.68;

  return {
    transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: abs === 2 ? 0.55 : 1,
    zIndex: 10 - abs,
    pointerEvents: "auto",
  };
}

interface CardProps {
  item: WordWheelItem;
  offset: number;
  isActive: boolean;
  playLabel: string;
  onSelect: () => void;
}

function WheelCard({ item, offset, isActive, playLabel, onSelect }: CardProps) {
  const style = cardStyle(offset);

  return (
    <button
      type="button"
      className={`wheel__card${isActive ? " wheel__card--active" : ""}`}
      style={{
        transform: style.transform,
        opacity: style.opacity,
        zIndex: style.zIndex,
        pointerEvents: style.pointerEvents,
        background: item.gradient,
      }}
      aria-current={isActive ? "true" : undefined}
      aria-label={item.label}
      onClick={onSelect}
    >
      <span className="wheel__card-badge" aria-hidden="true">
        {item.letter}
      </span>
      {isActive && (
        <span className="wheel__card-play">{playLabel}</span>
      )}
    </button>
  );
}

/** 3D perspective carousel inspired by the I/O 2026 word wheel. */
export function WordWheelCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(Math.floor(COUNT / 2));

  const goTo = useCallback((index: number) => {
    setActive(((index % COUNT) + COUNT) % COUNT);
  }, []);

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  const activeItem = WORD_WHEEL_ITEMS[active];

  const offsets = useMemo(
    () => WORD_WHEEL_ITEMS.map((_, index) => getOffset(index, active, COUNT)),
    [active]
  );

  const handlePlay = () => {
    window.open(activeItem.href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="wheel" aria-labelledby="wheel-title">
      <header className="wheel__header">
        <h2 id="wheel-title" className="wheel__title">
          {t("wheel.title")}
        </h2>
        <p className="wheel__subtitle">{t("wheel.subtitle")}</p>
      </header>

      <div className="wheel__viewport">
        <button
          type="button"
          className="wheel__nav wheel__nav--prev"
          aria-label={t("wheel.prev")}
          onClick={goPrev}
        >
          ‹
        </button>

        <div className="wheel__stage" aria-live="polite">
          {WORD_WHEEL_ITEMS.map((item, index) => (
            <WheelCard
              key={item.id}
              item={item}
              offset={offsets[index]}
              isActive={index === active}
              playLabel={t("wheel.play")}
              onSelect={() => {
                if (index === active) handlePlay();
                else goTo(index);
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="wheel__nav wheel__nav--next"
          aria-label={t("wheel.next")}
          onClick={goNext}
        >
          ›
        </button>
      </div>

      <div className="wheel__progress" role="group" aria-label={t("wheel.progressAria")}>
        <span className="wheel__progress-text">
          {t("wheel.progress", { current: active + 1, total: COUNT })}
        </span>
        <div className="wheel__dots">
          {WORD_WHEEL_ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`wheel__dot${index === active ? " wheel__dot--active" : ""}`}
              aria-label={item.label}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
