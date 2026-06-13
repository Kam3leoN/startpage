import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITES, type Category } from "./data/favorites";
import { useTheme } from "./hooks/useTheme";
import { useClock } from "./hooks/useClock";
import { useClockSettings } from "./hooks/useClockSettings";
import { useProfile } from "./hooks/useProfile";
import { useCustomShortcuts } from "./hooks/useCustomShortcuts";
import { useK3UI } from "./hooks/useK3UI";
import { SearchBar } from "./components/SearchBar";
import { Filters } from "./components/Filters";
import { FavoritesGrid } from "./components/FavoritesGrid";
import { SettingsSheet } from "./components/SettingsSheet";
import { SettingsIcon } from "./components/icons";
import { Greeting } from "./components/Greeting";
import { Clock } from "./components/Clock";
import { PerspectiveShowcase } from "./components/PerspectiveShowcase";
import { formatTodayDate } from "./utils/formatTodayDate";

export default function App() {
  const { t, i18n } = useTranslation();
  const { mode, seed, setMode, setSeed } = useTheme();
  const { firstName, setFirstName } = useProfile();
  const { showClock, setShowClock, hourFormat, setHourFormat, showSeconds, setShowSeconds } =
    useClockSettings();
  const k3ready = useK3UI();
  const { hh, mm, ss, date } = useClock();
  const {
    shortcuts: customShortcuts,
    favorites: customFavorites,
    addShortcut,
    updateShortcut,
    removeShortcut,
    exportJson,
    importJson,
  } = useCustomShortcuts();

  const [filter, setFilter] = useState<Category | "all">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allFavorites = useMemo(
    () => [...FAVORITES, ...customFavorites],
    [customFavorites]
  );

  const availableCats = useMemo(() => {
    const set = new Set<Category>();
    allFavorites.forEach((f) => f.tags.forEach((tg) => set.add(tg)));
    return Array.from(set);
  }, [allFavorites]);

  const dateLabel = useMemo(
    () => formatTodayDate(date, i18n.language, t("date.todayPrefix")),
    [i18n.language, date, hh, t]
  );

  return (
    <>
      <header className="appbar">
        <span className="appbar__brand">
          <span className="appbar__brand-dot" />
          <span className="appbar__brand-text">StartPage</span>
        </span>
        {showClock && (
          <div className="appbar__clock">
            <Clock
              hh={hh}
              mm={mm}
              ss={ss}
              showSeconds={showSeconds}
              hourFormat={hourFormat}
            />
          </div>
        )}
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
          <Greeting firstName={firstName} hour={date.getHours()} />
          <p className="clock__date">{dateLabel}</p>
          <SearchBar />
        </section>

        <Filters active={filter} available={availableCats} onChange={setFilter} />

        <FavoritesGrid favorites={allFavorites} filter={filter} k3ready={k3ready} />

        <footer className="footer">© {new Date().getFullYear()} — {t("footer")}</footer>
      </main>

      <PerspectiveShowcase k3ready={k3ready} />

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode={mode}
        setMode={setMode}
        seed={seed}
        setSeed={setSeed}
        firstName={firstName}
        setFirstName={setFirstName}
        showClock={showClock}
        setShowClock={setShowClock}
        hourFormat={hourFormat}
        setHourFormat={setHourFormat}
        showSeconds={showSeconds}
        setShowSeconds={setShowSeconds}
        customShortcuts={customShortcuts}
        onAddShortcut={addShortcut}
        onUpdateShortcut={updateShortcut}
        onRemoveShortcut={removeShortcut}
        onExportShortcuts={exportJson}
        onImportShortcuts={importJson}
      />
    </>
  );
}
