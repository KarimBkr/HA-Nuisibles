import { describe, expect, it } from "vitest";
import { PRICE_RE } from "@/lib/content";
import { prices } from "@/config/home";
import { pricesNav } from "@/config/navigation";
import { TARIFFS } from "@/config/tariffs";


describe("home price preview", () => {
  it("shows at least 3 prices, each linked to a price page", () => {
    expect(prices.items.length).toBeGreaterThanOrEqual(3);
    for (const p of prices.items) {
      expect(p.text).toMatch(new RegExp(PRICE_RE));
      expect(pricesNav.map((l) => l.href)).toContain(p.href);
    }
  });

  it("every figure shown is a price of the official grid (M60)", () => {
    const grid = new Set(TARIFFS.flatMap((c) => c.rows.map((r) => r.price)));
    expect(prices.items.filter((p) => !grid.has(p.text.replace(/^dès /, "")))).toEqual([]);
  });
});
