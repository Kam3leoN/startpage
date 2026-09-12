import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import {
  getAgeAtNextBirthday,
  getNextUpcomingBirthdayGroup,
  getWeekBirthdays,
  getWeekCelebrations,
  sortBirthdaysUpcoming,
} from "../utils/weekCelebrations";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { BirthdayNameList, entryToNamePart } from "./BirthdayNameList";
import { EphemerisGenderIcon } from "./EphemerisGenderIcon";
import { CloseIcon, PenIcon } from "./icons";
import { K3IconButton } from "./K3IconButton";

const SHEET_ID = "week-celebrations-sheet";

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

function formatWeekday(d: Date, locale: string, compact: boolean): string {
  const lang = locale.startsWith("fr") ? "fr-FR" : "en-US";
  const weekday = d.toLocaleDateString(lang, { weekday: compact ? "short" : "long" });
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatBirthdayDate(day: number, month: number, locale: string): string {
  const lang = locale.startsWith("fr") ? "fr-FR" : "en-US";
  const d = new Date(2000, month - 1, day);
  return d.toLocaleDateString(lang, { day: "numeric", month: "short" });
}

/**
 * Bottom sheet K3UI — liste scrollable des fêtes de la semaine + anniversaires.
 */
export function WeekCelebrationsSheet({
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
  const [showAllBirthdays, setShowAllBirthdays] = useState(false);
  onCloseRef.current = onClose;

  const weekCelebrations = useMemo(
    () => getWeekCelebrations(date, i18n.language),
    [date, i18n.language]
  );

  const weekBirthdays = useMemo(
    () => getWeekBirthdays(date, birthdays),
    [date, birthdays]
  );

  const allBirthdaysSorted = useMemo(
    () => sortBirthdaysUpcoming(date, birthdays),
    [date, birthdays]
  );

  const nextUpcomingGroup = useMemo(
    () => getNextUpcomingBirthdayGroup(date, birthdays),
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
      const instance = window.K?.Sheet?.getInstance(el);
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

  const renderBirthdayItem = (
    entry: BirthdayEntry,
    options: {
      isToday: boolean;
      age: number | null;
      highlightWeek?: boolean;
      daysUntil?: number;
    }
  ) => {
    const { isToday, age, highlightWeek = false, daysUntil } = options;
    return (
      <li
        key={entry.id}
        className={`week-sheet__birthday-item${highlightWeek ? " week-sheet__birthday-item--week" : ""}${isToday ? " week-sheet__birthday-item--today" : ""}`}
      >
        <span className="week-sheet__birthday-cake" aria-hidden="true">
          🎂
        </span>
        <div className="week-sheet__birthday-info">
          <span
            className={`week-sheet__birthday-name${entry.gender ? ` week-sheet__birthday-name--${entry.gender}` : ""}`}
          >
            {entry.name}
          </span>
          <span className="week-sheet__birthday-date">
            {formatBirthdayDate(entry.day, entry.month, i18n.language)}
            {age !== null && (
              <span className="week-sheet__birthday-age">
                {" · "}
                {t("weekCard.turns", { age })}
              </span>
            )}
            {typeof daysUntil === "number" && (
              <span className="week-sheet__birthday-countdown">
                {" · "}
                {daysUntil === 0
                  ? t("weekCard.todayShort")
                  : t("weekCard.daysLeft", { count: daysUntil })}
              </span>
            )}
          </span>
        </div>
        <div className="week-sheet__birthday-actions">
          <K3IconButton
            variant="standard"
            size="xs"
            className="week-sheet__birthday-edit-btn"
            label={t("weekCard.editBirthday", { name: entry.name })}
            onClick={() => onEditBirthday(entry)}
          >
            <PenIcon width={14} height={14} />
          </K3IconButton>
          <K3IconButton
            variant="standard"
            size="xs"
            className="week-sheet__birthday-remove"
            label={t("weekCard.removeBirthday", { name: entry.name })}
            onClick={() => onRemoveBirthday(entry.id)}
          >
            <CloseIcon width={14} height={14} />
          </K3IconButton>
        </div>
      </li>
    );
  };

  return (
    <div ref={rootRef}>
      <div
        id={SHEET_ID}
        className="sheet no-autoinit sheet--bottom sheet--large week-sheet"
        aria-hidden="true"
      >
        <div className="sheet-container">
          <div className="sheet-header week-sheet__header">
            <h2 className="week-sheet__title">{t("weekCard.title")}</h2>
            <button
              type="button"
              className="btn btn--filled btn--sm btn--primary ripple week-sheet__add"
              aria-label={t("weekCard.addBirthday")}
              onClick={onAddBirthday}
            >
              <span aria-hidden="true">+</span>
              <span className="week-sheet__add-label">{t("weekCard.addShort")}</span>
            </button>
          </div>
          <div className="sheet-content week-sheet__content">
            <section className="week-sheet__section" aria-label={t("weekCard.holidays")}>
              <h3 className="week-sheet__section-title">{t("weekCard.holidays")}</h3>
              <ul className="week-sheet__days">
                {weekCelebrations.map((item) => (
                  <li
                    key={item.date.toISOString()}
                    className={`week-sheet__day${item.isToday ? " week-sheet__day--today" : ""}${item.names.length === 0 ? " week-sheet__day--empty" : ""}`}
                  >
                    <div className="week-sheet__day-head">
                      <span className="week-sheet__weekday">
                        {formatWeekday(item.date, i18n.language, true)}
                      </span>
                      <span className="week-sheet__date-num">{item.date.getDate()}</span>
                    </div>
                    <div className="week-sheet__day-content">
                      {item.names.length > 0 ? (
                        <ul className="week-sheet__names">
                          {item.names.map((celebration) => (
                            <li
                              key={`${celebration.gender}-${celebration.name}`}
                              className={`week-sheet__name-entry week-sheet__name-entry--${celebration.gender}`}
                            >
                              <EphemerisGenderIcon
                                kind={celebration.gender}
                                label={
                                  celebration.gender === "male"
                                    ? t("weekCard.saint")
                                    : t("weekCard.sainte")
                                }
                                className="week-sheet__gender-icon"
                              />
                              <span className="week-sheet__name">{celebration.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="week-sheet__empty-day">{t("weekCard.noEvents")}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="week-sheet__section week-sheet__section--birthdays"
              aria-label={t("weekCard.birthdays")}
            >
              <h3 className="week-sheet__section-title week-sheet__section-title--birthdays">
                {t("weekCard.birthdays")}
              </h3>
              {weekBirthdays.length === 0 ? (
                <p className="week-sheet__birthdays-empty">
                  {t("weekCard.noBirthdays")}
                  {birthdays.length > 0 ? (
                    <span className="week-sheet__birthdays-saved-hint">
                      {" "}
                      {t("weekCard.noBirthdaysSaved", { count: birthdays.length })}
                    </span>
                  ) : null}
                </p>
              ) : (
                <ul className="week-sheet__birthdays-list">
                  {weekBirthdays.map(({ entry, isToday, age }) =>
                    renderBirthdayItem(entry, { isToday, age, highlightWeek: true })
                  )}
                </ul>
              )}
              {nextUpcomingGroup && weekBirthdays.length === 0 && (
                <p className="week-sheet__next-up" role="status">
                  {nextUpcomingGroup.isToday ? (
                    <>
                      {t("weekCard.nextUpTodayPrefix")}
                      <BirthdayNameList
                        entries={nextUpcomingGroup.items.map((item) =>
                          entryToNamePart(item.entry, item.age)
                        )}
                        nameClassName="week-sheet__birthday-name"
                      />
                      {t("weekCard.nextUpTodaySuffix")}
                    </>
                  ) : (
                    <>
                      {t("weekCard.nextUpPrefix")}
                      <BirthdayNameList
                        entries={nextUpcomingGroup.items.map((item) =>
                          entryToNamePart(item.entry, item.age)
                        )}
                        nameClassName="week-sheet__birthday-name"
                      />
                      {t("weekCard.nextUpSuffix", {
                        count: nextUpcomingGroup.daysUntil,
                      })}
                    </>
                  )}
                </p>
              )}
              {birthdays.length > 0 && (
                <button
                  type="button"
                  className="btn btn--text btn--sm ripple week-sheet__birthdays-all-toggle"
                  aria-expanded={showAllBirthdays}
                  onClick={() => setShowAllBirthdays((value) => !value)}
                >
                  {showAllBirthdays
                    ? t("weekCard.hideAllBirthdays")
                    : t("weekCard.showAllBirthdays")}
                </button>
              )}
              {showAllBirthdays && birthdays.length > 0 && (
                <ul
                  className="week-sheet__birthdays-list week-sheet__birthdays-list--all"
                  aria-label={t("weekCard.allBirthdaysTitle")}
                >
                  {allBirthdaysSorted.map(({ entry, isToday, age, daysUntil }) =>
                    renderBirthdayItem(entry, {
                      isToday,
                      age: age ?? getAgeAtNextBirthday(entry, date),
                      daysUntil,
                    })
                  )}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
