import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { WeatherWidget } from "./WeatherWidget";

const DIALOG_ID = "weather-dialog";

interface Props {
  open: boolean;
  k3ready: boolean;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  condition: string;
  locationLabel: string;
  weatherCode: number | null;
  loading: boolean;
  error: string | null;
  isDark?: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

/** Dialog K3UI centré affichant la météo. */
export function WeatherDialog({
  open,
  k3ready,
  temperature,
  feelsLike,
  humidity,
  condition,
  locationLabel,
  weatherCode,
  loading,
  error,
  isDark = false,
  onClose,
  onOpenSettings,
}: Props) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!k3ready) return;
    const el = document.getElementById(DIALOG_ID) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;

    const boot = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      if (cancelled) return;

      const K = window.K;
      if (!K?.Dialog?.init) return;

      if (!K.Dialog.getInstance(el)) {
        K.Dialog.init(el, {
          dismissible: true,
          onCloseEnd: () => onCloseRef.current(),
        });
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, [k3ready]);

  useEffect(() => {
    if (!k3ready || !open) return;
    const el = document.getElementById(DIALOG_ID) as
      | (HTMLElement & { open?: () => void })
      | null;
    if (!el) return;

    const openDialog = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      const instance = window.K?.Dialog?.getInstance(el);
      instance?.open?.() ?? el.open?.();
    };

    void openDialog();
  }, [open, k3ready]);

  useEffect(() => {
    if (!k3ready || open) return;
    const el = document.getElementById(DIALOG_ID) as HTMLElement | null;
    if (!el) return;
    const instance = window.K?.Dialog?.getInstance(el);
    instance?.close?.() ?? (el as HTMLElement & { close?: () => void }).close?.();
  }, [open, k3ready]);

  return (
    <div ref={rootRef}>
      <k3ui-dialog
        id={DIALOG_ID}
        class="dialog no-autoinit"
        title={t("weather.dialogTitle")}
      >
        <div className="dialog-content weather-dialog__content">
          <WeatherWidget
            temperature={temperature}
            feelsLike={feelsLike}
            humidity={humidity}
            condition={condition}
            locationLabel={locationLabel}
            weatherCode={weatherCode}
            loading={loading}
            error={error}
            isDark={isDark}
            variant="dialog"
          />
        </div>
        <div className="dialog-footer weather-dialog__footer">
          <button
            type="button"
            className="btn btn--text btn--sm ripple"
            onClick={onClose}
          >
            {t("navBar.close")}
          </button>
          <button
            type="button"
            className="btn btn--filled btn--sm btn--primary ripple"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
          >
            {t("weather.openSettings")}
          </button>
        </div>
      </k3ui-dialog>
    </div>
  );
}
