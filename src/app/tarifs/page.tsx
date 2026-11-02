import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PRICES_HREF, pricesNav } from "@/config/navigation";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { prices } from "@/config/home";
import SectionHeader from "@/components/ui/SectionHeader";
import LeaderList from "@/components/ui/LeaderList";

export const metadata: Metadata = pageMetadata({
  title: "Tarifs anti-nuisibles à Lyon et Villeurbanne",
  description:
    "Prix de la dératisation, des punaises de lit, de la désinsectisation, des nids de guêpes, du dépigeonnage et de la désinfection à Lyon. Devis gratuit.",
  path: PRICES_HREF,
});

// Prices hub (the header « Tarifs » link), read as a quote: the old site's « from » prices as leader rows, then the price pages as a numbered index.
export default function PricesHub() {
  return (
    <>
      <PageHero trail={[{ label: "Tarifs", href: PRICES_HREF }]} eyebrow="Tarifs" title="Nos tarifs à Lyon et Villeurbanne" text={metadata.description as string} actions />
      <div className="container-site py-10 md:py-16 [&>*]:max-w-3xl">
        <section aria-labelledby="tarifs">
          <SectionHeader n={1} label="Prix" id="tarifs" small>
            Prix par <em>intervention</em>
          </SectionHeader>
          <div data-from-prices>
            <LeaderList className="mt-4 border-b border-rule text-lg" items={prices.items.map((p) => ({ label: p.label, value: p.text, href: p.href }))} />
          </div>
          <p className="mt-3 max-w-[60ch] text-muted">Devis gratuit et sans engagement, rapport d’intervention, second passage si nécessaire et garantie de résultat.</p>
        </section>
        <nav aria-labelledby="detail" className="mt-14">
          <SectionHeader n={2} label="Détail" id="detail" small>
            Le détail par <em>service</em>
          </SectionHeader>
          <ol className="mt-4 border-t border-rule">
            {pricesNav.map((l, i) => (
              <li key={l.href} className="border-b border-rule">
                <Link href={l.href} className="flex min-h-11 items-center gap-4 py-4 hover:text-brand">
                  <span aria-hidden className="serif-title w-8 shrink-0 text-2xl tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg">{l.label}</span>
                  <ArrowRight aria-hidden size={18} className="shrink-0" />
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <CtaBand />
    </>
  );
}
