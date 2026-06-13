/** Default first name shown in the greeting (overridable in settings). */
export const DEFAULT_FIRST_NAME = "";

/** localStorage key for the user's first name. */
export const FIRST_NAME_KEY = "k3-first-name";

/** Whether the clock is visible in the app bar. */
export const DEFAULT_SHOW_CLOCK = true;

/** localStorage key for clock visibility. */
export const SHOW_CLOCK_KEY = "k3-clock-visible";

/** Default hour format: 24-hour. */
export const DEFAULT_HOUR_FORMAT: "12" | "24" = "24";

/** localStorage key for 12h / 24h preference. */
export const HOUR_FORMAT_KEY = "k3-clock-hour-format";

/** Whether the clock shows seconds (HH:MM:SS) by default. */
export const DEFAULT_SHOW_SECONDS = true;

/** localStorage key for the clock seconds display preference. */
export const SHOW_SECONDS_KEY = "k3-clock-show-seconds";

/** localStorage key for custom shortcuts JSON (mirrors public/data/custom-shortcuts.json). */
export const CUSTOM_SHORTCUTS_KEY = "k3-custom-shortcuts";

/** localStorage key for user-managed category definitions. */
export const CATEGORIES_STORAGE_KEY = "k3-categories";

/** localStorage key for favorites grid tile order. */
export const FAVORITE_ORDER_KEY = "k3-favorite-order";

/** Default web search engine. */
export const DEFAULT_SEARCH_ENGINE = "google" as const;

/** localStorage key for web search engine preference. */
export const SEARCH_ENGINE_KEY = "k3-search-engine";

/** Whether the weather widget is visible. */
export const DEFAULT_SHOW_WEATHER = true;

/** localStorage key for weather widget visibility. */
export const SHOW_WEATHER_KEY = "k3-weather-visible";

/** Default location mode: browser geolocation. */
export const DEFAULT_WEATHER_LOCATION_MODE = "auto" as const;

/** localStorage key for weather location mode (`auto` | `manual`). */
export const WEATHER_LOCATION_MODE_KEY = "k3-weather-location-mode";

/** Default manual address when forcing a fixed location. */
export const DEFAULT_WEATHER_MANUAL_ADDRESS = "";

/** localStorage key for manual weather address. */
export const WEATHER_MANUAL_ADDRESS_KEY = "k3-weather-manual-address";

/** localStorage key for cached GPS coordinates. */
export const GEO_COORDS_CACHE_KEY = "k3-weather-geo";

/** localStorage key for cached place name (reverse geocode). */
export const LOCATION_NAME_CACHE_KEY = "k3-weather-place";

/** localStorage key for cached weather snapshot. */
export const WEATHER_CACHE_KEY = "k3-weather-data";
