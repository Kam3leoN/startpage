import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry, BirthdayGender } from "../types/birthday";
import { resolveBirthYearFromDate } from "../utils/birthdayYear";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { K3Datepicker } from "./K3Datepicker";
import { K3OutlinedField } from "./K3OutlinedField";

const DIALOG_ID = "birthday-form-dialog";

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

type K3DialogEl = HTMLElement & {
  open?: () => void;
  close?: () => void;
};

/**
 * Dialog K3UI centré — anatomie M3 actuelle (Dialog.buildDialogMarkup / Dialog.show) :
 * ```
 * k3ui-dialog.dialog
 *   .dialog-container
 *     .dialog-header > h2
 *     .dialog-scroller > .dialog-content
 *     .dialog-footer
 * ```
 * React doit déclarer cette structure (ne pas laisser Dialog.init wrapper les nœuds,
 * sinon le reconcile React défait le DOM et open() laisse display:none).
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
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<BirthdayGender | undefined>();
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(() => startOfDay(date));

  onCloseRef.current = onClose;
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
    if (!k3ready) return;
    const el = document.getElementById(DIALOG_ID) as K3DialogEl | null;
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
    const el = document.getElementById(DIALOG_ID) as K3DialogEl | null;
    if (!el) return;

    let cancelled = false;

    const openDialog = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      if (cancelled) return;

      const K = window.K;
      if (!K?.Dialog) return;

      let instance = K.Dialog.getInstance(el);
      if (!instance) {
        K.Dialog.init(el, {
          dismissible: true,
          onCloseEnd: () => onCloseRef.current(),
        });
        instance = K.Dialog.getInstance(el);
      }

      // Laisser React committer header/content avant open (évite structure cassée)
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
      if (cancelled) return;

      instance?.open?.() ?? el.open?.();
    };

    void openDialog();
    return () => {
      cancelled = true;
    };
  }, [open, k3ready]);

  useEffect(() => {
    if (!k3ready || open) return;
    const el = document.getElementById(DIALOG_ID) as K3DialogEl | null;
    if (!el) return;
    const instance = window.K?.Dialog?.getInstance(el);
    instance?.close?.() ?? el.close?.();
  }, [open, k3ready]);

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

  return (
    <div ref={rootRef}>
      <k3ui-dialog id={DIALOG_ID} class="dialog no-autoinit" aria-label={title}>
        <div className="dialog-container">
          <div className="dialog-header">
            <h2 className="dialog-title">{title}</h2>
          </div>
          <div className="dialog-scroller">
            <div className="dialog-content birthday-form">
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
            <button
              type="button"
              className="btn btn--text btn--sm ripple"
              onClick={onClose}
            >
              {t("weekCard.cancel")}
            </button>
            <button
              type="submit"
              form="birthday-form-fields"
              className="btn btn--filled btn--sm btn--primary ripple"
              disabled={!name.trim() || !birthdayDate}
            >
              {isEdit ? t("weekCard.update") : t("weekCard.save")}
            </button>
          </div>
        </div>
      </k3ui-dialog>
    </div>
  );
}
