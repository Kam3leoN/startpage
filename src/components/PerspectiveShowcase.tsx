import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITES } from "../data/favorites";

const SLIDES = FAVORITES.slice(0, 9);

interface Props {
  k3ready: boolean;
}

/** K3UI Perspective slider below the favorites grid. */
export function PerspectiveShowcase({ k3ready }: Props) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!k3ready || !rootRef.current) return;
    const el = rootRef.current;

    try {
      window.K?.Perspective?.init(el, {
        effect: "wave",
        autoplay: { enabled: true, speed: 2500 },
        loop: { enabled: true },
        navigation: { enabled: true },
        indicators: true,
      });
    } catch {
      window.K?.initComponents?.(el);
    }

    return () => {
      const K = window.K as typeof window.K & {
        Perspective?: { getInstance(node: HTMLElement): { destroy?: () => void } | undefined };
      };
      K?.Perspective?.getInstance(el)?.destroy?.();
    };
  }, [k3ready]);

  return (
    <section className="perspective-section" aria-labelledby="perspective-title">
      <h2 id="perspective-title" className="perspective-section__title">
        {t("perspective.title")}
      </h2>
      <p className="perspective-section__subtitle">{t("perspective.subtitle")}</p>

      <div
        ref={rootRef}
        className="perspective perspective--grid perspective--startpage"
        data-effect="wave"
      >
        {SLIDES.map((fav) => (
          <section key={fav.id} className="perspective__slide">
            <a
              className="perspective__slide-inner perspective__slide-link"
              href={fav.url}
              target="_blank"
              rel="noopener noreferrer"
              data-tile={fav.id}
            >
              <img className="perspective__slide-icon" src={fav.icon} alt="" loading="lazy" />
              <span className="perspective__slide-label">{fav.label}</span>
            </a>
          </section>
        ))}
        <span className="perspective__nav perspective__nav--prev" aria-hidden="true" />
        <span className="perspective__nav perspective__nav--next" aria-hidden="true" />
      </div>
    </section>
  );
}
