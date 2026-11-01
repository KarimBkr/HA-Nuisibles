import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import type { ServiceKey } from "@/config/services";
import { allEntries } from "@/lib/content";
import { anchor } from "@/components/RelatedServices";

export const ZONES_HREF = "/zones-d-intervention/";

// Local pages of a city (old site's own Lyon/Villeurbanne pages), optionally of one service, with keyword anchors.
export const localLinks = (city: string, service?: ServiceKey, current?: string) =>
  allEntries()
    .filter((e) => e.kind === "local" && e.city === city && (!service || e.service === service) && e.slug !== current)
    .map((e) => ({ href: `/${e.slug}/`, label: anchor(e.slug, e.title, e.h1) }));

const GROUPS = [
  { title: "Villeurbanne", city: "villeurbanne", places: site.zone.villeurbanne },
  { title: "Lyon", city: "lyon", places: site.zone.lyon },
  { title: "Communes voisines", places: site.zone.nearby },
  { title: "Nous intervenons aussi à", places: site.zone.contactCities.filter((c) => c !== "Lyon" && c !== "Villeurbanne") },
];

// Intervention area, from site.ts (old site's zones and contact cities), with links to the local pages and the zones hub.
export default function ZoneBlock({ home, service, current }: { home?: string; service?: ServiceKey; current?: string }) {
  const a = site.address;
  return (
    <section aria-labelledby="zone" data-home={home} data-zone-block className="py-16">
      <div className="container-site">
        <h2 id="zone" className="text-2xl font-bold text-brand-dark md:text-3xl">Zone d&apos;intervention</h2>
        <p className="mt-2 flex items-start gap-2 text-muted">
          <MapPin aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
          Basés au {a.street}, {a.postalCode} {a.city}, nous intervenons dans le Rhône, l&apos;Isère, la Haute-Savoie et toute la région Rhône-Alpes.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="font-bold text-ink">{g.title}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {g.places.map((p) => (
                  <li key={p} className="rounded-full bg-surface px-3 py-1 text-sm text-ink">{p}</li>
                ))}
              </ul>
              {g.city && (
                <ul className="mt-3 grid gap-1">
                  {localLinks(g.city, service, current).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="inline-flex min-h-11 items-center gap-1.5 text-brand-dark underline-offset-2 hover:underline">
                        <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <Link href={ZONES_HREF} className="mt-8 inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-dark underline underline-offset-2">
          Toutes nos zones d&apos;intervention <ArrowRight aria-hidden size={16} />
        </Link>
      </div>
    </section>
  );
}
