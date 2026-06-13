interface Props {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

/** Switch Material pour le sheet réglages. */
export function SettingsSwitch({ id, label, hint, checked, onChange }: Props) {
  return (
    <div className="sheet__switch-row">
      <div className="sheet__switch-texts">
        <label htmlFor={id} className="sheet__switch-label">
          {label}
        </label>
        {hint ? <p className="sheet__switch-hint">{hint}</p> : null}
      </div>
      <label className="sheet__switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="sheet__switch-track" aria-hidden="true" />
      </label>
    </div>
  );
}
