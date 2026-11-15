import type { ServiceKey } from "@/config/services";

// Official tariff grid « Tarifs HA nuisibles 3D — Novembre 2025 » (client PDF, request of 2026-11-15).
// Copied exactly, in the PDF's order: never round, rephrase or add an amount here.

export type TariffRow = {
  label: string; // pest or service
  treatment?: string;
  price: string;
  condition?: string;
};

export type TariffCategory = {
  title: string;
  service?: ServiceKey; // its service page and /rendez-vous/#key
  rows: TariffRow[];
};

export const TARIFFS_EDITION = "Tarifs novembre 2025";

const SPRAY = "Nébulisation / Pulvérisation";
const PER_M2 = "3 €/m²";

export const TARIFFS: TariffCategory[] = [
  { title: "Diagnostic", rows: [{ label: "Diagnostic", price: "Gratuit" }] },
  {
    title: "Punaises de lit",
    service: "punaises-de-lit",
    rows: [
      { label: "Punaises de lit", treatment: SPRAY, price: PER_M2 },
      { label: "Punaises de lit", treatment: "Vapeur + chimique", price: "450 €" },
      { label: "Punaises de lit", treatment: "Tente chauffante", price: "500 €" },
      { label: "Punaises de lit", treatment: "Tente chauffante + vapeur", price: "800 €" },
    ],
  },
  {
    title: "Blattes / Cafards",
    service: "desinsectisation",
    rows: [
      { label: "Blattes / Cafards", treatment: SPRAY, price: PER_M2 },
      { label: "Blattes / Cafards", treatment: "Gel", price: "110 €", condition: "Surface < 80 m²" },
      { label: "Blattes / Cafards", treatment: "Gel contact encadrement porte principale", price: "90 €" },
    ],
  },
  {
    title: "Guêpes et frelons",
    service: "guepes-frelons",
    rows: [
      { label: "Guêpes", price: "110 €" },
      { label: "Frelons", price: "130 €" },
    ],
  },
  {
    title: "Fourmis",
    service: "desinsectisation",
    rows: [{ label: "Fourmis", treatment: "Gel", price: "150 €", condition: "Forfait" }],
  },
  {
    title: "Autres insectes",
    service: "desinsectisation",
    rows: ["Poissons d'argent", "Mille-pattes", "Mouches de grenier", "Mouches à drain", "Gale", "Puces", "Anthrène"].map(
      (label) => ({ label, treatment: SPRAY, price: PER_M2 }),
    ),
  },
  {
    title: "Rats et souris",
    service: "deratisation",
    rows: [
      { label: "Rats", price: "20 €/boîte" },
      { label: "Souris", price: "10 €/boîte" },
    ],
  },
  {
    title: "Pigeons",
    service: "depigeonnage",
    rows: [
      { label: "Dépigeonnage", price: "Sur devis", condition: "À partir de 600 € + nacelle" },
      { label: "Cage de relevage", price: "Sur devis" },
      { label: "Pic", price: "Sur devis" },
      { label: "Filet", price: "Sur devis" },
    ],
  },
  { title: "Déplacement", rows: [{ label: "Déplacement", price: "70 €" }] },
];

// Unlinked rows (Diagnostic, Déplacement) apply to every intervention.
export const COMMON_ROWS = TARIFFS.filter((c) => !c.service).flatMap((c) => c.rows);
export const serviceRows = (key?: ServiceKey) => TARIFFS.filter((c) => key && c.service === key).flatMap((c) => c.rows);

/** One display line per row: « Punaises de lit · Vapeur + chimique », « 110 € (Surface < 80 m²) ». */
export const rowLabel = (r: TariffRow) => (r.treatment ? `${r.label} · ${r.treatment}` : r.label);
export const rowValue = (r: TariffRow) => (r.condition ? `${r.price} (${r.condition})` : r.price);

const amount = (price: string) => Number(price.match(/^(\d+(?:,\d+)?) €/)?.[1].replace(",", ".") ?? NaN);
/** Lowest grid price of a service (« 3 €/m² », « 110 € »), undefined when it is only « Sur devis » or has no row. */
export const fromPrice = (key?: ServiceKey) =>
  serviceRows(key)
    .filter((r) => !Number.isNaN(amount(r.price)))
    .reduce<TariffRow | undefined>((min, r) => (!min || amount(r.price) < amount(min.price) ? r : min), undefined)?.price;

/** The service's grid rows then the common rows, as a Markdown table (replaces the old-site price tables, see alignPrices). */
export const gridTable = (key: ServiceKey) =>
  [
    `| Prestation | Prix | Conditions |`,
    `| --- | --- | --- |`,
    ...[...serviceRows(key), ...COMMON_ROWS].map((r) => `| **${rowLabel(r)}** | ${r.price} | ${r.condition ?? ""} |`),
  ].join("\n");
