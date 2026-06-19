import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { WEEK_CELEBRATIONS_POSITION_KEY } from "../config/defaults";
import { useDraggablePosition } from "../hooks/useDraggablePosition";
import type { BirthdayEntry } from "../types/birthday";
import { resolveBirthYearFromDate } from "../utils/birthdayYear";
import { getAgeAtNextBirthday, getWeekBirthdays, getWeekCelebrations, sortBirthdaysUpcoming } from "../utils/weekCelebrations";
import { EphemerisGenderIcon } from "./EphemerisGenderIcon";
import { CloseIcon, PenIcon } from "./icons";
import { K3Datepicker } from "./K3Datepicker";
import { K3IconButton } from "./K3IconButton";
import { K3OutlinedField } from "./K3OutlinedField";

interface Props {
  date: Date;
  birthdays: BirthdayEntry[];
  onAddBirthday: (input: Omit<BirthdayEntry, "id">) => BirthdayEntry | null;
  onRemoveBirthday: (id: string) => void;
  onUpdateBirthday: (
    id: string,
    patch: Partial<Pick<BirthdayEntry, "name" | "day" | "month" | "year">>
  ) => boolean;
}

function defaultCardPosition(): { x: number; y: number } {
  const margin = 14;
  const top = 88;
  const width = 300;
  return {
    x: Math.max(margin, window.innerWidth - width - margin),
    y: top,
  };
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

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function entryToDate(entry: BirthdayEntry): Date {
  const year = entry.year ?? 2000;
  return new Date(year, entry.month - 1, entry.day);
}

/**
 * Carte flottante déplaçable : fêtes de la semaine + anniversaires de la semaine.
 */
export function WeekCelebrationsCard({
  date,
  birthdays,
  onAddBirthday,
  onRemoveBirthday,
  onUpdateBirthday,
}: Props) {
  const { t, i18n } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [showAllBirthdays, setShowAllBirthdays] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(() => startOfDay(date));
  const [editDate, setEditDate] = useState<Date | null>(null);

  const { elementRef, position, dragging, onDragHandlePointerDown } = useDraggablePosition({
    storageKey: WEEK_CELEBRATIONS_POSITION_KEY,
    defaultPosition: defaultCardPosition(),
  });

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

  const pickerLocale = i18n.language.startsWith("fr") ? "fr-FR" : "en-US";

  const closeForm = () => {
    setShowForm(false);
    setName("");
    setBirthdayDate(startOfDay(date));
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditDate(null);
  };

  const openForm = () => {
    closeEdit();
    setBirthdayDate(startOfDay(date));
    setShowForm(true);
  };

  const startEdit = (entry: BirthdayEntry) => {
    closeForm();
    setEditingId(entry.id);
    setEditDate(entryToDate(entry));
  };

  useEffect(() => {
    if (!showForm && !editingId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (editingId) closeEdit();
        else closeForm();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showForm, editingId, date]);

  const handleAddBirthday = (event: FormEvent) => {
    event.preventDefault();
    if (!birthdayDate || !name.trim()) return;

    const created = onAddBirthday({
      name,
      day: birthdayDate.getDate(),
      month: birthdayDate.getMonth() + 1,
      year: resolveBirthYearFromDate(birthdayDate),
    });
    if (!created) return;
    closeForm();
  };

  const handleUpdateBirthday = (event: FormEvent, entryId: string) => {
    event.preventDefault();
    if (!editDate) return;

    const ok = onUpdateBirthday(entryId, {
      day: editDate.getDate(),
      month: editDate.getMonth() + 1,
      year: resolveBirthYearFromDate(editDate),
    });
    if (!ok) return;
    closeEdit();
  };

  const renderBirthdayItem = (
    entry: BirthdayEntry,
    options: { isToday: boolean; age: number | null; highlightWeek?: boolean }
  ) => {
    const { isToday, age, highlightWeek = false } = options;
    return (
      <li
        key={entry.id}
        className={`week-card__birthday-item${highlightWeek ? " week-card__birthday-item--week" : ""}${isToday ? " week-card__birthday-item--today" : ""}${editingId === entry.id ? " week-card__birthday-item--editing" : ""}`}
      >
        {editingId === entry.id ? (
          <form
            className="week-card__birthday-edit"
            onSubmit={(event) => handleUpdateBirthday(event, entry.id)}
          >
            <p className="week-card__birthday-edit-title">
              {entry.name} — {t("weekCard.editFormTitle")}
            </p>
            <K3Datepicker
              className="week-card__datepicker week-card__datepicker--inline"
              label={t("weekCard.birthDate")}
              placeholder={t("weekCard.birthDatePlaceholder")}
              value={editDate}
              onChange={setEditDate}
              locale={pickerLocale}
            />
            <div className="week-card__form-actions">
              <button
                type="button"
                className="btn btn--text btn--sm ripple"
                onClick={closeEdit}
              >
                {t("weekCard.cancel")}
              </button>
              <button
                type="submit"
                className="btn btn--filled btn--sm btn--primary ripple"
                disabled={!editDate}
              >
                {t("weekCard.update")}
              </button>
            </div>
          </form>
        ) : (
          <>
            <span className="week-card__birthday-cake" aria-hidden="true">🎂</span>
            <div className="week-card__birthday-info">
              <span className="week-card__birthday-name">{entry.name}</span>
              <span className="week-card__birthday-date">
                {formatBirthdayDate(entry.day, entry.month, i18n.language)}
                {age !== null && (
                  <span className="week-card__birthday-age">
                    {" · "}
                    {t("weekCard.turns", { age })}
                  </span>
                )}
              </span>
            </div>
            <div className="week-card__birthday-actions">
              <K3IconButton
                variant="standard"
                size="xs"
                className="week-card__birthday-edit-btn"
                label={t("weekCard.editBirthday", { name: entry.name })}
                onClick={() => startEdit(entry)}
              >
                <PenIcon width={14} height={14} />
              </K3IconButton>
              <K3IconButton
                variant="standard"
                size="xs"
                className="week-card__birthday-remove"
                label={t("weekCard.removeBirthday", { name: entry.name })}
                onClick={() => onRemoveBirthday(entry.id)}
              >
                <CloseIcon width={14} height={14} />
              </K3IconButton>
            </div>
          </>
        )}
      </li>
    );
  };

  return (
    <aside
      ref={elementRef}
      className={`week-card${dragging ? " week-card--dragging" : ""}`}
      style={{ left: position.x, top: position.y }}
      aria-label={t("weekCard.title")}
    >
      <header className="week-card__header">
        <button
          type="button"
          className="week-card__drag-handle"
          aria-label={t("weekCard.drag")}
          onPointerDown={onDragHandlePointerDown}
        >
          <span className="week-card__grip" aria-hidden="true" />
        </button>
        <h2 className="week-card__title">{t("weekCard.title")}</h2>
        <button
          type="button"
          className={`btn btn--icon btn--sm ripple week-card__toggle${showForm ? " week-card__toggle--close" : ""}`}
          aria-label={showForm ? t("weekCard.cancelAdd") : t("weekCard.addBirthday")}
          aria-expanded={showForm}
          onClick={() => (showForm ? closeForm() : openForm())}
        >
          {showForm ? (
            <CloseIcon width={18} height={18} aria-hidden="true" />
          ) : (
            <span className="week-card__add-icon" aria-hidden="true">+</span>
          )}
        </button>
      </header>

      {showForm && (
        <form className="week-card__form" onSubmit={handleAddBirthday}>
          <p className="week-card__form-title">{t("weekCard.formTitle")}</p>
          <K3OutlinedField
            className="week-card__field"
            name="birthday-name"
            label={t("weekCard.namePlaceholder")}
            placeholder={t("weekCard.namePlaceholder")}
            value={name}
            onChange={setName}
          />
          <K3Datepicker
            className="week-card__datepicker"
            label={t("weekCard.birthDate")}
            placeholder={t("weekCard.birthDatePlaceholder")}
            value={birthdayDate}
            onChange={setBirthdayDate}
            locale={pickerLocale}
          />
          <div className="week-card__form-actions">
            <button
              type="button"
              className="btn btn--text btn--sm ripple"
              onClick={closeForm}
            >
              {t("weekCard.cancel")}
            </button>
            <button
              type="submit"
              className="btn btn--filled btn--sm btn--primary ripple"
              disabled={!name.trim() || !birthdayDate}
            >
              {t("weekCard.save")}
            </button>
          </div>
        </form>
      )}

      <div className="week-card__body">
        <section className="week-card__section" aria-label={t("weekCard.holidays")}>
          <h3 className="week-card__section-title">{t("weekCard.holidays")}</h3>
          <ul className="week-card__days">
            {weekCelebrations.map((item) => (
              <li
                key={item.date.toISOString()}
                className={`week-card__day${item.isToday ? " week-card__day--today" : ""}${item.names.length === 0 ? " week-card__day--empty" : ""}`}
              >
                <div className="week-card__day-head">
                  <span className="week-card__weekday">{formatWeekday(item.date, i18n.language, true)}</span>
                  <span className="week-card__date-num">{item.date.getDate()}</span>
                </div>
                <div className="week-card__day-content">
                  {item.names.length > 0 ? (
                    <ul className="week-card__names">
                      {item.names.map((celebration) => (
                        <li
                          key={`${celebration.gender}-${celebration.name}`}
                          className={`week-card__name-entry week-card__name-entry--${celebration.gender}`}
                        >
                          <EphemerisGenderIcon
                            kind={celebration.gender}
                            label={
                              celebration.gender === "male"
                                ? t("weekCard.saint")
                                : t("weekCard.sainte")
                            }
                            className="week-card__gender-icon"
                          />
                          <span className="week-card__name">{celebration.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="week-card__empty-day">{t("weekCard.noEvents")}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="week-card__section week-card__section--birthdays" aria-label={t("weekCard.birthdays")}>
          <h3 className="week-card__section-title week-card__section-title--birthdays">
            {t("weekCard.birthdays")}
          </h3>
          {weekBirthdays.length === 0 ? (
            <p className="week-card__birthdays-empty">
              {t("weekCard.noBirthdays")}
              {birthdays.length > 0 ? (
                <span className="week-card__birthdays-saved-hint">
                  {" "}
                  {t("weekCard.noBirthdaysSaved", { count: birthdays.length })}
                </span>
              ) : null}
            </p>
          ) : (
            <ul className="week-card__birthdays-list">
              {weekBirthdays.map(({ entry, isToday, age }) =>
                renderBirthdayItem(entry, { isToday, age, highlightWeek: true })
              )}
            </ul>
          )}
          {birthdays.length > 0 && (
            <button
              type="button"
              className="btn btn--text btn--sm ripple week-card__birthdays-all-toggle"
              aria-expanded={showAllBirthdays}
              onClick={() => setShowAllBirthdays((open) => !open)}
            >
              {showAllBirthdays
                ? t("weekCard.hideAllBirthdays")
                : t("weekCard.showAllBirthdays")}
            </button>
          )}
          {showAllBirthdays && birthdays.length > 0 && (
            <ul
              className="week-card__birthdays-list week-card__birthdays-list--all"
              aria-label={t("weekCard.allBirthdaysTitle")}
            >
              {allBirthdaysSorted.map(({ entry, isToday, age }) =>
                renderBirthdayItem(entry, {
                  isToday,
                  age: age ?? getAgeAtNextBirthday(entry, date),
                })
              )}
            </ul>
          )}
        </section>
      </div>
    </aside>
  );
}
