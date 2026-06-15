import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  current: number;
  total: number;
  k3ready: boolean;
}

const CHIP_ID = "deck-page-indicator";

function chipData(text: string) {
  return [
    {
      id: CHIP_ID,
      text,
      type: "filter" as const,
      selected: true,
    },
  ];
}

/**
 * Indicateur de page bank — chip K3UI filter (couleur primaire du thème, texte seul).
 */
export function DeckPageChip({ current, total, k3ready }: Props) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const label = t("deck.pageIndicator", { current, total });
  const text = `${current}/${total}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !k3ready || !window.K?.Chip?.init) return;
    if (window.K.Chip.getInstance?.(el)) return;

    const instance = window.K.Chip.init(el, {
      variant: "filter",
      selectable: false,
      data: chipData(text),
    });

    return () => {
      const chip = Array.isArray(instance) ? instance[0] : instance;
      chip?.destroy?.();
    };
  }, [k3ready]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !k3ready) return;
    window.K?.Chip?.getInstance?.(el)?.setData?.(chipData(text));
  }, [k3ready, text]);

  return (
    <div
      ref={containerRef}
      className="chips no-autoinit deck-page-chip"
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );
}
