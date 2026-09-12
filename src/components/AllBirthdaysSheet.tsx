import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import { getAgeAtNextBirthday, sortBirthdaysUpcoming } from "../utils/weekCelebrations";
import { CloseIcon, PenIcon } from "./icons";
import { K3IconButton } from "./K3IconButton";

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

/**
 * Liste des anniversaires — sheet React contrôlé (même modèle que SettingsSheet).
 * Backdrop non dismissible pendant le premier tick (évite mouseup click-through).
 */
export function AllBirthdaysSheet({
  open,
  k3ready: _k3ready,
  date,
  birthdays,
  onClose,
  onAddBirthday,
  onEditBirthday,
  onRemoveBirthday,
}: Props) {
  const { t, i18n } = useTranslation();
  const [dismissible, setDismissible] = useState(false);

  const sorted = useMemo(
    () => sortBirthdaysUpcoming(date, birthdays),
    [date, birthdays]
  );

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

  return createPortal(
    <div
      className="sheet-backdrop birthdays-sheet-backdrop"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className="sheet birthdays-sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("weekCard.allBirthdaysTitle")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet__grab" />
        <div className="birthdays-sheet__header">
          <h2 className="sheet__title birthdays-sheet__title">{t("weekCard.allBirthdaysTitle")}</h2>
          <button
            type="button"
            className="btn btn--filled btn--sm btn--primary"
            aria-label={t("weekCard.addBirthday")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddBirthday();
            }}
          >
            <span aria-hidden="true">+</span>
            <span className="birthdays-sheet__add-label">{t("weekCard.addShort")}</span>
          </button>
        </div>
        <div className="birthdays-sheet__content">
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
                        onClick={() => onEditBirthday(entry)}
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
