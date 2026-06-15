import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { K3ThemeMode } from "../types/k3ui";
import type { SettingsSection } from "../types/settings";
import type { WeatherLocationMode } from "../types/weather";
import type { ClockStyle } from "../hooks/useDisplaySettings";
import { PROJECT_FEEDBACK_URL, PROJECT_GITHUB_URL } from "../config/defaults";
import { K3OutlinedField } from "./K3OutlinedField";
import { SettingsSwitch } from "./SettingsSwitch";
import { SunIcon, MoonIcon, MonitorIcon, ClockIcon } from "./icons";

interface Props {
  open: boolean;
  section: SettingsSection;
  onClose: () => void;
  mode: K3ThemeMode;
  setMode: (m: K3ThemeMode) => void;
  seed: string;
  setSeed: (s: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  showSeconds: boolean;
  setShowSeconds: (value: boolean) => void;
  showClock: boolean;
  setShowClock: (value: boolean) => void;
  hourFormat: "12" | "24";
  setHourFormat: (value: "12" | "24") => void;
  showWeather: boolean;
  setShowWeather: (value: boolean) => void;
  weatherLocationMode: WeatherLocationMode;
  setWeatherLocationMode: (value: WeatherLocationMode) => void;
  weatherManualAddress: string;
  setWeatherManualAddress: (value: string) => void;
  clockStyle: ClockStyle;
  setClockStyle: (value: ClockStyle) => void;
  showFavorites: boolean;
  setShowFavorites: (value: boolean) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  showEphemeris: boolean;
  setShowEphemeris: (value: boolean) => void;
  showPersonalMessage: boolean;
  setShowPersonalMessage: (value: boolean) => void;
  showAiTools: boolean;
  setShowAiTools: (value: boolean) => void;
  compactDate: boolean;
  setCompactDate: (value: boolean) => void;
}

const MODES: { id: K3ThemeMode; icon: typeof SunIcon; key: string }[] = [
  { id: "light", icon: SunIcon, key: "theme.light" },
  { id: "dark", icon: MoonIcon, key: "theme.dark" },
  { id: "system", icon: MonitorIcon, key: "theme.system" },
  { id: "auto", icon: ClockIcon, key: "theme.auto" },
];

const SWATCHES = [
  "#6750A4",
  "#4382EC",
  "#EC4343",
  "#f4d837",
  "#5CBA5C",
  "#00CED1",
  "#EC5E78",
  "#EC844D",
  "#9563B5",
];

export function SettingsSheet({
  open,
  section,
  onClose,
  mode,
  setMode,
  seed,
  setSeed,
  firstName,
  setFirstName,
  showSeconds,
  setShowSeconds,
  showClock,
  setShowClock,
  hourFormat,
  setHourFormat,
  showWeather,
  setShowWeather,
  weatherLocationMode,
  setWeatherLocationMode,
  weatherManualAddress,
  setWeatherManualAddress,
  clockStyle,
  setClockStyle,
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
}: Props) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sectionTitle = t(`settingsSections.${section}.title`);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={sectionTitle} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        <h3 className="sheet__title">{sectionTitle}</h3>

        {section === "profile" && (
        <div className="sheet__group">
          <K3OutlinedField
            className="sheet__k3-field"
            name="profile-first-name"
            label={t("profile.firstName")}
            placeholder={t("profile.firstNamePlaceholder")}
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
          />
        </div>
        )}

        {section === "clock" && (
        <div className="sheet__group">
          <div className="sheet__label">{t("clock.title")}</div>
          <div className="seg seg--2 sheet__seg-row">
            <button
              type="button"
              aria-pressed={showClock}
              onClick={() => setShowClock(true)}
            >
              {t("clock.show")}
            </button>
            <button
              type="button"
              aria-pressed={!showClock}
              onClick={() => setShowClock(false)}
            >
              {t("clock.hide")}
            </button>
          </div>
          <div className="seg seg--2 sheet__seg-row">
            <button
              type="button"
              aria-pressed={hourFormat === "24"}
              onClick={() => setHourFormat("24")}
            >
              {t("clock.format24")}
            </button>
            <button
              type="button"
              aria-pressed={hourFormat === "12"}
              onClick={() => setHourFormat("12")}
            >
              {t("clock.format12")}
            </button>
          </div>
          <div className="seg seg--2 sheet__seg-row">
            <button
              type="button"
              aria-pressed={!showSeconds}
              onClick={() => setShowSeconds(false)}
            >
              {t("clock.withoutSeconds")}
            </button>
            <button
              type="button"
              aria-pressed={showSeconds}
              onClick={() => setShowSeconds(true)}
            >
              {t("clock.withSeconds")}
            </button>
          </div>
          <div className="sheet__label sheet__label--spaced">{t("clock.style")}</div>
          <div className="seg seg--2 sheet__seg-row">
            <button
              type="button"
              aria-pressed={clockStyle === "digital"}
              onClick={() => setClockStyle("digital")}
            >
              {t("clock.digital")}
            </button>
            <button
              type="button"
              aria-pressed={clockStyle === "analog"}
              onClick={() => setClockStyle("analog")}
            >
              {t("clock.analog")}
            </button>
          </div>
        </div>
        )}

        {section === "general" && (
        <>
        <div className="sheet__group">
          <div className="sheet__label">{t("theme.title")}</div>
          <div className="seg">
            {MODES.map(({ id, icon: Icon, key }) => (
              <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>
                <Icon />
                {t(key)}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet__group">
          <div className="sheet__label">{t("theme.color")}</div>
          <div className="swatches">
            {SWATCHES.map((c) => (
              <button
                key={c}
                className="swatch"
                style={{ background: c }}
                aria-pressed={seed.toLowerCase() === c.toLowerCase()}
                aria-label={c}
                onClick={() => setSeed(c)}
              />
            ))}
            <label className="swatch swatch--custom" aria-label={t("theme.color")}>
              +
              <input
                type="color"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="sheet__group">
          <div className="sheet__label">{t("lang.label")}</div>
          <div className="lang">
            <button aria-pressed={i18n.language.startsWith("fr")} onClick={() => i18n.changeLanguage("fr")}>
              {t("lang.fr")}
            </button>
            <button aria-pressed={i18n.language.startsWith("en")} onClick={() => i18n.changeLanguage("en")}>
              {t("lang.en")}
            </button>
          </div>
        </div>

        <div className="sheet__group">
          <div className="sheet__label">{t("display.title")}</div>
          <SettingsSwitch
            id="show-favorites"
            label={t("display.favorites")}
            checked={showFavorites}
            onChange={setShowFavorites}
          />
          <SettingsSwitch
            id="show-filters"
            label={t("display.filters")}
            checked={showFilters}
            onChange={setShowFilters}
          />
          <SettingsSwitch
            id="show-ephemeris"
            label={t("display.ephemeris")}
            checked={showEphemeris}
            onChange={setShowEphemeris}
          />
          <SettingsSwitch
            id="show-personal-message"
            label={t("display.personalMessage")}
            checked={showPersonalMessage}
            onChange={setShowPersonalMessage}
          />
          <SettingsSwitch
            id="show-ai-tools"
            label={t("display.aiTools")}
            checked={showAiTools}
            onChange={setShowAiTools}
          />
          <SettingsSwitch
            id="compact-date"
            label={t("display.compactDate")}
            hint={t("display.compactDateHint")}
            checked={compactDate}
            onChange={setCompactDate}
          />
        </div>

        <div className="sheet__links">
          <a href={PROJECT_GITHUB_URL} target="_blank" rel="noopener noreferrer">
            {t("links.github")}
          </a>
          <a href={PROJECT_FEEDBACK_URL}>{t("links.feedback")}</a>
        </div>
        </>
        )}

        {section === "weather" && (
        <>
        <div className="sheet__group">
          <div className="sheet__label">{t("weather.settings.widget")}</div>
          <div className="seg seg--2 sheet__seg-row">
            <button
              type="button"
              aria-pressed={showWeather}
              onClick={() => setShowWeather(true)}
            >
              {t("weather.settings.show")}
            </button>
            <button
              type="button"
              aria-pressed={!showWeather}
              onClick={() => setShowWeather(false)}
            >
              {t("weather.settings.hide")}
            </button>
          </div>
        </div>

        <div className="sheet__group">
          <div className="sheet__label">{t("weather.settings.location")}</div>
          <div className="seg seg--2 sheet__seg-row">
            <button
              type="button"
              aria-pressed={weatherLocationMode === "auto"}
              onClick={() => setWeatherLocationMode("auto")}
            >
              {t("weather.settings.autoDetect")}
            </button>
            <button
              type="button"
              aria-pressed={weatherLocationMode === "manual"}
              onClick={() => setWeatherLocationMode("manual")}
            >
              {t("weather.settings.manualAddress")}
            </button>
          </div>
          {weatherLocationMode === "manual" && (
            <K3OutlinedField
              className="sheet__k3-field sheet__k3-field--spaced"
              name="weather-manual-address"
              label={t("weather.settings.addressLabel")}
              placeholder={t("weather.settings.addressPlaceholder")}
              value={weatherManualAddress}
              onChange={setWeatherManualAddress}
            />
          )}
          <p className="sheet__hint">{t("weather.settings.locationHint")}</p>
        </div>
        </>
        )}

        {section === "wallpaper" && (
          <p className="sheet__placeholder">{t("settingsSections.wallpaper.placeholder")}</p>
        )}
      </div>
    </div>
  );
}
