import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { getEntry, renderMarkdown } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ContentBody from "@/components/ContentBody";
import Faq from "@/components/Faq";
import QuoteForm from "@/components/QuoteForm";
import MapEmbed from "@/components/MapEmbed";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";

const entry = getEntry("contact")!;

export const metadata: Metadata = entryMetadata(entry);

const ROW = "grid gap-1 border-b border-rule py-3 sm:grid-cols-[8rem_1fr]";

// Contact (client, 2026-11-02): the phone and the booking first, in large; then the short form; address, hours and the map (on click).
export default function ContactPage() {
  const a = site.address;
  return (
    <>
      <PageHero trail={[{ label: "Contact", href: "/contact/" }]} eyebrow="Contact" title={entry.h1} text={entry.description} width="lg:max-w-page">
        <div className="mt-6" data-hero-actions data-top-actions>
          <a href={telHref} className="serif-title block text-[2.75rem] leading-none tabular-nums whitespace-nowrap text-accent hover:text-ink min-[400px]:text-[3.25rem] md:text-8xl">
            {site.phone.display}
          </a>
          <p className="mt-2 text-muted">{site.hours[0].days} {site.hours[0].hours} · dimanche : urgences (+50 %)</p>
          <Button href={BOOKING_HREF} className="mt-5 min-h-12">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous en ligne
          </Button>
        </div>
      </PageHero>
      {/* Desktop: form and coordinates side by side, separated by a rule; the hours are said once, in the hero. */}
      <div className="container-site grid items-start gap-x-16 gap-y-10 py-10 md:py-16 lg:max-w-page lg:grid-cols-12 lg:py-section">
        <section aria-labelledby="contact-devis" className="lg:col-span-7">
          <SectionHeader n={1} label="Devis" id="contact-devis" small>
            Une demande <em>écrite</em>
          </SectionHeader>
          <p className="mt-3 mb-6 max-w-[60ch] text-muted">Réponse sous 24h, devis gratuit et sans engagement.</p>
          <QuoteForm />
        </section>
        <aside aria-labelledby="coord-titre" className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-12">
          <SectionHeader n={2} label="Coordonnées" id="coord-titre" small>
            Nous <em>trouver</em>
          </SectionHeader>
          <dl className="mt-4 border-t border-rule">
            <div className={ROW}>
              <dt className="eyebrow text-muted">Adresse</dt>
              <dd>{site.name}<br />{a.street}<br />{a.postalCode} {a.city}</dd>
            </div>
            <div className={ROW}>
              <dt className="eyebrow text-muted">E-mail</dt>
              <dd><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4 hover:text-brand">{site.email}</a></dd>
            </div>
            <div className={ROW}>
              <dt className="eyebrow text-muted">Zone</dt>
              <dd>{site.zone.contactCities.join(" · ")} et alentours.</dd>
            </div>
          </dl>
          <div className="mt-6">
            <MapEmbed />
          </div>
        </aside>
      </div>
      {/* Old-site text (facts kept, tests/unit/facts.test.ts), folded: the hero and the coordinates already say the essentials (M56). */}
      {entry.body.trim() && (
        <section aria-labelledby="contact-savoir" className="container-site max-w-[72ch] pb-10 lg:max-w-page">
          <SectionHeader n={3} label="À savoir" id="contact-savoir" small>
            Ce que nous <em>traitons</em>
          </SectionHeader>
          <details className="mt-4 max-w-[72ch]">
            <summary className="flex min-h-11 cursor-pointer items-center font-medium text-brand-dark underline underline-offset-4">En savoir plus sur nos interventions</summary>
            <div className="mt-4"><ContentBody markdown={entry.body} /></div>
          </details>
        </section>
      )}
      {entry.faq && <Faq editorial width="max-w-[72ch] lg:max-w-page" eyebrow="04 — Questions" title={entry.faqTitle} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
    </>
  );
}
