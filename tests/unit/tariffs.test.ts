import { describe, expect, it } from "vitest";
import { TARIFFS } from "@/config/tariffs";
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
