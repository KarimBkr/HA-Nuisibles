import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { SERVICES } from "@/config/services";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { CARD, H2, SECTION } from "@/components/ShortBlock";
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

// Zones hub: the old site's cities and districts, linking only the local pages that really exist (no thin city page).
export default function ZonesHub() {
  return (
    <>
      <PageHero trail={[{ label: "Zones d'intervention", href: ZONES_HREF }]} title="Zones d'intervention à Lyon, Villeurbanne et alentours" text={metadata.description as string} actions />
      <section aria-labelledby="villes" className={SECTION}>
        <div className="container-site">
          <h2 id="villes" className={H2}>Lyon et Villeurbanne</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {CITIES.map((c) => (
              <article key={c.city} className={CARD} data-zone-city={c.city}>
                <h3 className="flex items-center gap-2 text-xl font-bold text-brand-dark">
                  <MapPin aria-hidden size={22} className="text-brand" /> {c.name}
                </h3>
                <p className="mt-1 text-muted">{c.note}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.places.map((p) => (
                    <li key={p} className="rounded-full bg-surface px-3 py-1 text-sm text-ink">{p}</li>
                  ))}
                </ul>
                <ul className="mt-4 grid gap-1">
                  {localLinks(c.city).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-brand-dark underline-offset-2 hover:underline">
                        <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="alentours" className={`${SECTION} bg-brand-light`}>
        <div className="container-site grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="alentours" className={H2}>Communes voisines</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.zone.nearby.map((p) => (
                <li key={p} className="rounded-full bg-white px-3 py-1 text-ink">{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={H2}>Rhône-Alpes</h2>
            <p className="mt-3 text-muted">
              Nous intervenons aussi dans le Rhône, l&apos;Isère et la Haute-Savoie : appelez-nous ou demandez un devis pour ces villes.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.zone.contactCities.filter((c) => c !== "Lyon" && c !== "Villeurbanne").map((p) => (
                <li key={p} className="rounded-full bg-white px-3 py-1 text-ink">{p}</li>
              ))}
            </ul>
            <Link href="/contact/#mon-devis" className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-dark underline underline-offset-2">
              Demander un devis gratuit <ArrowRight aria-hidden size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="services-zone" className={SECTION}>
        <div className="container-site">
          <h2 id="services-zone" className={H2}>Nos services dans toute la zone</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <li key={s.key}>
                <a href={`/${s.mainSlug}/`} className="flex h-full items-start justify-between gap-3 rounded-card border border-line bg-white p-5 font-medium shadow-soft hover:border-brand hover:text-brand-dark">
                  {s.label} <ArrowRight aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
