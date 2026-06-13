import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CategoryDef } from "../data/categories";
import type { Category } from "../data/favorites";
import type { CustomShortcut } from "../types/shortcuts";
import { readImageAsDataUrl } from "../utils/imageUpload";
import { K3OutlinedField } from "./K3OutlinedField";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PenIcon,
  TrashIcon,
} from "./icons";

interface Props {
  categories: CategoryDef[];
  fallbackCategoryId: string;
  shortcuts: CustomShortcut[];
  onAddCategory: (label: string) => CategoryDef | null;
  onUpdateCategory: (id: string, label: string) => boolean;
  onRemoveCategory: (id: string) => boolean;
  onMoveCategory: (id: string, delta: -1 | 1) => boolean;
  onMoveShortcut: (id: string, delta: -1 | 1) => boolean;
  onRemoveShortcut: (id: string) => void;
  onSubmit: (input: Omit<CustomShortcut, "id">) => boolean;
  onCancel: () => void;
}

/** Add-shortcut form used inside ShortcutDialog. */
export function ShortcutForm({
  categories,
  fallbackCategoryId,
  shortcuts,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
  onMoveCategory,
  onMoveShortcut,
  onRemoveShortcut,
  onSubmit,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<Category[]>([fallbackCategoryId]);
  const [iconDataUrl, setIconDataUrl] = useState<string | null>(null);
  const [iconName, setIconName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  useEffect(() => {
    setTags((prev) => {
      const valid = prev.filter((id) => categories.some((c) => c.id === id));
      return valid.length ? valid : [fallbackCategoryId];
    });
  }, [categories, fallbackCategoryId]);

  const toggleTag = (tag: Category) => {
    setTags((prev) => {
      const has = prev.includes(tag);
      const next = has ? prev.filter((tg) => tg !== tag) : [...prev, tag];
      return next.length ? next : prev;
    });
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setIconDataUrl(null);
      setIconName(null);
      return;
    }
    const dataUrl = await readImageAsDataUrl(file);
    if (!dataUrl) {
      setError(t("shortcuts.iconTooLarge"));
      e.target.value = "";
      return;
    }
    setError(null);
    setIconDataUrl(dataUrl);
    setIconName(file.name);
  };

  const clearIcon = () => {
    setIconDataUrl(null);
    setIconName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCreateCategory = () => {
    const created = onAddCategory(newCategoryLabel);
    if (!created) return;
    setNewCategoryLabel("");
    setTags((prev) => (prev.includes(created.id) ? prev : [...prev, created.id]));
  };

  const startEdit = (cat: CategoryDef) => {
    setEditingId(cat.id);
    setEditingLabel(cat.label);
  };

  const commitEdit = () => {
    if (!editingId) return;
    if (!onUpdateCategory(editingId, editingLabel)) return;
    setEditingId(null);
    setEditingLabel("");
  };

  const handleRemoveCategory = (id: string) => {
    if (!onRemoveCategory(id)) return;
    setTags((prev) => {
      const next = prev.filter((tg) => tg !== id);
      return next.length ? next : [fallbackCategoryId];
    });
    if (editingId === id) {
      setEditingId(null);
      setEditingLabel("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label: label.trim(),
      url: url.trim(),
      icon: iconDataUrl || undefined,
      tags,
    };
    const ok = onSubmit(payload);
    if (!ok) {
      setError(t("shortcuts.errorInvalid"));
      return;
    }
    setLabel("");
    setUrl("");
    setTags([fallbackCategoryId]);
    clearIcon();
    setError(null);
  };

  return (
    <form ref={formRef} className="shortcut-form" onSubmit={handleSubmit}>
      <K3OutlinedField
        name="shortcut-label"
        label={t("shortcuts.label")}
        placeholder={t("shortcuts.labelPlaceholder")}
        value={label}
        onChange={setLabel}
        autoFocus
      />

      <K3OutlinedField
        name="shortcut-url"
        label={t("shortcuts.url")}
        placeholder={t("shortcuts.urlPlaceholder")}
        type="url"
        value={url}
        onChange={setUrl}
      />

      <div className="shortcut-form__icon">
        <span className="sheet__field-label">{t("shortcuts.icon")}</span>
        <div className="shortcut-form__icon-row">
          <label className="shortcut-form__upload btn btn--outlined btn--sm ripple">
            {t("shortcuts.iconChoose")}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="shortcut-form__upload-input"
              onChange={handleIconChange}
            />
          </label>
          {iconName && (
            <button type="button" className="btn btn--text btn--sm ripple" onClick={clearIcon}>
              {t("shortcuts.iconClear")}
            </button>
          )}
        </div>
        {iconDataUrl && (
          <img className="shortcut-form__icon-preview" src={iconDataUrl} alt="" width={48} height={48} />
        )}
        <p className="shortcut-form__icon-hint">{t("shortcuts.iconHint")}</p>
      </div>

      <div className="sheet__field">
        <span className="sheet__field-label">{t("shortcuts.categories")}</span>
        <div className="shortcut-form__tags" role="group" aria-label={t("shortcuts.categories")}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="chip"
              aria-pressed={tags.includes(cat.id)}
              onClick={() => toggleTag(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shortcut-form__category-crud">
        <span className="sheet__field-label">{t("shortcuts.manageCategories")}</span>
        <ul className="shortcut-form__category-list">
          {categories.map((cat, index) => (
            <li key={cat.id} className="shortcut-form__category-item">
              {editingId === cat.id ? (
                <K3OutlinedField
                  key={cat.id}
                  className="shortcut-form__category-edit-field"
                  fieldClassName="k3-field--label-sr-only"
                  name={`category-edit-${cat.id}`}
                  label={t("shortcuts.edit")}
                  value={editingLabel}
                  onChange={setEditingLabel}
                  autoFocus
                  onEnter={commitEdit}
                  onEscape={() => {
                    setEditingId(null);
                    setEditingLabel("");
                  }}
                />
              ) : (
                <span className="shortcut-form__category-name">{cat.label}</span>
              )}
              <div className="shortcut-form__category-actions">
                <button
                  type="button"
                  className="iconbtn iconbtn--sm"
                  onClick={() => onMoveCategory(cat.id, -1)}
                  disabled={index === 0}
                  aria-label={t("a11y.moveUp")}
                >
                  <ChevronUpIcon aria-hidden />
                </button>
                <button
                  type="button"
                  className="iconbtn iconbtn--sm"
                  onClick={() => onMoveCategory(cat.id, 1)}
                  disabled={index === categories.length - 1}
                  aria-label={t("a11y.moveDown")}
                >
                  <ChevronDownIcon aria-hidden />
                </button>
                {editingId === cat.id ? (
                  <button type="button" className="iconbtn iconbtn--sm" onClick={commitEdit} aria-label={t("shortcuts.save")}>
                    <PenIcon aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="iconbtn iconbtn--sm"
                    onClick={() => startEdit(cat)}
                    aria-label={t("shortcuts.edit")}
                  >
                    <PenIcon aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  className="iconbtn iconbtn--sm"
                  onClick={() => handleRemoveCategory(cat.id)}
                  disabled={categories.length <= 1}
                  aria-label={t("shortcuts.remove")}
                >
                  <TrashIcon aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="shortcut-form__category-add">
          <K3OutlinedField
            className="shortcut-form__category-field"
            name="new-category"
            label={t("shortcuts.newCategoryLabel")}
            placeholder={t("shortcuts.newCategoryPlaceholder")}
            value={newCategoryLabel}
            onChange={setNewCategoryLabel}
            onEnter={handleCreateCategory}
          />
          <button type="button" className="btn btn--outlined btn--sm ripple" onClick={handleCreateCategory}>
            {t("shortcuts.addCategory")}
          </button>
        </div>
      </div>

      {shortcuts.length > 0 && (
        <div className="shortcut-form__shortcut-order">
          <span className="sheet__field-label">{t("shortcuts.orderTitle")}</span>
          <ul className="shortcut-form__category-list">
            {shortcuts.map((shortcut, index) => (
              <li key={shortcut.id} className="shortcut-form__category-item">
                <span className="shortcut-form__category-name">{shortcut.label}</span>
                <div className="shortcut-form__category-actions">
                  <button
                    type="button"
                    className="iconbtn iconbtn--sm"
                    onClick={() => onMoveShortcut(shortcut.id, -1)}
                    disabled={index === 0}
                    aria-label={t("a11y.moveUp")}
                  >
                    <ChevronUpIcon aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="iconbtn iconbtn--sm"
                    onClick={() => onMoveShortcut(shortcut.id, 1)}
                    disabled={index === shortcuts.length - 1}
                    aria-label={t("a11y.moveDown")}
                  >
                    <ChevronDownIcon aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="iconbtn iconbtn--sm"
                    onClick={() => onRemoveShortcut(shortcut.id)}
                    aria-label={t("shortcuts.remove")}
                  >
                    <TrashIcon aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="shortcut-form__error">{error}</p>}

      <div className="dialog-footer">
        <div className="dialog-action-right">
          <button type="button" className="btn btn--text btn--sm ripple" onClick={onCancel}>
            {t("shortcuts.cancel")}
          </button>
          <button type="submit" className="btn btn--filled btn--sm btn--primary ripple">
            {t("shortcuts.add")}
          </button>
        </div>
      </div>
    </form>
  );
}
