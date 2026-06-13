interface Props {
  id: string;
}

/** Minimal black icons matching the I/O word-wheel cards. */
export function WordWheelIcon({ id }: Props) {
  switch (id) {
    case "alpha":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="wheel__icon">
          <text x="32" y="44" textAnchor="middle" className="wheel__icon-letter">
            A
          </text>
        </svg>
      );
    case "blocks":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="wheel__icon">
          <rect x="18" y="14" width="12" height="12" rx="1" fill="currentColor" />
          <rect x="34" y="14" width="12" height="12" rx="1" fill="currentColor" />
          <rect x="18" y="30" width="12" height="12" rx="1" fill="currentColor" />
          <rect x="34" y="30" width="12" height="12" rx="1" fill="currentColor" />
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="wheel__icon">
          <path
            fill="currentColor"
            d="M34 18c4.2 0 7.2 1.8 8.8 3.3l6-5.8C45.8 11.8 40.5 9 34 9c-9.8 0-17.8 7.2-17.8 16s8 16 17.8 16c8.2 0 13.6-5.8 13.6-14 0-.9-.1-1.6-.3-2.3H34V22h16.5c-.8 4.2-4.8 10.5-12.8 10.5-7.7 0-13.9-6.4-13.9-14.3S26 18 34 18z"
          />
        </svg>
      );
    case "android":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="wheel__icon">
          <path
            fill="currentColor"
            d="M20 28c0-6.2 5.1-11.2 11.5-11.2S43 21.8 43 28v14c0 1.1-.9 2-2 2H22c-1.1 0-2-.9-2-2V28zm3 0v12h18V28H23zm-4-6 2-3.5 2 3.5-2 1.2-2-1.2zm24 0 2-3.5 2 3.5-2 1.2-2-1.2zM28 24h2v2h-2v-2zm6 0h2v2h-2v-2z"
          />
        </svg>
      );
    case "chrome":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="wheel__icon">
          <path
            fill="currentColor"
            d="M32 14c-4.8 0-9 2.4-11.5 6.1l4.8 8.3c1.2-2.1 3.5-3.5 6.2-3.5 2.2 0 4.1 1 5.4 2.6l4.8-2.8C39.2 16.5 35.8 14 32 14zm12.8 8.9-4.8 2.8c.3.9.5 1.9.5 2.9 0 1.4-.4 2.7-1.1 3.8l4.8 8.3C47.6 36.8 49 34 49 31c0-3.1-1.4-5.9-4.2-8.1zM32 37c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-9.3-3.8-4.8 8.3C15.4 36.8 14 34 14 31c0-3.1 1.4-5.9 4.2-8.1l4.8 2.8c-.7 1.1-1.1 2.4-1.1 3.8 0 1 .2 2 .5 2.9z"
          />
        </svg>
      );
    default:
      return null;
  }
}
