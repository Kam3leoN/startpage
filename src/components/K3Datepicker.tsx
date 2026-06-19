import { useEffect, useRef } from "react";
import { waitForK3UIDeferred } from "../utils/k3uiDeferred";

interface Props {
  label: string;
  placeholder?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  locale?: string;
  maxDate?: Date;
  className?: string;
  inputVariant?: "filled" | "outlined";
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function refreshIcons(root: HTMLElement | null | undefined): void {
  if (!root) return;
  window.K?.IconManager?.processIconsInContainer?.(root);
  window.K?.IconManager?.forceDisplayIcons?.();
}

/** Datepicker K3UI — init unique, cleanup DOM explicite (évite les champs empilés). */
export function K3Datepicker({
  label,
  placeholder,
  value,
  onChange,
  locale = "fr-FR",
  maxDate,
  className,
  inputVariant = "outlined",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLElement | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const maxDateRef = useRef(maxDate);

  onChangeRef.current = onChange;
  valueRef.current = value;
  maxDateRef.current = maxDate;

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await waitForK3UIDeferred();
      if (cancelled || !hostRef.current) return;

      const el = hostRef.current.querySelector(".datepicker") as HTMLElement | null;
      if (!el || !window.K?.Datepicker?.init) return;

      window.K.Datepicker.getInstance(el)?.destroy?.();
      el.innerHTML = "";

      pickerRef.current = el;

      const initOptions: Parameters<NonNullable<typeof window.K.Datepicker>["init"]>[1] = {
        label,
        locale,
        inputVariant,
        placeholder,
        icon: "calendar",
        selectedDate: valueRef.current,
        showTodayButton: true,
        showClearButton: true,
        onChange: (next) => {
          if (next instanceof Date) onChangeRef.current(next);
          else if (next === null) onChangeRef.current(null);
        },
        onOpenEnd: () => {
          refreshIcons(hostRef.current);
          refreshIcons(document.body);
        },
      };

      if (maxDateRef.current) {
        initOptions.maxDate = maxDateRef.current;
      }

      window.K.Datepicker.init(el, initOptions);

      requestAnimationFrame(() => {
        refreshIcons(hostRef.current);
      });
      window.setTimeout(() => refreshIcons(hostRef.current), 60);
    };

    void boot();

    return () => {
      cancelled = true;
      const el = pickerRef.current;
      if (el) {
        window.K?.Datepicker?.getInstance(el)?.destroy?.();
        el.innerHTML = "";
      }
      pickerRef.current = null;
    };
  }, [inputVariant, label, locale, placeholder]);

  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;
    const inst = window.K?.Datepicker?.getInstance(el);
    if (!inst) return;

    const current = inst.getDate?.();

    if (!value) {
      if (current) inst.setDate?.(null);
      return;
    }

    if (!current || !isSameCalendarDay(current, value)) {
      inst.setDate?.(value);
    }
  }, [value]);

  return (
    <div ref={hostRef} className={className}>
      <div className="datepicker no-autoinit" />
    </div>
  );
}
