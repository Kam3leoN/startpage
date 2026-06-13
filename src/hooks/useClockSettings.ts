import { useCallback, useState } from "react";
import {
  DEFAULT_HOUR_FORMAT,
  DEFAULT_SHOW_CLOCK,
  DEFAULT_SHOW_SECONDS,
  HOUR_FORMAT_KEY,
  SHOW_CLOCK_KEY,
  SHOW_SECONDS_KEY,
} from "../config/defaults";

export type HourFormat = "12" | "24";

function readBool(key: string, fallback: boolean): boolean {
  const stored = localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

function readHourFormat(): HourFormat {
  const stored = localStorage.getItem(HOUR_FORMAT_KEY);
  return stored === "12" || stored === "24" ? stored : DEFAULT_HOUR_FORMAT;
}

/** Persists clock visibility, hour format and seconds display. */
export function useClockSettings() {
  const [showClock, setShowClockState] = useState<boolean>(() =>
    readBool(SHOW_CLOCK_KEY, DEFAULT_SHOW_CLOCK)
  );
  const [hourFormat, setHourFormatState] = useState<HourFormat>(readHourFormat);
  const [showSeconds, setShowSecondsState] = useState<boolean>(() =>
    readBool(SHOW_SECONDS_KEY, DEFAULT_SHOW_SECONDS)
  );

  const setShowClock = useCallback((value: boolean) => {
    setShowClockState(value);
    localStorage.setItem(SHOW_CLOCK_KEY, String(value));
  }, []);

  const setHourFormat = useCallback((value: HourFormat) => {
    setHourFormatState(value);
    localStorage.setItem(HOUR_FORMAT_KEY, value);
  }, []);

  const setShowSeconds = useCallback((value: boolean) => {
    setShowSecondsState(value);
    localStorage.setItem(SHOW_SECONDS_KEY, String(value));
  }, []);

  return {
    showClock,
    setShowClock,
    hourFormat,
    setHourFormat,
    showSeconds,
    setShowSeconds,
  };
}
