import { useTranslation } from "react-i18next";
import { CATEGORIES, type Category } from "../data/profiles";

interface Props {
  active: Category | "all";
  available: Category[];
  onChange: (c: Category | "all") => void;
}

export function Filters({ active, available, onChange }: Props) {
  const { t } = useTranslation();
  const cats = CATEGORIES.filter((c) => available.includes(c));

  return (
    <div className="filters" role="group" aria-label="Filtres">
      <button
        className="chip"
        aria-pressed={active === "all"}
        onClick={() => onChange("all")}
      >
        {t("filters.all")}
      </button>
      {cats.map((c) => (
        <button
          key={c}
          className="chip"
          aria-pressed={active === c}
          onClick={() => onChange(c)}
        >
          {t(`filters.${c}`)}
        </button>
      ))}
    </div>
  );
}
