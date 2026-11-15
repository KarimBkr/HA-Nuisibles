import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PEST_PAGES, PESTS_HREF, pestHref } from "@/config/pests";
import { PESTS, SERVICES } from "@/config/services";
import { fromPrice } from "@/config/tariffs";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = pageMetadata({
  title: "Types de nuisibles à Lyon : les reconnaître et les traiter",
  description:
    "Rats, cafards, punaises de lit, guêpes, pigeons, moustiques, fourmis, chenilles, mouches : signes, risques, méthode et prix de chaque traitement à Lyon.",
  path: PESTS_HREF,
});

const SEC = "container-site py-12 md:py-16 lg:max-w-page";
const ROW = "inline-flex min-h-11 items-center gap-1.5 text-brand-dark underline-offset-2 hover:underline";

// Pests hub (M68): one entry per pest page (direct answer + starting price), then every other pest treated → its page, and every service.
export default function PestsHub() {
  const others = PESTS.filter((p) => !PEST_PAGES.some((pp) => pp.service === p.service && pp.name.includes(p.name.split(" ")[0])));
  return (
    <>
      <PageHero trail={[{ label: "Nuisibles", href: PESTS_HREF }]} title="Types de nuisibles : les reconnaître et s’en débarrasser" text={metadata.description as string} actions width="lg:max-w-page" />
      <section aria-labelledby="fiches" className={SEC}>
        <SectionHeader n={1} label="Fiches" id="fiches">Les nuisibles les plus <em>fréquents</em></SectionHeader>
        <ul className="mt-8 divide-y divide-rule border-y border-rule" data-pest-hub>
          {PEST_PAGES.map((p) => {
            const price = fromPrice(p.service);
            return (
              <li key={p.slug} className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[16rem_1fr]">
                <div>
                  <a href={pestHref(p.slug)} className="inline-flex min-h-11 items-center gap-1.5 text-xl font-medium hover:text-brand-dark">
                    {p.name} <ArrowRight aria-hidden size={18} className="shrink-0 text-brand" />
                  </a>
                  {price && <p className="text-sm text-muted">À partir de {price}</p>}
                </div>
                <p className="max-w-prose text-muted">{p.intro}</p>
              </li>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby="autres" className={SEC}>
        <SectionHeader n={2} label="Autres nuisibles" id="autres">Les autres nuisibles <em>traités</em></SectionHeader>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <li key={p.name}><a href={`/${p.slug}/`} className={ROW}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {p.name}</a></li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="services-nuisibles" className={SEC}>
        <SectionHeader n={3} label="Services" id="services-nuisibles">Le service qui <em>correspond</em></SectionHeader>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.key}><a href={`/${s.mainSlug}/`} className={ROW}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {s.label} ({s.pests.join(", ").toLowerCase()})</a></li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
