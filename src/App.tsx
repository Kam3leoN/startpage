import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PROFILES, type Category } from "./data/profiles";
import { useTheme } from "./hooks/useTheme";
import { useClock } from "./hooks/useClock";
import { useK3UI } from "./hooks/useK3UI";
import { SearchBar } from "./components/SearchBar";
import { Filters } from "./components/Filters";
import { FavoritesGrid } from "./components/FavoritesGrid";
import { SettingsSheet } from "./components/SettingsSheet";
import { SettingsIcon } from "./components/icons";

export default function App() {
  const { t, i18n } = useTranslation();
  const { mode, seed, setMode, setSeed } = useTheme();
  const k3ready = useK3UI();
  const { hh, mm } = useClock();

  const [profileKey, setProfileKey] = useState(PROFILES[0].key);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const profile = useMemo(
    () => PROFILES.find((p) => p.key === profileKey) ?? PROFILES[0],
    [profileKey]
  );

  const availableCats = useMemo(() => {
    const set = new Set<Category>();
    profile.favorites.forEach((f) => f.tags.forEach((tg) => set.add(tg)));
    return Array.from(set);
  }, [profile]);

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(i18n.language, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [i18n.language, hh] // refresh label across day boundary
  );

  const selectProfile = (key: string) => {
    setProfileKey(key);
    setFilter("all");
    const p = PROFILES.find((x) => x.key === key);
    if (p) setSeed(p.seed);
  };

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
        <nav className="tabs" aria-label="Profils">
          {PROFILES.map((p) => (
            <button
              key={p.key}
              className="tab"
              aria-selected={p.key === profileKey}
              onClick={() => selectProfile(p.key)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <section className="hero">
          <div className="clock" aria-label={`${hh}:${mm}`}>
            {hh}
            <span className="clock__colon">:</span>
            {mm}
          </div>
          <div className="clock__date">{dateLabel}</div>
          <SearchBar />
        </section>

        <Filters active={filter} available={availableCats} onChange={setFilter} />

        <FavoritesGrid
          key={profile.key}
          favorites={profile.favorites}
          filter={filter}
          k3ready={k3ready}
        />

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
