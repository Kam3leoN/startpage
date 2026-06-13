import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { GeoCoordinates, WeatherLocationMode, WeatherSnapshot } from "../types/weather";
import { wmoConditionKey } from "../utils/weather/wmoCodes";
import {
  clearPlaceNameCache,
  fetchCurrentWeather,
  geocodeAddress,
  getBrowserLocation,
  loadCachedCoords,
  loadCachedWeather,
  reverseGeocode,
} from "../utils/weather/weatherApi";

const REFRESH_MS = 3 * 60 * 1000;

interface UseWeatherOptions {
  enabled: boolean;
  locationMode: WeatherLocationMode;
  manualAddress: string;
}

interface WeatherState {
  snapshot: WeatherSnapshot | null;
  locationLabel: string;
  loading: boolean;
  error: string | null;
}

/** Resolves coordinates then fetches Open-Meteo weather (auto GPS or manual address). */
export function useWeather({ enabled, locationMode, manualAddress }: UseWeatherOptions) {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState<WeatherState>({
    snapshot: loadCachedWeather(),
    locationLabel: "",
    loading: enabled,
    error: null,
  });

  const manualAddressRef = useRef(manualAddress);
  const locationModeRef = useRef(locationMode);
  manualAddressRef.current = manualAddress;
  locationModeRef.current = locationMode;

  const describe = useCallback(
    (code: number) => t(`weather.conditions.${wmoConditionKey(code)}`),
    [t]
  );

  const resolveCoords = useCallback(async (): Promise<{
    coords: GeoCoordinates;
    place?: { city: string; country: string };
  } | null> => {
    const mode = locationModeRef.current;
    const lang = i18n.language.startsWith("fr") ? "fr" : "en";

    if (mode === "manual") {
      const address = manualAddressRef.current.trim();
      if (!address) return null;
      const hit = await geocodeAddress(address, lang);
      if (!hit) return null;
      return {
        coords: { lat: hit.lat, lon: hit.lon },
        place: { city: hit.city, country: hit.country },
      };
    }

    const coords =
      (await getBrowserLocation(loadCachedCoords())) ?? loadCachedCoords();
    if (!coords) return null;
    return { coords };
  }, [i18n.language]);

  const refresh = useCallback(async () => {
    if (!enabled) return;

    const cached = loadCachedWeather();
    if (cached) {
      setState((prev) => ({
        ...prev,
        snapshot: cached,
        loading: prev.snapshot === null,
        error: null,
      }));
    } else {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    }

    try {
      const resolved = await resolveCoords();
      if (!resolved) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: t("weather.errors.location"),
        }));
        return;
      }

      const { coords, place } = resolved;
      const snap = await fetchCurrentWeather(coords);

      let locationLabel = "";
      if (place) {
        locationLabel = `${place.city}, ${place.country}`;
      } else {
        const lang = i18n.language.startsWith("fr") ? "fr" : "en";
        const rev = await reverseGeocode(coords.lat, coords.lon, lang);
        locationLabel = `${rev.city}, ${rev.country}`;
      }

      setState({
        snapshot: snap,
        locationLabel,
        loading: false,
        error: null,
      });
    } catch {
      const fallback = loadCachedWeather();
      setState((prev) => ({
        ...prev,
        snapshot: fallback ?? prev.snapshot,
        loading: false,
        error: fallback ? null : t("weather.errors.unavailable"),
      }));
    }
  }, [enabled, i18n.language, resolveCoords, t]);

  useEffect(() => {
    if (!enabled) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    if (locationMode === "manual") {
      clearPlaceNameCache();
    }

    void refresh();
    const id = window.setInterval(() => void refresh(), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [enabled, locationMode, manualAddress, refresh]);

  const condition =
    state.snapshot !== null ? describe(state.snapshot.code) : t("weather.loading");

  return {
    ...state,
    condition,
    refresh,
  };
}
