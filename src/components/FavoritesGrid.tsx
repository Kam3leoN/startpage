import { useEffect, useRef } from "react";
import type { Favorite, Category } from "../data/favorites";
import { FavoriteCard } from "./FavoriteCard";

interface Props {
  favorites: Favorite[];
  filter: Category | "all";
  k3ready: boolean;
}

export function FavoritesGrid({ favorites, filter, k3ready }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Drive k3ui's native IsoFilter when the active filter changes.
  useEffect(() => {
    if (!k3ready || !ref.current) return;
    const root = ref.current;
    const value = filter === "all" ? "all" : filter;
    root.querySelectorAll<HTMLElement>("[data-isofilter-id]").forEach((el) => {
      const tags = (el.getAttribute("data-isofilter-tags") || "").split(",");
      const show = value === "all" || tags.includes(value);
      el.style.display = show ? "" : "none";
    });
  }, [filter, k3ready, favorites]);

  return (
    <div ref={ref}>
      <k3ui-mason
        class="grid k3ui-mason"
        data-columns="12"
        data-gap="14"
        data-isofilter="true"
      >
        {favorites.map((fav, i) => (
          <FavoriteCard key={fav.id + i} fav={fav} index={i} />
        ))}
      </k3ui-mason>
    </div>
  );
}
