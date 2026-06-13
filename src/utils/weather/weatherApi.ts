import type { GeoCoordinates, WeatherPlace, WeatherSnapshot } from "../../types/weather";
import {
  GEO_COORDS_CACHE_KEY,
  LOCATION_NAME_CACHE_KEY,
  WEATHER_CACHE_KEY,
} from "../../config/defaults";

const GEO_CACHE_MS = 2 * 60 * 1000;
const LOCATION_NAME_CACHE_MS = 24 * 60 * 60 * 1000;
const WEATHER_CACHE_MS = 2 * 60 * 1000;
const NOMINATIM_UA = "K3StartPage/1.0 (personal start page)";

interface CachedCoords {
  lat: number;
  lon: number;
  timestamp: number;
}

interface CachedPlace extends WeatherPlace {
  timestamp: number;
}

/** Reads cached GPS coordinates (auto mode). */
export function loadCachedCoords(): GeoCoordinates | null {
  try {
    const raw = localStorage.getItem(GEO_COORDS_CACHE_KEY);
    if (!raw) return null;
    const { lat, lon, timestamp } = JSON.parse(raw) as CachedCoords;
    if (Date.now() - timestamp >= GEO_CACHE_MS) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}

/** Persists GPS coordinates from geolocation. */
export function saveCachedCoords(lat: number, lon: number): void {
  localStorage.setItem(
    GEO_COORDS_CACHE_KEY,
    JSON.stringify({ lat, lon, timestamp: Date.now() } satisfies CachedCoords)
  );
}

/** Browser geolocation with high accuracy (same strategy as startpage-one). */
export function getBrowserLocation(fallback?: GeoCoordinates | null): Promise<GeoCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(fallback ?? null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {
        saveCachedCoords(lat, lon);
        resolve({ lat, lon });
      },
      () => resolve(fallback ?? loadCachedCoords()),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: GEO_CACHE_MS }
    );
  });
}

/** Reverse geocoding via Nominatim (city + country from lat/lon). */
export async function reverseGeocode(
  lat: number,
  lon: number,
  lang: string
): Promise<WeatherPlace> {
  try {
    const raw = localStorage.getItem(LOCATION_NAME_CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw) as CachedPlace;
      if (Date.now() - cached.timestamp < LOCATION_NAME_CACHE_MS) {
        return { city: cached.city, country: cached.country };
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${encodeURIComponent(lang)}`,
      { headers: { "User-Agent": NOMINATIM_UA } }
    );
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = (await res.json()) as { address?: Record<string, string> };
    const a = data.address ?? {};
    const city =
      a.city ||
      a.town ||
      a.village ||
      a.municipality ||
      a.hamlet ||
      a.county ||
      "—";
    const country = a.country || "—";
    localStorage.setItem(
      LOCATION_NAME_CACHE_KEY,
      JSON.stringify({ city, country, timestamp: Date.now() } satisfies CachedPlace)
    );
    return { city, country };
  } catch {
    try {
      const raw = localStorage.getItem(LOCATION_NAME_CACHE_KEY);
      if (raw) {
        const { city, country } = JSON.parse(raw) as WeatherPlace;
        return { city, country };
      }
    } catch {
      /* ignore */
    }
    return { city: "—", country: "—" };
  }
}

/** Forward geocoding via Open-Meteo (manual address → coordinates). */
export async function geocodeAddress(
  query: string,
  lang: string
): Promise<(GeoCoordinates & WeatherPlace) | null> {
  const name = query.trim();
  if (!name) return null;

  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(name)}&count=1&language=${encodeURIComponent(lang)}&format=json`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{
      latitude: number;
      longitude: number;
      name: string;
      country?: string;
      admin1?: string;
    }>;
  };

  const hit = data.results?.[0];
  if (!hit) return null;

  return {
    lat: hit.latitude,
    lon: hit.longitude,
    city: hit.name,
    country: hit.country ?? hit.admin1 ?? "—",
  };
}

/** Loads cached weather snapshot if still fresh. */
export function loadCachedWeather(): WeatherSnapshot | null {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw) as WeatherSnapshot;
    if (Date.now() - snap.timestamp >= WEATHER_CACHE_MS) return null;
    return snap;
  } catch {
    return null;
  }
}

/** Fetches current weather from Open-Meteo. */
export async function fetchCurrentWeather(
  coords: GeoCoordinates
): Promise<WeatherSnapshot> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&wind_speed_unit=kmh&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("weather fetch failed");

  const data = (await res.json()) as {
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      weather_code: number;
    };
  };

  const c = data.current;
  const snap: WeatherSnapshot = {
    temp: c.temperature_2m,
    feel: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    windKmh: c.wind_speed_10m,
    code: c.weather_code,
    timestamp: Date.now(),
  };

  localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(snap));
  return snap;
}

/** Clears place name cache (after manual location change). */
export function clearPlaceNameCache(): void {
  localStorage.removeItem(LOCATION_NAME_CACHE_KEY);
}
