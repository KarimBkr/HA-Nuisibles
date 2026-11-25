// Business data, taken from the old site https://hanuisibles.fr/ (see .athanor/docs/OLD_SITE.md §1 and §3). Never invent a value here.

export type OpeningHours = { days: string; hours: string };

const LYON = ["Croix-Rousse", "Monplaisir", "Bellecour", "Vaise", "Guillotière", "Part-Dieu", "Vieux Lyon", "Jean-Macé"] as const;
const VILLEURBANNE = ["Gratte-Ciel", "Charpennes", "Tonkin", "Cusset", "Grandclément"] as const;

export const site = {
  name: "HA Nuisibles",
  legalName: "HA Nuisibles 3D",
  legalForm: "Entreprise individuelle",
  publisher: "Abdeli Hebbache",
  // Live domain (Vercel, apex 308 → www). hanuisibles.fr is a parked, noindex Hostinger page: never point canonicals there.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.ha-nuisibles.fr",
  tagline: "Expert anti nuisibles – Dératisation & désinsectisation",
  description:
    "HA Nuisibles est une entreprise spécialisée dans la dératisation et la désinsectisation, basée à Villeurbanne. Nous intervenons rapidement à Lyon, Villeurbanne et dans toute la région Rhône-Alpes pour éradiquer rats, souris, punaises de lit, cafards, guêpes, frelons et autres nuisibles. Solutions certifiées, devis gratuit, accompagnement sur-mesure pour particuliers, professionnels et collectivités.",
  phone: {
    display: "07 64 46 46 91",
    tel: "+33764464691",
  },
  email: "contact@hanuisibles3d.fr",
  address: {
    street: "127 cours Tolstoï",
    postalCode: "69100",
    city: "Villeurbanne",
    region: "Rhône-Alpes",
    country: "FR",
  },
  geo: { lat: 45.760335, lng: 4.879522 },
  // Opening hours chosen by the client (2026-11-01): Monday to Saturday 9h–18h, Sunday emergencies only.
  hours: [
    { days: "Lundi au samedi", hours: "9h – 18h" },
    { days: "Dimanche", hours: "Urgences uniquement (majoration de 50 %)" },
  ] satisfies OpeningHours[],
  availability: "7/7",
  // Online booking on Cal.com (one event type per service, all synced with the client's Google Calendar).
  // Every intervention is booked as one 1 h slot (client, 2026-11-13); keep the Cal.com event types at 1 h. Keys = ServiceKey + "urgence-dimanche".
  booking: {
    base: "https://cal.com/ha-nuisibles/",
    hours: {
      deratisation: 1,
      "punaises-de-lit": 1,
      desinsectisation: 1,
      "guepes-frelons": 1,
      demoustication: 1,
      depigeonnage: 1,
      desinfection: 1,
      "urgence-dimanche": 1,
    },
    days: "du lundi au samedi, urgences le dimanche",
    // Online booking slots (client, 2026-11-01): shown on /rendez-vous/ only; the phone hours above stay the site-wide ones.
    schedule: ["Lundi au samedi : 9h – 18h", "Dimanche : urgences uniquement (majoration de 50 %)"],
  },
  socials: {
    instagram: "https://www.instagram.com/ha_nuisibles/",
    facebook: "https://www.facebook.com/people/HA-Nuisibles/61575659115504/",
    // Google Business Profile (client, 2026-11-25): footer link and business sameAs.
    google: "https://share.google/9NDSqUKEzPx1YSs3D",
  },
  // Direct « write a review » link (client, 2026-11-25); public, so it is also the fallback when the env var is unset.
  reviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://g.page/r/CRjoESu5nUf_EBM/review",
  priceRange: "€€",
  promises: [
    "Intervention sous 24h",
    "Devis gratuit sans engagement",
    "Garantie de résultat",
    "Techniciens certifiés Certibiocide",
  ],
  zone: {
    villeurbanne: VILLEURBANNE,
    lyon: LYON,
    nearby: ["Bron", "Caluire-et-Cuire", "Vénissieux", "Vaulx-en-Velin", "Décines"],
    // Cities listed on the old Contact page.
    contactCities: [
      "Lyon",
      "Villeurbanne",
      "Grenoble",
      "Annecy",
      "Bourg-en-Bresse",
      "Villefranche-sur-Saône",
      "Saint-Étienne",
      "Annemasse",
    ],
    areas: ["Rhône", "Isère", "Haute-Savoie", "Rhône-Alpes"],
  },
  // Cities with a local page (city slug of the frontmatter → display name, postcode, districts). M77 adds the five
  // neighbouring towns of site.zone.nearby; districts are public place names, never invented cases.
  cities: {
    lyon: { name: "Lyon", postalCode: "69001–69009", districts: LYON },
    villeurbanne: { name: "Villeurbanne", postalCode: "69100", districts: VILLEURBANNE },
    bron: { name: "Bron", postalCode: "69500", districts: ["Centre", "Parilly", "Terraillon", "Rebufer", "Les Essarts", "Plateau de Bron"] },
    caluire: { name: "Caluire-et-Cuire", postalCode: "69300", districts: ["Saint-Clair", "Montessuy", "Cuire-le-Bas", "Cuire-le-Haut", "Vassieux", "Bissardon"] },
    venissieux: { name: "Vénissieux", postalCode: "69200", districts: ["Centre", "Les Minguettes", "Moulin-à-Vent", "Parilly", "Charréard", "Max Barel"] },
    "vaulx-en-velin": { name: "Vaulx-en-Velin", postalCode: "69120", districts: ["Village", "Mas du Taureau", "Carré de Soie", "La Grappinière", "Les Noirettes", "Pont des Planches"] },
    decines: { name: "Décines-Charpieu", postalCode: "69150", districts: ["Centre", "Charpieu", "Le Grand Large", "Montout", "Prainet", "La Berthaudière"] },
  } as Record<string, { name: string; postalCode: string; districts: readonly string[] }>,
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    email: "privacy@vercel.com",
  },
} as const;

// The client's cream illustration (404, blog list header).
export const illustration = {
  src: "/images/desinsectisation-a-villeurbanne-et-toute-sa-region.webp",
  alt: "Illustration HA Nuisibles : technicien en tenue de protection pulvérisant un traitement contre des insectes",
};
export const telHref = `tel:${site.phone.tel}`;
