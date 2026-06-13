import type { Category, Favorite } from "../data/favorites";
import type { CustomShortcut } from "../types/shortcuts";

const FAVICON_SIZE = 64;

/** Ensures a URL has a protocol for safe navigation. */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Google favicon service for domains without a custom icon. */
export function faviconFromUrl(url: string): string {
  try {
    const hostname = new URL(normalizeUrl(url)).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${FAVICON_SIZE}`;
  } catch {
    return `${import.meta.env.BASE_URL}icons/google.svg`;
  }
}

/** Stable id for a new custom shortcut. */
export function createShortcutId(): string {
  return `custom-${crypto.randomUUID()}`;
}

/** Maps persisted shortcuts to grid favorites (appended after built-ins). */
export function customShortcutToFavorite(shortcut: CustomShortcut): Favorite {
  const url = normalizeUrl(shortcut.url);
  return {
    id: shortcut.id,
    label: shortcut.label.trim(),
    url,
    icon: shortcut.icon?.trim() || faviconFromUrl(url),
    tags: shortcut.tags.length ? shortcut.tags : (["infos"] as Category[]),
    custom: true,
    color: shortcut.color,
  };
}

/** Validates user input before persisting. */
export function isValidShortcutInput(label: string, url: string): boolean {
  return label.trim().length > 0 && normalizeUrl(url).length > 0;
}
