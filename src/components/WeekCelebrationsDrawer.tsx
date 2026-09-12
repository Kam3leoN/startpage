import { useEffect, useMemo, useRef, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import type { BirthdayEntry } from "../types/birthday";
import {
  getNextUpcomingBirthdayGroup,
  getWeekBirthdays,
  getWeekCelebrations,
} from "../utils/weekCelebrations";
import { initK3UISubtree } from "../utils/k3uiDeferred";
import { BirthdayNameList, entryToNamePart } from "./BirthdayNameList";
import { EphemerisGenderIcon } from "./EphemerisGenderIcon";
import { CloseIcon, PenIcon } from "./icons";
import { K3IconButton } from "./K3IconButton";

const DRAWER_ID = "week-celebrations-drawer";

interface Props {
  open: boolean;
  k3ready: boolean;
  date: Date;
  birthdays: BirthdayEntry[];
  onClose: () => void;
  onAddBirthday: () => void;
  onEditBirthday: (entry: BirthdayEntry) => void;
  onRemoveBirthday: (id: string) => void;
  onShowAllBirthdays: () => void;
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
 * Drawer K3UI à droite — liste scrollable des fêtes + anniversaires.
 */
export function WeekCelebrationsDrawer({
  open,
  k3ready,
  date,
  birthdays,
  onClose,
  onAddBirthday,
  onEditBirthday,
  onRemoveBirthday,
  onShowAllBirthdays,
}: Props) {
  const { t, i18n } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const weekCelebrations = useMemo(
    () => getWeekCelebrations(date, i18n.language),
    [date, i18n.language]
  );

  const weekBirthdays = useMemo(
    () => getWeekBirthdays(date, birthdays),
    [date, birthdays]
  );

  const nextUpcomingGroup = useMemo(
    () => getNextUpcomingBirthdayGroup(date, birthdays),
    [date, birthdays]
  );

  useEffect(() => {
    if (!k3ready) return;
    const el = document.getElementById(DRAWER_ID) as HTMLElement | null;
    if (!el) return;

    let cancelled = false;

    const boot = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      if (cancelled) return;

      const K = window.K;
      if (!K?.Drawer?.init) return;

      if (!K.Drawer.getInstance(el)) {
        K.Drawer.init(el, {
          edge: "right",
          width: "min(100vw, 380px)",
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
    const el = document.getElementById(DRAWER_ID) as HTMLElement | null;
    if (!el) return;

    const openDrawer = async () => {
      if (rootRef.current) await initK3UISubtree(rootRef.current);
      const K = window.K;
      if (!K?.Drawer) return;
      let instance = K.Drawer.getInstance(el);
      if (!instance) {
        K.Drawer.init(el, {
          edge: "right",
          width: "min(100vw, 380px)",
          dismissible: true,
          draggable: true,
          onCloseEnd: () => onCloseRef.current(),
        });
        instance = K.Drawer.getInstance(el);
      }
      instance?.open?.();
    };

    void openDrawer();
  }, [open, k3ready]);

  useEffect(() => {
    if (!k3ready || open) return;
    const el = document.getElementById(DRAWER_ID) as HTMLElement | null;
    if (!el) return;
    window.K?.Drawer?.getInstance(el)?.close?.();
  }, [open, k3ready]);

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onAddBirthday();
  };

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
        className={`week-drawer__birthday-item${highlightWeek ? " week-drawer__birthday-item--week" : ""}${isToday ? " week-drawer__birthday-item--today" : ""}`}
      >
        <span className="week-drawer__birthday-cake" aria-hidden="true">
          🎂
        </span>
        <div className="week-drawer__birthday-info">
          <span
            className={`week-drawer__birthday-name${entry.gender ? ` week-drawer__birthday-name--${entry.gender}` : ""}`}
          >
            {entry.name}
          </span>
          <span className="week-drawer__birthday-date">
            {formatBirthdayDate(entry.day, entry.month, i18n.language)}
            {age !== null && (
              <span className="week-drawer__birthday-age">
                {" · "}
                {t("weekCard.turns", { age })}
              </span>
            )}
            {typeof daysUntil === "number" && (
              <span className="week-drawer__birthday-countdown">
                {" · "}
                {daysUntil === 0
                  ? t("weekCard.todayShort")
                  : t("weekCard.daysLeft", { count: daysUntil })}
              </span>
            )}
          </span>
        </div>
        <div className="week-drawer__birthday-actions">
          <K3IconButton
            variant="standard"
            size="xs"
            className="week-drawer__birthday-edit-btn"
            label={t("weekCard.editBirthday", { name: entry.name })}
            onClick={() => onEditBirthday(entry)}
          >
            <PenIcon width={14} height={14} />
          </K3IconButton>
          <K3IconButton
            variant="standard"
            size="xs"
            className="week-drawer__birthday-remove"
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
        id={DRAWER_ID}
        className="drawer no-autoinit drawer--right week-drawer"
        aria-hidden="true"
      >
        <div className="drawer-wrapper">
          <div className="drawer-header week-drawer__header">
            <h2 className="drawer-header__title week-drawer__title">{t("weekCard.title")}</h2>
            <div className="week-drawer__header-actions">
              <button
                type="button"
                className="btn btn--filled btn--sm btn--primary ripple week-drawer__add"
                aria-label={t("weekCard.addBirthday")}
                onClick={handleAddClick}
              >
                <span aria-hidden="true">+</span>
                <span className="week-drawer__add-label">{t("weekCard.addShort")}</span>
              </button>
              <button
                type="button"
                className="btn btn--icon btn--sm ripple week-drawer__close"
                aria-label={t("navBar.close")}
                onClick={onClose}
              >
                <CloseIcon width={18} height={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="drawer-content week-drawer__content">
            <section className="week-drawer__section" aria-label={t("weekCard.holidays")}>
              <h3 className="week-drawer__section-title">{t("weekCard.holidays")}</h3>
              <ul className="week-drawer__days">
                {weekCelebrations.map((item) => (
                  <li
                    key={item.date.toISOString()}
                    className={`week-drawer__day${item.isToday ? " week-drawer__day--today" : ""}${item.names.length === 0 ? " week-drawer__day--empty" : ""}`}
                  >
                    <div className="week-drawer__day-head">
                      <span className="week-drawer__weekday">
                        {formatWeekday(item.date, i18n.language, true)}
                      </span>
                      <span className="week-drawer__date-num">{item.date.getDate()}</span>
                    </div>
                    <div className="week-drawer__day-content">
                      {item.names.length > 0 ? (
                        <ul className="week-drawer__names">
                          {item.names.map((celebration) => (
                            <li
                              key={`${celebration.gender}-${celebration.name}`}
                              className={`week-drawer__name-entry week-drawer__name-entry--${celebration.gender}`}
                            >
                              <EphemerisGenderIcon
                                kind={celebration.gender}
                                label={
                                  celebration.gender === "male"
                                    ? t("weekCard.saint")
                                    : t("weekCard.sainte")
                                }
                                className="week-drawer__gender-icon"
                              />
                              <span className="week-drawer__name">{celebration.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="week-drawer__empty-day">{t("weekCard.noEvents")}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="week-drawer__section week-drawer__section--birthdays"
              aria-label={t("weekCard.birthdays")}
            >
              <h3 className="week-drawer__section-title week-drawer__section-title--birthdays">
                {t("weekCard.birthdays")}
              </h3>
              {weekBirthdays.length === 0 ? (
                <p className="week-drawer__birthdays-empty">
                  {t("weekCard.noBirthdays")}
                  {birthdays.length > 0 ? (
                    <span className="week-drawer__birthdays-saved-hint">
                      {" "}
                      {t("weekCard.noBirthdaysSaved", { count: birthdays.length })}
                    </span>
                  ) : null}
                </p>
              ) : (
                <ul className="week-drawer__birthdays-list">
                  {weekBirthdays.map(({ entry, isToday, age }) =>
                    renderBirthdayItem(entry, { isToday, age, highlightWeek: true })
                  )}
                </ul>
              )}
              {nextUpcomingGroup && weekBirthdays.length === 0 && (
                <p className="week-drawer__next-up" role="status">
                  {nextUpcomingGroup.isToday ? (
                    <>
                      {t("weekCard.nextUpTodayPrefix")}
                      <BirthdayNameList
                        entries={nextUpcomingGroup.items.map((item) =>
                          entryToNamePart(item.entry, item.age)
                        )}
                        nameClassName="week-drawer__birthday-name"
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
                        nameClassName="week-drawer__birthday-name"
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
                  className="btn btn--outlined btn--sm ripple week-drawer__birthdays-all-toggle"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onShowAllBirthdays();
                  }}
                >
                  {t("weekCard.showAllBirthdays")}
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
