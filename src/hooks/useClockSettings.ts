import { useCallback, useState } from "react";
import { DEFAULT_SHOW_SECONDS, SHOW_SECONDS_KEY } from "../config/defaults";

function readShowSeconds(): boolean {
  const stored = localStorage.getItem(SHOW_SECONDS_KEY);
  if (stored === null) return DEFAULT_SHOW_SECONDS;
  return stored === "true";
}

/** Persists the user's clock format preference (HH:MM vs HH:MM:SS). */
export function useClockSettings() {
  const [showSeconds, setShowSecondsState] = useState<boolean>(readShowSeconds);

  const setShowSeconds = useCallback((value: boolean) => {
    setShowSecondsState(value);
    localStorage.setItem(SHOW_SECONDS_KEY, String(value));
  }, []);

  return { showSeconds, setShowSeconds };
}
