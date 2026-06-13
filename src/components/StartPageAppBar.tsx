import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "./Clock";
import { AppBarThemeSwitch } from "./AppBarThemeSwitch";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import type { K3ThemeMode } from "../types/k3ui";

const APPBAR_ID = "startpage-appbar";

interface Props {
  k3ready: boolean;
  showClock: boolean;
  clockStyle: "digital" | "analog";
  hh: string;
  mm: string;
  ss: string;
  showSeconds: boolean;
  hourFormat: "12" | "24";
  themeMode: K3ThemeMode;
  onThemeModeChange: (mode: K3ThemeMode) => void;
}

/** Top app bar M3 (`k3ui-appbar`) — marque, horloge, thème à droite. */
export function StartPageAppBar({
  k3ready,
  showClock,
  clockStyle,
  hh,
  mm,
  ss,
  showSeconds,
  hourFormat,
  themeMode,
  onThemeModeChange,
}: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!k3ready) return;

    let cancelled = false;
    const el = document.getElementById(APPBAR_ID) as HTMLElement | null;
    if (!el) return;

    const boot = async () => {
      await initK3UISubtree(el);
      if (cancelled) return;

      window.K?.AppBar?.getInstance(el)?.destroy?.();
      window.K?.AppBar?.init(el, { variant: "small" });
    };

    void boot();

    return () => {
      cancelled = true;
      window.K?.AppBar?.getInstance(el)?.destroy?.();
    };
  }, [k3ready]);

  return (
    <k3ui-appbar
      id={APPBAR_ID}
      class="appbar startpage-appbar no-autoinit"
      variant="small"
      role="banner"
      aria-label={t("appbar.label", { defaultValue: "StartPage" })}
    >
      <div className="appbar__content startpage-appbar__content">
        <div className="appbar__leading startpage-appbar__brand">
          <span className="startpage-appbar__brand-dot" aria-hidden="true" />
          <span className="startpage-appbar__brand-text">StartPage</span>
        </div>

        {showClock && clockStyle === "digital" ? (
          <div className="startpage-appbar__clock">
            <Clock
              hh={hh}
              mm={mm}
              ss={ss}
              showSeconds={showSeconds}
              hourFormat={hourFormat}
            />
          </div>
        ) : (
          <div className="startpage-appbar__clock startpage-appbar__clock--empty" aria-hidden="true" />
        )}

        <div className="appbar__actions startpage-appbar__actions">
          <AppBarThemeSwitch
            k3ready={k3ready}
            mode={themeMode}
            onModeChange={onThemeModeChange}
          />
        </div>
      </div>
    </k3ui-appbar>
  );
}
