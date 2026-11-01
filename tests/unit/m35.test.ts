import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PRICE_RE } from "@/lib/content";
import { prices } from "@/config/home";
import { pricesNav } from "@/config/navigation";

// M35: every figure of the home price preview occurs on the old site, and each card links to a real price page.
const OLD = path.resolve(__dirname, "../../.athanor/docs/OLD_SITE.md");
const norm = (s: string) => s.replace(/[\s ]+/g, " ").replace(/ ?€/g, "€").replace(/[*_]/g, "").toLowerCase();

describe("home price preview", () => {
  it("shows at least 3 prices, each linked to a price page", () => {
    expect(prices.items.length).toBeGreaterThanOrEqual(3);
    for (const p of prices.items) {
      expect(p.text).toMatch(new RegExp(PRICE_RE));
      expect(pricesNav.map((l) => l.href)).toContain(p.href);
    }
  });

  it.skipIf(!fs.existsSync(OLD))("every figure shown exists in OLD_SITE.md", () => {
    const old = norm(fs.readFileSync(OLD, "utf8"));
    expect(prices.items.filter((p) => !old.includes(norm(p.text)))).toEqual([]);
  });
});
