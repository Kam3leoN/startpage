import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { K3ThemeMode } from "../types/k3ui";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { isThemeMode, THEME_ICONS } from "../utils/themeMode";

const SPLIT_ID = "startpage-theme-split";
const SELECT_ID = "startpage-theme-select";

interface Props {
  k3ready: boolean;
  mode: K3ThemeMode;
  onModeChange: (mode: K3ThemeMode) => void;
}

/** HTML des options (icônes menu Select K3UI). */
function themeOptionHtml(icon: string, label: string): string {
  return `<i name="${icon}" type="classic" size="md"></i><span>${label}</span>`;
}

/** Résout le `<select>` natif (direct ou enfant de k3ui-select avant upgrade). */
function resolveThemeSelect(): HTMLSelectElement | null {
  const host = document.getElementById(SELECT_ID);
  if (!host) return null;
  if (host instanceof HTMLSelectElement) return host;
  const nested = host.querySelector("select");
  return nested instanceof HTMLSelectElement ? nested : null;
}

/** Attend l’upgrade k3ui-select → select natif. */
async function waitForThemeSelect(maxMs = 3000): Promise<HTMLSelectElement | null> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const sel = resolveThemeSelect();
    if (sel) return sel;
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  }
  return null;
}

/** Rafraîchit les icônes K3UI dans le conteneur thème. */
function refreshIcons(root: HTMLElement): void {
  window.K?.IconManager?.processIconsInContainer?.(root);
  window.K?.IconManager?.forceDisplayIcons?.();
}

/** Synchronise icône leading + valeur du select. */
function syncThemeUi(mode: K3ThemeMode): void {
  const icon = THEME_ICONS[mode];
  const splitEl = document.getElementById(SPLIT_ID);
  const leadingIcon = splitEl?.querySelector(
    ".button-split__leading i, .split-btn__leading i"
  ) as HTMLElement | null;
  if (leadingIcon) {
    leadingIcon.setAttribute("name", icon);
    window.K?.IconManager?.forceDisplayIcons?.();
  }

  const innerSelect = resolveThemeSelect();
  if (innerSelect instanceof HTMLSelectElement && innerSelect.value !== mode) {
    innerSelect.value = mode;
    window.K?.Select?.getInstance(innerSelect)?.forceSyncAll?.();
  }
}

/**
 * Button-split + select caché — pattern k3ui-docs/partials/navbar.php.
 * Select natif (pas k3ui-select) pour compatibilité React.
 */
export function AppBarThemeSwitch({ k3ready, mode, onModeChange }: Props) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onModeChangeRef = useRef(onModeChange);
  onModeChangeRef.current = onModeChange;

  useEffect(() => {
    if (!k3ready) return;

    let cancelled = false;

    const boot = async () => {
      const root = rootRef.current;
      if (!root) return;

      await initK3UISubtree(root);
      if (cancelled) return;

      const splitEl = document.getElementById(SPLIT_ID);
      const innerSelect = await waitForThemeSelect();
      if (cancelled || !splitEl || !innerSelect) return;

      const K = window.K;

      K?.ButtonSplit?.getInstance(splitEl)?.destroy?.();
      K?.Select?.getInstance(innerSelect)?.destroy?.();

      innerSelect.value = mode;

      K?.ButtonSplit?.init(splitEl, {
        variant: "filled",
        size: "sm",
        shape: "rounded",
        iconType: "chevron",
        leadingIcon: THEME_ICONS[mode],
        label: "",
      });

      K?.Select?.init(innerSelect, {
        onOptionSelect: (_el, value) => {
          if (value && isThemeMode(value)) {
            onModeChangeRef.current(value);
          }
        },
      });

      refreshIcons(root);
      syncThemeUi(mode);
    };

    void boot();

    return () => {
      cancelled = true;
      const splitEl = document.getElementById(SPLIT_ID);
      const innerSelect = resolveThemeSelect();
      window.K?.ButtonSplit?.getInstance(splitEl as HTMLElement)?.destroy?.();
      if (innerSelect) window.K?.Select?.getInstance(innerSelect)?.destroy?.();
    };
  }, [k3ready, t]);

  useEffect(() => {
    if (!k3ready) return;
    syncThemeUi(mode);
  }, [k3ready, mode]);

  const themeIcon = THEME_ICONS[mode];

  return (
    <div
      ref={rootRef}
      className="navbar-select-container navbar-select-container--theme startpage-appbar__theme"
    >
      <div
        id={SPLIT_ID}
        className="split-btn split-button button-split no-autoinit"
        data-size="sm"
        data-variant="filled"
        data-shape="rounded"
        data-label=""
        data-leading-icon={themeIcon}
      >
        <button
          type="button"
          className="split-btn__leading split-button__leading button-split__leading switch-theme"
          data-group="theme"
          data-theme={mode}
          aria-label={t("theme.current", { defaultValue: "Thème actuel" })}
          tabIndex={-1}
        >
          <span className="button-split__icon button-split__icon--leading">
            <i className="k3ui-icon" name={themeIcon} type="classic" size="md" aria-hidden="true" />
          </span>
          <span className="button-split__label" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="split-btn__trailing split-button__trailing button-split__trailing select--right switch-theme"
          data-group="theme"
          aria-label={t("theme.choose", { defaultValue: "Choisir le thème" })}
          aria-haspopup="listbox"
          aria-expanded="false"
        >
          <span className="button-split__icon button-split__icon--trailing">
            <i className="k3ui-icon" name="chevron" type="classic" aria-hidden="true" />
          </span>
        </button>
      </div>

      <select
        id={SELECT_ID}
        className="select select-hidden switch-theme no-autoinit"
        data-group="theme"
        defaultValue={mode}
        aria-hidden="true"
        tabIndex={-1}
      >
        <option
          value="light"
          data-option-html={themeOptionHtml("sun", t("theme.light"))}
        >
          {t("theme.light")}
        </option>
        <option
          value="dark"
          data-option-html={themeOptionHtml("moon", t("theme.dark"))}
        >
          {t("theme.dark")}
        </option>
        <option
          className="divider"
          value=""
          disabled
          hidden
          aria-hidden="true"
          data-divider="true"
        />
        <option
          value="auto"
          data-option-html={themeOptionHtml("clock", t("theme.auto"))}
        >
          {t("theme.auto")}
        </option>
        <option
          value="system"
          data-option-html={themeOptionHtml("gear", t("theme.system"))}
        >
          {t("theme.system")}
        </option>
      </select>
    </div>
  );
}
