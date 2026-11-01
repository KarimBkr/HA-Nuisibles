import { describe, expect, it } from "vitest";
import { site, telHref } from "@/config/site";
import { SERVICES } from "@/config/services";

describe("business data", () => {
  it("has a French phone number in display and E.164 forms that match", () => {
    expect(site.phone.display).toMatch(/^0\d( \d\d){4}$/);
    expect(site.phone.tel).toMatch(/^\+33\d{9}$/);
    expect(site.phone.tel.slice(3)).toBe(site.phone.display.replace(/ /g, "").slice(1));
    expect(telHref).toBe("tel:+33764464691");
  });

  it("has the old site's address and email", () => {
    expect(site.address).toMatchObject({ street: "127 cours Tolstoï", postalCode: "69100", city: "Villeurbanne" });
    expect(site.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
  });

  it("lists opening hours for the whole week", () => {
    expect(site.hours.map((h) => h.days)).toEqual(["Lundi au Vendredi", "Samedi", "Dimanche"]);
    for (const h of site.hours) expect(h.hours.length).toBeGreaterThan(0);
  });

  it("books every service with the longest duration, 7 days a week", () => {
    expect(site.booking.days).toBe("7 jours sur 7");
    expect(Object.keys(site.booking.hours).sort()).toEqual([...SERVICES.map((s) => s.key), "urgence-dimanche"].sort());
    expect(site.booking.hours).toMatchObject({ deratisation: 4, "punaises-de-lit": 5, "guepes-frelons": 1 });
  });

  it("has unique service keys and slugs", () => {
    const slugs = SERVICES.flatMap((s) => [s.mainSlug, ...s.relatedSlugs]);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(SERVICES.map((s) => s.key)).size).toBe(SERVICES.length);
  });
});
