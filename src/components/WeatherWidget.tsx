import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  googleWeatherIconUrl,
  wmoToGoogleWeatherSlug,
} from "../utils/weather/googleWeatherIcons";

interface Props {
  temperature: number | null;
  condition: string;
  locationLabel: string;
  weatherCode: number | null;
  loading: boolean;
  error: string | null;
  isDark?: boolean;
  onOpenSettings?: () => void;
}

/** Compact weather pill — Open-Meteo + Google Weather icons (gstatic v1). */
export function WeatherWidget({
  temperature,
  condition,
  locationLabel,
  weatherCode,
  loading,
  error,
  isDark = false,
  onOpenSettings,
}: Props) {
  const { t } = useTranslation();
  const [iconFailed, setIconFailed] = useState(false);

  const slug = weatherCode !== null ? wmoToGoogleWeatherSlug(weatherCode) : "partly_cloudy";
  const iconUrl = googleWeatherIconUrl(slug, isDark);

  useEffect(() => {
    setIconFailed(false);
  }, [iconUrl]);

  const tempLabel =
    temperature !== null ? `${Math.round(temperature)}°C` : loading ? "--°C" : "--°C";

  const desc = error ?? (loading && !condition ? t("weather.loading") : condition);
  const place =
    locationLabel ||
    (loading ? t("weather.locating") : error ? t("weather.locationUnknown") : "");

  const inner = (
    <>
      <span className="weather-widget__icon-wrap" aria-hidden>
        {!iconFailed ? (
          <img
            className="weather-widget__icon-img"
            src={iconUrl}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
            onError={() => setIconFailed(true)}
          />
        ) : (
          <span className="weather-widget__icon-fallback" aria-hidden>
            ○
          </span>
        )}
      </span>
      <span className="weather-widget__body">
        <span className="weather-widget__temp">{tempLabel}</span>
        <span className="weather-widget__desc">{desc}</span>
        {place ? <span className="weather-widget__place">{place}</span> : null}
      </span>
    </>
  );

  if (onOpenSettings) {
    return (
      <button
        type="button"
        className="weather-widget"
        onClick={onOpenSettings}
        aria-label={t("weather.openSettings")}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className="weather-widget" aria-live="polite">
      {inner}
    </div>
  );
}
