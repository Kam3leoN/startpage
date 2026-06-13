import { useCallback, useState } from "react";
import { DEFAULT_PERSONAL_MESSAGE, PERSONAL_MESSAGE_KEY } from "../config/defaults";

/** Message personnel éditable sous la salutation. */
export function usePersonalMessage() {
  const [message, setMessageState] = useState<string>(
    () => localStorage.getItem(PERSONAL_MESSAGE_KEY) ?? DEFAULT_PERSONAL_MESSAGE
  );

  const setMessage = useCallback((value: string) => {
    const trimmed = value.trim();
    setMessageState(trimmed);
    if (trimmed) localStorage.setItem(PERSONAL_MESSAGE_KEY, trimmed);
    else localStorage.removeItem(PERSONAL_MESSAGE_KEY);
  }, []);

  return { message, setMessage };
}
