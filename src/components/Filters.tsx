import { useTranslation } from "react-i18next";
import type { CategoryDef } from "../data/categories";
import type { Category } from "../data/favorites";

interface Props {
  active: Category | "all";
  categories: CategoryDef[];
  available: Category[];
  onChange: (c: Category | "all") => void;
}

export function Filters({ active, categories, available, onChange }: Props) {
  const { t } = useTranslation();
  const visible = categories.filter((c) => available.includes(c.id));

  return (
    <div className="filters" role="group" aria-label="Filtres">
      <button
        className="chip"
        aria-pressed={active === "all"}
        onClick={() => onChange("all")}
      >
        {t("filters.all")}
      </button>
      {visible.map((c) => (
        <button
          key={c.id}
          className="chip"
          aria-pressed={active === c.id}
          onClick={() => onChange(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
