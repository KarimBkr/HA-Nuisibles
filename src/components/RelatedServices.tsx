import { ArrowRight } from "lucide-react";
import { SERVICES, type ServiceKey } from "@/config/services";
import { getEntry } from "@/lib/content";

// Links to the page's own service pages first, then the other services' main pages.
export default function RelatedServices({ service, current }: { service?: ServiceKey; current: string }) {
  const own = SERVICES.find((s) => s.key === service);
  const slugs = [
    ...(own ? [own.mainSlug, ...own.relatedSlugs] : []),
    ...SERVICES.filter((s) => s !== own).map((s) => s.mainSlug),
  ].filter((slug) => slug !== current);
  const links = slugs.slice(0, 6).flatMap((slug) => {
    const entry = getEntry(slug);
    return entry ? [{ slug, label: entry.h1 }] : [];
  });
  return (
    <section aria-labelledby="services-lies" className="py-16">
      <div className="container-site">
        <h2 id="services-lies" className="text-2xl font-bold text-brand-dark md:text-3xl">
          {own ? `Nos interventions : ${own.label.toLowerCase()}` : "Nos services"}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.slug}>
              <a
                href={`/${l.slug}/`}
                className="flex h-full items-start justify-between gap-3 rounded-card border border-line bg-white p-5 font-medium shadow-soft hover:border-brand hover:text-brand-dark"
              >
                {l.label}
                <ArrowRight aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
