/** Supported web search engines. */
export const SEARCH_ENGINES = [
  { id: "google", url: "https://www.google.com/search?q=" },
  { id: "duckduckgo", url: "https://duckduckgo.com/?q=" },
  { id: "qwant", url: "https://www.qwant.com/?q=" },
  { id: "brave", url: "https://search.brave.com/search?q=" },
  { id: "yahoo", url: "https://search.yahoo.com/search?p=" },
  { id: "bing", url: "https://www.bing.com/search?q=" },
] as const;

export type SearchEngine = (typeof SEARCH_ENGINES)[number]["id"];

const ENGINE_IDS = new Set<string>(SEARCH_ENGINES.map((e) => e.id));

/** Type guard for persisted / menu item ids. */
export function isSearchEngine(value: string): value is SearchEngine {
  return ENGINE_IDS.has(value);
}

/** Builds a search URL for the selected engine. */
export function buildSearchUrl(engine: SearchEngine, query: string): string {
  const q = encodeURIComponent(query.trim());
  const def = SEARCH_ENGINES.find((e) => e.id === engine) ?? SEARCH_ENGINES[0];
  return `${def.url}${q}`;
}

/** i18n key for a search engine label. */
export function searchEngineLabelKey(engine: SearchEngine): string {
  return `search.engines.${engine}`;
}
