/* Typings for the k3ui global API surface we actually use. */

export interface K3DynamicColorManager {
  init(opts?: {
    sourceColor?: string;
    contrastLevel?: number;
    isDark?: boolean;
    savePreference?: boolean;
    storageKey?: string;
    onChange?: (hex: string, contrast: number, isDark: boolean) => void;
  }): void;
  applyTheme(sourceColor: string, contrastLevel?: number, isDark?: boolean): void;
  readonly currentSourceColor: string;
  readonly isDark: boolean;
}

export type K3ThemeMode = "light" | "dark" | "system" | "auto";

export interface K3ThemeManager {
  init(opts?: {
    savePreference?: boolean;
    onChange?: (mode: K3ThemeMode) => void;
  }): void;
  setTheme(mode: K3ThemeMode): void;
  readonly options: unknown;
}

export interface K3Toast {
  show(opts: {
    title?: string;
    description?: string;
    icon?: string;
    variant?: string;
  }): void;
}

export interface K3MenuInstance {
  isOpen?: boolean;
  open?: () => void;
  close?: () => void;
  destroy?: () => void;
}

export interface K3FieldInstance {
  setValue?: (value: string) => void;
  getValue?: () => string;
  destroy?: () => void;
}

export interface K3API {
  ThemeManager: K3ThemeManager;
  DynamicColorManager: K3DynamicColorManager;
  Mason: {
    init(el: Element, opts?: Record<string, unknown>): unknown;
    getInstance(el: HTMLElement): { destroy?: () => void; refresh?: () => void } | undefined;
  };
  IsoFilter: { init(el: Element, opts?: Record<string, unknown>): unknown };
  Perspective: {
    init(els: HTMLElement | NodeListOf<HTMLElement> | string, opts?: Record<string, unknown>): unknown;
    getInstance(el: HTMLElement): { destroy?: () => void } | undefined;
  };
  Dialog: {
    init(el: Element, opts?: Record<string, unknown>): unknown;
    getInstance(el: HTMLElement): { open?: () => void; close?: () => void; destroy?: () => void } | undefined;
  };
  Menu: {
    init(
      el: Element,
      opts?: {
        placement?: string;
        constrainWidth?: boolean;
        container?: HTMLElement | null;
        onItemClick?: (item: { id?: string }, menuId: string) => void;
        onCloseEnd?: () => void;
      }
    ): K3MenuInstance | undefined;
    getInstance(el: HTMLElement): K3MenuInstance | undefined;
  };
  ButtonSplit: {
    init(
      el: Element,
      opts?: {
        label?: string;
        variant?: string;
        size?: string;
        shape?: string;
        iconType?: string;
        leadingIcon?: string;
        onMainClick?: () => void;
      }
    ): unknown;
    getInstance(el: HTMLElement): { closeTrailing?: () => void; destroy?: () => void } | undefined;
  };
  IconManager?: {
    processIconsInContainer?: (el: HTMLElement) => void;
    forceDisplayIcons?: () => void;
  };
  Field?: {
    init(
      el: HTMLElement,
      opts?: { onInput?: (fieldEl: HTMLElement, value: string) => void }
    ): K3FieldInstance;
    getInstance(el: HTMLElement): K3FieldInstance | undefined;
  };
  ButtonFabMenu?: {
    init(
      el: Element,
      opts?: {
        position?: string;
        fabIcon?: string;
        items?: Array<{ id: string; label: string; icon?: string }>;
        onItemClick?: (item: { id: string; label: string; icon?: string }) => void;
      }
    ): unknown;
    getInstance(el: HTMLElement): { destroy?: () => void; closeMenu?: () => void } | undefined;
  };
  AppBar?: {
    init(el: Element, opts?: { variant?: string; fixed?: boolean; collapseDistance?: number }): unknown;
    getInstance(el: HTMLElement): { destroy?: () => void; updateOptions?: (opts: Record<string, unknown>) => void } | undefined;
    create?: (opts?: Record<string, unknown>) => HTMLElement;
  };
  Toast: K3Toast;
  loadDeferredComponents?: () => Promise<void>;
  initManagers?: (opts?: Record<string, unknown>) => void;
  initComponents?: (root?: Element) => void;
}

declare global {
  interface Window {
    K: K3API;
    K3UI_OPTIONS?: Record<string, unknown>;
  }
}

export {};
