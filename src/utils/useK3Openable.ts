import { useEffect, useRef } from "react";
import { waitForK3UIDeferred } from "./k3uiDeferred";

type OverlayKind = "Dialog" | "Drawer" | "Sheet";

type OpenableApi = {
  init: (el: HTMLElement, opts?: Record<string, unknown>) => unknown;
  getInstance: (el: HTMLElement) =>
    | { open?: (trigger?: HTMLElement) => void; close?: () => void; isOpen?: boolean }
    | undefined;
};

function getApi(kind: OverlayKind): OpenableApi | undefined {
  const K = window.K;
  if (!K) return undefined;
  return K[kind] as OpenableApi | undefined;
}

/**
 * Bridge React `open` ↔ instance k3ui (Dialog / Drawer / Sheet).
 * - init une seule fois (pas d'AutoInit Ripple via initK3UISubtree)
 * - open différé d'un tick (évite mouseup click-through sur overlay)
 * - closeOnBackNavigation désactivé pour Dialog (évite race history)
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

  useEffect(() => {
    if (!k3ready) return;
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;

    const boot = async () => {
      await waitForK3UIDeferred();
      if (cancelled) return;
      const api = getApi(kind);
      if (!api?.init || api.getInstance(el)) return;

      api.init(el, {
        ...optionsRef.current,
        onCloseEnd: () => onCloseRef.current(),
      });
    };

    void boot();
    return () => {
      cancelled = true;
    };
  }, [k3ready, id, kind]);

  useEffect(() => {
    if (!k3ready || !open) return;
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;
    let timer = 0;

    const run = async () => {
      await waitForK3UIDeferred();
      if (cancelled) return;

      const api = getApi(kind);
      if (!api) return;

      let instance = api.getInstance(el);
      if (!instance) {
        api.init(el, {
          ...optionsRef.current,
          onCloseEnd: () => onCloseRef.current(),
        });
        instance = api.getInstance(el);
      }

      // Laisser passer le pointeur / mouseup du clic déclencheur
      timer = window.setTimeout(() => {
        if (cancelled) return;
        instance?.open?.();
        if (kind === "Dialog") {
          // Garde-fou si le ressort M3 diverge (opacity via --dialog-effects)
          el.style.setProperty("--dialog-spatial", "1");
          el.style.setProperty("--dialog-effects", "1");
          const overlay = document.querySelector<HTMLElement>(".dialog-overlay:last-of-type");
          overlay?.style.setProperty("--dialog-effects", "1");
        }
      }, 30);
    };

    void run();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, k3ready, id, kind]);

  useEffect(() => {
    if (!k3ready || open) return;
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;
    getApi(kind)?.getInstance(el)?.close?.();
  }, [open, k3ready, id, kind]);
}
