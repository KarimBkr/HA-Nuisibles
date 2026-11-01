import { describe, expect, it } from "vitest";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs";
import LeaderList from "@/components/ui/LeaderList";
import Rail, { RAIL_MAX } from "@/components/ui/Rail";
import { prices } from "@/config/home";

// M42 design system components.
describe("LeaderList", () => {
  const items = [
    { label: "Dératisation", value: "dès 150 €", href: "/tarifs/" },
    { label: "Punaises de lit", value: "dès 290 €" },
  ];
  const html = renderToStaticMarkup(h(LeaderList, { items }));
  it("renders one row per item with label then value", () => {
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html.indexOf("Dératisation")).toBeLessThan(html.indexOf("dès 150 €"));
  });
  it("links only rows with an href and hides the dots from screen readers", () => {
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toMatch(/href="\/tarifs\/?"/);
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(2);
  });
  it("renders the real home prices as linked rows", () => {
    const rows = prices.items.map((p) => ({ label: p.label, value: p.text, href: p.href }));
    const out = renderToStaticMarkup(h(LeaderList, { items: rows }));
    expect(out.match(/<a /g)).toHaveLength(prices.items.length);
  });
});

describe("Rail", () => {
  const cards = (n: number) => Array.from({ length: n }, (_, i) => h("p", null, `Avis ${i + 1}`));
  it("renders every item in the HTML, a focusable snap track and desktop arrows", () => {
    const html = renderToStaticMarkup(h(Rail, { label: "Avis clients", items: cards(3) }));
    expect(html.match(/Avis \d/g)).toEqual(["Avis 1", "Avis 2", "Avis 3"]);
    expect(html).toContain("snap-x");
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-label="Suivant"');
    expect(html).not.toMatch(/autoplay|setInterval/);
  });
  it(`refuses more than ${RAIL_MAX} items`, () => {
    expect(() => renderToStaticMarkup(h(Rail, { label: "Trop", items: cards(RAIL_MAX + 1) }))).toThrow(/at most/);
  });
  it("has no autoplay in its source", () => {
    expect(fs.readFileSync("src/components/ui/Rail.tsx", "utf8")).not.toMatch(/setInterval|setTimeout/);
  });
});
