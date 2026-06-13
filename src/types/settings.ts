/** Settings sections opened from the FAB menu. */
export type SettingsSection = "general" | "profile" | "clock" | "weather" | "wallpaper";

/** Maps FAB menu item ids to settings sections. */
export const SETTINGS_FAB_ITEM_IDS: Record<string, SettingsSection> = {
  general: "general",
  profile: "profile",
  clock: "clock",
  weather: "weather",
  wallpaper: "wallpaper",
};
