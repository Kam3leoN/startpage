import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { AI_TOOLS } from "../data/aiTools";
import { AI_TOOLS_FAB_MENU_ID, FAB_MENU_LAYER_ID } from "../config/fabMenu";
import { initK3UISubtree } from "../utils/k3uiDeferred";

interface Props {
  k3ready: boolean;
}

/** FAB speed-dial AI-Tools — bas droite, pattern ButtonFabMenu K3UI. */
export function AiToolsBar({ k3ready }: Props) {
  const { t, i18n } = useTranslation();
  const [layerEl, setLayerEl] = useState<HTMLElement | null>(() =>
    typeof document !== "undefined" ? document.getElementById(FAB_MENU_LAYER_ID) : null
  );

  useEffect(() => {
    const existing = document.getElementById(FAB_MENU_LAYER_ID);
    if (existing) {
      setLayerEl(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const layer = document.getElementById(FAB_MENU_LAYER_ID);
      if (layer) {
        setLayerEl(layer);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: false });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!k3ready || !layerEl) return;

    let cancelled = false;

    const boot = async () => {
      const menuEl = document.getElementById(AI_TOOLS_FAB_MENU_ID);
      if (!menuEl) return;

      document.body.classList.add("has-fab-menu");

      await initK3UISubtree(menuEl);
      if (cancelled) return;

      const K = window.K;
      const items = AI_TOOLS.map((tool) => ({
        id: tool.id,
        label: tool.label,
        icon: tool.icon,
      }));

      K?.ButtonFabMenu?.getInstance(menuEl)?.destroy?.();

      K?.ButtonFabMenu?.init(menuEl, {
        position: "bottom-right",
        fabIcon: "add",
        items,
        onItemClick: (item) => {
          const tool = AI_TOOLS.find((entry) => entry.id === item.id);
          if (tool?.url) {
            window.open(tool.url, "_blank", "noopener,noreferrer");
          }
        },
      });

      K?.initComponents?.(layerEl);
      K?.IconManager?.processIconsInContainer?.(menuEl);
      K?.IconManager?.forceDisplayIcons?.();
    };

    void boot();

    return () => {
      cancelled = true;
      const menuEl = document.getElementById(AI_TOOLS_FAB_MENU_ID);
      window.K?.ButtonFabMenu?.getInstance(menuEl as HTMLElement)?.destroy?.();
    };
  }, [k3ready, layerEl, t, i18n.language]);

  if (!layerEl) return null;

  return createPortal(
    <div className="fab-menu-layer__slot fab-menu-layer__slot--bottom-right">
      <div
        id={AI_TOOLS_FAB_MENU_ID}
        className="button-fab-menu no-autoinit startpage-ai-tools-fab"
        data-position="bottom-right"
        data-fab-icon="add"
        aria-label={t("aiTools.title")}
      />
    </div>,
    layerEl
  );
}
