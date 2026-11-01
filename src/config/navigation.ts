// Header and footer menus (DESIGN.md §Information architecture, PDF_BRIEF.md §4). Every href is an old-site URL or a new route.
import { SERVICES } from "./services";

export type NavLink = { label: string; href: string };

export const BOOKING_HREF = "/rendez-vous/";

export const mainNav: NavLink[] = [
  { label: "Dératisation", href: "/deratisation-lyon-2/" },
  { label: "Punaises de lit", href: "/entreprise-punaises-de-lit-lyon/" },
  { label: "Désinsectisation", href: "/desinsectisation-lyon-2/" },
  { label: "Guêpes & frelons", href: "/destruction-nid-guepes-frelons/" },
];

// "Nos services" dropdown: the hub, then every service.
export const servicesNav: NavLink[] = [
  { label: "Tous nos services", href: "/nos-services/" },
  ...SERVICES.map((s) => ({ label: s.label, href: `/${s.mainSlug}/` })),
];

export const secondaryNav: NavLink[] = [
  { label: "Conseils", href: "/conseils-nuisibles/" },
  { label: "Contact", href: "/contact/" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Dératisation", href: "/deratisation-lyon-2/" },
      { label: "Désinsectisation", href: "/desinsectisation-lyon-2/" },
      { label: "Dépigeonnage", href: "/depigeonnage/" },
      { label: "Traitement des punaises de lit", href: "/entreprise-punaises-de-lit-lyon/" },
      { label: "Désinfection", href: "/desinfection/" },
      { label: "Traitement contre les moustiques", href: "/demoustication/" },
      { label: "Nids de guêpes et frelons à Villeurbanne", href: "/nid-guepes-frelons-villeurbanne/" },
      { label: "Nids de guêpes et frelons à Lyon", href: "/nid-guepes-frelons-lyon/" },
      { label: "Zones d'intervention", href: "/zones-d-intervention/" },
    ],
  },
  {
    title: "Nuisibles",
    links: [
      { label: "Punaises de lit à Lyon", href: "/entreprise-punaises-de-lit-lyon/" },
      { label: "Moustiques tigres", href: "/demoustication/" },
      { label: "Rats", href: "/comment-se-debarrasser-des-rats-solutions-efficaces/" },
      { label: "Blattes et cafards", href: "/guide-cafards-blattes/" },
      { label: "Guêpes et frelons", href: "/destruction-nid-guepes-frelons/" },
      { label: "Pigeons", href: "/comment-faire-fuir-les-pigeons/" },
      { label: "Chenilles", href: "/comment-se-debarrasser-des-chenilles/" },
      { label: "Nids de guêpes", href: "/nid-de-guepes/" },
    ],
  },
  {
    title: "Tarifs",
    links: [
      { label: "Tarifs de désinsectisation", href: "/tarif-desinsectisation-lyon/" },
      { label: "Prix de traitement des cafards", href: "/tarif-desinsectisation-cafard-2026/" },
      { label: "Tarifs de désinfection", href: "/tarif-societe-de-desinfection/" },
      { label: "Prix de destruction des nids de guêpes", href: "/tarif-destruction-nid-de-guepes/" },
      { label: "Traitement des punaises de lit", href: "/prix-traitement-punaise-de-lit/" },
      { label: "Prix d'une dératisation", href: "/prix-deratisation/" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales/" },
  { label: "Politique de confidentialité", href: "/confidentalite/" },
];
