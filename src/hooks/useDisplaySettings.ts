import { useCallback, useState } from "react";
import {
  CLOCK_STYLE_KEY,
  COMPACT_DATE_KEY,
  DEFAULT_CLOCK_STYLE,
  DEFAULT_COMPACT_DATE,
  DEFAULT_SHOW_AI_TOOLS,
  DEFAULT_SHOW_DOCK,
  DEFAULT_SHOW_EPHEMERIS,
  DEFAULT_SHOW_FILTERS,
  DEFAULT_SHOW_FAVORITES,
  DEFAULT_SHOW_PERSONAL_MESSAGE,
  SHOW_AI_TOOLS_KEY,
  SHOW_DOCK_KEY,
  SHOW_EPHEMERIS_KEY,
  SHOW_FILTERS_KEY,
  SHOW_FAVORITES_KEY,
  SHOW_PERSONAL_MESSAGE_KEY,
} from "../config/defaults";

export type ClockStyle = "digital" | "analog";

function readBool(key: string, fallback: boolean): boolean {
  const stored = localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

function readClockStyle(): ClockStyle {
  const stored = localStorage.getItem(CLOCK_STYLE_KEY);
  return stored === "analog" || stored === "digital" ? stored : DEFAULT_CLOCK_STYLE;
}

/** Toggles d'affichage des sections (inspiré materialYouNewTab). */
export function useDisplaySettings() {
  const [showFavorites, setShowFavoritesState] = useState(() =>
    readBool(SHOW_FAVORITES_KEY, DEFAULT_SHOW_FAVORITES)
  );
  const [showFilters, setShowFiltersState] = useState(() =>
    readBool(SHOW_FILTERS_KEY, DEFAULT_SHOW_FILTERS)
  );
  const [showEphemeris, setShowEphemerisState] = useState(() =>
    readBool(SHOW_EPHEMERIS_KEY, DEFAULT_SHOW_EPHEMERIS)
  );
  const [showPersonalMessage, setShowPersonalMessageState] = useState(() =>
    readBool(SHOW_PERSONAL_MESSAGE_KEY, DEFAULT_SHOW_PERSONAL_MESSAGE)
  );
  const [showAiTools, setShowAiToolsState] = useState(() =>
    readBool(SHOW_AI_TOOLS_KEY, DEFAULT_SHOW_AI_TOOLS)
  );
  const [showDock, setShowDockState] = useState(() =>
    readBool(SHOW_DOCK_KEY, DEFAULT_SHOW_DOCK)
  );
  const [compactDate, setCompactDateState] = useState(() =>
    readBool(COMPACT_DATE_KEY, DEFAULT_COMPACT_DATE)
  );
  const [clockStyle, setClockStyleState] = useState<ClockStyle>(readClockStyle);

  const setShowFavorites = useCallback((value: boolean) => {
    setShowFavoritesState(value);
    localStorage.setItem(SHOW_FAVORITES_KEY, String(value));
  }, []);

  const setShowFilters = useCallback((value: boolean) => {
    setShowFiltersState(value);
    localStorage.setItem(SHOW_FILTERS_KEY, String(value));
  }, []);

  const setShowEphemeris = useCallback((value: boolean) => {
    setShowEphemerisState(value);
    localStorage.setItem(SHOW_EPHEMERIS_KEY, String(value));
  }, []);

  const setShowPersonalMessage = useCallback((value: boolean) => {
    setShowPersonalMessageState(value);
    localStorage.setItem(SHOW_PERSONAL_MESSAGE_KEY, String(value));
  }, []);

  const setShowAiTools = useCallback((value: boolean) => {
    setShowAiToolsState(value);
    localStorage.setItem(SHOW_AI_TOOLS_KEY, String(value));
  }, []);

  const setShowDock = useCallback((value: boolean) => {
    setShowDockState(value);
    localStorage.setItem(SHOW_DOCK_KEY, String(value));
  }, []);

  const setCompactDate = useCallback((value: boolean) => {
    setCompactDateState(value);
    localStorage.setItem(COMPACT_DATE_KEY, String(value));
  }, []);

  const setClockStyle = useCallback((value: ClockStyle) => {
    setClockStyleState(value);
    localStorage.setItem(CLOCK_STYLE_KEY, value);
  }, []);

  return {
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
  };
}
