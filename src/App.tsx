import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITES } from "./data/favorites";
import { useTheme } from "./hooks/useTheme";
import { useClock } from "./hooks/useClock";
import { useClockSettings } from "./hooks/useClockSettings";
import { useDisplaySettings } from "./hooks/useDisplaySettings";
import { usePersonalMessage } from "./hooks/usePersonalMessage";
import { useProfile } from "./hooks/useProfile";
import { useCustomShortcuts } from "./hooks/useCustomShortcuts";
import { useCategories } from "./hooks/useCategories";
import { useDeckGrid } from "./hooks/useDeckGrid";
import { useK3UI } from "./hooks/useK3UI";
import { useSearchEngine } from "./hooks/useSearchEngine";
import { useWeatherSettings } from "./hooks/useWeatherSettings";
import { useWeather } from "./hooks/useWeather";
import { StreamDeckGrid } from "./components/StreamDeckGrid";
import { DeckSlotEditorDialog, type DeckEditorMode } from "./components/DeckSlotEditorDialog";
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
import type { SettingsSection } from "./types/settings";
import type { DeckCategoryEditorValues, DeckSlot, DeckSlotEditorValues } from "./types/deck";
import { registerDeckCallback, resolveSlotAction } from "./utils/deckCallbacks";

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

  const allFavoritesRaw = useMemo(
    () => [...FAVORITES, ...customFavorites],
    [customFavorites]
  );

  const {
    currentPage,
    bankPagination,
    isOnHome,
    canGoPrevBank,
    navigateToPage,
    navigateToLinkedPage,
    navigateHome,
    navigatePrevBank,
    navigateNextBank,
    executeSlot,
    assignShortcutAt,
    assignCategoryAt,
    clearSlotAt,
    addShortcutToCurrentPage,
    reorderSlotsAt,
  } = useDeckGrid({ favorites: allFavoritesRaw, categories });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [shortcutDialogOpen, setShortcutDialogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [deckEditor, setDeckEditor] = useState<{
    open: boolean;
    mode: DeckEditorMode;
    slotIndex: number;
    slot?: DeckSlot;
  }>({ open: false, mode: "add-shortcut", slotIndex: 0 });

  useEffect(() => {
    registerDeckCallback("open-search", () => setSearchOpen(true));
    registerDeckCallback("open-settings", () => {
      setSettingsSection("general");
      setSettingsOpen(true);
    });
  }, []);

  const openSettings = (section: SettingsSection) => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  const showAnalogInHero = showClock && clockStyle === "analog";

  const handleAddShortcut = (input: Parameters<typeof addShortcut>[0]) => {
    const created = addShortcut(input);
    if (!created) return false;
    addShortcutToCurrentPage(created);
    return true;
  };

  const editorInitial = useMemo(() => {
    const slot = deckEditor.slot;
    if (!slot) return undefined;
    if (deckEditor.mode === "add-category" || deckEditor.mode === "edit-category") {
      return {
        label: slot.label ?? "",
        icon: slot.icon,
        monogram: slot.monogram,
        slotVisual: slot.slotVisual,
        backgroundColor: slot.backgroundColor,
      } satisfies Partial<DeckCategoryEditorValues>;
    }
    const action = resolveSlotAction(slot) ?? { type: "url" as const, url: "https://" };
    return {
      label: slot.label ?? "",
      icon: slot.icon,
      monogram: slot.monogram,
      slotVisual: slot.slotVisual,
      backgroundColor: slot.backgroundColor,
      action,
    } satisfies Partial<DeckSlotEditorValues>;
  }, [deckEditor.mode, deckEditor.slot]);

  const handleDeckMenuAction = (actionId: string, slotIndex: number, slot: DeckSlot) => {
    switch (actionId) {
      case "add-category":
        setDeckEditor({ open: true, mode: "add-category", slotIndex, slot });
        break;
      case "add-shortcut":
        setDeckEditor({ open: true, mode: "add-shortcut", slotIndex, slot });
        break;
      case "edit-category":
        setDeckEditor({ open: true, mode: "edit-category", slotIndex, slot });
        break;
      case "edit-shortcut":
        setDeckEditor({ open: true, mode: "edit-shortcut", slotIndex, slot });
        break;
      case "delete-category":
        if (slot.categoryId) removeCategory(slot.categoryId);
        clearSlotAt(slotIndex);
        break;
      case "delete-shortcut":
        clearSlotAt(slotIndex);
        break;
      default:
        break;
    }
  };

  const handleSaveCategory = (values: DeckCategoryEditorValues) => {
    const { slotIndex, mode, slot } = deckEditor;

    if (mode === "edit-category" && slot?.categoryId) {
      updateCategory(slot.categoryId, values.label);
      assignCategoryAt(slotIndex, values, { id: slot.categoryId, label: values.label }, slot.targetPageId);
    } else {
      const created = addCategory(values.label);
      if (created) assignCategoryAt(slotIndex, values, created);
    }

    setDeckEditor((prev) => ({ ...prev, open: false }));
  };

  const handleSaveShortcut = (values: DeckSlotEditorValues) => {
    const { slotIndex, mode, slot } = deckEditor;
    assignShortcutAt(slotIndex, values, mode === "edit-shortcut" ? slot?.id : undefined);
    setDeckEditor((prev) => ({ ...prev, open: false }));
  };

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

        {showFavorites && (
          <StreamDeckGrid
            page={currentPage}
            bankPagination={bankPagination}
            isOnHome={isOnHome}
            canGoPrevBank={canGoPrevBank}
            k3ready={k3ready}
            onSearchClick={() => setSearchOpen(true)}
            onNavigatePage={navigateToPage}
            onNavigateLinkedPage={navigateToLinkedPage}
            onNavigateHome={navigateHome}
            onNavigatePrevBank={navigatePrevBank}
            onNavigateNextBank={navigateNextBank}
            onExecuteSlot={executeSlot}
            onMenuAction={handleDeckMenuAction}
            onReorderSlots={reorderSlotsAt}
          />
        )}

      </main>

      <footer className="footer footer--sticky">
        © {new Date().getFullYear()} — {t("footer")}
      </footer>

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
        compactDate={compactDate}
        setCompactDate={setCompactDate}
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
        onMoveShortcut={reorderShortcut}
        onRemoveShortcut={removeShortcut}
        onClose={() => setShortcutDialogOpen(false)}
        onAdd={handleAddShortcut}
      />

      <DeckSlotEditorDialog
        open={deckEditor.open}
        mode={deckEditor.mode}
        initial={editorInitial}
        onClose={() => setDeckEditor((prev) => ({ ...prev, open: false }))}
        onSaveCategory={handleSaveCategory}
        onSaveShortcut={handleSaveShortcut}
      />
    </>
  );
}
