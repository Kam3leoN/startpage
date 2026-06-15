import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DeckSlot } from "../types/deck";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { resolveSlotMonogram, resolveSlotVisualMode } from "../utils/deckMonogram";
import { readDeckSwitch } from "../utils/deckSwitchStorage";

export interface DeckSlotActions {
  onSearch: () => void;
  onNavigatePage: (pageId: string) => void;
  onNavigateBack: () => void;
  onNavigateLinked: (pageId: string) => void;
  onExecuteSlot: (slot: DeckSlot) => void;
}

type DeckSlotMenuKind = "empty" | "category" | "shortcut";

interface Props {
  slot: DeckSlot;
  slotIndex: number;
  pageId: string;
  k3ready: boolean;
  actions: DeckSlotActions;
  onMenuAction: (actionId: string) => void;
}

type K3MenuElement = HTMLElement & { __triggerElement?: HTMLElement };

function setMenuTriggerElement(menuEl: HTMLElement, trigger: HTMLElement): void {
  (menuEl as K3MenuElement).__triggerElement = trigger;
}

function menuKindForSlot(slot: DeckSlot): DeckSlotMenuKind | null {
  if (slot.kind === "empty") return "empty";
  if (slot.kind === "category") return "category";
  if (slot.kind === "link" || slot.kind === "search" || slot.kind === "switch") return "shortcut";
  return null;
}

function useDeckSlotK3Menu(
  hostRef: React.RefObject<HTMLDivElement | null>,
  opts: {
    k3ready: boolean;
    menuKind: DeckSlotMenuKind | null;
    menuId: string;
    onMenuAction: (actionId: string) => void;
    onPrimaryClick: () => void;
  }
) {
  const onMenuActionRef = useRef(opts.onMenuAction);
  onMenuActionRef.current = opts.onMenuAction;
  const onPrimaryClickRef = useRef(opts.onPrimaryClick);
  onPrimaryClickRef.current = opts.onPrimaryClick;
  const menuReadyRef = useRef(false);

  const initMenu = useCallback(async () => {
    if (menuReadyRef.current || !hostRef.current) return;

    const menuEl = hostRef.current.querySelector("k3ui-menu") as HTMLElement | null;
    const triggerEl = hostRef.current.querySelector('[slot="trigger"]') as HTMLButtonElement | null;
    if (!menuEl || !triggerEl) return;

    if (!window.K?.Menu?.init) {
      await initK3UISubtree(hostRef.current);
    }

    const K = window.K;
    K?.Menu?.getInstance(menuEl)?.destroy?.();
    setMenuTriggerElement(menuEl, triggerEl);
    K?.Menu?.init(menuEl, {
      placement: "bottom",
      onItemClick: (item) => {
        if (item?.id) onMenuActionRef.current(item.id);
      },
    });
    menuReadyRef.current = true;
  }, [hostRef]);

  useLayoutEffect(() => {
    if (!opts.k3ready || !opts.menuKind || !hostRef.current) return;

    const menuEl = hostRef.current.querySelector("k3ui-menu") as HTMLElement | null;
    const triggerEl = hostRef.current.querySelector('[slot="trigger"]') as HTMLButtonElement | null;
    if (!menuEl || !triggerEl) return;

    menuReadyRef.current = false;

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      void initMenu().then(() => {
        window.K?.Menu?.getInstance(menuEl)?.open?.();
      });
    };

    const onTriggerClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onPrimaryClickRef.current();
    };

    const onDomItemClick = (event: Event) => {
      const id = (event as CustomEvent<{ item?: { id?: string } }>).detail?.item?.id;
      if (id) onMenuActionRef.current(id);
    };

    triggerEl.addEventListener("contextmenu", onContextMenu);
    triggerEl.addEventListener("click", onTriggerClick, true);
    menuEl.addEventListener("onItemClick", onDomItemClick);

    return () => {
      menuReadyRef.current = false;
      triggerEl.removeEventListener("contextmenu", onContextMenu);
      triggerEl.removeEventListener("click", onTriggerClick, true);
      menuEl.removeEventListener("onItemClick", onDomItemClick);
      window.K?.Menu?.getInstance(menuEl)?.destroy?.();
    };
  }, [hostRef, initMenu, opts.k3ready, opts.menuKind, opts.menuId]);
}

/**
 * Bouton Stream Deck — clic gauche : action ; clic droit : k3ui-menu.
 */
export function DeckSlotButton({
  slot,
  slotIndex,
  pageId,
  k3ready,
  actions,
  onMenuAction,
}: Props) {
  const { t } = useTranslation();
  const hostRef = useRef<HTMLDivElement>(null);
  const [switchOn, setSwitchOn] = useState(() =>
    slot.kind === "switch" && slot.switchId ? readDeckSwitch(slot.switchId) : false
  );

  const menuKind = menuKindForSlot(slot);
  const menuId = `deck-slot-menu-${pageId}-${slotIndex}`;

  const menuItems = useMemo(() => {
    if (!menuKind) return [];
    if (menuKind === "empty") {
      return [
        { id: "add-category", label: t("deck.menu.addCategory") },
        { id: "add-shortcut", label: t("deck.menu.addShortcut") },
      ];
    }
    if (menuKind === "category") {
      return [
        { id: "edit-category", label: t("deck.menu.editCategory") },
        { id: "delete-category", label: t("deck.menu.deleteCategory") },
      ];
    }
    return [
      { id: "edit-shortcut", label: t("deck.menu.editShortcut") },
      { id: "delete-shortcut", label: t("deck.menu.deleteShortcut") },
    ];
  }, [menuKind, t]);

  const handlePrimaryClick = () => {
    if (slot.kind === "empty") return;
    actions.onExecuteSlot(slot);
    if (slot.kind === "switch" && slot.switchId) {
      setSwitchOn(readDeckSwitch(slot.switchId));
    }
  };

  useDeckSlotK3Menu(hostRef, {
    k3ready,
    menuKind,
    menuId,
    onMenuAction,
    onPrimaryClick: handlePrimaryClick,
  });

  const label = resolveLabel(slot, t);
  const style = slot.backgroundColor ? { backgroundColor: slot.backgroundColor } : undefined;
  const isSwitch = slot.kind === "switch" && slot.switchId;
  const isMonogramVisual = resolveSlotVisualMode(slot) === "monogram";
  const slotClass = `deck-slot deck-slot--${slot.kind}${isSwitch && switchOn ? " deck-slot--switch-on" : ""}${isMonogramVisual ? " deck-slot--monogram-visual" : ""}`;

  if (!menuKind) {
    return (
      <button type="button" className={slotClass} style={style} aria-label={label} onClick={handlePrimaryClick}>
        <span className="deck-slot__inner">
          {renderSlotVisual(slot)}
          {label && <span className="deck-slot__label">{label}</span>}
        </span>
      </button>
    );
  }

  const innerContent =
    slot.kind === "empty" ? null : isSwitch ? (
      <>
        {renderSlotVisual(slot)}
        {label && <span className="deck-slot__label">{label}</span>}
        <span className="deck-slot__switch-state">{switchOn ? "ON" : "OFF"}</span>
      </>
    ) : (
      <>
        {renderSlotVisual(slot)}
        {label && <span className="deck-slot__label">{label}</span>}
      </>
    );

  return (
    <div ref={hostRef} className="deck-slot-host">
      <k3ui-menu
        id={menuId}
        class="no-autoinit deck-slot-menu-host"
        data-placement="bottom"
        data-close-on-click="true"
      >
        <button
          type="button"
          slot="trigger"
          className={slotClass}
          style={slot.kind === "empty" ? undefined : style}
          aria-label={slot.kind === "empty" ? t("deck.emptySlot") : label}
          aria-pressed={isSwitch ? switchOn : undefined}
        >
          <span className="deck-slot__inner">{innerContent}</span>
        </button>
        {menuItems.map((item) => (
          <menu-item key={item.id} data-id={item.id} data-label={item.label} />
        ))}
      </k3ui-menu>
    </div>
  );
}

function renderSlotVisual(slot: DeckSlot) {
  if (resolveSlotVisualMode(slot) === "icon" && slot.icon) {
    return (
      <img
        className="deck-slot__icon"
        src={slot.icon}
        alt=""
        width={44}
        height={44}
        decoding="async"
      />
    );
  }

  const monogram = resolveSlotMonogram(slot);
  if (monogram) {
    return (
      <span className="deck-slot__monogram" aria-hidden>
        {monogram}
      </span>
    );
  }

  if (slot.kind === "switch") {
    return <span className="deck-slot__switch-pill" aria-hidden />;
  }

  return null;
}

function resolveLabel(
  slot: DeckSlot,
  t: (key: string, opts?: { defaultValue?: string }) => string
): string {
  if (slot.label) return slot.label;
  if (slot.kind === "search") return t("search.tile");
  return "";
}
