import type { Metadata } from "next";
import { site } from "@/config/site";
import { hero } from "@/config/home";
import type { NavLink } from "@/config/navigation";
import { lastUpdate, type Entry } from "@/lib/content";
import type { ServiceKey } from "@/config/services";
import { fromPrice } from "@/config/tariffs";

// Per-page metadata and JSON-LD (schema.org). No aggregateRating markup: the Google rating is shown, never marked up.

export const absUrl = (p: string) => new URL(p, site.url).toString();

export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const images = [absUrl(image || hero.image)];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "fr_FR", siteName: site.name, url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export const entryMetadata = (e: Entry, path = e.slug ? `/${e.slug}/` : "/") =>
  pageMetadata({ title: e.title, description: e.description, path, image: e.image });

const BUSINESS_ID = absUrl("/#entreprise");
const ORG_ID = absUrl("/#organisation");
const SITE_ID = absUrl("/#site");
const DAYS: Record<string, string[]> = {
  "Lundi au samedi": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

// Site-wide graph (layout): the website, the company and the local business, linked by @id.
export const siteLd = () => ({ "@context": "https://schema.org", "@graph": [websiteLd(), organizationLd(), localBusinessLd()] });

const websiteLd = () => ({ "@type": "WebSite", "@id": SITE_ID, name: site.name, url: absUrl("/"), inLanguage: "fr-FR", publisher: { "@id": ORG_ID } });

// sameAs: only the real profiles of site.socials.
const organizationLd = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  legalName: site.legalName,
  url: absUrl("/"),
  logo: absUrl("/icon.png"),
  telephone: site.phone.tel,
  email: site.email,
  sameAs: Object.values(site.socials),
});

function localBusinessLd() {
  return {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: absUrl("/"),
    image: absUrl(hero.image),
    logo: absUrl("/icon.png"),
    telephone: site.phone.tel,
    email: site.email,
    priceRange: site.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    // Hours of the old Contact page; Sunday is emergencies only, so it is not marked as open.
    openingHoursSpecification: site.hours.flatMap((h) => {
      const m = h.hours.match(/(\d+)h\s*–\s*(\d+)h/);
      return DAYS[h.days] && m
        ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[h.days], opens: `${m[1].padStart(2, "0")}:00`, closes: `${m[2].padStart(2, "0")}:00` }]
        : [];
    }),
    areaServed: [...new Set([...site.zone.contactCities, ...site.zone.nearby])].map((name) => ({ "@type": "City", name })),
    parentOrganization: { "@id": ORG_ID },
    sameAs: Object.values(site.socials),
  };
}

// « 3 €/m² » → price 3 with the unit kept in the text; undefined when the grid has no amount.
const offerLd = (key?: ServiceKey) => {
  const price = fromPrice(key);
  const amount = price?.match(/^(\d+(?:,\d+)?) €/)?.[1];
  return amount
    ? { "@type": "Offer", price: amount.replace(",", "."), priceCurrency: "EUR", description: `À partir de ${price} (grille tarifaire)`, url: absUrl("/tarifs/") }
    : undefined;
};

export const serviceLd = (e: Entry, serviceType: string, key?: ServiceKey) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: e.h1,
  serviceType,
  description: e.description,
  url: absUrl(`/${e.slug}/`),
  provider: { "@id": BUSINESS_ID },
  areaServed: e.city
    ? { "@type": "City", name: site.cities[e.city]?.name ?? e.city[0].toUpperCase() + e.city.slice(1) }
    : site.zone.contactCities.map((name) => ({ "@type": "City", name })),
  ...(offerLd(key) && { offers: offerLd(key) }),
});

export const breadcrumbLd = (items: NavLink[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: absUrl(it.href) })),
});

export const articleLd = (p: Entry) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: p.h1,
  description: p.description,
  url: absUrl(`/${p.slug}/`),
  mainEntityOfPage: absUrl(`/${p.slug}/`),
  ...(p.image && { image: absUrl(p.image) }),
  ...(p.date && { datePublished: p.date }),
  ...(lastUpdate(p) && { dateModified: lastUpdate(p) }),
  author: { "@type": "Organization", "@id": ORG_ID, name: site.name, url: absUrl("/") },
  publisher: { "@type": "Organization", "@id": ORG_ID, name: site.name, logo: { "@type": "ImageObject", url: absUrl("/icon.png") } },
});
