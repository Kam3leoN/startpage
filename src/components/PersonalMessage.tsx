import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  message: string;
  onChange: (value: string) => void;
}

/** Message perso éditable (double-clic) — materialYouNewTab. */
export function PersonalMessage({ message, onChange }: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLParagraphElement>(null);
  const [editing, setEditing] = useState(false);

  const commit = useCallback(() => {
    const text = ref.current?.textContent?.trim() ?? "";
    onChange(text);
    setEditing(false);
  }, [onChange]);

  const startEdit = useCallback(() => {
    setEditing(true);
    requestAnimationFrame(() => {
      ref.current?.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      if (ref.current && sel) {
        range.selectNodeContents(ref.current);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  }, []);

  if (!message && !editing) {
    return (
      <button type="button" className="personal-message personal-message--empty" onClick={startEdit}>
        {t("personalMessage.placeholder")}
      </button>
    );
  }

  return (
    <p
      ref={ref}
      className={`personal-message${editing ? " personal-message--editing" : ""}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={startEdit}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (ref.current) ref.current.textContent = message;
          setEditing(false);
          ref.current?.blur();
        }
      }}
      title={t("personalMessage.editHint")}
    >
      {message}
    </p>
  );
}
