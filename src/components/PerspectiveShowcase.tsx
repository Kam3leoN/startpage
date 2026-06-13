import { useEffect, useRef } from "react";

const SLIDES = [1, 2, 3, 4, 5] as const;

interface Props {
  k3ready: boolean;
}

/** K3UI Perspective slider — 5 placeholder cards below the favorites grid. */
export function PerspectiveShowcase({ k3ready }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!k3ready || !rootRef.current) return;
    const el = rootRef.current;

    const timer = window.setTimeout(() => {
      try {
        window.K?.Perspective?.init(el, {
          effect: "wave",
          autoplay: { enabled: true, speed: 2500 },
          loop: { enabled: true },
          navigation: { enabled: true },
          indicators: true,
        });
      } catch {
        window.K?.initComponents?.(el);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.K?.Perspective?.getInstance(el)?.destroy?.();
    };
  }, [k3ready]);

  return (
    <section className="perspective-section">
      <div ref={rootRef} className="perspective perspective--grid perspective--startpage">
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
