import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { greetingPeriod } from "../hooks/useProfile";

interface Props {
  firstName: string;
  hour: number;
}

/** Time-based greeting below the LED clock. */
export function Greeting({ firstName, hour }: Props) {
  const { t } = useTranslation();
  const period = greetingPeriod(hour);

  const text = useMemo(() => {
    if (firstName) {
      return t(`greeting.withName.${period}`, { name: firstName });
    }
    return t(`greeting.generic.${period}`);
  }, [firstName, period, t]);

  return <h1 className="greeting">{text}</h1>;
}
