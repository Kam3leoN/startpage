import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { K3ThemeMode } from "../types/k3ui";
import { SunIcon, MoonIcon, MonitorIcon, ClockIcon } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: K3ThemeMode;
  setMode: (m: K3ThemeMode) => void;
  seed: string;
  setSeed: (s: string) => void;
}

const MODES: { id: K3ThemeMode; icon: typeof SunIcon; key: string }[] = [
  { id: "light", icon: SunIcon, key: "theme.light" },
  { id: "dark", icon: MoonIcon, key: "theme.dark" },
  { id: "system", icon: MonitorIcon, key: "theme.system" },
  { id: "auto", icon: ClockIcon, key: "theme.auto" },
];

const SWATCHES = ["#6750A4", "#0B57D0", "#B3261E", "#1E6E3C", "#E8A800", "#00696F"];

export function SettingsSheet({ open, onClose, mode, setMode, seed, setSeed }: Props) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />

        <div className="sheet__group">
          <div className="sheet__label">{t("theme.title")}</div>
          <div className="seg">
            {MODES.map(({ id, icon: Icon, key }) => (
              <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>
                <Icon />
                {t(key)}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet__group">
          <div className="sheet__label">{t("theme.color")}</div>
          <div className="swatches">
            {SWATCHES.map((c) => (
              <button
                key={c}
                className="swatch"
                style={{ background: c }}
                aria-pressed={seed.toLowerCase() === c.toLowerCase()}
                aria-label={c}
                onClick={() => setSeed(c)}
              />
            ))}
            <label className="swatch swatch--custom" aria-label={t("theme.color")}>
              +
              <input
                type="color"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="sheet__group">
          <div className="sheet__label">{t("lang.label")}</div>
          <div className="lang">
            <button aria-pressed={i18n.language.startsWith("fr")} onClick={() => i18n.changeLanguage("fr")}>
              {t("lang.fr")}
            </button>
            <button aria-pressed={i18n.language.startsWith("en")} onClick={() => i18n.changeLanguage("en")}>
              {t("lang.en")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
