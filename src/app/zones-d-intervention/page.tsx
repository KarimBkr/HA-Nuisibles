import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { SERVICES } from "@/config/services";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import { allEntries, renderMarkdown } from "@/lib/content";
import { ZONES_FAQ } from "@/config/hub-faq";
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

// M77: one local page per neighbouring town (Bron, Caluire-et-Cuire, Vénissieux, Vaulx-en-Velin, Décines-Charpieu).
const NEARBY_PAGES = allEntries().filter((e) => e.kind === "local" && e.city && e.city !== "lyon" && e.city !== "villeurbanne");

// Real cases of the old site's guêpes/frelons page in nearby towns (also shown on the Bron and Caluire pages).
const NEARBY_CASES = [
  { place: "Bron", title: "Nid de frelons asiatiques en haut d'un arbre", text: "Nid repéré à plus de 8 m : perche longue, combinaison renforcée, zone sécurisée ; nid neutralisé et retiré. Devis sur mesure selon l'accessibilité." },
  { place: "Caluire-et-Cuire", title: "Nid de guêpes sous un abri de jardin", text: "Nid entre deux planches : traitement ciblé, retrait du nid, conseils anti-récidive. 110 € + déplacement 70 €." },
];

const SEC = "container-site py-12 md:py-16 lg:max-w-page lg:py-section";
const ROW = "flex min-h-11 items-center justify-between gap-3 py-2.5 hover:text-brand-dark";

// Zones hub: the old site's cities and districts, linking every local page (Lyon, Villeurbanne and the neighbouring towns).
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
          <div>
            <ul className="divide-y divide-rule border-y border-rule" data-zone-nearby>
              {NEARBY_PAGES.map((e) => (
                <li key={e.slug}>
                  <a href={`/${e.slug}/`} className={ROW}>
                    {e.h1} <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" />
                  </a>
                </li>
              ))}
            </ul>
            <details className="mt-6 border-y border-rule" data-zone-cases>
              <summary className="flex min-h-11 cursor-pointer items-center font-medium">{NEARBY_CASES.length} cas réels près de Lyon</summary>
              <ul className="divide-y divide-rule border-t border-rule">
              {NEARBY_CASES.map((c) => (
                <li key={c.place} className="py-3">
                  <p className="text-sm text-muted">{c.place}</p>
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-muted">{c.text}</p>
                </li>
              ))}
              </ul>
            </details>
            <Link href="/destruction-nid-guepes-frelons/" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-brand-dark underline underline-offset-2">
              Destruction de nids de guêpes et frelons <ArrowRight aria-hidden size={16} />
            </Link>
          </div>
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
      <section aria-labelledby="services-zone" className={SEC} data-zone-matrix>
        <SectionHeader n={3} label="Villes × services" id="services-zone">Chaque service, <em>ville par ville</em></SectionHeader>
        <p className="mt-4 max-w-prose text-muted">
          Toutes nos prestations couvrent la zone. Hors Lyon et Villeurbanne, la page du service donne la méthode et le prix de départ ; le devis précise le déplacement.
        </p>
        <ul className="mt-8 divide-y divide-rule border-y border-rule">
          {SERVICES.map((s) => (
            <li key={s.key} data-zone-service={s.key} className="grid gap-x-8 gap-y-1 py-3 sm:grid-cols-[14rem_1fr]">
              <a href={`/${s.mainSlug}/`} className="inline-flex min-h-11 items-center gap-1.5 font-medium hover:text-brand-dark">
                {s.label} <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" />
              </a>
              <p className="flex flex-wrap items-center gap-x-4">
                {CITIES.flatMap((c) => localLinks(c.city, s.key).slice(0, 1).map((l) => (
                  <a key={c.city} href={l.href} aria-label={`${s.label} à ${c.name}`} className="inline-flex min-h-11 items-center text-brand-dark underline underline-offset-2">
                    {c.name}
                  </a>
                )))}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <Faq editorial width="max-w-[72ch] lg:max-w-page" title="Questions sur nos zones d'intervention" items={ZONES_FAQ.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      <CtaBand />
    </>
  );
}
