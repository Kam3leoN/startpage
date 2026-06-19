import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { DeckCategoryEditorValues, DeckSlotAction, DeckSlotEditorValues, DeckSlotVisual } from "../types/deck";
import { listDeckCallbackIds } from "../utils/deckCallbacks";
import { defaultMonogramFromLabel, sanitizeMonogram } from "../utils/deckMonogram";
import { readImageAsDataUrl } from "../utils/imageUpload";
import { CloseIcon } from "./icons";
import { K3IconButton } from "./K3IconButton";
import { K3OutlinedField } from "./K3OutlinedField";

export type DeckEditorMode =
  | "add-category"
  | "edit-category"
  | "add-shortcut"
  | "edit-shortcut";

const DEFAULT_PICKER_COLOR = "#6750A4";

interface Props {
  open: boolean;
  mode: DeckEditorMode;
  initial?: Partial<DeckSlotEditorValues & DeckCategoryEditorValues>;
  onClose: () => void;
  onSaveCategory: (values: DeckCategoryEditorValues) => void;
  onSaveShortcut: (values: DeckSlotEditorValues) => void;
}

const ACTION_TYPES: DeckSlotAction["type"][] = ["url", "search", "switch", "callback"];

/**
 * Éditeur de case : icône, label, couleur, action (URL / recherche / switch / callback).
 */
export function DeckSlotEditorDialog({
  open,
  mode,
  initial,
  onClose,
  onSaveCategory,
  onSaveShortcut,
}: Props) {
  const { t } = useTranslation();
  const isCategory = mode === "add-category" || mode === "edit-category";

  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<string | undefined>();
  const [monogram, setMonogram] = useState("");
  const [useDefaultMonogram, setUseDefaultMonogram] = useState(true);
  const [slotVisual, setSlotVisual] = useState<DeckSlotVisual>("monogram");
  const [useDefaultColor, setUseDefaultColor] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_PICKER_COLOR);
  const [actionType, setActionType] = useState<DeckSlotAction["type"]>("url");
  const [url, setUrl] = useState("https://");
  const [switchId, setSwitchId] = useState("");
  const [callbackId, setCallbackId] = useState("");

  useEffect(() => {
    if (!open) return;
    setLabel(initial?.label ?? "");
    setIcon(initial?.icon);
    const hasCustomMonogram = Boolean(initial?.monogram);
    setUseDefaultMonogram(!hasCustomMonogram);
    setMonogram(initial?.monogram ?? defaultMonogramFromLabel(initial?.label ?? ""));
    setSlotVisual(initial?.slotVisual ?? (initial?.icon ? "icon" : "monogram"));
    const hasCustomColor = Boolean(initial?.backgroundColor);
    setUseDefaultColor(!hasCustomColor);
    setBackgroundColor(initial?.backgroundColor ?? DEFAULT_PICKER_COLOR);
    const action = initial?.action;
    setActionType(action?.type ?? "url");
    setUrl(action?.url ?? "https://");
    setSwitchId(action?.switchId ?? "");
    setCallbackId(action?.callbackId ?? listDeckCallbackIds()[0] ?? "");
  }, [open, initial, mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const root = document.querySelector(".deck-editor");
      if (root instanceof HTMLElement) {
        window.K?.IconManager?.processIconsInContainer?.(root);
        window.K?.IconManager?.forceDisplayIcons?.();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const title = t(`deck.editor.${mode}`);
  const resolvedBackgroundColor = useDefaultColor ? undefined : backgroundColor;
  const resolvedMonogram = useDefaultMonogram ? undefined : sanitizeMonogram(monogram);
  const resolvedSlotVisual: DeckSlotVisual = icon ? slotVisual : "monogram";

  const handleIcon = async (file: File | null) => {
    if (!file) {
      setIcon(undefined);
      return;
    }
    const data = await readImageAsDataUrl(file, 256 * 1024);
    if (data) {
      setIcon(data);
      setSlotVisual("icon");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!label.trim()) return;

    if (isCategory) {
      onSaveCategory({
        label: label.trim(),
        icon,
        monogram: resolvedMonogram,
        slotVisual: resolvedSlotVisual,
        backgroundColor: resolvedBackgroundColor,
      });
      return;
    }

    const action: DeckSlotAction =
      actionType === "search"
        ? { type: "search" }
        : actionType === "switch"
          ? { type: "switch", switchId: switchId.trim() || label.trim() }
          : actionType === "callback"
            ? { type: "callback", callbackId: callbackId.trim() }
            : { type: "url", url: url.trim() };

    onSaveShortcut({
      label: label.trim(),
      icon,
      monogram: resolvedMonogram,
      slotVisual: resolvedSlotVisual,
      backgroundColor: resolvedBackgroundColor,
      action,
    });
  };

  const callbackOptions = listDeckCallbackIds();

  return (
    <div className="deck-editor-backdrop" role="presentation" onClick={onClose}>
      <form
        className="deck-editor"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <header className="deck-editor__header">
          <h2 className="deck-editor__title">{title}</h2>
          <K3IconButton variant="standard" size="md" label={t("deck.editor.close")} onClick={onClose}>
            <CloseIcon width={20} height={20} />
          </K3IconButton>
        </header>

        <div className="deck-editor__body">
          <K3OutlinedField
            name="deck-slot-label"
            label={t("deck.editor.label")}
            value={label}
            onChange={(value) => {
              setLabel(value);
              if (useDefaultMonogram && !icon) {
                setMonogram(defaultMonogramFromLabel(value));
              }
            }}
          />

          <div className="deck-editor__field-label">{t("deck.editor.visual")}</div>
          <div className="deck-editor__visual-row">
            <button
              type="button"
              className={`btn btn--sm ripple ${slotVisual === "icon" ? "btn--filled btn--primary" : "btn--outlined"}`}
              disabled={!icon}
              onClick={() => setSlotVisual("icon")}
            >
              {t("deck.editor.visualIcon")}
            </button>
            <button
              type="button"
              className={`btn btn--sm ripple ${slotVisual === "monogram" ? "btn--filled btn--primary" : "btn--outlined"}`}
              onClick={() => setSlotVisual("monogram")}
            >
              {t("deck.editor.visualMonogram")}
            </button>
          </div>

          <div className="deck-editor__field-label">{t("deck.editor.monogram")}</div>
          <div className="deck-editor__monogram-row">
            {useDefaultMonogram ? (
              <span className="deck-editor__color-default">
                {t("deck.editor.monogramDefault", { value: defaultMonogramFromLabel(label) })}
              </span>
            ) : (
              <K3OutlinedField
                name="deck-slot-monogram"
                label={t("deck.editor.monogramField")}
                value={monogram}
                onChange={(value) => setMonogram(sanitizeMonogram(value) ?? "")}
              />
            )}
            {useDefaultMonogram ? (
              <button
                type="button"
                className="btn btn--outlined btn--sm ripple"
                onClick={() => {
                  setUseDefaultMonogram(false);
                  setMonogram(sanitizeMonogram(monogram) ?? defaultMonogramFromLabel(label));
                }}
              >
                {t("deck.editor.monogramCustomize")}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--text btn--sm ripple"
                onClick={() => setUseDefaultMonogram(true)}
              >
                {t("deck.editor.monogramReset")}
              </button>
            )}
          </div>

          <div className="deck-editor__field-label">{t("deck.editor.color")}</div>
          <div className="deck-editor__color-row">
            {useDefaultColor ? (
              <span className="deck-editor__color-default">{t("deck.editor.colorDefault")}</span>
            ) : (
              <input
                type="color"
                className="deck-editor__color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                aria-label={t("deck.editor.color")}
              />
            )}
            {useDefaultColor ? (
              <button
                type="button"
                className="btn btn--outlined btn--sm ripple"
                onClick={() => setUseDefaultColor(false)}
              >
                {t("deck.editor.colorCustomize")}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn--text btn--sm ripple"
                  onClick={() => setUseDefaultColor(true)}
                >
                  {t("deck.editor.colorReset")}
                </button>
              </>
            )}
          </div>

          <div className="deck-editor__icon-row">
            <label className="btn btn--outlined btn--sm ripple deck-editor__upload">
              {t("deck.editor.icon")}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="deck-editor__upload-input"
                onChange={(e) => void handleIcon(e.target.files?.[0] ?? null)}
              />
            </label>
            {icon && (
              <>
                <img className="deck-editor__icon-preview" src={icon} alt="" width={40} height={40} />
                <K3IconButton
                  variant="standard"
                  size="md"
                  label={t("deck.editor.removeIcon")}
                  onClick={() => {
                    setIcon(undefined);
                    setSlotVisual("monogram");
                    setUseDefaultMonogram(true);
                    setMonogram(defaultMonogramFromLabel(label));
                  }}
                >
                  <CloseIcon width={20} height={20} />
                </K3IconButton>
              </>
            )}
          </div>

          {!isCategory && (
            <>
              <label className="deck-editor__field-label" htmlFor="deck-action-type">
                {t("deck.editor.action")}
              </label>
              <select
                id="deck-action-type"
                className="deck-editor__select"
                value={actionType}
                onChange={(e) => setActionType(e.target.value as DeckSlotAction["type"])}
              >
                {ACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`deck.editor.actionTypes.${type}`)}
                  </option>
                ))}
              </select>

              {actionType === "url" && (
                <K3OutlinedField
                  name="deck-slot-url"
                  label={t("deck.editor.url")}
                  value={url}
                  onChange={setUrl}
                />
              )}

              {actionType === "switch" && (
                <K3OutlinedField
                  name="deck-slot-switch-id"
                  label={t("deck.editor.switchId")}
                  value={switchId}
                  onChange={setSwitchId}
                />
              )}

              {actionType === "callback" && (
                <label className="deck-editor__field-label" htmlFor="deck-callback-id">
                  {t("deck.editor.callback")}
                </label>
              )}
              {actionType === "callback" && (
                <select
                  id="deck-callback-id"
                  className="deck-editor__select"
                  value={callbackId}
                  onChange={(e) => setCallbackId(e.target.value)}
                >
                  {callbackOptions.length === 0 && (
                    <option value="">{t("deck.editor.noCallbacks")}</option>
                  )}
                  {callbackOptions.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>

        <footer className="deck-editor__footer">
          <button type="button" className="btn btn--text btn--sm ripple" onClick={onClose}>
            {t("shortcuts.cancel")}
          </button>
          <button type="submit" className="btn btn--filled btn--sm btn--primary ripple">
            {t("shortcuts.save")}
          </button>
        </footer>
      </form>
    </div>
  );
}
