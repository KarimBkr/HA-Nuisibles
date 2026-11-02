import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getEntry, priceItems } from "@/lib/content";
import { asRow } from "@/components/ServicePage";
import { pageMetadata } from "@/lib/seo";
import { PRICES_HREF, pricesNav } from "@/config/navigation";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { prices } from "@/config/home";
import SectionHeader from "@/components/ui/SectionHeader";
import LeaderList, { type LeaderItem } from "@/components/ui/LeaderList";

export const metadata: Metadata = pageMetadata({
  title: "Tarifs anti-nuisibles à Lyon et Villeurbanne",
  description:
    "Prix de la dératisation, des punaises de lit, de la désinsectisation, des nids de guêpes, du dépigeonnage et de la désinfection à Lyon. Devis gratuit.",
  path: PRICES_HREF,
});

// Prices hub (the header « Tarifs » link): one group per price page, its first four old-site rows, the others folded (rule « ≤ 4 rows »).
export default function PricesHub() {
  const groups = pricesNav.map((l) => {
    const entry = getEntry(l.href.replaceAll("/", ""));
    return { ...l, rows: entry ? priceItems(entry.body).map(asRow).filter((r): r is LeaderItem => !!r) : [] };
  });
  return (
    <>
      <PageHero trail={[{ label: "Tarifs", href: PRICES_HREF }]} eyebrow="Tarifs" title="Nos tarifs à Lyon et Villeurbanne" text={metadata.description as string} actions />
      <div className="container-site py-10 md:py-16 lg:max-w-read lg:py-section">
        <section aria-labelledby="tarifs">
          <SectionHeader n={1} label="Prix" id="tarifs" small>
            Prix par <em>intervention</em>
          </SectionHeader>
          <div data-from-prices>
            <LeaderList className="mt-4 border-b border-rule text-lg" items={prices.items.map((p) => ({ label: p.label, value: p.text, href: p.href }))} />
          </div>
          <p className="mt-3 max-w-[60ch] text-muted">Devis gratuit et sans engagement, rapport d’intervention, second passage si nécessaire et garantie de résultat.</p>
        </section>
        {groups.map((g, i) => (
          <section key={g.href} aria-labelledby={`tarif-${i}`} data-price-group className="mt-14">
            <SectionHeader n={i + 2} label="Tarifs" id={`tarif-${i}`} small>
              <Link href={g.href} className="underline-offset-4 hover:text-brand hover:underline">{g.label}</Link>
            </SectionHeader>
            {g.rows.length > 0 && <LeaderList className="mt-4 border-b border-rule text-lg" items={g.rows.slice(0, 4)} />}
            {g.rows.length > 4 && (
              <details className="group border-b border-rule">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                  {g.rows.length === 5 ? "Voir l’autre tarif" : `Voir les ${g.rows.length - 4} autres tarifs`}
                  <ChevronDown aria-hidden size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <LeaderList className="text-lg" items={g.rows.slice(4)} />
              </details>
            )}
          </section>
        ))}
      </div>
      <CtaBand />
    </>
  );
}
