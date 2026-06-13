import { useEffect, useRef } from "react";
import { initK3UISubtree } from "../utils/k3uiDeferred";

const SLIDES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const PERSPECTIVE_OPTIONS = {
  effect: "wave" as const,
  focus: 8,
  shadows: { enabled: true },
  autoplay: { enabled: true, speed: 2500 },
  loop: { enabled: true },
  navigation: { enabled: true },
  indicators: true,
  indicatorsPosition: "bottom" as const,
};

interface Props {
  k3ready: boolean;
}

/**
 * K3UI Perspective — markup aligned with k3ui-docs/perspective.php (grid demo).
 * Init via initComponents(subtree) after deferred load, with Perspective.init fallback.
 */
export function PerspectiveShowcase({ k3ready }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!k3ready || !rootRef.current) return;

    const el = rootRef.current;
    let cancelled = false;

    const boot = async () => {
      await initK3UISubtree(el);
      if (cancelled) return;

      const K = window.K;
      if (!K?.Perspective?.init) return;

      if (!K.Perspective.getInstance(el)) {
        K.Perspective.init(el, PERSPECTIVE_OPTIONS);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      window.K?.Perspective?.getInstance(el)?.destroy?.();
    };
  }, [k3ready]);

  return (
    <section className="perspective-section" aria-label="Perspective">
      <div
        ref={rootRef}
        id="startpage-perspective"
        className="perspective perspective--grid"
      >
        {SLIDES.map((value) => (
          <section key={value} className="perspective__slide">
            <div className="perspective__slide-inner">
              <p className="perspective-demo-text">{value}</p>
            </div>
          </section>
        ))}
        <span className="perspective__nav perspective__nav--prev" aria-hidden="true" />
        <span className="perspective__nav perspective__nav--next" aria-hidden="true" />
      </div>
    </section>
  );
}
