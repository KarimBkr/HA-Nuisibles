import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allEntries } from "@/lib/content";
import { HERO_IMAGES, heroImage, SERVICES } from "@/config/services";

// M36: service heroes only show client photos of people at work (or the city), never an animal close-up.
describe("service hero photos", () => {
  it("every listed hero image exists in public/", () => {
    for (const src of [...HERO_IMAGES, ...SERVICES.map((s) => s.heroPhoto).filter(Boolean)]) {
      expect(HERO_IMAGES, src).toContain(src);
      expect(fs.existsSync(path.resolve(__dirname, "../../public", src!.slice(1))), src).toBe(true);
    }
  });
  it("service, local and guide pages pick a listed image or none", () => {
    const pages = allEntries().filter((e) => ["service", "local", "guide"].includes(e.kind));
    expect(pages.length).toBeGreaterThan(15);
    for (const e of pages) {
      const hero = heroImage(e.image, SERVICES.find((s) => s.key === e.service));
      if (hero) expect(HERO_IMAGES, e.slug).toContain(hero);
    }
    expect(heroImage("/images/demoustication.webp", SERVICES.find((s) => s.key === "demoustication"))).toBeUndefined();
  });
});
