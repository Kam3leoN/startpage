/** Google Weather API icon slugs (maps.gstatic.com/weather/v1). */
export type GoogleWeatherIconSlug =
  | "sunny"
  | "clear"
  | "mostly_sunny"
  | "partly_cloudy"
  | "mostly_cloudy"
  | "cloudy"
  | "mist"
  | "dust"
  | "drizzle"
  | "showers"
  | "scattered_showers"
  | "flurries"
  | "snow_showers"
  | "heavy_snow"
  | "blowing_snow"
  | "blizzard"
  | "strong_tstorms"
  | "tornado"
  | "smoke";

const GOOGLE_WEATHER_BASE = "https://maps.gstatic.com/weather/v1";

/** Maps Open-Meteo WMO codes to Google Weather icon slugs. */
const WMO_TO_GOOGLE: Record<number, GoogleWeatherIconSlug> = {
  0: "sunny",
  1: "mostly_sunny",
  2: "partly_cloudy",
  3: "cloudy",
  45: "mist",
  48: "mist",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "showers",
  63: "showers",
  65: "scattered_showers",
  66: "showers",
  67: "scattered_showers",
  71: "flurries",
  73: "snow_showers",
  75: "heavy_snow",
  77: "flurries",
  80: "showers",
  81: "scattered_showers",
  82: "scattered_showers",
  85: "snow_showers",
  86: "heavy_snow",
  95: "strong_tstorms",
  96: "strong_tstorms",
  99: "tornado",
};

/** Resolves a WMO code to a Google Weather icon slug. */
export function wmoToGoogleWeatherSlug(code: number): GoogleWeatherIconSlug {
  return WMO_TO_GOOGLE[code] ?? "cloudy";
}

/** Builds the public Google Weather icon URL (light or dark). */
export function googleWeatherIconUrl(slug: GoogleWeatherIconSlug, dark = false): string {
  return `${GOOGLE_WEATHER_BASE}/${slug}${dark ? "_dark" : ""}.svg`;
}
