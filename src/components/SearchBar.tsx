import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "./icons";

export function SearchBar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(term)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <form className="search" onSubmit={submit} role="search">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search.placeholder")}
        autoComplete="off"
        aria-label={t("search.placeholder")}
      />
      <button className="search__btn" type="submit" aria-label="Google">
        <SearchIcon />
      </button>
    </form>
  );
}
