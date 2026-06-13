import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CategoryDef } from "../data/categories";
import type { CustomShortcut } from "../types/shortcuts";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { ShortcutForm } from "./ShortcutForm";

interface Props {
  open: boolean;
  k3ready: boolean;
  categories: CategoryDef[];
  fallbackCategoryId: string;
  shortcuts: CustomShortcut[];
  onAddCategory: (label: string) => CategoryDef | null;
  onUpdateCategory: (id: string, label: string) => boolean;
  onRemoveCategory: (id: string) => boolean;
  onMoveCategory: (id: string, delta: -1 | 1) => boolean;
  onMoveShortcut: (id: string, delta: -1 | 1) => boolean;
  onRemoveShortcut: (id: string) => void;
  onClose: () => void;
  onAdd: (input: Omit<CustomShortcut, "id">) => boolean;
}

const DIALOG_ID = "shortcut-add-dialog";

/** K3UI Dialog dedicated to adding and managing custom shortcuts. */
export function ShortcutDialog({
  open,
  k3ready,
  categories,
  fallbackCategoryId,
  shortcuts,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
  onMoveCategory,
  onMoveShortcut,
  onRemoveShortcut,
  onClose,
  onAdd,
}: Props) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [formKey, setFormKey] = useState(0);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) setFormKey((n) => n + 1);
  }, [open]);

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
      | (HTMLElement & { open?: () => void; close?: () => void })
      | null;
    if (!el) return;

    const openDialog = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      const instance = window.K?.Dialog?.getInstance(el);
      instance?.open?.() ?? el.open?.();
    };

    void openDialog();
  }, [open, k3ready, formKey]);

  useEffect(() => {
    if (!k3ready || open) return;
    const el = document.getElementById(DIALOG_ID) as HTMLElement | null;
    if (!el) return;
    const instance = window.K?.Dialog?.getInstance(el);
    instance?.close?.() ?? (el as HTMLElement & { close?: () => void }).close?.();
  }, [open, k3ready]);

  const handleAdd = (input: Omit<CustomShortcut, "id">) => {
    const ok = onAdd(input);
    if (ok) onClose();
    return ok;
  };

  return (
    <div ref={rootRef}>
      <k3ui-dialog id={DIALOG_ID} class="dialog no-autoinit" title={t("shortcuts.dialogTitle")}>
        <div className="dialog-content shortcut-dialog__content">
          <p className="shortcut-dialog__lead">{t("shortcuts.dialogLead")}</p>
          <ShortcutForm
            key={formKey}
            categories={categories}
            fallbackCategoryId={fallbackCategoryId}
            shortcuts={shortcuts}
            onAddCategory={onAddCategory}
            onUpdateCategory={onUpdateCategory}
            onRemoveCategory={onRemoveCategory}
            onMoveCategory={onMoveCategory}
            onMoveShortcut={onMoveShortcut}
            onRemoveShortcut={onRemoveShortcut}
            onSubmit={handleAdd}
            onCancel={onClose}
          />
        </div>
      </k3ui-dialog>
    </div>
  );
}
