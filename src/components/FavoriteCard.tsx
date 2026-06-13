import type { CSSProperties } from "react";
import type { Favorite } from "../data/favorites";

interface Props {
  fav: Favorite;
  index: number;
}

export function FavoriteCard({ fav, index }: Props) {
  const tileStyle =
    fav.custom && fav.color
      ? ({ animationDelay: `${Math.min(index * 45, 360)}ms`, "--fav-custom-bg": fav.color } as CSSProperties)
      : { animationDelay: `${Math.min(index * 45, 360)}ms` };

  return (
    <a
      className="fav k3ui-mason__item s1 m1 l1 xl1"
      href={fav.url}
      target="_blank"
      rel="noopener noreferrer"
      data-tile={fav.custom ? "custom" : fav.id}
      data-isofilter-id={fav.id}
      data-isofilter-tags={fav.tags.join(",")}
      data-tooltip={fav.label}
      data-tooltip-placement="bottom"
      style={tileStyle}
      aria-label={fav.label}
    >
      <div className="fav__inner">
        <img
          className="fav__icon"
          src={fav.icon}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
        />
      </div>
    </a>
  );
}
