/** Resolves when deferred K3UI components (Perspective, etc.) are on `window.K`. */
export function waitForK3UIDeferred(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const isReady = () => typeof window.K?.Perspective?.init === "function";

  if (isReady()) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled || !isReady()) return;
      settled = true;
      resolve();
    };

    const onReady = () => finish();
    document.addEventListener("k3ui-ready", onReady);

    void window.K?.loadDeferredComponents?.().then(finish);

    const poll = window.setInterval(() => finish(), 100);
    window.setTimeout(() => {
      window.clearInterval(poll);
      document.removeEventListener("k3ui-ready", onReady);
      if (!settled) {
        settled = true;
        resolve();
      }
    }, 8000);
  });
}

/** Waits for the full K3UI runtime (AutoInit + deferred chunks). */
export function waitForK3UIReady(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.body?.classList.contains("k3ui-ready")) {
    return waitForK3UIDeferred();
  }

  return new Promise((resolve) => {
    const done = () => {
      void waitForK3UIDeferred().then(resolve);
    };
    document.addEventListener("k3ui-ready", done, { once: true });
    if (window.K) void window.K.loadDeferredComponents?.().then(done);
    window.setTimeout(done, 8000);
  });
}

/** Initializes K3UI components inside a React-mounted subtree. */
export async function initK3UISubtree(root: HTMLElement): Promise<void> {
  await waitForK3UIDeferred();
  window.K?.initComponents?.(root);
}
