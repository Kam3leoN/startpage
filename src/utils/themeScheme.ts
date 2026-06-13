import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
  type Theme as MCUTheme,
} from "@material/material-color-utilities";
import type { K3ThemeMode } from "../types/k3ui";

export const THEME_MODE_KEY = "k3-theme-mode";
export const THEME_SEED_KEY = "k3-theme-seed";
export const DEFAULT_THEME_SEED = "#6750A4";

/** Resolve whether the effective UI is dark, given the chosen mode. */
export function resolveThemeDark(mode: K3ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  const h = new Date().getHours();
  return h >= 19 || h < 7;
}

function applyScheme(theme: MCUTheme, dark: boolean): void {
  const scheme = dark ? theme.schemes.dark : theme.schemes.light;
  const root = document.documentElement;
  const json = scheme.toJSON() as Record<string, number>;

  for (const [name, argb] of Object.entries(json)) {
    const token = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    root.style.setProperty(`--md-sys-color-${token}`, hexFromArgb(argb));
  }

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

/** Applies Material 3 tokens on `document.documentElement`. */
export function paintTheme(mode: K3ThemeMode, seed: string): boolean {
  const dark = resolveThemeDark(mode);
  const theme = themeFromSourceColor(argbFromHex(seed));
  applyScheme(theme, dark);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  return dark;
}

function readThemeMode(): K3ThemeMode {
  const stored = localStorage.getItem(THEME_MODE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto" || stored === "system") {
    return stored;
  }
  return "system";
}

/** Reads user prefs and paints tokens — used before React boot. */
export function paintThemeFromStorage(): boolean {
  const mode = readThemeMode();
  const seed = localStorage.getItem(THEME_SEED_KEY) || DEFAULT_THEME_SEED;
  return paintTheme(mode, seed);
}
