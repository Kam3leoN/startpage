import type { Favorite } from "../data/profiles";

interface Props {
  fav: Favorite;
  index: number;
}

export function FavoriteCard({ fav, index }: Props) {
  return (
    <a
      className="fav"
      href={fav.url}
      target="_blank"
      rel="noopener noreferrer"
      data-tile={fav.id}
      data-isofilter-id={fav.id}
      data-isofilter-tags={fav.tags.join(",")}
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
      aria-label={fav.label}
    >
      <k3ui-card data-variant="filled" class="fav__inner">
        <img className="fav__icon" src={fav.icon} alt="" loading="lazy" />
        <span className="fav__label">{fav.label}</span>
      </k3ui-card>
    </a>
  );
}
