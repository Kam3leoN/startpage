import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry, BirthdayGender } from "../types/birthday";
import { resolveBirthYearFromDate } from "../utils/birthdayYear";
import { K3Datepicker } from "./K3Datepicker";
import { K3OutlinedField } from "./K3OutlinedField";

export type BirthdayFormMode = "add" | "edit";

interface Props {
  open: boolean;
  k3ready: boolean;
  mode: BirthdayFormMode;
  date: Date;
  entry?: BirthdayEntry | null;
  onClose: () => void;
  onAdd: (input: Omit<BirthdayEntry, "id">) => BirthdayEntry | null;
  onUpdate: (
    id: string,
    patch: Partial<Pick<BirthdayEntry, "name" | "day" | "month" | "year">> & {
      gender?: BirthdayGender | null;
    }
  ) => boolean;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function entryToDate(entry: BirthdayEntry): Date {
  const year = entry.year ?? 2000;
  return new Date(year, entry.month - 1, entry.day);
}

/**
 * Dialog d'ajout / édition — overlay React contrôlé (même modèle que SettingsSheet).
 * Backdrop non dismissible pendant le premier tick (évite mouseup click-through).
 */
export function BirthdayFormDialog({
  open,
  k3ready: _k3ready,
  mode,
  date,
  entry,
  onClose,
  onAdd,
  onUpdate,
}: Props) {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<BirthdayGender | undefined>();
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(() => startOfDay(date));
  const [dismissible, setDismissible] = useState(false);

  const pickerLocale = i18n.language.startsWith("fr") ? "fr-FR" : "en-US";
  const isEdit = mode === "edit" && entry != null;
  const title = isEdit ? t("weekCard.editFormTitle") : t("weekCard.formTitle");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && entry) {
      setName(entry.name);
      setGender(entry.gender);
      setBirthdayDate(entryToDate(entry));
    } else {
      setName("");
      setGender(undefined);
      setBirthdayDate(startOfDay(date));
    }
  }, [open, mode, entry, date]);

  useEffect(() => {
    if (!open) {
      setDismissible(false);
      return;
    }
    const timer = window.setTimeout(() => setDismissible(true), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggleGender = (next: BirthdayGender) => {
    setGender((current) => (current === next ? undefined : next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!birthdayDate || !name.trim()) return;

    if (isEdit && entry) {
      onUpdate(entry.id, {
        name: name.trim(),
        day: birthdayDate.getDate(),
        month: birthdayDate.getMonth() + 1,
        year: resolveBirthYearFromDate(birthdayDate),
        gender: gender ?? null,
      });
      onClose();
      return;
    }

    const created = onAdd({
      name,
      day: birthdayDate.getDate(),
      month: birthdayDate.getMonth() + 1,
      year: resolveBirthYearFromDate(birthdayDate),
      gender,
    });
    if (created) onClose();
  };

  return createPortal(
    <div
      className="birthday-overlay"
      role="presentation"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className="birthday-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="birthday-dialog__title">{title}</h2>
        <p className="birthday-dialog__lead">{t("weekCard.formLead")}</p>
        <form className="birthday-form" onSubmit={handleSubmit}>
          <K3OutlinedField
            className="birthday-form__field"
            name="birthday-name"
            label={t("weekCard.namePlaceholder")}
            placeholder={t("weekCard.namePlaceholder")}
            value={name}
            onChange={setName}
          />
          <K3Datepicker
            className="birthday-form__datepicker"
            label={t("weekCard.birthDate")}
            placeholder={t("weekCard.birthDatePlaceholder")}
            value={birthdayDate}
            onChange={setBirthdayDate}
            locale={pickerLocale}
          />
          <fieldset className="birthday-form__gender-fieldset">
            <legend className="birthday-form__gender-legend">{t("weekCard.gender")}</legend>
            <div
              className="birthday-form__gender-options"
              role="group"
              aria-label={t("weekCard.gender")}
            >
              <label
                className={`birthday-form__gender-option birthday-form__gender-option--female${gender === "female" ? " birthday-form__gender-option--checked" : ""}`}
                htmlFor="birthday-form-female"
              >
                <input
                  id="birthday-form-female"
                  type="checkbox"
                  checked={gender === "female"}
                  onChange={() => toggleGender("female")}
                />
                <span>{t("weekCard.girl")}</span>
              </label>
              <label
                className={`birthday-form__gender-option birthday-form__gender-option--male${gender === "male" ? " birthday-form__gender-option--checked" : ""}`}
                htmlFor="birthday-form-male"
              >
                <input
                  id="birthday-form-male"
                  type="checkbox"
                  checked={gender === "male"}
                  onChange={() => toggleGender("male")}
                />
                <span>{t("weekCard.boy")}</span>
              </label>
            </div>
          </fieldset>
          <div className="birthday-form__footer">
            <button type="button" className="btn btn--text btn--sm ripple" onClick={onClose}>
              {t("weekCard.cancel")}
            </button>
            <button
              type="submit"
              className="btn btn--filled btn--sm btn--primary ripple"
              disabled={!name.trim() || !birthdayDate}
            >
              {isEdit ? t("weekCard.update") : t("weekCard.save")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
