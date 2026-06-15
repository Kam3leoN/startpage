import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DeckPageChip } from "./DeckPageChip";
import { K3IconButton } from "./K3IconButton";
import { SearchIcon } from "./icons";
import { ChevronLeftIcon, ChevronRightIcon } from "./deckIcons";

interface Props {
  isOnHome: boolean;
  canGoPrev: boolean;
  pageCurrent: number;
  pageTotal: number;
  k3ready: boolean;
  onSearch: () => void;
  onHome: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

/**
 * Barre sous la grille — une case par colonne active, chip centré sur la colonne 10.
 */
export function DeckNavBar({
  isOnHome,
  canGoPrev,
  pageCurrent,
  pageTotal,
  k3ready,
  onSearch,
  onHome,
  onPrevPage,
  onNextPage,
}: Props) {
  const { t } = useTranslation();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = navRef.current;
    if (!root) return;
    window.K?.IconManager?.processIconsInContainer?.(root);
    window.K?.IconManager?.forceDisplayIcons?.();
  }, []);

  return (
    <nav ref={navRef} className="deck-nav" aria-label={t("deck.navLabel")}>
      <div className="deck-nav__bar">
        <K3IconButton
          className="deck-nav__btn deck-nav__btn--prev"
          variant="tonal"
          size="md"
          label={t("deck.prevPage")}
          disabled={!canGoPrev}
          onClick={onPrevPage}
        >
          <ChevronLeftIcon aria-hidden />
        </K3IconButton>

        <K3IconButton
          className="deck-nav__btn deck-nav__btn--home"
          variant="tonal"
          size="md"
          label={t("deck.home")}
          disabled={isOnHome}
          onClick={onHome}
          iconName="house-blank"
        />

        <K3IconButton
          className="deck-nav__btn deck-nav__btn--search"
          variant="filled"
          size="md"
          label={t("search.tile")}
          onClick={onSearch}
        >
          <SearchIcon aria-hidden />
        </K3IconButton>

        <K3IconButton
          className="deck-nav__btn deck-nav__btn--next"
          variant="tonal"
          size="md"
          label={t("deck.nextPage")}
          onClick={onNextPage}
        >
          <ChevronRightIcon aria-hidden />
        </K3IconButton>

        <DeckPageChip current={pageCurrent} total={pageTotal} k3ready={k3ready} />
      </div>
    </nav>
  );
}
