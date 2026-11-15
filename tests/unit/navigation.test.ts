import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { footerColumns, legalNav, mainNav, pricesNav, servicesNav } from "@/config/navigation";

// New routes built by later milestones; every other link must be an imported old page or post.
const NEW_ROUTES = ["/rendez-vous/", "/nos-services/", "/zones-d-intervention/", "/conseils-nuisibles/", "/contact/", "/tarifs/", "/a-propos/", "/garanties/", "/avis/"];

describe("navigation", () => {
  const links = [...mainNav, ...servicesNav, ...pricesNav, ...legalNav, ...footerColumns.flatMap((c) => c.links)];
  it.each(links.map((l) => [l.label, l.href]))("%s → %s resolves", (_label, href) => {
    expect(href).toMatch(/^\/[a-z0-9-]+\/$/);
    const slug = href.slice(1, -1);
    const exists = ["pages", "posts"].some((d) => fs.existsSync(`content/${d}/${slug}.md`));
    expect(exists || NEW_ROUTES.includes(href)).toBe(true);
  });

  it("header: Services dropdown (7 + all) then Tarifs, Conseils, Contact; footer: 2 link columns + contact", () => {
    expect(servicesNav).toHaveLength(8);
    expect(mainNav.map((l) => l.label)).toEqual(["Tarifs", "Conseils", "Contact"]);
    expect(footerColumns.map((c) => c.title)).toEqual(["Services", "Tarifs"]);
    expect(footerColumns[0].links.some((l) => l.href === "/zones-d-intervention/")).toBe(true);
  });
});
