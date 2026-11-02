import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Phone, Plus } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF, PRICES_HREF } from "@/config/navigation";
import { SERVICES } from "@/config/services";
import { fromPrice, hero, method, prices } from "@/config/home";
import reviews from "../../../content/reviews.json";
import Img from "@/components/Img";
import SectionHeader from "@/components/ui/SectionHeader";
import LeaderList from "@/components/ui/LeaderList";
import Button from "@/components/ui/Button";
import HomeQuote from "@/components/home/HomeQuote";
import { ZONES_HREF } from "@/components/ZoneBlock";

// Home « dossier d'intervention » (client, 2026-11-02): numbered sections, rules, serif titles, leader-dot prices.
// Client-written copy lives here; texts quoted from the old site stay in config/home.ts (checked by facts.test.ts).

const SECTION = "container-site py-6 md:py-24"; // desktop: one column, 96 px rhythm (the section header draws the rule)
const BAND = "container-site py-6 md:py-24"; // forest bands: no rule, same rhythm

/** 01 Triage: question H1 beside the technician's arch portrait; desktop: full-width band, text left, portrait right, call + booking. */
export function Hero({ h1 }: { h1: string }) {
  const [question, rest] = h1.includes("?") ? [h1.slice(0, h1.indexOf("?") + 1), h1.slice(h1.indexOf("?") + 1).trim()] : ["", h1];
  return (
    <section data-home="hero" className="container-site pt-6 md:grid md:grid-cols-12 md:items-center md:gap-x-16 md:pt-16 md:pb-8">
      <Img
        src={hero.image}
        alt="Technicien HA Nuisibles en intervention"
        priority
        sizes="(max-width: 768px) 40vw, 320px"
        className="float-right mb-3 ml-4 aspect-[4/5] w-[40%] max-w-80 rounded-t-full rounded-b-3xl object-cover md:float-none md:col-span-4 md:col-start-9 md:row-start-1 md:m-0 md:w-full md:justify-self-end"
      />
      <div className="md:col-span-8 md:row-start-1">
      <h1 className="serif-title text-[2.5rem] leading-[1.02] md:text-display">
        {question && <span className="block">{question}</span>}
        <span className="mt-2 block text-[1.75rem] leading-[1.1] text-brand-dark md:text-title">
          {rest.replace(/ Lyon$/, " ")}
          {rest.endsWith(" Lyon") && <em>Lyon</em>}
        </span>
      </h1>
      <p className="mt-4 text-muted">
        {reviews.rating.score} · {reviews.rating.count} Google — intervention sous 24h
      </p>
      {/* Desktop only: on mobile the fixed bottom bar carries both actions. */}
      <div className="clear-both hidden flex-wrap gap-3 pt-6 md:flex" data-top-actions>
        <Button href={telHref} variant="call">
          <Phone aria-hidden size={18} /> {site.phone.display}
        </Button>
        <Button href={BOOKING_HREF}>
          <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
        </Button>
      </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section data-home="solutions" aria-labelledby="services-titre" className={`${SECTION} clear-both`}>
      <SectionHeader n={1} label="Services" id="services-titre" small>
        Quel nuisible vous pose <em>problème</em> ?
      </SectionHeader>
      <ul className="mt-6 border-b border-rule">
        {SERVICES.map((s, i) => {
          const price = fromPrice(s.key);
          return (
            <li key={s.key} className="border-t border-rule">
              <a href={`/${s.mainSlug}/`} className="group grid min-h-11 grid-cols-[2.25rem_1fr_auto] items-center gap-x-2 py-1">
                <span className="eyebrow text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="serif-title text-[1.625rem] leading-tight transition-colors group-hover:text-brand md:text-4xl">{s.label}</span>
                <span className="flex items-center gap-2 text-muted">
                  <span className="whitespace-nowrap">{price ? `dès ${price}` : "sur devis"}</span>
                  <ArrowUpRight aria-hidden size={20} className="text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <Link href="/nos-services/" className="mt-2 inline-flex min-h-11 items-center gap-2 underline underline-offset-4 hover:text-brand">
        Tous nos services <ArrowRight aria-hidden size={18} />
      </Link>
    </section>
  );
}

/** 02 Urgency: forest block, orange call, the Sunday rule. */
export function UrgencyBand() {
  return (
    <section data-home="urgency" aria-labelledby="urgence-titre" className="bg-forest text-bone">
      <div className={BAND}>
        <SectionHeader n={2} label="Urgence" id="urgence-titre" dark>
          Un nid, des rats <em>ce soir</em> ?
        </SectionHeader>
        <a href={telHref} className="btn mt-6 min-h-12 rounded-full bg-accent px-7 text-lg text-white hover:brightness-110">
          <Phone aria-hidden size={20} /> Appeler le {site.phone.display}
        </a>
        <p className="mt-4 text-bone/85">Dimanche : urgences, majoration de 50 %.</p>
      </div>
    </section>
  );
}

/** 03 Method: vertical timeline of 5 numbers linked by a rule; the title opens the detail. */
export function Method() {
  return (
    <section data-home="method" aria-labelledby="methode-titre" className={SECTION}>
      <SectionHeader n={3} label="Méthode" id="methode-titre">
        Notre méthode en <em>5</em> étapes
      </SectionHeader>
      <ol className="mt-6">
        {method.steps.map((s, i) => (
          <li key={s.title} className="relative pl-16 before:absolute before:top-11 before:bottom-0 before:left-[1.2rem] before:w-px before:bg-rule last:before:hidden">
            <span aria-hidden className="serif-title absolute top-0 left-0 text-[2.75rem] leading-none tabular-nums text-brand">{i + 1}</span>
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-lg [&::-webkit-details-marker]:hidden">
                <h3>{s.title}</h3>
                <Plus aria-hidden size={20} className="shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-4 text-muted">{s.text}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 04 Prices: leader-dot list like a quote, each line to its price page. */
export function PricePreview() {
  return (
    <section data-home="prices" aria-labelledby="apercu-tarifs" className={SECTION}>
      <SectionHeader n={4} label="Tarifs" id="apercu-tarifs">
        Nos <em>tarifs</em>
      </SectionHeader>
      <LeaderList className="mt-4 border-y border-rule text-lg" items={prices.items.map((p) => ({ label: p.label, value: p.text.replace("À partir de", "dès"), href: p.href }))} />
      <p className="mt-3 max-w-[60ch] text-muted">
        Devis gratuit et sans engagement, rapport d’intervention, second passage si nécessaire et garantie de résultat.{" "}
        <a href={PRICES_HREF} className="text-ink underline underline-offset-4 hover:text-brand">
          Voir tous nos tarifs
        </a>
      </p>
    </section>
  );
}

/** 05 Reviews: one big quote (next on tap), the rating, a scrolling line of cities. */
export function HomeReviews({ n = 5, cityList = true }: { n?: number; cityList?: boolean }) {
  const cities = [...site.zone.contactCities, ...site.zone.nearby, ...site.zone.lyon];
  return (
    <section data-home="testimonials" data-reviews aria-labelledby="avis-titre" className={SECTION}>
      <SectionHeader n={n} label="Avis" id="avis-titre" small>
        {reviews.title}
      </SectionHeader>
      <p className="mt-2 text-muted">Note clients : {reviews.rating.score} – {reviews.rating.count}</p>
      <HomeQuote items={reviews.items} />
      {cityList && (
      <ul aria-label="Villes où nous intervenons" className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {cities.map((c) => (
          <li key={c} className="flex min-h-11 shrink-0 items-center rounded-full border border-rule px-4 whitespace-nowrap">{c}</li>
        ))}
        <li className="shrink-0">
          <Link href={ZONES_HREF} className="flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 whitespace-nowrap text-bone hover:bg-forest">
            Toutes nos zones <ArrowRight aria-hidden size={18} />
          </Link>
        </li>
      </ul>
      )}
    </section>
  );
}

/** End: forest block with the phone number as the graphic element, booking, address and hours. */
export function ClosingBlock() {
  const a = site.address;
  return (
    <section data-home="cta" aria-labelledby="fin-titre" className="bg-forest text-bone">
      <div className={BAND}>
        <h2 id="fin-titre" className="eyebrow text-bone/80">
          Un appel suffit
        </h2>
        <a href={telHref} className="serif-title mt-3 block text-[3.25rem] leading-none tabular-nums whitespace-nowrap text-white hover:text-bone md:text-8xl">
          {site.phone.display}
        </a>
        <Button href={BOOKING_HREF} variant="light" className="mt-5 min-h-12">
          <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
        </Button>
        {/* Desktop: the footer right below already gives address and hours. */}
        <p className="mt-5 max-w-[60ch] text-bone/85 md:hidden">
          {a.street}, {a.postalCode} {a.city}
          <br />
          {site.hours.map((h, k) => (
            <span key={h.days}>
              {k > 0 && " · "}
              {h.days} : {h.hours}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
