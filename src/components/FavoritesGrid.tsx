import { useEffect, useRef } from "react";
import type { Favorite, Category } from "../data/favorites";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { FavoriteCard } from "./FavoriteCard";

const MASON_OPTIONS = {
  itemsSelector: ".k3ui-mason__item",
  columns: 12,
  gap: 14,
  fallbackSpan: 1,
  spanBaseColumns: 12,
  itemsHeightStrategy: "offsetHeight" as const,
};

/** Square tiles: Mason sets width — mirror it on height so PNG intrinsic sizes cannot stretch rows. */
function syncSquareTileHeights(masonEl: HTMLElement): void {
  masonEl.querySelectorAll<HTMLElement>(".k3ui-mason__item").forEach((item) => {
    const width = item.offsetWidth;
    if (width > 0) item.style.height = `${width}px`;
  });
}

function layoutMason(masonEl: HTMLElement): void {
  const K = window.K;
  if (!K?.Mason?.init) return;

  K.Mason.getInstance(masonEl)?.destroy?.();
  K.Mason.init(masonEl, MASON_OPTIONS);

  const refresh = () => {
    syncSquareTileHeights(masonEl);
    K.Mason?.getInstance(masonEl)?.refresh?.();
  };

  refresh();
  window.requestAnimationFrame(refresh);
  window.setTimeout(() => {
    refresh();
    masonEl.classList.add("k3ui-mason--ready");
  }, 120);

  masonEl.querySelectorAll<HTMLImageElement>(".fav__icon").forEach((img) => {
    if (!img.complete) img.addEventListener("load", refresh, { once: true });
  });
}

interface Props {
  favorites: Favorite[];
  filter: Category | "all";
  k3ready: boolean;
}

export function FavoritesGrid({ favorites, filter, k3ready }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Init / re-layout K3UI Mason (12 cols × 1 span = 12 tiles per row).
  useEffect(() => {
    if (!k3ready || !ref.current) return;

    const masonEl = ref.current.querySelector("k3ui-mason") as HTMLElement | null;
    if (!masonEl) return;

    masonEl.classList.remove("k3ui-mason--ready");
    layoutMason(masonEl);
    void initK3UISubtree(ref.current);
  }, [k3ready, favorites]);

  // Drive k3ui's native IsoFilter when the active filter changes.
  useEffect(() => {
    if (!k3ready || !ref.current) return;
    const root = ref.current;
    const value = filter === "all" ? "all" : filter;
    root.querySelectorAll<HTMLElement>("[data-isofilter-id]").forEach((el) => {
      const tags = (el.getAttribute("data-isofilter-tags") || "").split(",");
      const show = value === "all" || tags.includes(value);
      if (show) el.removeAttribute("data-k3ui-mason-hidden");
      else el.setAttribute("data-k3ui-mason-hidden", "true");
    });
    const masonEl = root.querySelector("k3ui-mason") as HTMLElement | null;
    if (!masonEl) return;
    syncSquareTileHeights(masonEl);
    window.K?.Mason?.getInstance(masonEl)?.refresh?.();
  }, [filter, k3ready, favorites]);

  return (
    <div ref={ref}>
      <k3ui-mason
        class="k3ui-mason no-autoinit"
        data-columns="12"
        data-gap="14"
        data-isofilter="true"
      >
        {favorites.map((fav, i) => (
          <FavoriteCard key={fav.id} fav={fav} index={i} />
        ))}
      </k3ui-mason>
    </div>
  );
}
