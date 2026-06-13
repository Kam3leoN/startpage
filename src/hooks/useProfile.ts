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

export type GreetingPeriod = "morning" | "evening";

/** Bonjour (5h–17h59) ou Bonsoir (18h–4h59). */
export function greetingPeriod(hour: number): GreetingPeriod {
  return hour >= 5 && hour < 18 ? "morning" : "evening";
}
