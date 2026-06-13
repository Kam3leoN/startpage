/** How weather location is resolved. */
export type WeatherLocationMode = "auto" | "manual";

export interface GeoCoordinates {
  lat: number;
  lon: number;
}

export interface WeatherPlace {
  city: string;
  country: string;
}

export interface WeatherSnapshot {
  temp: number;
  feel: number;
  humidity: number;
  windKmh: number;
  code: number;
  timestamp: number;
}

export interface WeatherSettingsState {
  showWeather: boolean;
  locationMode: WeatherLocationMode;
  manualAddress: string;
}
