import type { K3ThemeMode } from "../types/k3ui";

export const THEME_MODES: K3ThemeMode[] = ["light", "dark", "auto", "system"];

export const THEME_ICONS: Record<K3ThemeMode, string> = {
  light: "sun",
  dark: "moon",
  auto: "clock",
  system: "gear",
};

export function isThemeMode(value: string): value is K3ThemeMode {
  return THEME_MODES.includes(value as K3ThemeMode);
}
