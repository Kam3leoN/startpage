import { useEffect, useRef } from "react";
import { waitForK3UIDeferred } from "../utils/k3uiDeferred";

/** Reads the current value from an initialized k3ui-field inside root. */
export function readK3FieldValue(root: HTMLElement, name: string): string {
  const el = root.querySelector(`k3ui-field[name="${name}"]`) as HTMLElement | null;
  if (!el) return "";
  const value = window.K?.Field?.getInstance(el)?.getValue?.();
  if (typeof value === "string") return value;
  const input = el.querySelector("input, textarea") as HTMLInputElement | null;
  return input?.value ?? "";
}

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  variant?: "filled" | "outlined";
  leadingIcon?: string;
  className?: string;
  fieldClassName?: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  onEnter?: () => void;
  onEscape?: () => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  spellCheck?: boolean;
}

/** Outlined/filled k3ui-field — explicit K.Field.init (required inside dialogs). */
export function K3OutlinedField({
  name,
  label,
  placeholder,
  type = "text",
  variant = "outlined",
  leadingIcon,
  className,
  fieldClassName,
  value,
  onChange,
  autoFocus,
  onEnter,
  onEscape,
  inputMode,
  autoComplete,
  spellCheck,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLElement | null>(null);
  const onChangeRef = useRef(onChange);
  const onEnterRef = useRef(onEnter);
  const onEscapeRef = useRef(onEscape);
  onChangeRef.current = onChange;
  onEnterRef.current = onEnter;
  onEscapeRef.current = onEscape;

  useEffect(() => {
    let cancelled = false;
    let keydownTarget: HTMLInputElement | null = null;
    let onKeydown: ((e: KeyboardEvent) => void) | null = null;

    const boot = async () => {
      await waitForK3UIDeferred();
      if (cancelled || !hostRef.current) return;

      const el = hostRef.current.querySelector("k3ui-field") as HTMLElement | null;
      if (!el) return;
      fieldRef.current = el;

      window.K?.Field?.getInstance(el)?.destroy?.();

      if (!window.K?.Field?.init) return;

      window.K.Field.init(el, {
        onInput: (_fieldEl: HTMLElement, next: string) => onChangeRef.current(next),
      });

      window.K.Field.getInstance(el)?.setValue?.(value);

      if (autoFocus) {
        window.requestAnimationFrame(() => {
          const input = el.querySelector("input, textarea") as HTMLInputElement | null;
          input?.focus({ preventScroll: true });
        });
      }

      keydownTarget = el.querySelector("input, textarea") as HTMLInputElement | null;
      if (keydownTarget) {
        if (inputMode) keydownTarget.inputMode = inputMode;
        if (autoComplete !== undefined) keydownTarget.setAttribute("autocomplete", autoComplete);
        if (spellCheck !== undefined) keydownTarget.spellcheck = spellCheck;

        onKeydown = (e: KeyboardEvent) => {
          if (e.key === "Enter" && onEnterRef.current) {
            e.preventDefault();
            onEnterRef.current();
          }
          if (e.key === "Escape" && onEscapeRef.current) {
            e.preventDefault();
            onEscapeRef.current();
          }
        };
        keydownTarget.addEventListener("keydown", onKeydown);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      if (keydownTarget && onKeydown) {
        keydownTarget.removeEventListener("keydown", onKeydown);
      }
      const el = fieldRef.current;
      if (el) window.K?.Field?.getInstance(el)?.destroy?.();
      fieldRef.current = null;
    };
  }, [
    autoComplete,
    autoFocus,
    inputMode,
    label,
    leadingIcon,
    name,
    spellCheck,
    type,
    variant,
  ]);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const inst = window.K?.Field?.getInstance(el);
    if (!inst?.getValue || !inst.setValue) return;
    if (inst.getValue() !== value) inst.setValue(value);
  }, [value]);

  return (
    <div ref={hostRef} className={className}>
      <k3ui-field
        class={["no-autoinit", fieldClassName].filter(Boolean).join(" ")}
        variant={variant}
        name={name}
        label={label}
        placeholder={placeholder}
        type={type}
        {...(leadingIcon ? { "leading-icon": leadingIcon } : {})}
      />
    </div>
  );
}
