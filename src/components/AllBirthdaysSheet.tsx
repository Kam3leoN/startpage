import { useMemo, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import { getAgeAtNextBirthday, sortBirthdaysUpcoming } from "../utils/weekCelebrations";
import { closeK3Overlay, openK3Overlay, useK3Openable } from "../utils/k3Overlay";
import { CloseIcon, PenIcon } from "./icons";
import { K3IconButton } from "./K3IconButton";
import { BIRTHDAY_DIALOG_ID, birthdayDialogOptions } from "./BirthdayFormDialog";

export const ALL_BIRTHDAYS_SHEET_ID = "all-birthdays-sheet";

export const allBirthdaysSheetOptions = {
  position: "bottom",
  size: "large",
  dismissible: true,
  draggable: true,
} as const;

interface Props {
  open: boolean;
  k3ready: boolean;
  date: Date;
  birthdays: BirthdayEntry[];
  onClose: () => void;
  onAddBirthday: () => void;
  onEditBirthday: (entry: BirthdayEntry) => void;
  onRemoveBirthday: (id: string) => void;
}

function formatBirthdayDate(day: number, month: number, locale: string): string {
  const lang = locale.startsWith("fr") ? "fr-FR" : "en-US";
  const d = new Date(2000, month - 1, day);
  return d.toLocaleDateString(lang, { day: "numeric", month: "short" });
}

/** Bottom sheet K3UI — createPortal(body) pour clics React après portal k3ui. */
export function AllBirthdaysSheet({
  open,
  k3ready,
  date,
  birthdays,
  onClose,
  onAddBirthday,
  onEditBirthday,
  onRemoveBirthday,
}: Props) {
  const { t, i18n } = useTranslation();

  useK3Openable(ALL_BIRTHDAYS_SHEET_ID, "Sheet", open, k3ready, onClose, {
    ...allBirthdaysSheetOptions,
  });

  const sorted = useMemo(
    () => sortBirthdaysUpcoming(date, birthdays),
    [date, birthdays]
  );

  const handleClose = (event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    void closeK3Overlay(ALL_BIRTHDAYS_SHEET_ID, "Sheet");
    onClose();
  };

  const handleAdd = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void closeK3Overlay(ALL_BIRTHDAYS_SHEET_ID, "Sheet");
    onClose();
    onAddBirthday();
    window.setTimeout(() => {
      void openK3Overlay(BIRTHDAY_DIALOG_ID, "Dialog", { ...birthdayDialogOptions });
    }, 50);
  };

  const handleEdit = (entry: BirthdayEntry) => {
    void closeK3Overlay(ALL_BIRTHDAYS_SHEET_ID, "Sheet");
    onClose();
    onEditBirthday(entry);
    window.setTimeout(() => {
      void openK3Overlay(BIRTHDAY_DIALOG_ID, "Dialog", { ...birthdayDialogOptions });
    }, 50);
  };

  return createPortal(
    <div
      id={ALL_BIRTHDAYS_SHEET_ID}
      className="sheet no-autoinit sheet--bottom sheet--large birthdays-sheet"
      aria-hidden="true"
    >
      <div className="sheet-container">
        <div className="sheet-header birthdays-sheet__header">
          <h2 className="birthdays-sheet__title">{t("weekCard.allBirthdaysTitle")}</h2>
          <div className="birthdays-sheet__header-actions">
            <button
              type="button"
              className="btn btn--filled btn--sm btn--primary"
              aria-label={t("weekCard.addBirthday")}
              onClick={handleAdd}
            >
              <span aria-hidden="true">+</span>
              <span className="birthdays-sheet__add-label">{t("weekCard.addShort")}</span>
            </button>
            <button
              type="button"
              className="btn btn--icon btn--sm birthdays-sheet__close"
              aria-label={t("navBar.close")}
              onClick={handleClose}
            >
              <span className="birthdays-sheet__close-glyph" aria-hidden="true">
                ×
              </span>
            </button>
          </div>
        </div>
        <div className="sheet-content birthdays-sheet__content">
          {sorted.length === 0 ? (
            <p className="birthdays-sheet__empty">{t("weekCard.noBirthdaysSavedEmpty")}</p>
          ) : (
            <ul className="birthdays-sheet__list" aria-label={t("weekCard.allBirthdaysTitle")}>
              {sorted.map(({ entry, isToday, age, daysUntil }) => {
                const resolvedAge = age ?? getAgeAtNextBirthday(entry, date);
                return (
                  <li
                    key={entry.id}
                    className={`birthdays-sheet__item${isToday ? " birthdays-sheet__item--today" : ""}`}
                  >
                    <span className="birthdays-sheet__cake" aria-hidden="true">
                      🎂
                    </span>
                    <div className="birthdays-sheet__info">
                      <span
                        className={`birthdays-sheet__name${entry.gender ? ` birthdays-sheet__name--${entry.gender}` : ""}`}
                      >
                        {entry.name}
                      </span>
                      <span className="birthdays-sheet__meta">
                        {formatBirthdayDate(entry.day, entry.month, i18n.language)}
                        {resolvedAge !== null && (
                          <>
                            {" · "}
                            {t("weekCard.turns", { age: resolvedAge })}
                          </>
                        )}
                        {" · "}
                        {daysUntil === 0
                          ? t("weekCard.todayShort")
                          : t("weekCard.daysLeft", { count: daysUntil })}
                      </span>
                    </div>
                    <div className="birthdays-sheet__actions">
                      <K3IconButton
                        variant="standard"
                        size="xs"
                        label={t("weekCard.editBirthday", { name: entry.name })}
                        onClick={() => handleEdit(entry)}
                      >
                        <PenIcon width={14} height={14} />
                      </K3IconButton>
                      <K3IconButton
                        variant="standard"
                        size="xs"
                        label={t("weekCard.removeBirthday", { name: entry.name })}
                        onClick={() => onRemoveBirthday(entry.id)}
                      >
                        <CloseIcon width={14} height={14} />
                      </K3IconButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
