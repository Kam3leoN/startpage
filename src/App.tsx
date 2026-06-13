import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITES, type Category } from "./data/favorites";
import { useTheme } from "./hooks/useTheme";
import { useClock } from "./hooks/useClock";
import { useClockSettings } from "./hooks/useClockSettings";
import { useProfile } from "./hooks/useProfile";
import { useCustomShortcuts } from "./hooks/useCustomShortcuts";
import { useCategories } from "./hooks/useCategories";
import { useFavoriteOrder } from "./hooks/useFavoriteOrder";
import { useK3UI } from "./hooks/useK3UI";
import { useSearchEngine } from "./hooks/useSearchEngine";
import { useWeatherSettings } from "./hooks/useWeatherSettings";
import { useWeather } from "./hooks/useWeather";
import { Filters } from "./components/Filters";
import { FavoritesGrid } from "./components/FavoritesGrid";
import { SettingsSheet } from "./components/SettingsSheet";
import { SettingsFabMenu } from "./components/SettingsFabMenu";
import { Greeting } from "./components/Greeting";
import { StartPageAppBar } from "./components/StartPageAppBar";
// import { PerspectiveShowcase } from "./components/PerspectiveShowcase";
import { SearchOverlay } from "./components/SearchOverlay";
import { WeatherWidget } from "./components/WeatherWidget";
import { ShortcutDialog } from "./components/ShortcutDialog";
import type { SettingsSection } from "./types/settings";
import { formatTodayDate } from "./utils/formatTodayDate";

export default function App() {
  const { t, i18n } = useTranslation();
  const { mode, seed, setMode, setSeed, isDark } = useTheme();
  const { firstName, setFirstName } = useProfile();
  const { showClock, setShowClock, hourFormat, setHourFormat, showSeconds, setShowSeconds } =
    useClockSettings();
  const { engine: searchEngine, setEngine: setSearchEngine } = useSearchEngine();
  const {
    showWeather,
    setShowWeather,
    locationMode: weatherLocationMode,
    setLocationMode: setWeatherLocationMode,
    manualAddress: weatherManualAddress,
    setManualAddress: setWeatherManualAddress,
  } = useWeatherSettings();
  const weather = useWeather({
    enabled: showWeather,
    locationMode: weatherLocationMode,
    manualAddress: weatherManualAddress,
  });
  const k3ready = useK3UI();
  const { hh, mm, ss, date } = useClock();
  const {
    shortcuts,
    favorites: customFavorites,
    addShortcut,
    removeShortcut,
    reorderShortcut,
  } = useCustomShortcuts();
  const {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    moveCategory,
    fallbackCategoryId,
  } = useCategories();

  const [filter, setFilter] = useState<Category | "all">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [shortcutDialogOpen, setShortcutDialogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSettings = (section: SettingsSection) => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  const allFavoritesRaw = useMemo(
    () => [...FAVORITES, ...customFavorites],
    [customFavorites]
  );

  const { orderedFavorites, moveFavorite } = useFavoriteOrder(allFavoritesRaw);

  const availableCats = useMemo(() => {
    const set = new Set<Category>();
    orderedFavorites.forEach((f) => f.tags.forEach((tg) => set.add(tg)));
    return Array.from(set);
  }, [orderedFavorites]);

  const dateLabel = useMemo(
    () => formatTodayDate(date, i18n.language, t("date.todayPrefix")),
    [i18n.language, date, hh, t]
  );

  return (
    <>
      {showWeather && (
        <WeatherWidget
          temperature={weather.snapshot?.temp ?? null}
          condition={weather.condition}
          locationLabel={weather.locationLabel}
          weatherCode={weather.snapshot?.code ?? null}
          loading={weather.loading}
          error={weather.error}
          isDark={isDark}
          onOpenSettings={() => openSettings("weather")}
        />
      )}

      <StartPageAppBar
        k3ready={k3ready}
        showClock={showClock}
        hh={hh}
        mm={mm}
        ss={ss}
        showSeconds={showSeconds}
        hourFormat={hourFormat}
      />

      <main className="shell">
        <section className="hero">
          <Greeting firstName={firstName} hour={date.getHours()} />
          <p className="clock__date">{dateLabel}</p>
        </section>

        <Filters
          active={filter}
          categories={categories}
          available={availableCats}
          onChange={setFilter}
        />

        <FavoritesGrid
          favorites={orderedFavorites}
          filter={filter}
          k3ready={k3ready}
          onAddShortcutClick={() => setShortcutDialogOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />

        <footer className="footer">© {new Date().getFullYear()} — {t("footer")}</footer>
      </main>

      {/* PerspectiveShowcase désactivé — composant conservé pour usage futur */}
      {/* <PerspectiveShowcase k3ready={k3ready} /> */}

      <SettingsFabMenu k3ready={k3ready} onOpenSection={openSettings} />

      <SettingsSheet
        open={settingsOpen}
        section={settingsSection}
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
        showWeather={showWeather}
        setShowWeather={setShowWeather}
        weatherLocationMode={weatherLocationMode}
        setWeatherLocationMode={setWeatherLocationMode}
        weatherManualAddress={weatherManualAddress}
        setWeatherManualAddress={setWeatherManualAddress}
      />

      <SearchOverlay
        open={searchOpen}
        engine={searchEngine}
        onEngineChange={setSearchEngine}
        onClose={() => setSearchOpen(false)}
      />

      <ShortcutDialog
        open={shortcutDialogOpen}
        k3ready={k3ready}
        categories={categories}
        fallbackCategoryId={fallbackCategoryId}
        shortcuts={shortcuts}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onRemoveCategory={removeCategory}
        onMoveCategory={moveCategory}
        onMoveShortcut={(id, delta) => {
          reorderShortcut(id, delta);
          moveFavorite(id, delta);
          return true;
        }}
        onRemoveShortcut={removeShortcut}
        onClose={() => setShortcutDialogOpen(false)}
        onAdd={addShortcut}
      />
    </>
  );
}
