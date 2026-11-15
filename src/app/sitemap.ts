import type { MetadataRoute } from "next";
import { allEntries, CATEGORIES, pageCount } from "@/lib/content";
import { absUrl } from "@/lib/seo";
import { PEST_PAGES, PESTS_HREF, pestHref } from "@/config/pests";

export const dynamic = "force-static";

// Every indexable page of the static export (the 404 page excluded).
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...allEntries().map((e) => (e.slug ? `/${e.slug}/` : "/")),
    "/nos-services/",
    "/rendez-vous/",
    "/zones-d-intervention/",
    "/tarifs/",
    PESTS_HREF,
    ...PEST_PAGES.map((p) => pestHref(p.slug)),
    ...Array.from({ length: pageCount() - 1 }, (_, i) => `/conseils-nuisibles/page/${i + 2}/`),
    ...Object.keys(CATEGORIES).map((c) => `/category/${c}/`),
  ];
  const modified = new Map(allEntries().map((e) => [e.slug ? `/${e.slug}/` : "/", e.modified || e.date]));
  return paths.map((p) => ({ url: absUrl(p), ...(modified.get(p) && { lastModified: modified.get(p) }) }));
}
