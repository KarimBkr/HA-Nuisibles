import { ArrowRight } from "lucide-react";
import { SERVICES, type ServiceKey } from "@/config/services";
import { getEntry } from "@/lib/content";
import keywords from "../../content/keywords.json";
import { Title } from "@/components/ui/SectionHeader";

// Anchor text: the page's first target keyword (content/keywords.json); a one-word keyword alone reads poorly,
// so it gets the head of the page title (which contains it, checked by the SEO audit); no keyword: the H1.
export const anchor = (slug: string, title: string, h1: string) => {
  const k = keywords.find((k) => k.page === slug)?.keyword;
  if (!k) return h1;
  return k.includes(" ") ? k[0].toUpperCase() + k.slice(1) : title.split(/ [:–-] /)[0];
};

// Links to the page's own service pages first, then the other services' main pages.
export const relatedLinks = (service: ServiceKey | undefined, current: string) => {
  const own = SERVICES.find((s) => s.key === service);
  const slugs = [
    ...(own ? [own.mainSlug, ...own.relatedSlugs] : []),
    ...SERVICES.filter((s) => s !== own).map((s) => s.mainSlug),
  ].filter((slug) => slug !== current);
  const links = slugs.slice(0, 6).flatMap((slug) => {
    const entry = getEntry(slug);
    return entry ? [{ slug, label: anchor(slug, entry.title, entry.h1) }] : [];
  });
  return { own, links };
};

// M56: a quiet ruled list in the reading column (was shadow cards wider than the text).
export default function RelatedServices({ service, current }: { service?: ServiceKey; current: string }) {
  const { own, links } = relatedLinks(service, current);
  return (
    <section aria-labelledby="services-lies" className="container-site max-w-[72ch] pb-16 lg:max-w-read lg:pb-section">
      <p className="eyebrow border-t border-rule pt-3 text-muted">Pour aller plus loin</p>
      <Title id="services-lies" size="sub" className="mt-2">
        {own ? `Nos interventions : ${own.label.toLowerCase()}` : "Nos services"}
      </Title>
      <ul className="mt-6 divide-y divide-rule border-y border-rule">
        {links.map((l) => (
          <li key={l.slug}>
            <a href={`/${l.slug}/`} className="flex min-h-12 items-center justify-between gap-3 py-3 hover:text-brand-dark">
              {l.label}
              <ArrowRight aria-hidden size={18} className="shrink-0 text-brand" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
