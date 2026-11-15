import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { BOOKING_HREF } from "@/config/navigation";
import { SECTORS_HREF, sectorHref, sectorRows, type SectorPage } from "@/config/sectors";
import { SERVICES } from "@/config/services";
import { rowLabel, rowValue } from "@/config/tariffs";
import { getEntry, renderMarkdown } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Button from "@/components/ui/Button";
import LeaderList from "@/components/ui/LeaderList";
import SectionHeader from "@/components/ui/SectionHeader";
import { localLinks } from "@/components/ZoneBlock";

const SEC = "container-site py-10 md:py-14 lg:max-w-page";
const LINK = "inline-flex min-h-11 items-center gap-1.5 text-brand-dark underline-offset-2 hover:underline";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const Arrow = () => <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" />;

// Sector page (M70): stakes, method, organisation, real cases, grid prices + booking, FAQ, then sector → service → city → articles links.
export default function SectorPageView({ sector }: { sector: SectorPage }) {
  const service = SERVICES.find((s) => s.key === sector.service)!;
  const cities = ["lyon", "villeurbanne"].flatMap((c) => localLinks(c, sector.service).slice(0, 1));
  const articles = sector.articles.flatMap((slug) => getEntry(slug) ?? []);
  const list = (items: string[]) => (
    <ul className="mt-6 max-w-prose list-disc space-y-3 pl-5 marker:text-brand">
      {items.map((s) => <li key={s}>{s}</li>)}
    </ul>
  );
  return (
    <>
      <PageHero
        trail={[{ label: "Professionnels", href: SECTORS_HREF }, { label: sector.name, href: sectorHref(sector.slug) }]}
        title={sector.h1}
        text={sector.intro}
        actions
        service={sector.service}
        width="lg:max-w-page"
      />
      <div data-sector={sector.slug}>
        <section aria-labelledby="enjeux" className={SEC}>
          <SectionHeader n={1} label="Enjeux" id="enjeux" small>Ce que les nuisibles vous font risquer</SectionHeader>
          {list(sector.stakes)}
        </section>
        <section aria-labelledby="methode" className={SEC}>
          <SectionHeader n={2} label="Méthode" id="methode" small>Notre intervention, étape par étape</SectionHeader>
          <ol className="mt-6 max-w-prose list-decimal space-y-3 pl-5 marker:font-medium marker:text-brand">
            {sector.method.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>
        <section aria-labelledby="organisation" className={SEC}>
          <SectionHeader n={3} label="Organisation" id="organisation" small>Horaires, discrétion et suivi</SectionHeader>
          {list(sector.organisation)}
        </section>
        {sector.cases.length > 0 && (
          <section aria-labelledby="cas" className={SEC}>
            <SectionHeader n={4} label="Cas concrets" id="cas" small>Interventions réalisées</SectionHeader>
            <ul className="mt-6 grid max-w-prose gap-6">
              {sector.cases.map((c) => (
                <li key={c.title + c.place} className="border-l-2 border-brand pl-4">
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="text-sm text-muted">{c.place}</p>
                  <p className="mt-2">{c.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="prix" className={SEC} data-sector-price>
          <SectionHeader n={5} label="Prix" id="prix" small>Prix de départ et rendez-vous</SectionHeader>
          <LeaderList className="mt-6 max-w-prose border-y border-rule" items={sectorRows(sector).map((r) => ({ label: rowLabel(r), value: rowValue(r) }))} />
          <Link href="/tarifs/" className={`mt-3 ${LINK}`}>Toute la grille tarifaire <ArrowRight aria-hidden size={16} /></Link>
          <div className="mt-6">
            <Button href={`${BOOKING_HREF}#${sector.service}`}><CalendarCheck aria-hidden size={18} /> Réserver un créneau</Button>
          </div>
        </section>
      </div>
      <Faq editorial title={`Questions fréquentes : ${sector.name.toLowerCase()}`} items={sector.faq.map((f) => ({ q: f.q, html: renderMarkdown(esc(f.a)) }))} />
      <section aria-labelledby="plus-loin" className={SEC} data-sector-links>
        <SectionHeader n={6} label="Aller plus loin" id="plus-loin" small>Service, villes et conseils</SectionHeader>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
          <li><a href={`/${service.mainSlug}/`} className={LINK}><Arrow /> {service.label} : notre service</a></li>
          {cities.map((l) => <li key={l.href}><a href={l.href} className={LINK}><Arrow /> {l.label}</a></li>)}
          {articles.map((e) => <li key={e.slug}><a href={`/${e.slug}/`} className={LINK}><Arrow /> {e.h1}</a></li>)}
          <li><Link href={SECTORS_HREF} className={LINK}><Arrow /> Tous les secteurs professionnels</Link></li>
        </ul>
      </section>
      <CtaBand service={sector.service} />
    </>
  );
}
