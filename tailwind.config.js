/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        "m3-primary": "var(--md-sys-color-primary)",
        "m3-on-primary": "var(--md-sys-color-on-primary)",
        "m3-surface": "var(--md-sys-color-surface)",
        "m3-on-surface": "var(--md-sys-color-on-surface)",
        "m3-surface-container": "var(--md-sys-color-surface-container)",
        "m3-surface-container-high": "var(--md-sys-color-surface-container-high)",
        "m3-outline": "var(--md-sys-color-outline)",
        "m3-on-surface-variant": "var(--md-sys-color-on-surface-variant)",
      },
    },
  },
  plugins: [],
};
