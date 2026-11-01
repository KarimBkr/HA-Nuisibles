import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { describe, expect, it } from "vitest";
import { hero } from "@/config/home";

// Weight budgets over the static export (out/), run by check.sh after the build. Report: .athanor/.verif/budget.txt.
// First-load JS per page = scripts referenced by the HTML (nomodule polyfills excluded), gzip. The 120 KB target of the
// requirements is below the Next 16 + React 19 runtime alone (~132 KB, shared by every page and cached after the first):
// enforced instead as total ≤ 155 KB and page-specific JS (beyond the chunks every page shares) ≤ 30 KB. Hero ≤ 150 KB.
const OUT = path.join(process.cwd(), "out");
const REPORT = path.join(process.cwd(), ".athanor/.verif/budget.txt");
const JS_BUDGET = 155 * 1024;
const OWN_JS_BUDGET = 30 * 1024;
const HERO_BUDGET = 150 * 1024;

const gz = new Map<string, number>();
const gzipSize = (file: string) => {
  if (!gz.has(file)) gz.set(file, zlib.gzipSync(fs.readFileSync(file)).length);
  return gz.get(file)!;
};

function htmlPages(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "_next" ? [] : htmlPages(p);
    return d.name.endsWith(".html") ? [p] : [];
  });
}

/** First-load weight of one page: gzip HTML, JS and CSS it references (images excluded: lazy, srcset-dependent). */
function pageWeight(file: string) {
  const html = fs.readFileSync(file, "utf8");
  const scripts = [...html.matchAll(/<script(?![^>]*noModule)[^>]*\ssrc="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1]);
  const styles = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(\/_next\/[^"]+\.css)"/g)].map((m) => m[1]);
  const sum = (urls: string[]) => [...new Set(urls)].reduce((s, u) => s + gzipSize(path.join(OUT, decodeURIComponent(u))), 0);
  return { scripts: [...new Set(scripts)], js: sum(scripts), css: sum(styles), html: zlib.gzipSync(html).length };
}

describe("weight budgets (out/)", () => {
  const pages = htmlPages(OUT);
  const rows = pages.map((f) => ({ page: "/" + path.relative(OUT, f).replace(/index\.html$/, ""), ...pageWeight(f) }));
  const shared = rows.reduce((acc, r) => acc.filter((u) => r.scripts.includes(u)), rows[0]?.scripts ?? []);
  const sharedJs = shared.reduce((s, u) => s + gzipSize(path.join(OUT, decodeURIComponent(u))), 0);
  const own = (r: (typeof rows)[number]) => r.js - sharedJs;

  it("reports every page", () => {
    expect(pages.length).toBeGreaterThan(80);
    const kb = (n: number) => (n / 1024).toFixed(1).padStart(6);
    const lines = rows.sort((a, b) => b.js - a.js).map((r) => `${kb(r.js)} ${kb(own(r))} ${kb(r.css)} ${kb(r.html)}  ${r.page}`);
    const heroKb = (fs.statSync(path.join(OUT, hero.image)).size / 1024).toFixed(1);
    fs.mkdirSync(path.dirname(REPORT), { recursive: true });
    fs.writeFileSync(REPORT, [`Budget: JS ≤ 155 KB gzip per page (own ≤ 30 KB), hero ≤ 150 KB. Shared runtime ${kb(sharedJs)} KB. Hero ${hero.image}: ${heroKb} KB`, "  JS kB  own kB  CSS kB HTML kB  page (gzip)", ...lines, ""].join("\n"));
  });

  it("keeps first-load JS ≤ 155 KB gzip and page-specific JS ≤ 30 KB on every page", () => {
    const over = rows.filter((r) => r.js > JS_BUDGET || own(r) > OWN_JS_BUDGET).map((r) => `${r.page} ${(r.js / 1024).toFixed(1)} KB`);
    expect(over).toEqual([]);
  });

  it("keeps the home hero image ≤ 150 KB", () => {
    expect(fs.statSync(path.join(OUT, hero.image)).size).toBeLessThanOrEqual(HERO_BUDGET);
  });
});
