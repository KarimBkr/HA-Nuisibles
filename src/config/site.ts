// Business data, taken from the old site https://hanuisibles.fr/ (see .athanor/docs/OLD_SITE.md §1 and §3). Never invent a value here.

export type OpeningHours = { days: string; hours: string };

export const site = {
  name: "HA Nuisibles",
  legalName: "HA Nuisibles 3D",
  legalForm: "Entreprise individuelle",
  publisher: "Abdeli Hebbache",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hanuisibles.fr",
  tagline: "Expert Anti Nuisibles – Dératisation & Désinsectisation",
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
    { days: "Lundi au Samedi", hours: "9h – 18h" },
    { days: "Dimanche", hours: "Urgences uniquement (majoration de 50 %)" },
  ] satisfies OpeningHours[],
  availability: "7/7",
  // Online booking on Cal.com (one event type per service, all synced with the client's Google Calendar).
  // Hours = the longest the intervention can take (old site's duration table), reserved up front. Keys = ServiceKey + "urgence-dimanche".
  booking: {
    base: "https://cal.com/ha-nuisibles/",
    hours: {
      deratisation: 4,
      "punaises-de-lit": 5,
      desinsectisation: 2,
      "guepes-frelons": 1,
      demoustication: 4,
      depigeonnage: 4,
      desinfection: 5,
      "urgence-dimanche": 4,
    },
    days: "du lundi au samedi, urgences le dimanche",
    // Online booking slots (client, 2026-11-01): shown on /rendez-vous/ only; the phone hours above stay the site-wide ones.
    schedule: ["Lundi au samedi : 9h – 18h", "Dimanche : urgences uniquement (majoration de 50 %)"],
  },
  socials: {
    instagram: "https://www.instagram.com/ha_nuisibles/",
    facebook: "https://www.facebook.com/people/HA-Nuisibles/61575659115504/",
  },
  rating: { value: 5, count: 16, label: "5★ Google" },
  priceRange: "€€",
  promises: [
    "Intervention sous 24h",
    "Devis gratuit sans engagement",
    "Garantie de résultat",
    "Techniciens certifiés Certibiocide",
  ],
  zone: {
    villeurbanne: ["Gratte-Ciel", "Charpennes", "Tonkin", "Cusset", "Grandclément"],
    lyon: ["Croix-Rousse", "Monplaisir", "Bellecour", "Vaise", "Guillotière", "Part-Dieu", "Vieux Lyon", "Jean-Macé"],
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
  host: {
    name: "Hostinger International Ltd.",
    address: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
    email: "support@hostinger.com",
  },
} as const;

export const telHref = `tel:${site.phone.tel}`;
