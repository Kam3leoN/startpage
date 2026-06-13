import { useCallback, useEffect, useState } from "react";
import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
  type Theme as MCUTheme,
} from "@material/material-color-utilities";
import type { K3ThemeMode } from "../types/k3ui";

const MODE_KEY = "k3-theme-mode";
const SEED_KEY = "k3-theme-seed";

/** Map material-color-utilities scheme -> the --md-sys-color-* token names k3ui's CSS consumes. */
function applyScheme(theme: MCUTheme, dark: boolean) {
  const scheme = dark ? theme.schemes.dark : theme.schemes.light;
  const root = document.documentElement;
  const json = scheme.toJSON() as Record<string, number>;
  for (const [name, argb] of Object.entries(json)) {
    // camelCase -> kebab-case (primaryContainer -> primary-container)
    const token = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    root.style.setProperty(`--md-sys-color-${token}`, hexFromArgb(argb));
  }

  // material-color-utilities@0.3 omits the M3 tonal-surface roles.
  // Derive them from the neutral palette at the spec's fixed tones.
  const neutral = theme.palettes.neutral;
  const set = (token: string, tone: number) =>
    root.style.setProperty(`--md-sys-color-${token}`, hexFromArgb(neutral.tone(tone)));
  if (dark) {
    set("surface-dim", 6);
    set("surface-bright", 24);
    set("surface-container-lowest", 4);
    set("surface-container-low", 10);
    set("surface-container", 12);
    set("surface-container-high", 17);
    set("surface-container-highest", 22);
  } else {
    set("surface-dim", 87);
    set("surface-bright", 98);
    set("surface-container-lowest", 100);
    set("surface-container-low", 96);
    set("surface-container", 94);
    set("surface-container-high", 92);
    set("surface-container-highest", 90);
  }
}

/** Resolve whether the effective UI is dark, given the chosen mode. */
function resolveDark(mode: K3ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  if (mode === "system")
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  // auto = based on local time (dark between 19h and 7h)
  const h = new Date().getHours();
  return h >= 19 || h < 7;
}

export function useTheme() {
  const [mode, setModeState] = useState<K3ThemeMode>(
    () => (localStorage.getItem(MODE_KEY) as K3ThemeMode) || "system"
  );
  const [seed, setSeedState] = useState<string>(
    () => localStorage.getItem(SEED_KEY) || "#6750A4"
  );

  const repaint = useCallback(
    (m: K3ThemeMode, s: string) => {
      const dark = resolveDark(m);
      const theme = themeFromSourceColor(argbFromHex(s));
      applyScheme(theme, dark);
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      // Keep k3ui's own managers in sync if present (so its components react too).
      try {
        window.K?.DynamicColorManager?.applyTheme?.(s, 0, dark);
      } catch {
        /* k3ui not loaded yet — tokens already applied above */
      }
    },
    []
  );

  const setMode = useCallback(
    (m: K3ThemeMode) => {
      setModeState(m);
      localStorage.setItem(MODE_KEY, m);
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
      localStorage.setItem(SEED_KEY, s);
      repaint(mode, s);
    },
    [repaint, mode]
  );

  // Initial paint + react to OS scheme changes (for "system") and time ticks (for "auto").
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

  return { mode, seed, setMode, setSeed, isDark: resolveDark(mode) };
}
