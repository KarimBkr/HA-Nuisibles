import Link from "next/link";
import { ArrowRight } from "lucide-react";
import localData from "../../content/local.json";
import { site } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { fromPrice } from "@/config/tariffs";
import type { Service } from "@/config/services";
import { allEntries, getEntry, type Entry, type Faq } from "@/lib/content";
import { anchor } from "@/components/RelatedServices";
import { localLinks } from "@/components/ZoneBlock";
import SectionHeader from "@/components/ui/SectionHeader";

type Case = { place: string; title: string; text: string };
type Local = { answer: string; neighbour: string; cases: Case[] };
const LOCAL = localData as unknown as Record<string, Local>;

const CITY: Record<string, { name: string; districts: readonly string[] }> = {
  lyon: { name: "Lyon", districts: site.zone.lyon },
  villeurbanne: { name: "Villeurbanne", districts: site.zone.villeurbanne },
};

/** Everything the local template needs for one page (M66), or undefined for a non-local page. */
export function localPage(entry: Entry, service?: Service) {
  const data = LOCAL[entry.slug];
  const city = entry.city && CITY[entry.city];
  if (entry.kind !== "local" || !data || !city) return undefined;
  const price = fromPrice(service?.key);
  const booking = service ? `${BOOKING_HREF}?service=${service.key}` : BOOKING_HREF;
  const answer = data.answer.replace("{prix}", price ?? "sur devis");
  // City-specific FAQ first: the old page's questions naming the city, topped up to 4 with questions answered from site facts.
  const own = (entry.faq ?? []).filter((f) => f.q.includes(city.name));
  const filler: Faq[] = [
    { q: `Intervenez-vous dans tout ${city.name} ?`, a: `Oui, partout à ${city.name}, notamment à ${city.districts.join(", ")}, depuis notre base de ${site.address.city}.` },
    { q: `Sous quel délai intervenez-vous à ${city.name} ?`, a: `Sous 24h, ${site.booking.days}, sur [rendez-vous en ligne](${booking}) ou au ${site.phone.display}.` },
    ...(price ? [{ q: `Quel est le tarif ${service!.label.toLowerCase()} à ${city.name} ?`, a: `À partir de ${price}, selon la [grille tarifaire](/tarifs/) appliquée partout, avec un devis gratuit et sans engagement.` }] : []),
    { q: `Comment réserver une intervention à ${city.name} ?`, a: `Choisissez votre créneau sur la page [rendez-vous](${booking}) ou appelez le ${site.phone.display}.` },
  ];
  const faq = [...own.slice(0, 4), ...filler.slice(0, Math.max(0, 4 - own.length))];
  const rest = (entry.faq ?? []).filter((f) => !faq.includes(f));
  const neighbour = getEntry(data.neighbour);
  // M72: the city's other services, then the same service in the other cities, all with keyword anchors.
  const sameCity = localLinks(entry.city!, undefined, entry.slug, entry.slug);
  const otherCities = service ? allEntries().filter((e) => e.kind === "local" && e.service === service.key && e.city !== entry.city).map((e) => ({ href: `/${e.slug}/`, label: anchor(e.slug, e.title, e.h1, entry.slug) })) : [];
  const links = [
    service && service.mainSlug !== entry.slug ? { href: `/${service.mainSlug}/`, label: `${service.label} : le service` } : { href: "/nos-services/", label: "Tous nos services" },
    ...sameCity,
    ...otherCities,
    ...(neighbour ? [{ href: `/${neighbour.slug}/`, label: neighbour.h1 }] : []),
  ].filter((l, i, all) => all.findIndex((x) => x.href === l.href) === i);
  return {
    answer,
    city,
    cases: data.cases,
    links,
    faq: [...faq, ...rest],
    bookingHref: booking,
  };
}

export type LocalPage = NonNullable<ReturnType<typeof localPage>>;

/** Real cases, districts and nearby links of a local page. */
export default function LocalBlock({ local, n, className }: { local: LocalPage; n: number; className: string }) {
  const { city, cases, links } = local;
  return (
    <section aria-labelledby="a-la-ville" className={className} data-local>
      <SectionHeader n={n} label={city.name} id="a-la-ville" small>Nos interventions à <em>{city.name}</em></SectionHeader>
      {cases.length ? (
        <ul className="mt-4 divide-y divide-rule border-y border-rule" data-cases>
          {/* Folded like the page's other sections (first one open) to keep each screen calm. */}
          {cases.map((c, i) => (
            <li key={c.title}>
              <details open={i === 0} className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="eyebrow block text-muted">{c.place}</span>
                    <span className="text-lg font-medium">{c.title}</span>
                  </span>
                  <span aria-hidden className="shrink-0 text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[60ch] pb-3">{c.text}</p>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted" data-cases>Aucun cas publié pour l’instant.</p>
      )}
      <h3 className="mt-6 font-medium">Quartiers desservis</h3>
      <ul className="mt-2 flex flex-wrap gap-2" data-districts>
        {city.districts.map((d) => (
          <li key={d} className="rounded-full border border-rule px-3 py-1 text-sm">{d}</li>
        ))}
      </ul>
      <ul className="mt-6 grid gap-x-8 sm:grid-cols-2" data-local-links>
        {links.map((l) => (
          <li key={l.href} className="border-b border-rule">
            <Link href={l.href} className="flex min-h-11 items-center justify-between gap-3 py-2 hover:text-brand">
              {l.label} <ArrowRight aria-hidden size={18} className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
