import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PRICES_HREF } from "@/config/navigation";
import { SERVICES } from "@/config/services";
import { site } from "@/config/site";
import { TARIFFS, TARIFFS_EDITION, type TariffCategory } from "@/config/tariffs";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import { renderMarkdown } from "@/lib/content";
import { PRICES_FAQ } from "@/config/hub-faq";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = pageMetadata({
  title: "Tarifs anti-nuisibles à Lyon et Villeurbanne",
  description:
    "Prix des punaises de lit, cafards, guêpes et frelons, fourmis, rats et souris et du dépigeonnage à Lyon. Diagnostic gratuit, déplacement 70 €.",
  path: PRICES_HREF,
});

const info = TARIFFS.filter((c) => !c.service); // Diagnostic and Déplacement: shown first, they apply to every intervention
const categories = TARIFFS.filter((c): c is TariffCategory & { service: NonNullable<TariffCategory["service"]> } => !!c.service);

// Prices hub on the official grid (src/config/tariffs.ts): one numbered section per category, every row visible.
export default function PricesHub() {
  return (
    <>
      <PageHero trail={[{ label: "Tarifs", href: PRICES_HREF }]} eyebrow={TARIFFS_EDITION} title="Nos tarifs à Lyon et Villeurbanne" text={metadata.description as string} actions width="lg:max-w-read" />
      <div className="container-site py-10 md:py-16 lg:max-w-read lg:py-section">
        <ul data-tariff-info className="grid gap-3 sm:grid-cols-2 sm:gap-x-12">
          {info.map((c) =>
            c.rows.map((r) => (
              <li key={r.label} className="flex min-h-11 items-baseline justify-between gap-4 border-y border-rule py-3 text-xl">
                <span>{r.label}</span>
                <strong className="font-bold tabular-nums">{r.price}</strong>
              </li>
            )),
          )}
        </ul>
        <p className="mt-3 text-muted">{TARIFFS_EDITION} · prix par intervention. Le déplacement s’ajoute au traitement.</p>
        {categories.map((c, i) => {
          const svc = SERVICES.find((s) => s.key === c.service)!;
          const id = `tarif-${i}`;
          return (
            <section key={c.title} aria-labelledby={id} data-price-group={c.title} className="mt-14">
              <SectionHeader n={i + 1} label={svc.label} id={id} small>
                <Link href={`/${svc.mainSlug}/`} className="underline-offset-4 hover:text-brand hover:underline">{c.title}</Link>
              </SectionHeader>
              <ul className="mt-4 divide-y divide-rule border-y border-rule text-lg">
                {c.rows.map((r) => {
                  // The category title already names the pest: then the treatment is the row's name.
                  const name = r.label === c.title && r.treatment ? r.treatment : r.label;
                  const sub = name === r.label ? r.treatment : undefined;
                  return (
                    <li key={r.label + r.treatment} data-tariff-row className="flex min-h-11 items-baseline justify-between gap-4 py-2.5">
                      <span>
                        {name}
                        {sub && <span className="block text-base text-muted">{sub}</span>}
                      </span>
                      <span className="max-w-[55%] shrink-0 text-right">
                        <span className="font-bold tabular-nums">{r.price}</span>
                        {r.condition && <span className="block text-base text-muted">{r.condition}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                <Link href={`/rendez-vous/#${c.service}`} className="inline-flex min-h-11 items-center font-bold text-brand-dark underline underline-offset-4 hover:text-brand">
                  Prendre rendez-vous
                </Link>
                <span className="text-muted">Durée : {site.booking.hours[c.service]} h</span>
              </p>
            </section>
          );
        })}
      </div>
      <Faq editorial width="max-w-[72ch] lg:max-w-page" title="Questions sur nos tarifs" items={PRICES_FAQ.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      <CtaBand />
    </>
  );
}
