import { test as base, chromium, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// No server can listen in this sandbox: the static export in out/ is served through route interception.
export const ORIGIN = "http://ha-nuisibles.test";
// SERVE_ROOT=deliverable serves the delivery folder instead (tests/e2e/deliverable.spec.ts).
const OUT = path.resolve(__dirname, "../..", process.env.SERVE_ROOT || "out");
export const SCREENSHOTS = path.resolve(__dirname, "../../.athanor/screenshots");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

/** Maps a URL path to a file of out/ (`/x/` → out/x/index.html); null when absent. */
export function resolveFile(urlPath: string): string | null {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = clean.endsWith("/") ? [clean + "index.html"] : [clean, clean + "/index.html", clean + ".html"];
  for (const c of candidates) {
    const file = path.join(OUT, c);
    if (file.startsWith(OUT) && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

async function serve(page: Page) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort(); // keep tests offline and deterministic
    const file = resolveFile(url.pathname);
    if (!file) {
      return route.fulfill({ status: 404, contentType: TYPES[".html"], body: fs.readFileSync(path.join(OUT, "404.html")) });
    }
    route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] || "application/octet-stream", body: fs.readFileSync(file) });
  });
}

// One single-process browser per test (a --single-process Chromium cannot open a second context).
export const test = base.extend<{ page: Page }>({
  page: async ({}, provide) => {
    const browser = await chromium.launch({ args: ["--single-process"] });
    const context = await browser.newContext({ baseURL: ORIGIN, locale: "fr-FR" });
    const page = await context.newPage();
    await serve(page);
    await provide(page);
    await browser.close();
  },
});

export const MOBILE = { width: 390, height: 844 };
export const DESKTOP = { width: 1366, height: 900 };
export { expect } from "@playwright/test";
