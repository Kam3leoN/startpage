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

/** Editable personal message under the greeting. */
export const DEFAULT_PERSONAL_MESSAGE = "";

/** localStorage key for personal message. */
export const PERSONAL_MESSAGE_KEY = "k3-personal-message";

/** Clock display: digital (app bar) or analog (hero). */
export const DEFAULT_CLOCK_STYLE = "digital" as const;

/** localStorage key for clock style. */
export const CLOCK_STYLE_KEY = "k3-clock-style";

/** Compact date line (e.g. « Sam, 13 juin 2026 »). */
export const DEFAULT_COMPACT_DATE = false;

/** localStorage key for compact date preference. */
export const COMPACT_DATE_KEY = "k3-compact-date";

/** Show favorites / shortcuts grid. */
export const DEFAULT_SHOW_FAVORITES = true;
export const SHOW_FAVORITES_KEY = "k3-show-favorites";

/** Show category filter chips. */
export const DEFAULT_SHOW_FILTERS = true;
export const SHOW_FILTERS_KEY = "k3-show-filters";

/** Show saint ephemeris under the date. */
export const DEFAULT_SHOW_EPHEMERIS = true;
export const SHOW_EPHEMERIS_KEY = "k3-show-ephemeris";

/** Show editable personal message. */
export const DEFAULT_SHOW_PERSONAL_MESSAGE = true;
export const SHOW_PERSONAL_MESSAGE_KEY = "k3-show-personal-message";

/** Show AI tools expandable bar. */
export const DEFAULT_SHOW_AI_TOOLS = true;
export const SHOW_AI_TOOLS_KEY = "k3-show-ai-tools";

/** Show draggable week celebrations / birthdays card. */
export const DEFAULT_SHOW_WEEK_CELEBRATIONS = true;
export const SHOW_WEEK_CELEBRATIONS_KEY = "k3-show-week-celebrations";

/** localStorage key for week card drag position. */
export const WEEK_CELEBRATIONS_POSITION_KEY = "k3-week-celebrations-position";

/** localStorage key for user birthdays. */
export const BIRTHDAYS_STORAGE_KEY = "k3-birthdays";

/** Project links (settings footer). */
export const PROJECT_GITHUB_URL = "https://github.com/Kam3leoN/startpage";
export const PROJECT_FEEDBACK_URL = "mailto:feedback@example.com";
