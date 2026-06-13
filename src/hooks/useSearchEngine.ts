import { useCallback, useState } from "react";
import {
  DEFAULT_SEARCH_ENGINE,
  SEARCH_ENGINE_KEY,
} from "../config/defaults";
import { isSearchEngine, type SearchEngine } from "../utils/searchEngine";

function readEngine(): SearchEngine {
  const stored = localStorage.getItem(SEARCH_ENGINE_KEY);
  return stored && isSearchEngine(stored) ? stored : DEFAULT_SEARCH_ENGINE;
}

/** Persists the preferred web search engine. */
export function useSearchEngine() {
  const [engine, setEngineState] = useState<SearchEngine>(readEngine);

  const setEngine = useCallback((value: SearchEngine) => {
    setEngineState(value);
    localStorage.setItem(SEARCH_ENGINE_KEY, value);
  }, []);

  return { engine, setEngine };
}
