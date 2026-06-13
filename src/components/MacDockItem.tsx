import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Favorite } from "../data/favorites";
import { SearchIcon } from "./icons";
import {
  DOCK_BASE_WIDTH,
  DOCK_BEYOND_DISTANCE,
  dockWidthFromDistance,
} from "../utils/dockMagnify";

interface Props {
  fav: Favorite;
  mouseX: number | null;
  reducedMotion: boolean;
  onSearchClick?: () => void;
}

/**
 * Icône du dock avec effet de grossissement au survol (style macOS).
 */
export function MacDockItem({ fav, mouseX, reducedMotion, onSearchClick }: Props) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const widthRef = useRef(DOCK_BASE_WIDTH);
  const [width, setWidth] = useState(DOCK_BASE_WIDTH);

  const label = fav.action === "search" ? t("search.tile") : fav.label;
  const isSearch = fav.action === "search";

  useEffect(() => {
    if (reducedMotion) {
      setWidth(DOCK_BASE_WIDTH);
      return;
    }

    let raf = 0;

    const animate = () => {
      const el = buttonRef.current;
      let target = DOCK_BASE_WIDTH;

      if (el && mouseX !== null) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        target = dockWidthFromDistance(mouseX - centerX);
      }

      widthRef.current += (target - widthRef.current) * 0.22;
      setWidth(widthRef.current);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mouseX, reducedMotion]);

  const handleClick = () => {
    if (isSearch) onSearchClick?.();
    else window.open(fav.url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className="mac-dock__item"
      aria-label={label}
      onClick={handleClick}
    >
      <span
        className="mac-dock__icon-wrap"
        style={{ width: `${width}px`, height: `${width}px` }}
      >
        {isSearch ? (
          <SearchIcon className="mac-dock__icon mac-dock__icon--search" aria-hidden />
        ) : (
          <img
            className="mac-dock__icon"
            src={fav.icon}
            alt=""
            width={Math.round(width)}
            height={Math.round(width)}
            draggable={false}
            decoding="async"
          />
        )}
      </span>
      <span className="mac-dock__tooltip" role="tooltip">
        {label}
      </span>
    </button>
  );
}

/** Bouton « ajouter un raccourci » dans le dock. */
export function MacDockAddItem({
  mouseX,
  reducedMotion,
  label,
  onClick,
}: {
  mouseX: number | null;
  reducedMotion: boolean;
  label: string;
  onClick: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const widthRef = useRef(DOCK_BASE_WIDTH);
  const [width, setWidth] = useState(DOCK_BASE_WIDTH);

  useEffect(() => {
    if (reducedMotion) {
      setWidth(DOCK_BASE_WIDTH);
      return;
    }

    let raf = 0;

    const animate = () => {
      const el = buttonRef.current;
      let target = DOCK_BASE_WIDTH;

      if (el && mouseX !== null) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const delta = mouseX - centerX;
        target =
          Math.abs(delta) > DOCK_BEYOND_DISTANCE
            ? DOCK_BASE_WIDTH
            : dockWidthFromDistance(delta);
      }

      widthRef.current += (target - widthRef.current) * 0.22;
      setWidth(widthRef.current);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mouseX, reducedMotion]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="mac-dock__item mac-dock__item--add"
      aria-label={label}
      onClick={onClick}
    >
      <span
        className="mac-dock__icon-wrap mac-dock__icon-wrap--add"
        style={{ width: `${width}px`, height: `${width}px` }}
      >
        <span className="mac-dock__add-glyph" aria-hidden>
          +
        </span>
      </span>
      <span className="mac-dock__tooltip" role="tooltip">
        {label}
      </span>
    </button>
  );
}
