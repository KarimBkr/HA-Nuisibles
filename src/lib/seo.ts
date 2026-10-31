import type { Metadata } from "next";
import { site } from "@/config/site";
import { hero } from "@/config/home";
import type { NavLink } from "@/config/navigation";
import type { Entry } from "@/lib/content";

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
const DAYS: Record<string, string[]> = {
  "Lundi au Vendredi": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  Samedi: ["Saturday"],
};

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "PestControlService",
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
    sameAs: Object.values(site.socials),
  };
}

export const serviceLd = (e: Entry, serviceType: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: e.h1,
  serviceType,
  description: e.description,
  url: absUrl(`/${e.slug}/`),
  provider: { "@id": BUSINESS_ID },
  areaServed: e.city || site.zone.areas.at(-1),
});

export const breadcrumbLd = (items: NavLink[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: absUrl(it.href) })),
});

export const blogPostingLd = (p: Entry) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: p.h1,
  description: p.description,
  url: absUrl(`/${p.slug}/`),
  mainEntityOfPage: absUrl(`/${p.slug}/`),
  ...(p.image && { image: absUrl(p.image) }),
  ...(p.date && { datePublished: p.date }),
  ...((p.modified || p.date) && { dateModified: p.modified || p.date }),
  author: { "@id": BUSINESS_ID },
  publisher: { "@id": BUSINESS_ID },
});
