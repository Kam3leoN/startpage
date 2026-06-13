import { useTranslation } from "react-i18next";
import type { Favorite } from "../data/favorites";
import { SearchIcon } from "./icons";

interface Props {
  fav: Favorite;
  index: number;
  onSearchClick?: () => void;
}

export function FavoriteCard({ fav, index, onSearchClick }: Props) {
  const { t } = useTranslation();
  const tileStyle = { animationDelay: `${Math.min(index * 45, 360)}ms` };

  const label = fav.action === "search" ? t("search.tile") : fav.label;
  const isSearch = fav.action === "search";

  const inner = (
    <div className="fav__inner">
      {isSearch ? (
        <SearchIcon className="fav__icon fav__icon--search" aria-hidden />
      ) : (
        <img
          className="fav__icon"
          src={fav.icon}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );

  const shared = {
    className: "fav k3ui-mason__item s1 m1 l1 xl1",
    "data-tile": fav.custom ? "custom" : fav.id,
    "data-isofilter-id": fav.id,
    "data-isofilter-tags": fav.tags.join(","),
    "data-tooltip": label,
    "data-tooltip-placement": "bottom" as const,
    style: tileStyle,
    "aria-label": label,
  };

  if (isSearch) {
    return (
      <button
        type="button"
        {...shared}
        onClick={() => onSearchClick?.()}
      >
        {inner}
      </button>
    );
  }

  return (
    <a {...shared} href={fav.url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}
