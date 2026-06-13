/** WMO weather interpretation codes (Open-Meteo). */
export type WeatherIconKind = "sun" | "cloudSun" | "cloud" | "rain" | "snow" | "thunder";

const WMO_ICON: Record<number, WeatherIconKind> = {
  0: "sun",
  1: "cloudSun",
  2: "cloudSun",
  3: "cloud",
  45: "cloud",
  48: "cloud",
  51: "rain",
  53: "rain",
  55: "rain",
  56: "rain",
  57: "rain",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "thunder",
  96: "thunder",
  99: "thunder",
};

/** i18n keys under `weather.conditions.*` */
const WMO_I18N_KEY: Record<number, string> = {
  0: "clear",
  1: "mainlyClear",
  2: "partlyCloudy",
  3: "overcast",
  45: "fog",
  48: "rimeFog",
  51: "drizzleLight",
  53: "drizzle",
  55: "drizzleHeavy",
  56: "freezingDrizzleLight",
  57: "freezingDrizzle",
  61: "rainLight",
  63: "rain",
  65: "rainHeavy",
  66: "freezingRainLight",
  67: "freezingRain",
  71: "snowLight",
  73: "snow",
  75: "snowHeavy",
  77: "snowGrains",
  80: "showersLight",
  81: "showers",
  82: "showersHeavy",
  85: "snowShowers",
  86: "snowShowersHeavy",
  95: "thunder",
  96: "thunderHail",
  99: "thunderHeavy",
};

/** Returns icon variant for a WMO code. */
export function wmoIconKind(code: number): WeatherIconKind {
  return WMO_ICON[code] ?? "cloud";
}

/** Returns i18n key suffix for a WMO code. */
export function wmoConditionKey(code: number): string {
  return WMO_I18N_KEY[code] ?? "cloudy";
}
