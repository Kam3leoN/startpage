import { useCallback, useEffect, useState } from "react";
import type { K3ThemeMode } from "../types/k3ui";
import {
  DEFAULT_THEME_SEED,
  paintTheme,
  resolveThemeDark,
  THEME_MODE_KEY,
  THEME_SEED_KEY,
} from "../utils/themeScheme";

export function useTheme() {
  const [mode, setModeState] = useState<K3ThemeMode>(
    () => (localStorage.getItem(THEME_MODE_KEY) as K3ThemeMode) || "system"
  );
  const [seed, setSeedState] = useState<string>(
    () => localStorage.getItem(THEME_SEED_KEY) || DEFAULT_THEME_SEED
  );

  const repaint = useCallback((m: K3ThemeMode, s: string) => {
    const dark = paintTheme(m, s);
    try {
      window.K?.DynamicColorManager?.applyTheme?.(s, 0, dark);
    } catch {
      /* k3ui not loaded yet — tokens already applied above */
    }
    return dark;
  }, []);

  const setMode = useCallback(
    (m: K3ThemeMode) => {
      setModeState(m);
      localStorage.setItem(THEME_MODE_KEY, m);
      repaint(m, seed);
      try {
        window.K?.ThemeManager?.setTheme?.(m);
      } catch {
        /* noop */
      }
    },
    [repaint, seed]
  );

  const setSeed = useCallback(
    (s: string) => {
      setSeedState(s);
      localStorage.setItem(THEME_SEED_KEY, s);
      repaint(mode, s);
    },
    [repaint, mode]
  );

  useEffect(() => {
    repaint(mode, seed);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = () => {
      if (mode === "system") repaint(mode, seed);
    };
    mq.addEventListener("change", onMq);

    let timer: number | undefined;
    if (mode === "auto") {
      timer = window.setInterval(() => repaint(mode, seed), 60_000);
    }
    return () => {
      mq.removeEventListener("change", onMq);
      if (timer) window.clearInterval(timer);
    };
  }, [mode, seed, repaint]);

  return { mode, seed, setMode, setSeed, isDark: resolveThemeDark(mode) };
}
