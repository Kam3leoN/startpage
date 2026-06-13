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

export interface K3API {
  ThemeManager: K3ThemeManager;
  DynamicColorManager: K3DynamicColorManager;
  Mason: { init(el: Element, opts?: Record<string, unknown>): unknown };
  IsoFilter: { init(el: Element, opts?: Record<string, unknown>): unknown };
  Perspective: {
    init(els: HTMLElement | NodeListOf<HTMLElement> | string, opts?: Record<string, unknown>): unknown;
    getInstance(el: HTMLElement): { destroy?: () => void } | undefined;
  };
  Toast: K3Toast;
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
