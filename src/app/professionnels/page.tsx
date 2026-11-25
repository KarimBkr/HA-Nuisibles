import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SECTOR_PAGES, SECTORS_HREF, sectorHref } from "@/config/sectors";
import { fromPrice } from "@/config/tariffs";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import { renderMarkdown } from "@/lib/content";
import { SECTORS_FAQ } from "@/config/hub-faq";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = pageMetadata({
  title: "Nuisibles en entreprise à Lyon : solutions pour professionnels",
  description:
    "Nuisibles en entreprise à Lyon et Villeurbanne : restaurants, hôtels, syndics, collectivités, commerces et bureaux. Intervention discrète, rapport et suivi.",
  path: SECTORS_HREF,
});

// Sectors hub (M70): one entry per sector page (direct answer + starting price).
export default function SectorsHub() {
  return (
    <>
      <PageHero trail={[{ label: "Professionnels", href: SECTORS_HREF }]} title="Nuisibles en entreprise : une solution par secteur" text={metadata.description as string} actions width="lg:max-w-page" />
      <section aria-labelledby="secteurs" className="container-site py-12 md:py-16 lg:max-w-page">
        <SectionHeader n={1} label="Secteurs" id="secteurs">Votre <em>activité</em></SectionHeader>
        <ul className="mt-8 divide-y divide-rule border-y border-rule" data-sector-hub>
          {SECTOR_PAGES.map((s) => {
            const price = fromPrice(s.service);
            return (
              <li key={s.slug} className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[16rem_1fr]">
                <div>
                  <a href={sectorHref(s.slug)} className="inline-flex min-h-11 items-center gap-1.5 text-xl font-medium hover:text-brand-dark">
                    {s.name} <ArrowRight aria-hidden size={18} className="shrink-0 text-brand" />
                  </a>
                  {price && <p className="text-sm text-muted">À partir de {price}</p>}
                </div>
                <p className="max-w-prose text-muted">{s.intro}</p>
              </li>
            );
          })}
        </ul>
      </section>
      <Faq editorial width="max-w-[72ch] lg:max-w-page" title="Questions des professionnels" items={SECTORS_FAQ.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      <CtaBand />
    </>
  );
}
