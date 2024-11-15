import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "nikola-dw",
    project: "income-mapper-client"
  })],

  resolve: {
    alias: {
      src: path.resolve("src/"),
    },
  },

  build: {
    sourcemap: true
  }
});