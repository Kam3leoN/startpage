import { useTranslation } from "react-i18next";

interface Props {
  current: number;
  total: number;
}

/**
 * Indicateur de page — pill primaire, pleine largeur de case, texte centré.
 */
export function DeckPageChip({ current, total }: Props) {
  const { t } = useTranslation();
  const text = `${current}/${total}`;

  return (
    <div
      className="deck-page-chip"
      role="status"
      aria-live="polite"
      aria-label={t("deck.pageIndicator", { current, total })}
    >
      <span className="deck-page-chip__label">{text}</span>
    </div>
  );
}
