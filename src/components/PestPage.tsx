import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { BOOKING_HREF } from "@/config/navigation";
import { PESTS_HREF, pestHref, pestRows, type PestPage } from "@/config/pests";
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


// Pest page (M68): signs, risks, method, grid price, booking + follow-up, FAQ, then pest → service → city → articles links.
export default function PestPageView({ pest }: { pest: PestPage }) {
  const service = SERVICES.find((s) => s.key === pest.service)!;
  const cities = ["lyon", "villeurbanne"].flatMap((c) => localLinks(c, pest.service).slice(0, 1));
  const articles = pest.articles.flatMap((slug) => getEntry(slug) ?? []);
  const list = (items: string[]) => (
    <ul className="mt-6 max-w-prose list-disc space-y-3 pl-5 marker:text-brand">
      {items.map((s) => <li key={s}>{s}</li>)}
    </ul>
  );
  return (
    <>
      <PageHero
        trail={[{ label: "Nuisibles", href: PESTS_HREF }, { label: pest.name, href: pestHref(pest.slug) }]}
        title={pest.h1}
        text={pest.intro}
        actions
        service={pest.service}
        width="lg:max-w-page"
      />
      <div data-pest={pest.slug}>
        <section aria-labelledby="signes" className={SEC}>
          <SectionHeader n={1} label="Signes" id="signes" small>Comment reconnaître une infestation</SectionHeader>
          {list(pest.signs)}
        </section>
        <section aria-labelledby="risques" className={SEC}>
          <SectionHeader n={2} label="Risques" id="risques" small>Pourquoi agir sans attendre</SectionHeader>
          {list(pest.risks)}
        </section>
        <section aria-labelledby="traitement" className={SEC}>
          <SectionHeader n={3} label="Traitement" id="traitement" small>Notre méthode, étape par étape</SectionHeader>
          <ol className="mt-6 max-w-prose list-decimal space-y-3 pl-5 marker:font-medium marker:text-brand">
            {pest.treatment.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>
        <section aria-labelledby="prix" className={SEC} data-pest-price>
          <SectionHeader n={4} label="Prix" id="prix" small>Prix de départ</SectionHeader>
          <LeaderList className="mt-6 max-w-prose border-y border-rule" items={pestRows(pest).map((r) => ({ label: rowLabel(r), value: rowValue(r) }))} />
          <Link href="/tarifs/" className={`mt-3 ${LINK}`}>Toute la grille tarifaire <ArrowRight aria-hidden size={16} /></Link>
        </section>
        <section aria-labelledby="suivi" className={SEC}>
          <SectionHeader n={5} label="Rendez-vous et suivi" id="suivi" small>Votre créneau, puis le suivi</SectionHeader>
          <p className="mt-6 max-w-prose">{pest.followUp}</p>
          <div className="mt-6">
            <Button href={`${BOOKING_HREF}#${pest.service}`}><CalendarCheck aria-hidden size={18} /> Réserver un créneau</Button>
          </div>
        </section>
      </div>
      <Faq editorial title={`Questions fréquentes : ${pest.name.toLowerCase()}`} items={pest.faq.map((f) => ({ q: f.q, html: renderMarkdown(esc(f.a)) }))} />
      <section aria-labelledby="plus-loin" className={SEC} data-pest-links>
        <SectionHeader n={6} label="Aller plus loin" id="plus-loin" small>Service, villes et conseils</SectionHeader>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
          <li><a href={`/${service.mainSlug}/`} className={LINK}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {service.label} : notre service</a></li>
          {cities.map((l) => <li key={l.href}><a href={l.href} className={LINK}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {l.label}</a></li>)}
          {articles.map((e) => <li key={e.slug}><a href={`/${e.slug}/`} className={LINK}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {e.h1}</a></li>)}
          <li><Link href={PESTS_HREF} className={LINK}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> Tous les nuisibles traités</Link></li>
        </ul>
      </section>
      <CtaBand service={pest.service} />
    </>
  );
}
