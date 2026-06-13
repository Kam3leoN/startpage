import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CATEGORIES, type Category } from "../data/favorites";
import type { CustomShortcut } from "../types/shortcuts";

interface Props {
  shortcuts: CustomShortcut[];
  onAdd: (input: Omit<CustomShortcut, "id">) => boolean;
  onUpdate: (id: string, input: Omit<CustomShortcut, "id">) => boolean;
  onRemove: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
}

const EMPTY_FORM = {
  label: "",
  url: "",
  icon: "",
  color: "#6750A4",
  tags: ["infos"] as Category[],
};

export function CustomShortcutsEditor({
  shortcuts,
  onAdd,
  onUpdate,
  onRemove,
  onExport,
  onImport,
}: Props) {
  const { t } = useTranslation();
  const importRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<"ok" | "fail" | null>(null);

  const toggleTag = (tag: Category) => {
    setForm((prev) => {
      const has = prev.tags.includes(tag);
      const tags = has ? prev.tags.filter((tg) => tg !== tag) : [...prev.tags, tag];
      return { ...prev, tags: tags.length ? tags : prev.tags };
    });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label: form.label,
      url: form.url,
      icon: form.icon || undefined,
      color: form.color || undefined,
      tags: form.tags,
    };
    const ok = editingId ? onUpdate(editingId, payload) : onAdd(payload);
    if (!ok) {
      setError(t("shortcuts.errorInvalid"));
      return;
    }
    resetForm();
  };

  const startEdit = (shortcut: CustomShortcut) => {
    setEditingId(shortcut.id);
    setForm({
      label: shortcut.label,
      url: shortcut.url,
      icon: shortcut.icon ?? "",
      color: shortcut.color ?? "#6750A4",
      tags: shortcut.tags,
    });
    setError(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ok = await onImport(file);
    setImportStatus(ok ? "ok" : "fail");
    window.setTimeout(() => setImportStatus(null), 2500);
  };

  return (
    <div className="shortcuts-editor">
      {shortcuts.length > 0 && (
        <ul className="shortcuts-editor__list" aria-label={t("shortcuts.listLabel")}>
          {shortcuts.map((s) => (
            <li key={s.id} className="shortcuts-editor__item">
              <div className="shortcuts-editor__item-main">
                <span className="shortcuts-editor__item-label">{s.label}</span>
                <span className="shortcuts-editor__item-url">{s.url}</span>
              </div>
              <div className="shortcuts-editor__item-actions">
                <button type="button" className="shortcuts-editor__btn" onClick={() => startEdit(s)}>
                  {t("shortcuts.edit")}
                </button>
                <button
                  type="button"
                  className="shortcuts-editor__btn shortcuts-editor__btn--danger"
                  onClick={() => onRemove(s.id)}
                >
                  {t("shortcuts.remove")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="shortcuts-editor__form" onSubmit={handleSubmit}>
        <div className="sheet__label">
          {editingId ? t("shortcuts.editTitle") : t("shortcuts.addTitle")}
        </div>

        <label className="sheet__field">
          <span className="sheet__field-label">{t("shortcuts.label")}</span>
          <input
            className="sheet__input"
            type="text"
            value={form.label}
            placeholder={t("shortcuts.labelPlaceholder")}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            required
          />
        </label>

        <label className="sheet__field">
          <span className="sheet__field-label">{t("shortcuts.url")}</span>
          <input
            className="sheet__input"
            type="url"
            inputMode="url"
            value={form.url}
            placeholder={t("shortcuts.urlPlaceholder")}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            required
          />
        </label>

        <label className="sheet__field">
          <span className="sheet__field-label">{t("shortcuts.icon")}</span>
          <input
            className="sheet__input"
            type="url"
            inputMode="url"
            value={form.icon}
            placeholder={t("shortcuts.iconPlaceholder")}
            onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
          />
        </label>

        <label className="sheet__field shortcuts-editor__color">
          <span className="sheet__field-label">{t("shortcuts.color")}</span>
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
            aria-label={t("shortcuts.color")}
          />
        </label>

        <div className="sheet__field">
          <span className="sheet__field-label">{t("shortcuts.categories")}</span>
          <div className="shortcuts-editor__tags" role="group" aria-label={t("shortcuts.categories")}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className="chip"
                aria-pressed={form.tags.includes(cat)}
                onClick={() => toggleTag(cat)}
              >
                {t(`filters.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="shortcuts-editor__error">{error}</p>}

        <div className="shortcuts-editor__form-actions">
          <button type="submit" className="shortcuts-editor__submit">
            {editingId ? t("shortcuts.save") : t("shortcuts.add")}
          </button>
          {editingId && (
            <button type="button" className="shortcuts-editor__btn" onClick={resetForm}>
              {t("shortcuts.cancel")}
            </button>
          )}
        </div>
      </form>

      <div className="shortcuts-editor__io">
        <button type="button" className="shortcuts-editor__btn" onClick={onExport}>
          {t("shortcuts.export")}
        </button>
        <button type="button" className="shortcuts-editor__btn" onClick={() => importRef.current?.click()}>
          {t("shortcuts.import")}
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImport}
        />
      </div>
      {importStatus === "ok" && <p className="shortcuts-editor__status">{t("shortcuts.importOk")}</p>}
      {importStatus === "fail" && <p className="shortcuts-editor__error">{t("shortcuts.importFail")}</p>}
    </div>
  );
}
