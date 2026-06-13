import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { greetingPeriod } from "../hooks/useProfile";

interface Props {
  firstName: string;
  hour: number;
}

/** Salutation « Bonjour » / « Bonsoir » + prénom optionnel. */
export function Greeting({ firstName, hour }: Props) {
  const { t } = useTranslation();
  const period = greetingPeriod(hour);

  const text = useMemo(() => {
    const trimmed = firstName.trim();
    if (trimmed) {
      return t(`greeting.withName.${period}`, { name: trimmed });
    }
    return t(`greeting.generic.${period}`);
  }, [firstName, period, t]);

  return <h1 className="greeting">{text}</h1>;
}
