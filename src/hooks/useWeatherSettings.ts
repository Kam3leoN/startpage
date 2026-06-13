import { useCallback, useState } from "react";
import {
  DEFAULT_SHOW_WEATHER,
  DEFAULT_WEATHER_LOCATION_MODE,
  DEFAULT_WEATHER_MANUAL_ADDRESS,
  SHOW_WEATHER_KEY,
  WEATHER_LOCATION_MODE_KEY,
  WEATHER_MANUAL_ADDRESS_KEY,
} from "../config/defaults";
import type { WeatherLocationMode } from "../types/weather";

function readBool(key: string, fallback: boolean): boolean {
  const stored = localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

function readLocationMode(): WeatherLocationMode {
  const stored = localStorage.getItem(WEATHER_LOCATION_MODE_KEY);
  return stored === "manual" ? "manual" : DEFAULT_WEATHER_LOCATION_MODE;
}

/** Persists weather widget visibility and location preferences. */
export function useWeatherSettings() {
  const [showWeather, setShowWeatherState] = useState<boolean>(() =>
    readBool(SHOW_WEATHER_KEY, DEFAULT_SHOW_WEATHER)
  );
  const [locationMode, setLocationModeState] = useState<WeatherLocationMode>(readLocationMode);
  const [manualAddress, setManualAddressState] = useState<string>(() =>
    localStorage.getItem(WEATHER_MANUAL_ADDRESS_KEY) ?? DEFAULT_WEATHER_MANUAL_ADDRESS
  );

  const setShowWeather = useCallback((value: boolean) => {
    setShowWeatherState(value);
    localStorage.setItem(SHOW_WEATHER_KEY, String(value));
  }, []);

  const setLocationMode = useCallback((value: WeatherLocationMode) => {
    setLocationModeState(value);
    localStorage.setItem(WEATHER_LOCATION_MODE_KEY, value);
  }, []);

  const setManualAddress = useCallback((value: string) => {
    setManualAddressState(value);
    localStorage.setItem(WEATHER_MANUAL_ADDRESS_KEY, value);
  }, []);

  return {
    showWeather,
    setShowWeather,
    locationMode,
    setLocationMode,
    manualAddress,
    setManualAddress,
  };
}
