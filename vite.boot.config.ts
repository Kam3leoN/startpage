import { defineConfig } from "vite";

/** IIFE exécuté dans index.html avant le splash — tokens M3 + data-theme. */
export default defineConfig({
  build: {
    lib: {
      entry: "src/boot-critical.ts",
      name: "StartPageBoot",
      formats: ["iife"],
      fileName: () => "boot-critical.js",
    },
    outDir: "public",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
