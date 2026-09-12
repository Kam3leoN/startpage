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
  /** Dans un Dialog : pas de lock body (sinon Confirmer casse le dialog parent). */
  nestedOverlay?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
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

function bumpDatepickerStack(): void {
  const backdrop = document.querySelector<HTMLElement>(".datepicker__backdrop");
  const modal = document.querySelector<HTMLElement>(".datepicker__modal");
  if (backdrop) {
    backdrop.style.zIndex = "10000";
    backdrop.style.pointerEvents = "auto";
  }
  if (modal) {
    modal.style.zIndex = "10001";
    modal.style.pointerEvents = "auto";
  }
}

function emitDate(
  next: Date | null | { start: Date; end: Date },
  onChange: (date: Date | null) => void
): void {
  if (next instanceof Date) onChange(next);
  else if (next === null) onChange(null);
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
  nestedOverlay = false,
  onOpen,
  onClose,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLElement | null>(null);
  const onChangeRef = useRef(onChange);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const valueRef = useRef(value);
  const maxDateRef = useRef(maxDate);
  const nestedRef = useRef(nestedOverlay);

  onChangeRef.current = onChange;
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;
  valueRef.current = value;
  maxDateRef.current = maxDate;
  nestedRef.current = nestedOverlay;

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

      const pushDate = (next: Date | null | { start: Date; end: Date }) => {
        emitDate(next, (d) => onChangeRef.current(d));
      };

      const initOptions: Parameters<NonNullable<typeof window.K.Datepicker>["init"]>[1] = {
        label,
        locale,
        inputVariant,
        placeholder,
        icon: "calendar",
        selectedDate: valueRef.current,
        showTodayButton: true,
        // Clear dans un dialog birthday → date null → Enregistrer mort.
        showClearButton: !nestedRef.current,
        // Le Dialog parent gère déjà le scroll ; le datepicker ne doit pas reset body.
        preventScrolling: !nestedRef.current,
        onChange: pushDate,
        onSelect: pushDate,
        onOpenStart: () => {
          onOpenRef.current?.();
        },
        onOpenEnd: () => {
          bumpDatepickerStack();
          refreshIcons(hostRef.current);
          refreshIcons(document.body);
        },
        onCloseEnd: () => {
          if (nestedRef.current) {
            // Re-locker le scroll du Dialog parent (datepicker l’avait éventuellement touché).
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            document.body.classList.add("dialog-open");
          }
          onCloseRef.current?.();
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
  }, [inputVariant, label, locale, placeholder, nestedOverlay]);

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
