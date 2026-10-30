import { defineConfig } from "@playwright/test";

// Browsers live in $TOOLS/ms-playwright (PLAYWRIGHT_BROWSERS_PATH, set by .athanor/check.sh).
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  workers: 2,
  reporter: [["line"]],
  outputDir: ".athanor/.verif/playwright",
});
