import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITES, type Category } from "./data/favorites";
import { useTheme } from "./hooks/useTheme";
import { useClock } from "./hooks/useClock";
import { useK3UI } from "./hooks/useK3UI";
import { SearchBar } from "./components/SearchBar";
import { Filters } from "./components/Filters";
import { FavoritesGrid } from "./components/FavoritesGrid";
import { SettingsSheet } from "./components/SettingsSheet";
import { SettingsIcon } from "./components/icons";
import { LedClock } from "./components/LedClock";

export default function App() {
  const { t, i18n } = useTranslation();
  const { mode, seed, setMode, setSeed } = useTheme();
  const k3ready = useK3UI();
  const { hh, mm, ss } = useClock();

  const [filter, setFilter] = useState<Category | "all">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const availableCats = useMemo(() => {
    const set = new Set<Category>();
    FAVORITES.forEach((f) => f.tags.forEach((tg) => set.add(tg)));
    return Array.from(set);
  }, []);

  const timeLabel = `${hh}:${mm}:${ss}`;

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(i18n.language, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [i18n.language, hh]
  );

  return (
    <>
      <header className="appbar">
        <span className="appbar__brand">
          <span className="appbar__brand-dot" />
          StartPage
        </span>
        <button
          className="iconbtn"
          onClick={() => setSettingsOpen(true)}
          aria-label={t("a11y.settings")}
        >
          <SettingsIcon />
        </button>
      </header>

      <main className="shell">
        <section className="hero">
          <LedClock timeLabel={timeLabel} colorKey={`${seed}-${mode}`} />
          <div className="clock__date">{dateLabel}</div>
          <SearchBar />
        </section>

        <Filters active={filter} available={availableCats} onChange={setFilter} />

        <FavoritesGrid favorites={FAVORITES} filter={filter} k3ready={k3ready} />

        <footer className="footer">© {new Date().getFullYear()} — {t("footer")}</footer>
      </main>

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode={mode}
        setMode={setMode}
        seed={seed}
        setSeed={setSeed}
      />
    </>
  );
}
