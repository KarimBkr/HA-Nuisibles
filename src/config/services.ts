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
  /** Client photo of a technician at work, shown in the hero when the page's own image is an animal close-up. */
  heroPhoto?: string;
};

export const SERVICES: Service[] = [
  {
    key: "deratisation",
    label: "Dératisation",
    pests: ["Rats", "Souris"],
    mainSlug: "deratisation-lyon-2",
    heroPhoto: "/images/villeurbanne-intervention-nuisibles.webp",
    relatedSlugs: ["deratisation-villeurbanne", "desourisation", "prix-deratisation"],
    icon: "Rat",
  },
  {
    key: "punaises-de-lit",
    label: "Punaises de lit",
    pests: ["Punaises de lit"],
    mainSlug: "entreprise-punaises-de-lit-lyon",
    heroPhoto: "/images/intervention-bourg-en-bresse.webp",
    relatedSlugs: ["punaise-de-lit-a-villeurbanne", "prix-traitement-punaise-de-lit", "punaises-de-lit-que-faire"],
    icon: "Bug",
  },
  {
    key: "desinsectisation",
    label: "Désinsectisation",
    pests: ["Cafards", "Blattes", "Fourmis", "Chenilles processionnaires"],
    mainSlug: "desinsectisation-lyon-2",
    heroPhoto: "/images/intervention-rapide-a-lyon-contre-cafards-punaises-moustiques-et-guepes-e2-80-93-equipe-certifiee-devis-gratuit.webp",
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
    heroPhoto: "/images/intervention-nid-de-guepes-a-lyon.webp",
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
    heroPhoto: "/images/depigeonnage-a-villeurbanne-e2-80-93-intervention-rapide-contre-les-pigeons-envahissants.webp",
    relatedSlugs: ["depigeonnage-tarif", "comment-faire-fuir-les-pigeons"],
    icon: "Bird",
  },
  {
    key: "demoustication",
    label: "Démoustication",
    pests: ["Moustiques", "Moustiques tigres"],
    mainSlug: "demoustication",
    heroPhoto: "/images/intervention-rapide-a-lyon-contre-cafards-punaises-moustiques-et-guepes-e2-80-93-equipe-certifiee-devis-gratuit.webp",
    relatedSlugs: ["comment-eloigner-les-moustiques"],
    icon: "Wind",
  },
  {
    key: "desinfection",
    label: "Désinfection",
    pests: ["Virus", "Bactéries"],
    mainSlug: "desinfection",
    heroPhoto: "/images/villeurbanne-intervention-nuisibles.webp",
    relatedSlugs: ["tarif-societe-de-desinfection"],
    icon: "SprayCan",
  },
];

// Every pest treated, with its most specific page (services hub, ≤2 clicks from the header).
export const PESTS: { name: string; slug: string; service: ServiceKey }[] = [
  { name: "Rats", slug: "deratisation-lyon-2", service: "deratisation" },
  { name: "Souris", slug: "deratisation-villeurbanne", service: "deratisation" },
  { name: "Punaises de lit", slug: "entreprise-punaises-de-lit-lyon", service: "punaises-de-lit" },
  { name: "Cafards et blattes", slug: "guide-cafards-blattes", service: "desinsectisation" },
  { name: "Fourmis", slug: "comment-se-debarrasser-des-fourmis", service: "desinsectisation" },
  { name: "Chenilles processionnaires", slug: "comment-se-debarrasser-des-chenilles", service: "desinsectisation" },
  { name: "Guêpes", slug: "nid-de-guepes-villeurbanne", service: "guepes-frelons" },
  { name: "Frelons", slug: "destruction-nid-guepes-frelons", service: "guepes-frelons" },
  { name: "Moustiques", slug: "demoustication", service: "demoustication" },
  { name: "Pigeons", slug: "depigeonnage", service: "depigeonnage" },
  { name: "Virus et bactéries (désinfection)", slug: "desinfection", service: "desinfection" },
];

// Client images that show a technician, an intervention or the city, or a flat illustration (client, 2026-11-02), never an animal close-up photo (M36).
export const HERO_IMAGES = [
  "/images/depigeonnage-a-villeurbanne-e2-80-93-intervention-rapide-contre-les-pigeons-envahissants.webp",
  "/images/intervention-bourg-en-bresse.webp",
  "/images/villeurbanne-intervention-nuisibles.webp",
  "/images/intervention-nid-de-guepes-a-lyon.webp",
  "/images/intervention-nid-de-guepes-a-villeurbanne.webp",
  "/images/intervention-rapide-a-lyon-contre-cafards-punaises-moustiques-et-guepes-e2-80-93-equipe-certifiee-devis-gratuit.webp",
  "/images/desinsectisation-a-villeurbanne-et-toute-sa-region.webp",
  "/images/deratisation-villeurbanne-scaled.webp",
];

// Crop of the tall (2:3) illustrations in the 16:9 hero: keeps the pigeon's head and the technician's face in view.
export const HERO_POSITION: Record<string, string> = {
  "/images/depigeonnage-a-villeurbanne-e2-80-93-intervention-rapide-contre-les-pigeons-envahissants.webp": "object-[50%_28%]",
  "/images/intervention-rapide-a-lyon-contre-cafards-punaises-moustiques-et-guepes-e2-80-93-equipe-certifiee-devis-gratuit.webp": "object-[50%_30%]",
};

// Hero image of a service page: its own image if it shows people at work, else the service's photo, else none (icon panel).
export function heroImage(image: string | undefined, service: Service | undefined): string | undefined {
  return image && HERO_IMAGES.includes(image) ? image : service?.heroPhoto;
}
