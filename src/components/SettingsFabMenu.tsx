import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { FAB_MENU_LAYER_ID, SETTINGS_FAB_MENU_ID } from "../config/fabMenu";
import {
  SETTINGS_FAB_ITEM_IDS,
  type SettingsSection,
} from "../types/settings";

interface Props {
  k3ready: boolean;
  onOpenSection: (section: SettingsSection) => void;
}

type FabItem = { id: string; label: string; icon: string };

/** FAB speed-dial (bottom-left) — opens a settings section per pill. */
export function SettingsFabMenu({ k3ready, onOpenSection }: Props) {
  const { t, i18n } = useTranslation();
  const onOpenRef = useRef(onOpenSection);
  onOpenRef.current = onOpenSection;

  useEffect(() => {
    if (!k3ready) return;

    let cancelled = false;

    const buildItems = (): FabItem[] => [
      { id: "general", label: t("settingsFab.items.general"), icon: "gear" },
      { id: "profile", label: t("settingsFab.items.profile"), icon: "person" },
      { id: "clock", label: t("settingsFab.items.clock"), icon: "clock" },
      { id: "weather", label: t("settingsFab.items.weather"), icon: "sun" },
      { id: "wallpaper", label: t("settingsFab.items.wallpaper"), icon: "image" },
    ];

    const boot = async () => {
      const menuEl = document.getElementById(SETTINGS_FAB_MENU_ID);
      if (!menuEl) return;

      document.body.classList.add("has-fab-menu");

      await initK3UISubtree(menuEl);
      if (cancelled) return;

      const K = window.K;

      K?.ButtonFabMenu?.getInstance(menuEl)?.destroy?.();

      const handleItem = (item: { id: string; label: string; icon?: string }) => {
        const section = SETTINGS_FAB_ITEM_IDS[item.id];
        if (section) onOpenRef.current(section);
      };

      K?.ButtonFabMenu?.init(menuEl, {
        position: "bottom-left",
        fabIcon: "gear",
        items: buildItems(),
        onItemClick: handleItem,
      });

      K?.initComponents?.(document.getElementById(FAB_MENU_LAYER_ID) ?? menuEl);

      K?.IconManager?.processIconsInContainer?.(menuEl);
      K?.IconManager?.forceDisplayIcons?.();
    };

    void boot();

    return () => {
      cancelled = true;
      const menuEl = document.getElementById(SETTINGS_FAB_MENU_ID);
      window.K?.ButtonFabMenu?.getInstance(menuEl as HTMLElement)?.destroy?.();
      const aiFab = document.getElementById("startpage-ai-tools-fab-menu");
      if (!aiFab) document.body.classList.remove("has-fab-menu");
    };
  }, [k3ready, t, i18n.language]);

  return createPortal(
    <div className="fab-menu-layer" id={FAB_MENU_LAYER_ID}>
      <div className="fab-menu-layer__slot fab-menu-layer__slot--bottom-left">
        <div
          id={SETTINGS_FAB_MENU_ID}
          className="button-fab-menu no-autoinit startpage-settings-fab"
          data-position="bottom-left"
          data-fab-icon="gear"
          aria-label={t("settingsFab.title")}
        />
      </div>
    </div>,
    document.body
  );
}
