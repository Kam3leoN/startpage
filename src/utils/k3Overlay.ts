import { useEffect, useRef } from "react";
import { waitForK3UIDeferred } from "./k3uiDeferred";

export type OverlayKind = "Dialog" | "Drawer" | "Sheet";

type OpenableInstance = {
  open?: (trigger?: HTMLElement) => void;
  close?: () => void;
  isOpen?: boolean;
};

type OpenableApi = {
  init: (el: HTMLElement, opts?: Record<string, unknown>) => unknown;
  getInstance: (el: HTMLElement) => OpenableInstance | undefined;
};

function getApi(kind: OverlayKind): OpenableApi | undefined {
  const K = window.K;
  if (!K) return undefined;
  return K[kind] as OpenableApi | undefined;
}

function ensureInstance(
  id: string,
  kind: OverlayKind,
  options: Record<string, unknown>
): { el: HTMLElement; instance: OpenableInstance } | null {
  const el = document.getElementById(id) as HTMLElement | null;
  const api = getApi(kind);
  if (!el || !api?.init) return null;

  let instance = api.getInstance(el);
  if (!instance) {
    api.init(el, options);
    instance = api.getInstance(el);
  } else {
    const withOptions = instance as OpenableInstance & {
      options?: Record<string, unknown>;
    };
    if (withOptions.options) {
      Object.assign(withOptions.options, options);
    }
  }
  if (!instance) return null;
  return { el, instance };
}

function finalizeDialogOpen(el: HTMLElement): void {
  el.style.display = "block";
  el.style.visibility = "visible";
  el.style.pointerEvents = "auto";
  el.style.setProperty("--dialog-spatial", "1");
  el.style.setProperty("--dialog-effects", "1");
  const overlay = document.querySelector<HTMLElement>(".dialog-overlay:last-of-type");
  if (overlay) {
    overlay.style.display = "block";
    overlay.style.setProperty("--dialog-effects", "1");
    overlay.style.opacity = "1";
  }
}

/** Ouvre immédiatement une instance k3ui (handler clic — pas d’effet React). */
export async function openK3Overlay(
  id: string,
  kind: OverlayKind,
  options: Record<string, unknown> = {}
): Promise<boolean> {
  if (!getApi(kind)) await waitForK3UIDeferred();
  const ready = ensureInstance(id, kind, options);
  if (!ready?.instance.open) return false;
  ready.instance.open();
  if (kind === "Dialog") finalizeDialogOpen(ready.el);
  return true;
}

/** Ferme immédiatement une instance k3ui. */
export async function closeK3Overlay(id: string, kind: OverlayKind): Promise<boolean> {
  if (!getApi(kind)) await waitForK3UIDeferred();
  const el = document.getElementById(id) as HTMLElement | null;
  if (!el) return false;
  const instance = getApi(kind)?.getInstance(el);
  if (!instance?.close) return false;
  instance.close();
  return true;
}

/**
 * Synchronise la prop React `open` avec k3ui (nav / état externe).
 * Les boutons doivent aussi appeler openK3Overlay/closeK3Overlay au clic.
 */
export function useK3Openable(
  id: string,
  kind: OverlayKind,
  open: boolean,
  k3ready: boolean,
  onCloseEnd: () => void,
  initOptions: Record<string, unknown> = {}
): void {
  const onCloseRef = useRef(onCloseEnd);
  const optionsRef = useRef(initOptions);
  onCloseRef.current = onCloseEnd;
  optionsRef.current = initOptions;

  const mergedOptions = () => ({
    ...optionsRef.current,
    onCloseEnd: () => onCloseRef.current(),
  });

  useEffect(() => {
    if (!k3ready) return;
    let cancelled = false;

    const boot = async () => {
      if (!getApi(kind)) await waitForK3UIDeferred();
      if (cancelled) return;
      ensureInstance(id, kind, mergedOptions());
    };

    void boot();
    return () => {
      cancelled = true;
    };
  }, [k3ready, id, kind]);

  useEffect(() => {
    if (!k3ready) return;
    let cancelled = false;

    const sync = async () => {
      if (!getApi(kind)) await waitForK3UIDeferred();
      if (cancelled) return;
      const ready = ensureInstance(id, kind, mergedOptions());
      if (!ready) return;

      if (open) {
        if (!ready.instance.isOpen) ready.instance.open?.();
        if (kind === "Dialog") finalizeDialogOpen(ready.el);
      } else if (ready.instance.isOpen) {
        ready.instance.close?.();
      }
    };

    void sync();
    return () => {
      cancelled = true;
    };
  }, [open, k3ready, id, kind]);
}
