import { useCallback, useEffect, useRef } from "react";

const BOOT_MIN_MS = 2800;
const BOOT_EXIT_MS = 480;
const BOOT_MAX_MS = 6000;
const BOOT_SPLASH_ID = "boot-splash";

interface Props {
  /** Quand true, l’écran peut se fermer après le délai minimum. */
  appReady?: boolean;
}

/**
 * Contrôle l’écran de boot statique (#boot-splash dans index.html).
 * Visible dès le premier paint, avant React — inspiré PuruVJ/macos-web (MIT).
 */
export function BootScreen({ appReady = false }: Props) {
  const finishedRef = useRef(false);
  const shownAtRef = useRef(Date.now());
  const appReadyRef = useRef(appReady);
  appReadyRef.current = appReady;

  const finishBoot = useCallback(() => {
    if (finishedRef.current) return;

    const splash = document.getElementById(BOOT_SPLASH_ID);
    finishedRef.current = true;

    if (!splash) {
      document.documentElement.classList.remove("boot-pending");
      document.body.classList.remove("boot-active");
      return;
    }

    splash.classList.add("boot-screen--exit");
    window.setTimeout(() => {
      splash.remove();
      document.documentElement.classList.remove("boot-pending");
      document.body.classList.remove("boot-active");
    }, BOOT_EXIT_MS);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("boot-pending");
    document.body.classList.add("boot-active");

    const tryFinish = () => {
      if (finishedRef.current) return;
      const elapsed = Date.now() - shownAtRef.current;
      if (elapsed >= BOOT_MIN_MS && appReadyRef.current) finishBoot();
    };

    tryFinish();
    const pollId = window.setInterval(tryFinish, 120);
    const maxId = window.setTimeout(finishBoot, BOOT_MAX_MS);

    return () => {
      window.clearInterval(pollId);
      window.clearTimeout(maxId);
    };
  }, [finishBoot]);

  return null;
}
