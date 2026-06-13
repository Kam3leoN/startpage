import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "k3ui/k3ui.min.css",
        "k3ui/k3ui.min.js",
        "k3ui/init.js",
        "fonts/Digital-7.ttf",
        "icons/*.svg",
        "icons/*.png",
      ],
      manifest: {
        name: "K3 Start Page",
        short_name: "StartPage",
        description: "Page de démarrage personnalisable, Material 3 Expressive.",
        lang: "fr",
        theme_color: "#6750A4",
        background_color: "#1c1b1f",
        display: "standalone",
        orientation: "any",
        start_url: "./",
        scope: "./",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ttf,woff,woff2}"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
});
