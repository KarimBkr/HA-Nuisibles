import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Client's consistency points (2026-11-02): one brand « HA Nuisibles », one promise « sous 24h », hours Mon–Sat 9h–18h.
const ROOT = path.resolve(__dirname, "../../content");
const files = ["pages", "posts"].flatMap((d) =>
  fs.readdirSync(path.join(ROOT, d)).map((f) => path.join(ROOT, d, f)),
);
// The old* frontmatter fields are history, and the legal notice keeps the legal entity name.
const shown = (f: string) =>
  fs.readFileSync(f, "utf8").split("\n").filter((l) => !/^old/.test(l)).join("\n");

const hits = (re: RegExp, skip: (f: string) => boolean = () => false) =>
  files.filter((f) => !skip(f) && re.test(shown(f))).map((f) => path.basename(f));

describe("client consistency points", () => {
  it("uses the single brand « HA Nuisibles » outside the legal notice", () => {
    expect(hits(/Ha Nuisibles|Nuisibles 3D/, (f) => f.endsWith("mentions-legales.md"))).toEqual([]);
  });
  it("promises an intervention within 24h, never 2h or 48h", () => {
    expect(hits(/sous 2 ?h\b|moins de (2|deux) heures|moins de 48|24 ?h ?\/ ?24/i)).toEqual(
      // a customer's quoted review, kept verbatim
      ["destruction-nid-guepes-frelons.md"],
    );
  });
});
