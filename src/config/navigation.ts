// Header and footer menus (DESIGN.md §Information architecture, PDF_BRIEF.md §4). Every href is an old-site URL or a new route.
import { SERVICES } from "./services";

export type NavLink = { label: string; href: string };

export const BOOKING_HREF = "/rendez-vous/";

export const PRICES_HREF = "/tarifs/";

// "Services" dropdown: the 7 services, then the hub.
export const servicesNav: NavLink[] = [
  ...SERVICES.map((s) => ({ label: s.label, href: `/${s.mainSlug}/` })),
  { label: "Tous nos services", href: "/nos-services/" },
];

// After the dropdown: one link each, then the two buttons (client plan item 3: no duplicate service links).
export const mainNav: NavLink[] = [
  { label: "Tarifs", href: PRICES_HREF },
  { label: "Conseils", href: "/conseils-nuisibles/" },
  { label: "Contact", href: "/contact/" },
];

// The old site's price pages, listed by the /tarifs/ hub and the footer.
export const pricesNav: NavLink[] = [
  { label: "Prix d'une dératisation", href: "/prix-deratisation/" },
  { label: "Prix du traitement des punaises de lit", href: "/prix-traitement-punaise-de-lit/" },
  { label: "Tarifs de désinsectisation", href: "/tarif-desinsectisation-lyon/" },
  { label: "Prix de traitement des cafards", href: "/tarif-desinsectisation-cafard-2026/" },
  { label: "Prix de destruction des nids de guêpes", href: "/tarif-destruction-nid-de-guepes/" },
  { label: "Tarifs de dépigeonnage", href: "/depigeonnage-tarif/" },
  { label: "Tarifs de désinfection", href: "/tarif-societe-de-desinfection/" },
];

// Footer link columns (Contact is the third column, built in Footer.tsx).
export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [...servicesNav, { label: "Zones d'intervention", href: "/zones-d-intervention/" }],
  },
  { title: "Tarifs", links: [{ label: "Tous nos tarifs", href: PRICES_HREF }, ...pricesNav] },
];

export const legalNav: NavLink[] = [
  { label: "À propos", href: "/a-propos/" },
  { label: "Garanties", href: "/garanties/" },
  { label: "Avis clients", href: "/avis/" },
  { label: "Mentions légales", href: "/mentions-legales/" },
  { label: "Politique de confidentialité", href: "/confidentalite/" },
];
