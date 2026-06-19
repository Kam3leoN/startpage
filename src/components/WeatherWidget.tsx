import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { truncateLabel } from "../utils/truncateLabel";
import {
  googleWeatherIconUrl,
  wmoToGoogleWeatherSlug,
} from "../utils/weather/googleWeatherIcons";

interface Props {
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  condition: string;
  locationLabel: string;
  weatherCode: number | null;
  loading: boolean;
  error: string | null;
  isDark?: boolean;
  /** `fixed` = coin haut-gauche ; `dialog` = contenu dans un dialog centré. */
  variant?: "fixed" | "dialog";
  onOpenSettings?: () => void;
}

/** Widget météo — température, ressenti, humidité (materialYouNewTab). */
export function WeatherWidget({
  temperature,
  feelsLike,
  humidity,
  condition,
  locationLabel,
  weatherCode,
  loading,
  error,
  isDark = false,
  variant = "fixed",
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
  const feelLabel =
    feelsLike !== null
      ? t("weather.feelsLike", { value: Math.round(feelsLike) })
      : null;
  const desc = error ?? (loading && !condition ? t("weather.loading") : condition);
  const place = truncateLabel(
    locationLabel ||
      (loading ? t("weather.locating") : error ? t("weather.locationUnknown") : "")
  );
  const humidityPct = humidity !== null ? Math.min(100, Math.max(0, Math.round(humidity))) : null;
  const humidityWidth =
    humidityPct !== null ? `calc(${humidityPct}% - 48px)` : "0%";

  const inner = (
    <>
      <div className="weather-widget__top">
        <span className="weather-widget__icon-wrap" aria-hidden>
          {!iconFailed ? (
            <img
              className="weather-widget__icon-img"
              src={iconUrl}
              alt=""
              width={56}
              height={56}
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
        <div className="weather-widget__body">
          <span className="weather-widget__temp">{tempLabel}</span>
          {feelLabel ? <span className="weather-widget__feel">{feelLabel}</span> : null}
          <span className="weather-widget__desc">{desc}</span>
          {place ? <span className="weather-widget__place">{place}</span> : null}
        </div>
      </div>
      {humidityPct !== null && !error && (
        <div className="weather-widget__humidity" aria-label={t("weather.humidity", { value: humidityPct })}>
          <span className="weather-widget__humidity-label">
            {t("weather.humidity", { value: humidityPct })}
          </span>
          <div className="weather-widget__humidity-track">
            <div
              className="weather-widget__humidity-fill"
              style={{ width: humidityWidth }}
            />
          </div>
        </div>
      )}
    </>
  );

  const className =
    variant === "dialog" ? "weather-widget weather-widget--dialog" : "weather-widget";

  if (onOpenSettings) {
    return (
      <button
        type="button"
        className={className}
        onClick={onOpenSettings}
        aria-label={t("weather.openSettings")}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={className} aria-live="polite">
      {inner}
    </div>
  );
}
