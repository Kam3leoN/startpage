import { useEffect, useRef } from "react";
import type { LedConfig } from "../types/time_led";

const LED_ID = "led-clock";
const SCRIPT_ID = "time-led-js";

/** Native LED dot size — compact appbar uses smaller dots, scaled via viewBox + CSS. */
const COMPACT_LED_SIZE = 4;
const COMPACT_DISPLAY_HEIGHT = 32;

/** Reads the current M3 primary token for LED segment color. */
function readPrimaryColor(): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--md-sys-color-primary")
    .trim();
  return v || "#6750A4";
}

/** Reads the current surface token for inactive LED segments. */
function readSurfaceColor(): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--md-sys-color-surface")
    .trim();
  return v || "#1c1b1f";
}

/** Pixel size of each LED dot for full-size hero clock. */
function ledSize(): number {
  const w = window.innerWidth;
  if (w < 400) return 7;
  if (w < 640) return 9;
  if (w < 900) return 10;
  return 12;
}

function buildConfig(compact: boolean): LedConfig {
  if (compact) {
    return {
      id: LED_ID,
      type: "time",
      format: "hh:mm:ss",
      hourformat: 24,
      color: readPrimaryColor(),
      bgcolor: readSurfaceColor(),
      bgvisible: 0.35,
      size: COMPACT_LED_SIZE,
      rounded: 1,
      pix_between: 0,
      font: "font3",
      compact_colon: true,
    };
  }
  return {
    id: LED_ID,
    type: "time",
    format: "hh:mm:ss",
    hourformat: 24,
    color: readPrimaryColor(),
    bgcolor: readSurfaceColor(),
    bgvisible: 0.35,
    size: ledSize(),
    rounded: 2,
    pix_between: 1,
    font: "font3",
    compact_colon: true,
  };
}

/** Loads time_led.js once and mounts the digital_led3-style panel (hh:mm:ss, font3). */
export function LedClock({
  timeLabel,
  colorKey,
  compact = false,
}: {
  timeLabel: string;
  /** Changes when theme seed/mode updates — triggers LED color refresh. */
  colorKey: string;
  /** Smaller size for appbar placement. */
  compact?: boolean;
}) {
  const mounted = useRef(false);

  useEffect(() => {
    let resizeTimer: number | undefined;

    const mount = () => {
      const el = document.getElementById(LED_ID);
      if (!el || !window.Led) return;
      el.innerHTML = "";
      if (compact) {
        el.style.setProperty("--led-display-height", `${COMPACT_DISPLAY_HEIGHT}px`);
      } else {
        el.style.removeProperty("--led-display-height");
      }
      new window.Led!(buildConfig(compact));
      mounted.current = true;
    };

    const onResize = () => {
      if (!compact) {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (mounted.current) mount();
        }, 200);
      }
    };

    const boot = () => {
      mount();
      window.addEventListener("resize", onResize);
    };

    if (window.Led) {
      boot();
    } else {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", boot);
        if (window.Led) boot();
      } else {
        const s = document.createElement("script");
        s.id = SCRIPT_ID;
        s.src = `${import.meta.env.BASE_URL}vendor/time_led.js`;
        s.defer = true;
        s.addEventListener("load", boot);
        document.body.appendChild(s);
      }
    }

    return () => {
      mounted.current = false;
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      document.getElementById(LED_ID)?.replaceChildren();
    };
  }, [colorKey, compact]);

  return (
    <div
      id={LED_ID}
      className={`led-clock autosize${compact ? " led-clock--compact" : ""}`}
      role="timer"
      aria-live="polite"
      aria-label={timeLabel}
    />
  );
}
