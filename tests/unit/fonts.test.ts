import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// M42: two families, four faces: Instrument Serif 400 + italic (titles), Poppins 400/500 (text).
describe("fonts", () => {
  it("layout imports only Poppins 400/500 and Instrument Serif 400/italic", () => {
    const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
    expect(layout.match(/@fontsource\/[\w-]+\/[\w-]+\.css/g)).toEqual([
      "@fontsource/poppins/400.css",
      "@fontsource/poppins/500.css",
      "@fontsource/instrument-serif/400.css",
      "@fontsource/instrument-serif/400-italic.css",
    ]);
  });
  it("no source asks for another weight", () => {
    const hits = execSync("grep -rnE 'font-(thin|extralight|light|semibold|extrabold|black)\\b|font-weight: *[1-36789]00' src || true").toString();
    expect(hits).toBe("");
  });
  it("built CSS references only those font files", () => {
    const dir = "out/_next/static/css";
    if (!fs.existsSync(dir)) return; // unit run before the first build
    const css = fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("");
    const faces = new Set([...css.matchAll(/media\/([a-z-]+?)-(?:latin-ext|latin|devanagari)-(\d00-(?:normal|italic))\./g)].map((m) => `${m[1]} ${m[2]}`));
    expect([...faces].sort()).toEqual(["instrument-serif 400-italic", "instrument-serif 400-normal", "poppins 400-normal", "poppins 500-normal"]);
  });
});
