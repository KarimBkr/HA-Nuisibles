import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { SERVICES } from "@/config/services";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeader from "@/components/ui/SectionHeader";
import { localLinks, ZONES_HREF } from "@/components/ZoneBlock";

export const metadata: Metadata = pageMetadata({
  title: "Zones d'intervention anti-nuisibles à Lyon et Villeurbanne",
  description:
    "Dératisation, désinsectisation, punaises de lit et nids de guêpes à Lyon, Villeurbanne, Bron, Caluire, Vénissieux, Grenoble, Annecy et Saint-Étienne.",
  path: ZONES_HREF,
});

const CITIES = [
  { name: "Villeurbanne", city: "villeurbanne", places: site.zone.villeurbanne, note: `Notre siège : ${site.address.street}.` },
  { name: "Lyon", city: "lyon", places: site.zone.lyon, note: "Tous les arrondissements." },
];

const SEC = "container-site py-12 md:py-16 lg:max-w-page lg:py-section";
const ROW = "flex min-h-11 items-center justify-between gap-3 py-2.5 hover:text-brand-dark";

// Zones hub: the old site's cities and districts, linking only the local pages that really exist (no thin city page).
// M56: same « dossier » vocabulary as the other pages (numbered labels, serif titles, ruled rows, no cards or bands).
export default function ZonesHub() {
  const others = site.zone.contactCities.filter((c) => c !== "Lyon" && c !== "Villeurbanne");
  return (
    <>
      <PageHero trail={[{ label: "Zones d'intervention", href: ZONES_HREF }]} title="Zones d'intervention à Lyon, Villeurbanne et alentours" text={metadata.description as string} actions width="lg:max-w-page" />
      <section aria-labelledby="villes" className={SEC}>
        <SectionHeader n={1} label="Villes" id="villes">Lyon et <em>Villeurbanne</em></SectionHeader>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          {CITIES.map((c) => (
            <article key={c.city} data-zone-city={c.city}>
              <h3 className="flex items-center gap-2 text-xl font-medium">
                <MapPin aria-hidden size={20} className="text-brand" /> {c.name}
              </h3>
              <p className="mt-1 text-muted">{c.note}</p>
              <p className="mt-3 text-sm text-muted">{c.places.join(" · ")}</p>
              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {localLinks(c.city).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={ROW}>
                      {l.label} <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="alentours" className={SEC}>
        <SectionHeader n={2} label="Alentours" id="alentours">Communes <em>voisines</em></SectionHeader>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <p className="text-muted">{site.zone.nearby.join(" · ")}</p>
          <div>
            <h3 className="text-xl font-medium">Rhône-Alpes</h3>
            <p className="mt-2 text-muted">
              Nous intervenons aussi dans le Rhône, l&apos;Isère et la Haute-Savoie ({others.join(", ")}) : appelez-nous ou demandez un devis pour ces villes.
            </p>
            <Link href="/contact/#mon-devis" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-medium text-brand-dark underline underline-offset-2">
              Demander un devis gratuit <ArrowRight aria-hidden size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="services-zone" className={SEC}>
        <SectionHeader n={3} label="Services" id="services-zone">Nos services dans toute <em>la zone</em></SectionHeader>
        <ul className="mt-8 grid border-t border-rule sm:grid-cols-2 sm:gap-x-16 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.key} className="border-b border-rule">
              <a href={`/${s.mainSlug}/`} className={ROW}>
                {s.label} <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" />
              </a>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
