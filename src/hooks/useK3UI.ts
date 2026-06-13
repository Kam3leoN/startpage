import { useEffect, useState } from "react";

/** Loads k3ui CSS+JS once and initialises its managers/components. */
export function useK3UI() {
  const [ready, setReady] = useState<boolean>(() => Boolean(window.K));

  useEffect(() => {
    if (window.K) {
      setReady(true);
      return;
    }
    const base = import.meta.env.BASE_URL;

    // CSS
    if (!document.getElementById("k3ui-css")) {
      const link = document.createElement("link");
      link.id = "k3ui-css";
      link.rel = "stylesheet";
      link.href = `${base}k3ui/k3ui.min.css`;
      document.head.appendChild(link);
    }

    // JS
    const existing = document.getElementById("k3ui-js") as HTMLScriptElement | null;
    const onload = () => {
      try {
        window.K?.initManagers?.({ profileAutoInit: false });
        window.K?.initComponents?.(document.body);
      } catch {
        /* managers may already be running via autoinit */
      }
      setReady(true);
    };
    if (existing) {
      if (window.K) onload();
      else existing.addEventListener("load", onload);
    } else {
      const s = document.createElement("script");
      s.id = "k3ui-js";
      s.src = `${base}k3ui/k3ui.min.js`;
      s.defer = true;
      s.addEventListener("load", onload);
      document.body.appendChild(s);
    }
  }, []);

  return ready;
}
