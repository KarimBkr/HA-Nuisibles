import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";
import { getEntry, renderMarkdown } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentBody from "@/components/ContentBody";
import Faq from "@/components/Faq";
import QuoteForm from "@/components/QuoteForm";
import MapEmbed from "@/components/MapEmbed";
import CtaBand from "@/components/CtaBand";

const entry = getEntry("contact")!;

export const metadata: Metadata = { title: entry.title, description: entry.description, alternates: { canonical: "/contact/" } };

export default function ContactPage() {
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14">
        <div className="container-site max-w-[80ch]">
          <Breadcrumbs items={[{ label: "Contact", href: "/contact/" }]} />
          <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-dark md:text-4xl">{entry.h1}</h1>
          <p className="mt-4 text-lg text-muted">{entry.description}</p>
        </div>
      </header>
      <section aria-label="Coordonnées et demande de devis" className="py-12">
        <div className="container-site grid items-start gap-8 lg:grid-cols-[1fr_1.6fr]">
          <aside className="rounded-card border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-brand-dark">Nos coordonnées</h2>
            <ul className="mt-4 space-y-4 text-ink">
              <li className="flex gap-3">
                <MapPin aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                <span>
                  {site.name}
                  <br />
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                <a href={telHref} className="font-semibold underline-offset-2 hover:underline">{site.phone.display}</a>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                <a href={`mailto:${site.email}`} className="break-all underline-offset-2 hover:underline">{site.email}</a>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  {site.hours.map((h) => (
                    <div key={h.days} className="contents">
                      <dt className="font-medium">{h.days}</dt>
                      <dd>{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
            <h3 className="mt-6 font-semibold text-brand-dark">Zones d&apos;intervention</h3>
            <p className="mt-2 text-muted">{site.zone.contactCities.join(" · ")} et alentours.</p>
          </aside>
          <QuoteForm />
        </div>
      </section>
      <section aria-labelledby="plan-titre" className="pb-12">
        <div className="container-site">
          <h2 id="plan-titre" className="mb-4 text-2xl font-bold text-brand-dark">Plan d&apos;accès</h2>
          <MapEmbed />
        </div>
      </section>
      <div className="container-site max-w-[72ch] pb-10">
        <ContentBody markdown={entry.body} />
      </div>
      {entry.faq && <Faq title={entry.faqTitle} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      <CtaBand />
    </>
  );
}
