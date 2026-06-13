import { useCallback, useState } from "react";
import { DEFAULT_FIRST_NAME, FIRST_NAME_KEY } from "../config/defaults";

export function useProfile() {
  const [firstName, setFirstNameState] = useState<string>(
    () => localStorage.getItem(FIRST_NAME_KEY) ?? DEFAULT_FIRST_NAME
  );

  const setFirstName = useCallback((name: string) => {
    const trimmed = name.trim();
    setFirstNameState(trimmed);
    if (trimmed) localStorage.setItem(FIRST_NAME_KEY, trimmed);
    else localStorage.removeItem(FIRST_NAME_KEY);
  }, []);

  return { firstName, setFirstName };
}

export type GreetingPeriod = "morning" | "afternoon" | "evening";

/** Returns the greeting period for the given hour (0–23). */
export function greetingPeriod(hour: number): GreetingPeriod {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}
