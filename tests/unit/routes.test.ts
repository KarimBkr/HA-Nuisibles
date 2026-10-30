import { describe, expect, it } from "vitest";
import inventory from "../../content/url-inventory.json";
import { OWN_ROUTES, renderMarkdown, routedEntries } from "@/lib/content";

// Home, contact and the blog index (own routes) and categories (M12) are served elsewhere.
const served = inventory.filter((i) => (i.type === "page" || i.type === "post") && !OWN_ROUTES.has(i.path.replaceAll("/", "")));

describe("old URLs", () => {
  it("routes every old page and post except the own routes", () => {
    expect(served).toHaveLength(69);
    expect(routedEntries().map((e) => `/${e.slug}/`).sort()).toEqual(served.map((i) => i.path).sort());
  });

  it("rewrites links to the old domain as site-relative", () => {
    const html = renderMarkdown("[a](https://hanuisibles.fr) [b](https://hanuisibles.fr/prix-deratisation/) [c](https://example.org/)");
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/prix-deratisation/"');
    expect(html).toContain('href="https://example.org/"');
  });
});
