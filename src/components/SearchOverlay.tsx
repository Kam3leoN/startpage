import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { SearchEngine } from "../utils/searchEngine";
import { buildSearchUrl } from "../utils/searchEngine";
import { ArrowForwardIcon, CloseIcon } from "./icons";
import { K3OutlinedField } from "./K3OutlinedField";
import { SearchEngineMenu } from "./SearchEngineMenu";

interface Props {
  open: boolean;
  engine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
  onClose: () => void;
}

/** Full-page search overlay with blurred backdrop. */
export function SearchOverlay({ open, engine, onEngineChange, onClose }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("search-overlay-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("search-overlay-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const submitSearch = () => {
    const term = query.trim();
    if (!term) return;
    window.open(buildSearchUrl(engine, term), "_blank", "noopener");
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch();
  };

  return createPortal(
    <div className="search-overlay">
      <button
        type="button"
        className="search-overlay__backdrop"
        aria-label={t("search.close")}
        onClick={onClose}
      />
      <div
        className="search-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("search.overlayTitle")}
      >
        <header className="search-overlay__header">
          <div className="search-overlay__heading">
            <h2 className="search-overlay__title">{t("search.overlayTitle")}</h2>
            <SearchEngineMenu engine={engine} onChange={onEngineChange} />
          </div>
          <button
            type="button"
            className="search-overlay__close"
            onClick={onClose}
            aria-label={t("search.close")}
          >
            <CloseIcon aria-hidden />
          </button>
        </header>

        <form ref={formRef} className="search-overlay__form" onSubmit={submit} role="search">
          <K3OutlinedField
            className="search-overlay__k3-field"
            fieldClassName="k3-field--label-sr-only"
            name="search-query"
            variant="filled"
            leadingIcon="magnifying-glass"
            label={t("search.overlayPlaceholder")}
            placeholder={t("search.overlayPlaceholder")}
            value={query}
            onChange={setQuery}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            inputMode="search"
            onEnter={submitSearch}
          />
          <button
            type="submit"
            className="search-overlay__submit"
            aria-label={t("search.submit")}
            disabled={!query.trim()}
          >
            <ArrowForwardIcon aria-hidden />
          </button>
        </form>

        <p className="search-overlay__hint">{t("search.overlayHint")}</p>
      </div>
    </div>,
    document.body
  );
}
