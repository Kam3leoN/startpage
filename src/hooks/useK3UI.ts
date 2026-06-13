import { useEffect, useState } from "react";
import { waitForK3UIReady } from "../utils/k3uiDeferred";

function loadStylesheet(id: string, href: string): void {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string, id: string, type?: "module"): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    if (type) script.type = type;
    else script.defer = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
    document.head.appendChild(script);
  });
}

/** Loads k3ui (init.js + module) and waits for deferred components — same order as k3ui-docs. */
export function useK3UI() {
  const [ready, setReady] = useState<boolean>(
    () => Boolean(window.K) && document.body.classList.contains("k3ui-ready")
  );

  useEffect(() => {
    if (ready) return;

    const base = import.meta.env.BASE_URL;
    loadStylesheet("k3ui-css", `${base}k3ui/k3ui.min.css`);

    let cancelled = false;

    const boot = async () => {
      try {
        if (!window.K3UI_OPTIONS) {
          window.K3UI_OPTIONS = { pageLoader: false, hideBodyUntilReady: false };
        }

        await loadScript(`${base}k3ui/init.js`, "k3ui-init");
        await loadScript(`${base}k3ui/k3ui.min.js`, "k3ui-js", "module");
        await waitForK3UIReady();

        if (cancelled) return;

        try {
          window.K?.initManagers?.({ profileAutoInit: false });
          window.K?.initComponents?.(document.body);
        } catch {
          /* AutoInit may have already run via installK3UIRuntime */
        }

        setReady(true);
      } catch {
        if (!cancelled) setReady(Boolean(window.K));
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  return ready;
}
