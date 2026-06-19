import { useEffect, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { initK3UISubtree } from "../utils/k3uiDeferred";

const NAV_ID = "startpage-navigation-bar";

interface Props {
  k3ready: boolean;
  showWeekCelebrations: boolean;
  showWeather: boolean;
  onToggleWeekCelebrations: () => void;
  onWeatherNavClick: () => void;
}

function syncToggleActiveStates(
  navEl: HTMLElement,
  showCelebrations: boolean,
  showWeather: boolean
): void {
  const items = navEl.querySelectorAll<HTMLElement>(".navigation-bar__item");
  items.forEach((item, index) => {
    const isOn =
      index === 0 ? showCelebrations : index === 1 ? showWeather : false;
    item.classList.toggle("navigation-bar__item--active", isOn);
    item.setAttribute("aria-selected", isOn ? "true" : "false");
  });
}

/** Barre de navigation basse K3UI — toggles fêtes/anniversaires et météo. */
export function StartPageNavigationBar({
  k3ready,
  showWeekCelebrations,
  showWeather,
  onToggleWeekCelebrations,
  onWeatherNavClick,
}: Props) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onToggleCelebrationsRef = useRef(onToggleWeekCelebrations);
  const onWeatherNavClickRef = useRef(onWeatherNavClick);

  onToggleCelebrationsRef.current = onToggleWeekCelebrations;
  onWeatherNavClickRef.current = onWeatherNavClick;

  useEffect(() => {
    if (!k3ready) return;

    const el = document.getElementById(NAV_ID) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;

    const boot = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      if (cancelled) return;

      const K = window.K;
      if (!K?.NavigationBar?.init) return;

      K.NavigationBar.getInstance(el)?.destroy?.();
      K.NavigationBar.init(el, {
        displayMode: "always",
        compact: false,
        onClick: (destination) => {
          if (destination === "celebrations") {
            onToggleCelebrationsRef.current();
          } else if (destination === "weather") {
            onWeatherNavClickRef.current();
          }
        },
      });
    };

    void boot();

    return () => {
      cancelled = true;
      window.K?.NavigationBar?.getInstance(el)?.destroy?.();
    };
  }, [k3ready]);

  useLayoutEffect(() => {
    const el = document.getElementById(NAV_ID);
    if (!el) return;
    syncToggleActiveStates(el, showWeekCelebrations, showWeather);
  }, [showWeekCelebrations, showWeather]);

  return (
    <div ref={rootRef} className="startpage-navigation-bar-wrap">
      <k3ui-navigation-bar
        id={NAV_ID}
        class="navigation-bar navigation-bar--items-80 startpage-navigation-bar no-autoinit"
        data-active-index="0"
        data-display-mode="always"
        data-compact="false"
        aria-label={t("navBar.ariaLabel")}
      >
        <button
          type="button"
          className={`navigation-bar__item${showWeekCelebrations ? " navigation-bar__item--active" : ""}`}
          data-destination="celebrations"
          aria-label={t("navBar.celebrations")}
        >
          <div className="navigation-bar__icon">
            <div className="navigation-bar__pill" aria-hidden="true" />
            <i
              name="calendar"
              type="classic"
              className="navigation-bar__icon-classic k3ui-icon"
              aria-hidden="true"
            />
          </div>
          <span className="navigation-bar__label">{t("navBar.celebrationsShort")}</span>
        </button>

        <button
          type="button"
          className={`navigation-bar__item${showWeather ? " navigation-bar__item--active" : ""}`}
          data-destination="weather"
          aria-label={t("navBar.weather")}
        >
          <div className="navigation-bar__icon">
            <div className="navigation-bar__pill" aria-hidden="true" />
            <i
              name="sun"
              type="classic"
              className="navigation-bar__icon-classic k3ui-icon"
              aria-hidden="true"
            />
          </div>
          <span className="navigation-bar__label">{t("navBar.weatherShort")}</span>
        </button>

        <button
          type="button"
          className="navigation-bar__item"
          data-destination="pending-1"
          aria-disabled="true"
          tabIndex={-1}
          aria-label={t("navBar.pending")}
        >
          <div className="navigation-bar__icon">
            <div className="navigation-bar__pill" aria-hidden="true" />
            <i
              name="clock"
              type="classic"
              className="navigation-bar__icon-classic k3ui-icon"
              aria-hidden="true"
            />
          </div>
          <span className="navigation-bar__label">{t("navBar.pendingShort")}</span>
        </button>

        <button
          type="button"
          className="navigation-bar__item"
          data-destination="pending-2"
          aria-disabled="true"
          tabIndex={-1}
          aria-label={t("navBar.pending")}
        >
          <div className="navigation-bar__icon">
            <div className="navigation-bar__pill" aria-hidden="true" />
            <i
              name="clock"
              type="classic"
              className="navigation-bar__icon-classic k3ui-icon"
              aria-hidden="true"
            />
          </div>
          <span className="navigation-bar__label">{t("navBar.pendingShort")}</span>
        </button>
      </k3ui-navigation-bar>
    </div>
  );
}
