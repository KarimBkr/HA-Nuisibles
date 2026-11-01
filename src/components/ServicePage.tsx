import { createElement } from "react";
import { ChevronDown } from "lucide-react";
import { heroImage, SERVICES } from "@/config/services";
import { ICONS } from "@/components/ServiceIcons";
import { getEntry, priceItems, renderMarkdown, splitSections, type Entry } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentBody from "@/components/ContentBody";
import CtaBand from "@/components/CtaBand";
import MobileBar from "@/components/MobileBar";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import { HeroActions } from "@/components/PageHero";
import KeyFacts from "@/components/KeyFacts";
import PriceBlock from "@/components/PriceBlock";
import RelatedServices from "@/components/RelatedServices";
import ZoneBlock from "@/components/ZoneBlock";
import Reviews from "@/components/Reviews";
import { SECTION } from "@/components/ShortBlock";
import JsonLd from "@/components/JsonLd";
import { serviceLd } from "@/lib/seo";

// Rich template of the service and local pages (DESIGN.md §Page templates): short hero, key facts, intro,
// prices and FAQ up front, then the old site's long sections folded (every fact kept, nothing invented).
export default function ServicePage({ entry }: { entry: Entry }) {
  const service = SERVICES.find((s) => s.key === entry.service);
  const trail = [
    ...(service && service.mainSlug !== entry.slug ? [{ label: service.label, href: `/${service.mainSlug}/` }] : []),
    { label: entry.h1, href: `/${entry.slug}/` },
  ];
  const prices = priceItems(entry.body);
  const split = splitSections(entry.body);
  const { sections } = split;
  // The hero already shows entry.image: drop its repeat from the visible intro.
  const intro = split.intro.split("\n").filter((l) => !(entry.image && /^\s*!\[/.test(l) && l.includes(`(${entry.image})`))).join("\n").trim();
  const hero = heroImage(entry.image, service);
  const pricePage = service?.relatedSlugs.map(getEntry).find((e) => e?.kind === "price");
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14" data-service-hero>
        <div className="container-site grid items-center gap-8 md:grid-cols-[1fr_minmax(0,26rem)]">
          <div>
            <Breadcrumbs items={trail} />
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">{entry.h1}</h1>
            <p className="mt-4 max-w-[60ch] text-lg text-muted">{entry.description}</p>
            <HeroActions service={service?.key} />
          </div>
          {hero ? (
            <Img src={hero} alt="" priority className="aspect-[4/3] w-full rounded-card object-cover shadow-soft" sizes="(max-width: 768px) 100vw, 416px" />
          ) : (
            service && (
              <div aria-hidden className="hidden aspect-[4/3] items-center justify-center rounded-card bg-white shadow-soft md:flex" data-hero-icon>
                {createElement(ICONS[service.icon], { size: 96, strokeWidth: 1.5, className: "text-brand" })}
              </div>
            )
          )}
        </div>
      </header>
      <KeyFacts />
      {intro && (
        <div className="container-site max-w-[72ch] py-10">
          <ContentBody markdown={intro} />
        </div>
      )}
      {prices.length > 0 && (
        <PriceBlock items={prices} more={pricePage && pricePage.slug !== entry.slug ? { href: `/${pricePage.slug}/`, label: "Voir tous nos tarifs" } : undefined} />
      )}
      {entry.faq && <Faq title={entry.faqTitle} intro={entry.faqIntro && renderMarkdown(entry.faqIntro)} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      {sections.length > 0 && (
        <section aria-label="En détail" className={SECTION} data-sections>
          <div className="container-site max-w-[72ch]">
            <p className="text-sm font-bold uppercase tracking-wide text-brand">En détail</p>
            <div className="mt-4 divide-y divide-line rounded-card border border-line bg-white">
              {sections.map((s) => (
                <details key={s.title} className="group">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                    <h2 className="text-lg font-bold text-brand-dark md:text-xl" dangerouslySetInnerHTML={{ __html: renderMarkdown(s.title).replace(/^<p>|<\/p>\s*$/g, "") }} />
                    <ChevronDown aria-hidden size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-6">
                    <ContentBody markdown={s.body} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
      <Reviews />
      <ZoneBlock service={entry.service} current={entry.slug} />
      <RelatedServices service={entry.service} current={entry.slug} />
      <CtaBand service={service?.key} />
      {service && <MobileBar service={service.key} />}
      <JsonLd data={serviceLd(entry, service?.label ?? entry.h1)} />
    </>
  );
}
