import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "./Clock";
import { initK3UISubtree } from "../utils/k3uiDeferred";

const APPBAR_ID = "startpage-appbar";

interface Props {
  k3ready: boolean;
  showClock: boolean;
  hh: string;
  mm: string;
  ss: string;
  showSeconds: boolean;
  hourFormat: "12" | "24";
}

/** Top app bar M3 (`k3ui-appbar`) — marque à gauche, horloge centrée. */
export function StartPageAppBar({
  k3ready,
  showClock,
  hh,
  mm,
  ss,
  showSeconds,
  hourFormat,
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

        {showClock ? (
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

        <div className="appbar__actions startpage-appbar__actions" aria-hidden="true" />
      </div>
    </k3ui-appbar>
  );
}
