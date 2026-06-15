import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";
type IconButtonSize = "xs" | "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nom accessible (obligatoire pour icon-only). */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Icône K3UI (`<i name="…">`) — prioritaire si fourni. */
  iconName?: string;
  children?: ReactNode;
}

/**
 * Bouton icône K3UI — forme ronde par défaut (sans narrow/wide), Material 3 Expressive.
 * Init manuelle (`no-autoinit`) pour synchroniser l'état `disabled` avec React.
 */
export function K3IconButton({
  label,
  variant = "standard",
  size = "md",
  iconName,
  className = "",
  children,
  type = "button",
  disabled = false,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.K?.ButtonIcon?.init) return;

    const instance = window.K.ButtonIcon.init(el, { ripple: true });
    const btn = Array.isArray(instance) ? instance[0] : instance;

    return () => {
      btn?.destroy?.();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.K?.ButtonIcon?.getInstance) return;
    const btn = window.K.ButtonIcon.getInstance(el);
    if (!btn) return;
    if (disabled) btn.disable?.();
    else btn.enable?.();
  }, [disabled]);

  return (
    <button
      ref={ref}
      type={type}
      className={`btn-icon no-autoinit btn-icon--${variant} btn-icon--${size} ripple ${className}`.trim()}
      aria-label={label}
      disabled={disabled}
      {...rest}
    >
      <span className="btn-icon__icon">
        {iconName ? (
          <i className="k3ui-icon" name={iconName} type="classic" size="md" aria-hidden="true" />
        ) : (
          children
        )}
      </span>
    </button>
  );
}
