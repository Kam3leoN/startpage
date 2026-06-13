import { useTranslation } from "react-i18next";

interface Props {
  index: number;
  onClick: () => void;
}

/** Mason tile at the end of the grid — opens the add-shortcut dialog. */
export function AddShortcutCard({ index, onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="fav fav--add k3ui-mason__item s1 m1 l1 xl1"
      data-isofilter-id="add-shortcut"
      data-isofilter-tags=""
      data-tooltip={t("shortcuts.addCard")}
      data-tooltip-placement="bottom"
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
      aria-label={t("shortcuts.addCard")}
      onClick={onClick}
    >
      <div className="fav__inner">
        <span className="fav__add-icon" aria-hidden="true">
          +
        </span>
      </div>
    </button>
  );
}
