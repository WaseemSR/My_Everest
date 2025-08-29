import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8", // 👈 use @vitest/coverage-v8
      reporter: ["text", "html"], // text summary + HTML report
      reportsDirectory: "./coverage", // output folder (default is 'coverage')
    },
  },
});