import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { WORD_WHEEL_ITEMS } from "../data/wordWheel";

const COUNT = WORD_WHEEL_ITEMS.length;
const ANGLE_STEP = 360 / COUNT;
const BASE_RADIUS = 320;

function useRingRadius(): number {
  const [radius, setRadius] = useState(BASE_RADIUS);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setRadius(w < 520 ? 220 : w < 768 ? 270 : BASE_RADIUS);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return radius;
}

/** 3D ring carousel — same cylinder rotation as io.google/2026 puzzle word wheel. */
export function WordWheelCarousel() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(Math.floor(COUNT / 2));
  const radius = useRingRadius();

  const goTo = useCallback((index: number) => {
    setActive(((index % COUNT) + COUNT) % COUNT);
  }, []);

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  const activeItem = WORD_WHEEL_ITEMS[active];
  const ringRotation = -active * ANGLE_STEP;

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
      ref={sectionRef}
      className="wheel"
      aria-labelledby="wheel-title"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={() => sectionRef.current?.focus({ preventScroll: true })}
    >
      <header className="wheel__header">
        <h2 id="wheel-title" className="wheel__title">
          {t("wheel.title")}
        </h2>
        <p className="wheel__hint">{t("wheel.keyboardHint")}</p>
      </header>

      <div className="wheel__scene" aria-live="polite">
        <div
          className="wheel__ring"
          style={{ transform: `rotateY(${ringRotation}deg)` }}
        >
          {WORD_WHEEL_ITEMS.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.id}
                type="button"
                className={`wheel__card${isActive ? " wheel__card--active" : ""}`}
                style={{
                  transform: `rotateY(${index * ANGLE_STEP}deg) translateZ(${radius}px)`,
                  background: item.gradient,
                }}
                aria-current={isActive ? "true" : undefined}
                aria-label={item.label}
                onClick={() => {
                  if (isActive) handlePlay();
                  else goTo(index);
                }}
              >
                <span className="wheel__card-badge" aria-hidden="true">
                  {item.letter}
                </span>
                <span className="wheel__card-play">{t("wheel.play")}</span>
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
