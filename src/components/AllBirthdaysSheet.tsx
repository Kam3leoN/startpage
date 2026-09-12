import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import { getAgeAtNextBirthday, sortBirthdaysUpcoming } from "../utils/weekCelebrations";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { CloseIcon, PenIcon } from "./icons";
import { K3IconButton } from "./K3IconButton";

const SHEET_ID = "all-birthdays-sheet";

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
 * Bottom sheet K3UI — liste scrollable de tous les anniversaires enregistrés.
 */
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
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const sorted = useMemo(
    () => sortBirthdaysUpcoming(date, birthdays),
    [date, birthdays]
  );

  useEffect(() => {
    if (!k3ready) return;
    const el = document.getElementById(SHEET_ID) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;

    const boot = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      if (cancelled) return;
      const K = window.K;
      if (!K?.Sheet?.init) return;
      if (!K.Sheet.getInstance(el)) {
        K.Sheet.init(el, {
          position: "bottom",
          size: "large",
          dismissible: true,
          draggable: true,
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
    const el = document.getElementById(SHEET_ID) as HTMLElement | null;
    if (!el) return;

    const openSheet = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      const K = window.K;
      if (!K?.Sheet) return;
      let instance = K.Sheet.getInstance(el);
      if (!instance) {
        K.Sheet.init(el, {
          position: "bottom",
          size: "large",
          dismissible: true,
          draggable: true,
          onCloseEnd: () => onCloseRef.current(),
        });
        instance = K.Sheet.getInstance(el);
      }
      instance?.open?.();
    };

    void openSheet();
  }, [open, k3ready]);

  useEffect(() => {
    if (!k3ready || open) return;
    const el = document.getElementById(SHEET_ID) as HTMLElement | null;
    if (!el) return;
    window.K?.Sheet?.getInstance(el)?.close?.();
  }, [open, k3ready]);

  return (
    <div ref={rootRef}>
      <div
        id={SHEET_ID}
        className="sheet no-autoinit sheet--bottom sheet--large birthdays-sheet"
        aria-hidden="true"
      >
        <div className="sheet-container">
          <div className="sheet-header birthdays-sheet__header">
            <h2 className="birthdays-sheet__title">{t("weekCard.allBirthdaysTitle")}</h2>
            <button
              type="button"
              className="btn btn--filled btn--sm btn--primary ripple"
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
      </div>
    </div>
  );
}
