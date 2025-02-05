import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  preset: "ts-jest",
  plugins: [react(), tsconfigPaths()],
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/src", "<rootDir>"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
});
