import { describe, expect, it } from "vitest";
import { fromPrice, serviceRows, TARIFFS } from "@/config/tariffs";
import { alignPrices, allEntries } from "@/lib/content";
import { SERVICES } from "@/config/services";

// Every row of the client PDF « Tarifs Novembre 2025 », in order: category | label | treatment | price | condition.
const EXPECTED = [
  "Diagnostic | Diagnostic |  | Gratuit | ",
  "Punaises de lit | Punaises de lit | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Punaises de lit | Punaises de lit | Vapeur + chimique | 450 € | ",
  "Punaises de lit | Punaises de lit | Tente chauffante | 500 € | ",
  "Punaises de lit | Punaises de lit | Tente chauffante + vapeur | 800 € | ",
  "Blattes / Cafards | Blattes / Cafards | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Blattes / Cafards | Blattes / Cafards | Gel | 110 € | Surface < 80 m²",
  "Blattes / Cafards | Blattes / Cafards | Gel contact encadrement porte principale | 90 € | ",
  "Guêpes et frelons | Guêpes |  | 110 € | ",
  "Guêpes et frelons | Frelons |  | 130 € | ",
  "Fourmis | Fourmis | Gel | 150 € | Forfait",
  "Autres insectes | Poissons d'argent | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Autres insectes | Mille-pattes | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Autres insectes | Mouches de grenier | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Autres insectes | Mouches à drain | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Autres insectes | Gale | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Autres insectes | Puces | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Autres insectes | Anthrène | Nébulisation / Pulvérisation | 3 €/m² | ",
  "Rats et souris | Rats |  | 20 €/boîte | ",
  "Rats et souris | Souris |  | 10 €/boîte | ",
  "Pigeons | Dépigeonnage |  | Sur devis | À partir de 600 € + nacelle",
  "Pigeons | Cage de relevage |  | Sur devis | ",
  "Pigeons | Pic |  | Sur devis | ",
  "Pigeons | Filet |  | Sur devis | ",
  "Déplacement | Déplacement |  | 70 € | ",
];

describe("official tariff grid (November 2025)", () => {
  it("holds every row of the PDF, exactly and in order", () => {
    const rows = TARIFFS.flatMap((c) => c.rows.map((r) => [c.title, r.label, r.treatment ?? "", r.price, r.condition ?? ""].join(" | ")));
    expect(rows).toHaveLength(25);
    expect(rows).toEqual(EXPECTED);
  });

  it("links each bookable category to an existing service", () => {
    const keys = new Set(SERVICES.map((s) => s.key));
    for (const c of TARIFFS) if (c.service) expect(keys.has(c.service)).toBe(true);
    expect(TARIFFS.filter((c) => !c.service).map((c) => c.title)).toEqual(["Diagnostic", "Déplacement"]);
  });
});

describe("grid prices site-wide (M60)", () => {
  it("fromPrice is the lowest grid price of a service, none for « sur devis » or ungridded services", () => {
    expect(fromPrice("deratisation")).toBe("10 €/boîte");
    expect(fromPrice("punaises-de-lit")).toBe("3 €/m²");
    expect(fromPrice("desinsectisation")).toBe("3 €/m²");
    expect(fromPrice("guepes-frelons")).toBe("110 €");
    expect(fromPrice("depigeonnage")).toBeUndefined();
    expect(fromPrice("desinfection")).toBeUndefined();
  });

  it("alignPrices swaps € tables for the grid, keeps prose and ungridded services", () => {
    const body = "Intro à 99 €.\n\n| A | B |\n| - | - |\n| Rat | 25 € |\n\nTexte.\n\n| X | 1 € |\n| Y | 2 € |\n\n| Zone | Délai |\n| - | - |\n| Lyon | 24h |\n";
    const out = alignPrices(body, "deratisation");
    expect(out).toContain("Intro à 99 €.");
    expect(out).toContain("| **Rats** | 20 €/boîte |");
    expect(out).toContain("| **Déplacement** | 70 € |");
    expect(out).not.toMatch(/25 €|1 €\s\||2 €/);
    expect(out.match(/\| Prestation \|/g)).toHaveLength(1);
    expect(out).toContain("Montants à jour");
    expect(out).toContain("| Lyon | 24h |");
    expect(alignPrices(body, "desinfection")).toBe(body);
  });

  it("no content page shows a € table cell outside the grid for a gridded service", () => {
    const prices = new Set(TARIFFS.flatMap((c) => c.rows.map((r) => r.price)));
    const bad = allEntries()
      .filter((e) => serviceRows(e.service).length)
      .flatMap((e) => e.body.split("\n").filter((l) => /^\s*\|.*€/.test(l)).map((l) => [e.slug, l] as const))
      .filter(([, l]) => !l.split("|").some((c) => prices.has(c.trim())));
    expect(bad).toEqual([]);
  });
});
