import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry, BirthdayGender } from "../types/birthday";
import { resolveBirthYearFromDate } from "../utils/birthdayYear";
import { closeK3Overlay, useK3Openable } from "../utils/k3Overlay";
import { K3Datepicker } from "./K3Datepicker";
import { K3OutlinedField } from "./K3OutlinedField";

export const BIRTHDAY_DIALOG_ID = "birthday-form-dialog";

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

export const birthdayDialogOptions = {
  dismissible: true,
  closeOnBackNavigation: false,
} as const;

/**
 * Dialog K3UI — structure M3 déclarée dans React (évite undo du wrap k3ui au re-render)
 * + createPortal(body) pour les clics React.
 */
export function BirthdayFormDialog({
  open,
  k3ready,
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

  const pickerLocale = i18n.language.startsWith("fr") ? "fr-FR" : "en-US";
  const isEdit = mode === "edit" && entry != null;
  const title = isEdit ? t("weekCard.editFormTitle") : t("weekCard.formTitle");

  useK3Openable(BIRTHDAY_DIALOG_ID, "Dialog", open, k3ready, onClose, {
    ...birthdayDialogOptions,
  });

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

  const handleClose = () => {
    void closeK3Overlay(BIRTHDAY_DIALOG_ID, "Dialog");
    onClose();
  };

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
      handleClose();
      return;
    }

    const created = onAdd({
      name,
      day: birthdayDate.getDate(),
      month: birthdayDate.getMonth() + 1,
      year: resolveBirthYearFromDate(birthdayDate),
      gender,
    });
    if (created) handleClose();
  };

  return createPortal(
    <k3ui-dialog id={BIRTHDAY_DIALOG_ID} class="dialog no-autoinit" aria-label={title}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
        </div>
        <div className="dialog-scroller">
          <div className="dialog-content birthday-form">
            <p className="birthday-dialog__lead">{t("weekCard.formLead")}</p>
            <form id="birthday-form-fields" onSubmit={handleSubmit}>
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
            </form>
          </div>
        </div>
        <div className="dialog-footer birthday-form__footer">
          <button type="button" className="btn btn--text btn--sm" onClick={handleClose}>
            {t("weekCard.cancel")}
          </button>
          <button
            type="submit"
            form="birthday-form-fields"
            className="btn btn--filled btn--sm btn--primary"
            disabled={!name.trim() || !birthdayDate}
          >
            {isEdit ? t("weekCard.update") : t("weekCard.save")}
          </button>
        </div>
      </div>
    </k3ui-dialog>,
    document.body
  );
}
