/**
 * Easing quintInOut — même courbe que macos-web (Svelte quintInOut).
 * @see https://github.com/PuruVJ/macos-web
 */
export function quintInOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 16 * clamped ** 5
    : 1 - (-2 * clamped + 2) ** 5 / 2;
}
