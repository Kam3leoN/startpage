/**
 * Tronque un libellé avec ellipsis (ex. ville météo).
 */
export function truncateLabel(text: string, maxLength = 12): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}…`;
}
