import { useCallback, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { WORD_WHEEL_ITEMS } from "../data/wordWheel";
import { WordWheelIcon } from "./WordWheelIcon";

const COUNT = WORD_WHEEL_ITEMS.length;

/** Circular offset in [-2, 2] for a 5-card arc. */
function getOffset(index: number, active: number): number {
  let diff = index - active;
  while (diff > COUNT / 2) diff -= COUNT;
  while (diff < -COUNT / 2) diff += COUNT;
  return diff;
}

interface CardPose {
  transform: string;
  opacity: number;
  zIndex: number;
  pointerEvents: "auto" | "none";
}

/** Per-card 3D pose tuned to match io.google/2026 word-wheel arc. */
function getCardPose(offset: number): CardPose {
  const abs = Math.abs(offset);

  if (abs > 2) {
    return {
      transform: "translate3d(-50%, -50%, -420px) rotateY(0deg) scale(0.5)",
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none",
    };
  }

  const rotateY = offset * -36;
  const translateX = offset * 142;
  const translateZ = offset === 0 ? 80 : -abs * 52;
  const scale = offset === 0 ? 1 : abs === 1 ? 0.91 : 0.79;

  return {
    transform: `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: abs === 2 ? 0.72 : 1,
    zIndex: 20 - abs,
    pointerEvents: "auto",
  };
}

/** 3D arc carousel — 5 visible cards like the I/O 2026 word wheel. */
export function WordWheelCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive(((index % COUNT) + COUNT) % COUNT);
  }, []);

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  const activeItem = WORD_WHEEL_ITEMS[active];

  const handlePlay = useCallback(() => {
    window.open(activeItem.href, "_blank", "noopener,noreferrer");
  }, [activeItem.href]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          goNext();
          break;
        case "Enter":
        case " ":
          if (
            target.classList.contains("wheel__card--active") ||
            target.classList.contains("wheel")
          ) {
            event.preventDefault();
            handlePlay();
          }
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(COUNT - 1);
          break;
        default:
          break;
      }
    },
    [goPrev, goNext, goTo, handlePlay]
  );

  return (
    <section
      className="wheel"
      aria-labelledby="wheel-title"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest(".wheel__dot")) return;
        (event.currentTarget as HTMLElement).focus({ preventScroll: true });
      }}
    >
      <header className="wheel__header">
        <h2 id="wheel-title" className="wheel__title">
          {t("wheel.title")}
        </h2>
        <p className="wheel__hint">{t("wheel.keyboardHint")}</p>
      </header>

      <div className="wheel__scene" aria-live="polite">
        <div className="wheel__stage">
          {WORD_WHEEL_ITEMS.map((item, index) => {
            const offset = getOffset(index, active);
            const pose = getCardPose(offset);
            const isActive = offset === 0;
            const sideClass =
              offset < 0 ? " wheel__card--left" : offset > 0 ? " wheel__card--right" : "";

            return (
              <button
                key={item.id}
                type="button"
                className={`wheel__card${isActive ? " wheel__card--active" : ""}${sideClass}`}
                style={{
                  transform: pose.transform,
                  opacity: pose.opacity,
                  zIndex: pose.zIndex,
                  pointerEvents: pose.pointerEvents,
                }}
                aria-current={isActive ? "true" : undefined}
                aria-label={item.label}
                onClick={() => {
                  if (isActive) handlePlay();
                  else goTo(index);
                }}
              >
                <span
                  className="wheel__card-face"
                  style={{ background: item.gradient }}
                >
                  <span className="wheel__card-badge">
                    <WordWheelIcon id={item.id} />
                  </span>
                  <span className="wheel__card-play">{t("wheel.play")}</span>
                </span>
              </button>
            );
          })}
        </div>
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
