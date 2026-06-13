import { useEffect, useLayoutEffect, useRef } from "react";
import type { Favorite, Category } from "../data/favorites";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { FavoriteCard } from "./FavoriteCard";
import { AddShortcutCard } from "./AddShortcutCard";

const ADD_TILE_ID = "add-shortcut";
/** Tuiles toujours visibles, quel que soit le filtre actif. */
const PINNED_TILE_IDS = new Set([ADD_TILE_ID, "search"]);

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

/** Garantit que la tuile « + » est le dernier enfant Mason (ordre layout + filtre). */
function ensureAddTileLast(masonEl: HTMLElement): void {
  const addEl = masonEl.querySelector<HTMLElement>(`[data-isofilter-id="${ADD_TILE_ID}"]`);
  if (addEl && addEl.parentElement === masonEl) {
    masonEl.appendChild(addEl);
  }
}

/** Applique le filtre IsoFilter manuel sur les tuiles Mason. */
function applyFavoriteFilter(root: HTMLElement, filter: Category | "all"): void {
  const value = filter === "all" ? "all" : filter;
  root.querySelectorAll<HTMLElement>("[data-isofilter-id]").forEach((el) => {
    const id = el.getAttribute("data-isofilter-id");
    if (id && PINNED_TILE_IDS.has(id)) {
      el.removeAttribute("data-k3ui-mason-hidden");
      return;
    }
    const tags = (el.getAttribute("data-isofilter-tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const show = value === "all" || tags.includes(value);
    if (show) el.removeAttribute("data-k3ui-mason-hidden");
    else el.setAttribute("data-k3ui-mason-hidden", "true");
  });
}

interface Props {
  favorites: Favorite[];
  filter: Category | "all";
  k3ready: boolean;
  onAddShortcutClick: () => void;
  onSearchClick: () => void;
}

export function FavoritesGrid({ favorites, filter, k3ready, onAddShortcutClick, onSearchClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Pin « + » en dernier dans le DOM avant paint (évite un ordre Mason figé).
  useLayoutEffect(() => {
    const masonEl = ref.current?.querySelector("k3ui-mason") as HTMLElement | null;
    if (!masonEl) return;
    ensureAddTileLast(masonEl);
  }, [favorites, filter]);

  // Init / re-layout K3UI Mason (12 cols × 1 span = 12 tiles per row).
  useEffect(() => {
    if (!k3ready || !ref.current) return;

    const masonEl = ref.current.querySelector("k3ui-mason") as HTMLElement | null;
    if (!masonEl) return;

    applyFavoriteFilter(ref.current, filter);
    ensureAddTileLast(masonEl);
    masonEl.classList.remove("k3ui-mason--ready");
    layoutMason(masonEl);
    void initK3UISubtree(ref.current);
  }, [k3ready, favorites, filter]);

  return (
    <div ref={ref}>
      <k3ui-mason
        class="k3ui-mason no-autoinit"
        data-columns="12"
        data-gap="14"
        data-isofilter="true"
      >
        {favorites.map((fav, i) => (
          <FavoriteCard key={fav.id} fav={fav} index={i} onSearchClick={onSearchClick} />
        ))}
        <AddShortcutCard index={favorites.length} onClick={onAddShortcutClick} />
      </k3ui-mason>
    </div>
  );
}
