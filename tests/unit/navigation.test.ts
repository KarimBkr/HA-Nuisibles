import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { footerColumns, legalNav, mainNav, secondaryNav, servicesNav } from "@/config/navigation";

// New routes built by later milestones; every other link must be an imported old page or post.
const NEW_ROUTES = ["/rendez-vous/", "/nos-services/", "/zones-d-intervention/", "/conseils-nuisibles/", "/contact/"];

describe("navigation", () => {
  const links = [...mainNav, ...servicesNav, ...secondaryNav, ...legalNav, ...footerColumns.flatMap((c) => c.links)];
  it.each(links.map((l) => [l.label, l.href]))("%s → %s resolves", (_label, href) => {
    expect(href).toMatch(/^\/[a-z0-9-]+\/$/);
    const slug = href.slice(1, -1);
    const exists = ["pages", "posts"].some((d) => fs.existsSync(`content/${d}/${slug}.md`));
    expect(exists || NEW_ROUTES.includes(href)).toBe(true);
  });
});
