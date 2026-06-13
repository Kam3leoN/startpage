import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITES, type Category } from "./data/favorites";
import { useTheme } from "./hooks/useTheme";
import { useClock } from "./hooks/useClock";
import { useClockSettings } from "./hooks/useClockSettings";
import { useDisplaySettings } from "./hooks/useDisplaySettings";
import { usePersonalMessage } from "./hooks/usePersonalMessage";
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
import { TodayDate } from "./components/TodayDate";
import { PersonalMessage } from "./components/PersonalMessage";
import { AnalogClock } from "./components/AnalogClock";
import { AiToolsBar } from "./components/AiToolsBar";
import { StartPageAppBar } from "./components/StartPageAppBar";
import { SearchOverlay } from "./components/SearchOverlay";
import { WeatherWidget } from "./components/WeatherWidget";
import { ShortcutDialog } from "./components/ShortcutDialog";
import { BootScreen } from "./components/BootScreen";
import { MacDock } from "./components/MacDock";
import type { SettingsSection } from "./types/settings";

export default function App() {
  const { t } = useTranslation();
  const { mode, seed, setMode, setSeed, isDark } = useTheme();
  const { firstName, setFirstName } = useProfile();
  const { message: personalMessage, setMessage: setPersonalMessage } = usePersonalMessage();
  const {
    showFavorites,
    setShowFavorites,
    showFilters,
    setShowFilters,
    showEphemeris,
    setShowEphemeris,
    showPersonalMessage,
    setShowPersonalMessage,
    showAiTools,
    setShowAiTools,
    showDock,
    setShowDock,
    compactDate,
    setCompactDate,
    clockStyle,
    setClockStyle,
  } = useDisplaySettings();
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

  const showAnalogInHero = showClock && clockStyle === "analog";

  return (
    <>
      <BootScreen appReady={k3ready} />

      {showWeather && (
        <WeatherWidget
          temperature={weather.snapshot?.temp ?? null}
          feelsLike={weather.snapshot?.feel ?? null}
          humidity={weather.snapshot?.humidity ?? null}
          condition={weather.condition}
          locationLabel={weather.locationLabel}
          weatherCode={weather.snapshot?.code ?? null}
          loading={weather.loading}
          error={weather.error}
          isDark={isDark}
          onOpenSettings={() => openSettings("weather")}
        />
      )}

      <SettingsFabMenu k3ready={k3ready} onOpenSection={openSettings} />
      {showAiTools && <AiToolsBar k3ready={k3ready} />}

      <StartPageAppBar
        k3ready={k3ready}
        showClock={showClock}
        clockStyle={clockStyle}
        hh={hh}
        mm={mm}
        ss={ss}
        showSeconds={showSeconds}
        hourFormat={hourFormat}
        themeMode={mode}
        onThemeModeChange={setMode}
      />

      <main className="shell">
        <section
          className={`hero hero-layout${showAnalogInHero ? " hero-layout--analog" : ""}`}
        >
          {showAnalogInHero && (
            <div className="hero__clock">
              <AnalogClock date={date} showSeconds={showSeconds} />
            </div>
          )}
          <div className="hero__text">
            <Greeting firstName={firstName} hour={date.getHours()} />
            {showPersonalMessage && (
              <PersonalMessage message={personalMessage} onChange={setPersonalMessage} />
            )}
            <TodayDate date={date} compactDate={compactDate} showEphemeris={showEphemeris} />
          </div>
        </section>

        {showFilters && (
          <Filters
            active={filter}
            categories={categories}
            available={availableCats}
            onChange={setFilter}
          />
        )}

        {showFavorites && (
          <FavoritesGrid
            favorites={orderedFavorites}
            filter={filter}
            k3ready={k3ready}
            onAddShortcutClick={() => setShortcutDialogOpen(true)}
            onSearchClick={() => setSearchOpen(true)}
          />
        )}

        <footer className="footer">© {new Date().getFullYear()} — {t("footer")}</footer>
      </main>

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
        clockStyle={clockStyle}
        setClockStyle={setClockStyle}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        showEphemeris={showEphemeris}
        setShowEphemeris={setShowEphemeris}
        showPersonalMessage={showPersonalMessage}
        setShowPersonalMessage={setShowPersonalMessage}
        showAiTools={showAiTools}
        setShowAiTools={setShowAiTools}
        showDock={showDock}
        setShowDock={setShowDock}
        compactDate={compactDate}
        setCompactDate={setCompactDate}
      />

      {showDock && (
        <MacDock
          favorites={orderedFavorites}
          onSearchClick={() => setSearchOpen(true)}
          onAddShortcutClick={() => setShortcutDialogOpen(true)}
        />
      )}

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
