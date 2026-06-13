import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { Favorite } from "../data/favorites";
import { MacDockAddItem, MacDockItem } from "./MacDockItem";

interface Props {
  favorites: Favorite[];
  onSearchClick: () => void;
  onAddShortcutClick: () => void;
}

type DockEntry =
  | { type: "favorite"; fav: Favorite }
  | { type: "divider" }
  | { type: "add" };

/**
 * Dock macOS fixe en bas — grossissement au survol (inspiré PuruVJ/macos-web, MIT).
 * @see https://github.com/PuruVJ/macos-web
 */
export function MacDock({ favorites, onSearchClick, onAddShortcutClick }: Props) {
  const { t } = useTranslation();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    document.body.classList.add("has-mac-dock");
    return () => document.body.classList.remove("has-mac-dock");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const entries = useMemo(() => {
    const list: DockEntry[] = [];
    let dividerBeforeCustom = false;

    for (const fav of favorites) {
      if (fav.custom && !dividerBeforeCustom) {
        list.push({ type: "divider" });
        dividerBeforeCustom = true;
      }
      list.push({ type: "favorite", fav });
    }

    list.push({ type: "divider" });
    list.push({ type: "add" });
    return list;
  }, [favorites]);

  return createPortal(
    <div className="mac-dock" aria-label={t("dock.label")}>
      <div
        className="mac-dock__track"
        onMouseMove={(event) => setMouseX(event.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {entries.map((entry, index) => {
          if (entry.type === "divider") {
            return <div key={`div-${index}`} className="mac-dock__divider" aria-hidden />;
          }
          if (entry.type === "add") {
            return (
              <MacDockAddItem
                key="add"
                mouseX={mouseX}
                reducedMotion={reducedMotion}
                label={t("shortcuts.addCard")}
                onClick={onAddShortcutClick}
              />
            );
          }
          return (
            <MacDockItem
              key={entry.fav.id}
              fav={entry.fav}
              mouseX={mouseX}
              reducedMotion={reducedMotion}
              onSearchClick={onSearchClick}
            />
          );
        })}
      </div>
    </div>,
    document.body
  );
}
