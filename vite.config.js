import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"], // Supports all modern browsers, skips IE11
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // Add polyfills if needed
    }),
  ],
});

