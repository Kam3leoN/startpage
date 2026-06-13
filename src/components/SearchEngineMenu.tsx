import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import {
  SEARCH_ENGINES,
  isSearchEngine,
  searchEngineLabelKey,
  type SearchEngine,
} from "../utils/searchEngine";

interface Props {
  engine: SearchEngine;
  onChange: (engine: SearchEngine) => void;
}

const MENU_ID = "search-engine-menu";
const SPLIT_ID = "search-engine-split";

type K3MenuElement = HTMLElement & { __triggerElement?: HTMLElement };

/** Associe le trigger DOM au menu avant `Menu.init`. */
function setMenuTriggerElement(menuEl: HTMLElement, trigger: HTMLElement): void {
  (menuEl as K3MenuElement).__triggerElement = trigger;
}

/** Rafraîchit les icônes K3UI injectées dans un sous-arbre. */
function refreshK3UIIcons(root: HTMLElement): void {
  window.K?.IconManager?.processIconsInContainer?.(root);
  window.K?.IconManager?.forceDisplayIcons?.();
}

/** Synchronise l'état visuel expanded du chevron trailing. */
function setSplitExpanded(splitEl: HTMLElement, expanded: boolean): void {
  const trailing = splitEl.querySelector(
    ".button-split__trailing, .split-btn__trailing"
  ) as HTMLElement | null;
  if (!trailing) return;
  trailing.setAttribute("aria-expanded", String(expanded));
  trailing.classList.toggle("split-btn__trailing--expanded", expanded);
  trailing.classList.toggle("split-button__trailing--expanded", expanded);
  trailing.classList.toggle("button-split__trailing--expanded", expanded);
}

/**
 * Button-split (slot trigger) + k3ui-menu — ancrage flottant sous le split.
 * Pattern menu.php : le split est enfant direct du menu via `slot="trigger"`.
 */
export function SearchEngineMenu({ engine, onChange }: Props) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    let trailingClickCleanup: (() => void) | undefined;

    const boot = async () => {
      if (!rootRef.current) return;
      await initK3UISubtree(rootRef.current);
      if (cancelled) return;

      const menuEl = document.getElementById(MENU_ID) as HTMLElement | null;
      const splitEl = document.getElementById(SPLIT_ID) as HTMLElement | null;
      if (!menuEl || !splitEl) return;

      const K = window.K;
      const label = t(searchEngineLabelKey(engine));

      const handleItem = (item: { id?: string }) => {
        if (item?.id && isSearchEngine(item.id)) {
          onChangeRef.current(item.id);
        }
      };

      K?.Menu?.getInstance(menuEl)?.destroy?.();
      K?.ButtonSplit?.getInstance(splitEl)?.destroy?.();

      if (K?.ButtonSplit?.init) {
        K.ButtonSplit.init(splitEl, {
          label,
          variant: "tonal",
          size: "sm",
          shape: "rounded",
          iconType: "chevron",
          leadingIcon: "",
          onMainClick: () => {
            /* Leading : libellé du moteur actif uniquement. */
          },
        });
      }

      refreshK3UIIcons(splitEl);

      const trailing = splitEl.querySelector(
        ".button-split__trailing, .split-btn__trailing"
      ) as HTMLButtonElement | null;

      const leading = splitEl.querySelector(
        ".button-split__leading, .split-btn__leading"
      ) as HTMLButtonElement | null;

      if (leading) {
        leading.setAttribute("type", "button");
        leading.setAttribute("tabindex", "-1");
        leading.style.pointerEvents = "none";
      }

      /* Ancre Floating UI = button-split entier (rect visible, pas le menu-item caché). */
      setMenuTriggerElement(menuEl, splitEl);

      const dialogRoot = menuEl.closest('[role="dialog"]') as HTMLElement | null;

      if (K?.Menu?.init) {
        K.Menu.init(menuEl, {
          placement: "bottom-start",
          constrainWidth: Boolean(dialogRoot),
          container: dialogRoot,
          onItemClick: handleItem,
          onCloseEnd: () => {
            setSplitExpanded(splitEl, false);
          },
        });
      }

      if (trailing) {
        const onTrailingClick = (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          const menu = K?.Menu?.getInstance(menuEl);
          if (!menu?.open || !menu?.close) return;

          const openMenu = () => {
            if (!menu.open) return;
            menu.open();
            setSplitExpanded(splitEl, true);
          };

          if (menu.isOpen) {
            menu.close();
            setSplitExpanded(splitEl, false);
          } else {
            /* Attendre le layout (overlay animé) avant le calcul de position. */
            requestAnimationFrame(() => {
              requestAnimationFrame(openMenu);
            });
          }
        };

        trailing.addEventListener("click", onTrailingClick, true);
        trailingClickCleanup = () =>
          trailing.removeEventListener("click", onTrailingClick, true);
      }

      refreshK3UIIcons(menuEl);

      const onDomClick = (event: Event) => {
        const custom = event as CustomEvent<{ item?: { id?: string } }>;
        const id = custom.detail?.item?.id;
        if (id && isSearchEngine(id)) onChangeRef.current(id);
      };

      menuEl.addEventListener("onItemClick", onDomClick);

      return () => {
        trailingClickCleanup?.();
        menuEl.removeEventListener("onItemClick", onDomClick);
        K?.Menu?.getInstance(menuEl)?.destroy?.();
        K?.ButtonSplit?.getInstance(splitEl)?.destroy?.();
      };
    };

    let cleanup: (() => void) | undefined;
    void boot().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const splitEl = document.getElementById(SPLIT_ID);
    if (!splitEl) return;
    const label = t(searchEngineLabelKey(engine));
    splitEl.setAttribute("label", label);
    const labelEl = splitEl.querySelector(".button-split__label");
    if (labelEl) labelEl.textContent = label;
  }, [engine, t]);

  return (
    <div ref={rootRef} className="search-engine-menu navbar-select-container">
      <k3ui-menu
        id={MENU_ID}
        class="no-autoinit search-engine-menu__menu"
        data-placement="bottom-start"
        data-close-on-click="true"
      >
        <k3ui-button-split
          slot="trigger"
          id={SPLIT_ID}
          class="no-autoinit search-engine-menu__split"
          label={t(searchEngineLabelKey(engine))}
          variant="tonal"
          size="sm"
          shape="rounded"
          icon-type="chevron"
          leading-icon=""
        />
        {SEARCH_ENGINES.map((item) => (
          <menu-item
            key={item.id}
            data-id={item.id}
            data-label={t(searchEngineLabelKey(item.id))}
            {...(engine === item.id ? { "data-trailing-icon": "check" } : {})}
          />
        ))}
      </k3ui-menu>
    </div>
  );
}
