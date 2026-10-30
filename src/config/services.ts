// Services and pests of the old site; drives navigation, footer, the services hub and related links.

export type ServiceKey =
  | "deratisation"
  | "punaises-de-lit"
  | "desinsectisation"
  | "guepes-frelons"
  | "depigeonnage"
  | "demoustication"
  | "desinfection";

export type Service = {
  key: ServiceKey;
  label: string;
  pests: string[];
  mainSlug: string;
  relatedSlugs: string[];
  icon: "Rat" | "Bug" | "BugOff" | "Hexagon" | "Bird" | "Wind" | "SprayCan";
};

export const SERVICES: Service[] = [
  {
    key: "deratisation",
    label: "Dératisation",
    pests: ["Rats", "Souris"],
    mainSlug: "deratisation-lyon-2",
    relatedSlugs: ["deratisation-villeurbanne", "prix-deratisation"],
    icon: "Rat",
  },
  {
    key: "punaises-de-lit",
    label: "Punaises de lit",
    pests: ["Punaises de lit"],
    mainSlug: "entreprise-punaises-de-lit-lyon",
    relatedSlugs: ["punaise-de-lit-a-villeurbanne", "prix-traitement-punaise-de-lit", "punaises-de-lit-que-faire"],
    icon: "Bug",
  },
  {
    key: "desinsectisation",
    label: "Désinsectisation",
    pests: ["Cafards", "Blattes", "Fourmis", "Chenilles processionnaires"],
    mainSlug: "desinsectisation-lyon-2",
    relatedSlugs: [
      "desinsectisation-villeurbanne",
      "tarif-desinsectisation-lyon",
      "tarif-desinsectisation-cafard-2026",
      "guide-cafards-blattes",
      "comment-se-debarrasser-des-fourmis",
      "comment-se-debarrasser-des-chenilles",
    ],
    icon: "BugOff",
  },
  {
    key: "guepes-frelons",
    label: "Guêpes et frelons",
    pests: ["Guêpes", "Frelons"],
    mainSlug: "destruction-nid-guepes-frelons",
    relatedSlugs: [
      "nid-guepes-frelons-lyon",
      "nid-guepes-frelons-villeurbanne",
      "nid-de-guepes-villeurbanne",
      "tarif-destruction-nid-de-guepes",
      "peut-on-laisser-un-nid-de-guepes",
    ],
    icon: "Hexagon",
  },
  {
    key: "depigeonnage",
    label: "Dépigeonnage",
    pests: ["Pigeons"],
    mainSlug: "depigeonnage",
    relatedSlugs: ["depigeonnage-tarif", "comment-faire-fuir-les-pigeons"],
    icon: "Bird",
  },
  {
    key: "demoustication",
    label: "Démoustication",
    pests: ["Moustiques", "Moustiques tigres"],
    mainSlug: "demoustication",
    relatedSlugs: ["comment-eloigner-les-moustiques"],
    icon: "Wind",
  },
  {
    key: "desinfection",
    label: "Désinfection",
    pests: ["Virus", "Bactéries"],
    mainSlug: "desinfection",
    relatedSlugs: ["tarif-societe-de-desinfection"],
    icon: "SprayCan",
  },
];
