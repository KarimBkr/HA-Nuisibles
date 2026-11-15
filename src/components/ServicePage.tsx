import { createElement } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, ChevronDown, Phone } from "lucide-react";
import { HERO_POSITION, heroImage, SERVICES } from "@/config/services";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { fromPrice, method } from "@/config/home";
import { COMMON_ROWS, rowLabel, rowValue, serviceRows } from "@/config/tariffs";
import { ICONS } from "@/components/ServiceIcons";
import { getEntry, priceItems, renderMarkdown, splitSections, PRICE_RE, type Entry, type PriceItem } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentBody from "@/components/ContentBody";
import MobileBar from "@/components/MobileBar";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import { localLinks, ZONES_HREF } from "@/components/ZoneBlock";
import { relatedLinks } from "@/components/RelatedServices";
import SectionHeader, { Title } from "@/components/ui/SectionHeader";
import LeaderList, { type LeaderItem } from "@/components/ui/LeaderList";
import Button from "@/components/ui/Button";
import { HomeReviews } from "@/components/home/HomeSections";
import JsonLd from "@/components/JsonLd";
import { serviceLd } from "@/lib/seo";

const SECTION = "container-site py-6 md:px-0 md:py-20 lg:py-24"; // on desktop the sections sit in the right column, 96 px rhythm (the header draws the rule)
const SUMMARY = "flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden";

// « Label : 110 € » sentences read as leader rows; longer sentences stay as text under the list.
export const asRow = (i: PriceItem): LeaderItem | undefined => {
  if (i.label) return { label: i.label, value: i.text };
  const m = i.text.match(/^([^:]{2,50}) : (.{1,40})$/);
  return m && PRICE_RE.test(m[2]) ? { label: m[1], value: m[2].replace(/\.$/, "") } : undefined;
};

/** The intervention sheet: from-price, longest duration, guarantee, prefilled booking and call. A band on mobile, a column on desktop. */
function Sheet({ service }: { service?: (typeof SERVICES)[number] }) {
  const price = fromPrice(service?.key);
  const hours = service && site.booking.hours[service.key];
  const facts = [
    { k: "Tarif", v: price ? `dès ${price}` : "sur devis" },
    ...(hours ? [{ k: "Durée", v: `${hours} h` }] : []),
    { k: "Délai", v: "sous 24h" },
  ];
  return (
    <div data-sheet className="mt-5">
      <dl className="grid grid-cols-3 divide-x divide-rule border-y border-rule">
        {facts.map((f) => (
          <div key={f.k} className="px-2 py-2 first:pl-0">
            <dt className="eyebrow text-muted">{f.k}</dt>
            <dd className="serif-title text-[1.375rem] leading-tight tabular-nums">{f.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-muted md:hidden">Devis gratuit · garantie de résultat · {site.booking.days}.</p>
      <div className="mt-4 grid gap-3 min-[400px]:grid-cols-2 md:grid-cols-1" data-hero-actions data-top-actions>
        <Button href={service ? `${BOOKING_HREF}#${service.key}` : BOOKING_HREF} className="w-full">
          <CalendarCheck aria-hidden size={18} /> Rendez-vous
        </Button>
        <Button href={telHref} variant="call" className="w-full whitespace-nowrap">
          <Phone aria-hidden size={18} /> {site.phone.display}
        </Button>
      </div>
    </div>
  );
}

// Service and local pages as an « intervention sheet » (client, 2026-11-02): sticky sheet column, then numbered,
// folded content (every old-site fact kept, nothing invented).
export default function ServicePage({ entry }: { entry: Entry }) {
  const service = SERVICES.find((s) => s.key === entry.service);
  const trail = [
    ...(service && service.mainSlug !== entry.slug ? [{ label: service.label, href: `/${service.mainSlug}/` }] : []),
    { label: entry.h1, href: `/${entry.slug}/` },
  ];
  // Services in the official grid show its rows (then Diagnostic, Déplacement); the others keep their old-site lines.
  const grid = serviceRows(entry.service);
  const prices: PriceItem[] = grid.length ? [...grid, ...COMMON_ROWS].map((r) => ({ label: rowLabel(r), text: rowValue(r) })) : priceItems(entry.body);
  const rows = prices.map(asRow);
  const priceRows = rows.filter((r): r is LeaderItem => !!r);
  // Sentences that are not « label : price » rows; they summarise the rows, so they go into the fold when there is one.
  const notes = prices.filter((_, i) => !rows[i]).map((p) => <p key={p.text} className="mt-3 max-w-[60ch]">{p.text}</p>);
  const split = splitSections(entry.body);
  // The sheet already shows entry.image: drop its repeat from the intro.
  const intro = split.intro.split("\n").filter((l) => !(entry.image && /^\s*!\[/.test(l) && l.includes(`(${entry.image})`))).join("\n").trim();
  const folds = [...(intro ? [{ title: "Présentation", body: intro }] : []), ...split.sections];
  const hero = heroImage(entry.image, service);
  const pricePage = service?.relatedSlugs.map(getEntry).find((e) => e?.kind === "price");
  const cities = (["lyon", "villeurbanne"] as const).flatMap((c) => localLinks(c, entry.service, entry.slug));
  const { links: related } = relatedLinks(entry.service, entry.slug);
  // Desktop lead: the description's first sentence, said once (the mobile header shows the whole description instead).
  const lead = entry.description.split(/(?<=[.!?])\s/)[0];
  // Rule « ≤ 4 rows visible »: the old-site sections beyond four are folded once more.
  const fold = (s: { title: string; body: string }) => (
    <details key={s.title} className="group">
      <summary className={SUMMARY}>
        <h2 className="text-lg font-medium" dangerouslySetInnerHTML={{ __html: renderMarkdown(s.title).replace(/^<p>|<\/p>\s*$/g, "") }} />
        <ChevronDown aria-hidden size={20} className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-6">
        <ContentBody markdown={s.body} />
      </div>
    </details>
  );
  let n = 0;
  return (
    <>
      <div className="container-site pt-5 md:pt-8 xl:max-w-[1320px]">
        <Breadcrumbs items={trail} />
      </div>
      <div className="md:container-site md:grid md:grid-cols-12 md:gap-x-16 xl:max-w-[1320px]">
        {/* Desktop: a slim sticky card (title, 3 figures, 2 buttons, small photo), never taller than a 720 px screen. */}
        <header data-service-hero className="container-site pt-3 pb-2 md:sticky md:top-4 md:col-span-5 md:max-w-sheet md:self-start md:px-0 md:pt-6 lg:col-span-4">
          <Title as="h1" size="sub">{entry.h1}</Title>
          <p className="mt-3 max-w-[60ch] text-muted md:hidden">{entry.description}</p>
          <Sheet service={service} />
          {hero ? (
            <Img src={hero} alt="" priority className={`mt-5 aspect-[16/9] w-full rounded-card object-cover md:aspect-[2/1] ${HERO_POSITION[hero] ?? ""}`} sizes="(max-width: 768px) 100vw, 352px" />
          ) : (
            service && (
              <div aria-hidden className="mt-5 hidden aspect-[2/1] items-center justify-center rounded-card border border-rule md:flex" data-hero-icon>
                {createElement(ICONS[service.icon], { size: 64, strokeWidth: 1.25, className: "text-brand" })}
              </div>
            )
          )}
        </header>
        <div className="md:col-span-7 md:pb-16 lg:col-span-8">
          <p data-lead className="serif-title hidden max-w-read pt-6 text-[1.5rem] leading-snug md:block">{lead}</p>
          {prices.length > 0 && (
            <section aria-labelledby="tarifs" className={SECTION}>
              <SectionHeader n={++n} label="Tarifs" id="tarifs" small>Nos <em>tarifs</em></SectionHeader>
              {/* Four rows first: the whole list on one screen was too much on desktop. */}
              <LeaderList className="mt-4 border-b border-rule text-lg" items={priceRows.slice(0, 4)} />
              {priceRows.length > 4 && (
                <details className="group border-b border-rule">
                  <summary className={SUMMARY}>
                    {priceRows.length === 5 ? "Voir l’autre tarif" : `Voir les ${priceRows.length - 4} autres tarifs`}
                    <ChevronDown aria-hidden size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <LeaderList className="text-lg" items={priceRows.slice(4)} />
                  {notes}
                </details>
              )}
              {priceRows.length <= 4 && notes}
              {/* The rest of this line is step 5 of the process, shown on desktop. */}
              <p className="mt-3 max-w-[60ch] text-muted">Devis gratuit et sans engagement<span className="md:hidden">, rapport d’intervention, second passage si nécessaire et garantie de résultat</span>.</p>
              {pricePage && pricePage.slug !== entry.slug && (
                <Link href={`/${pricePage.slug}/`} className="mt-2 inline-flex min-h-11 items-center gap-2 underline underline-offset-4 hover:text-brand">
                  Voir tous nos tarifs <ArrowRight aria-hidden size={18} />
                </Link>
              )}
            </section>
          )}
          {entry.faq && (
            <div className="md:[&_.container-site]:mx-0 md:[&_.container-site]:px-0 lg:[&>section]:py-24">
              <Faq editorial fold={3} eyebrow={`${String(++n).padStart(2, "0")} — Questions`} title={entry.faqTitle} intro={entry.faqIntro && renderMarkdown(entry.faqIntro)} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
            </div>
          )}
          {folds.length > 0 && (
            <section aria-labelledby="en-detail" className={SECTION} data-sections>
              <SectionHeader n={++n} label="En détail" id="en-detail" small>Le dossier <em>complet</em></SectionHeader>
              <div className="mt-4 divide-y divide-rule border-y border-rule">
                {folds.slice(0, 4).map(fold)}
                {folds.length > 4 && (
                  <details className="group/more">
                    <summary className={SUMMARY}>
                      {folds.length === 5 ? "Voir l’autre section" : `Voir les ${folds.length - 4} autres sections`}
                      <ChevronDown aria-hidden size={20} className="shrink-0 transition-transform group-open/more:rotate-180" />
                    </summary>
                    <div className="divide-y divide-rule border-t border-rule">{folds.slice(4).map(fold)}</div>
                  </details>
                )}
              </div>
            </section>
          )}
          {/* Process, desktop only: the mobile page keeps its 6-screen budget. */}
          <section aria-labelledby="deroulement" className={`${SECTION} hidden md:block`} data-process>
            <SectionHeader n={++n} label="Déroulement" id="deroulement" small>Notre méthode en <em>5</em> étapes</SectionHeader>
            <ol className="mt-4 divide-y divide-rule border-y border-rule">
              {method.steps.map((s, i) => (
                <li key={s.title}>
                  <details className="group">
                    <summary className={SUMMARY}>
                      <span className="text-lg"><span className="mr-3 tabular-nums text-brand">{i + 1}</span>{s.title}</span>
                      <ChevronDown aria-hidden size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="pb-4 text-muted">{s.text}</p>
                  </details>
                </li>
              ))}
            </ol>
          </section>
          <div className="md:[&>section]:px-0">
            <HomeReviews n={++n} cityList={false} />
          </div>
          <nav aria-labelledby="zone" className={SECTION} data-zone-block>
            <SectionHeader n={++n} label="Aussi" id="zone" small>Aussi à <em>Lyon</em>, Villeurbanne et alentours</SectionHeader>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {[...cities, ...related.map((l) => ({ href: `/${l.slug}/`, label: l.label }))].filter((l, i, all) => all.findIndex((x) => x.href === l.href) === i).map((l) => (
                <li key={l.href} className="border-b border-rule">
                  <Link href={l.href} className="flex min-h-11 items-center justify-between gap-3 py-2 hover:text-brand">
                    {l.label} <ArrowRight aria-hidden size={18} className="shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[60ch] text-muted">
              Basés à {site.address.city}, nous intervenons aussi à {site.zone.contactCities.filter((c) => c !== "Lyon" && c !== "Villeurbanne").join(", ")}.
            </p>
            <Link href={ZONES_HREF} className="mt-2 inline-flex min-h-11 items-center gap-2 underline underline-offset-4 hover:text-brand">
              Toutes nos zones d’intervention <ArrowRight aria-hidden size={18} />
            </Link>
          </nav>
        </div>
      </div>
      {service && <MobileBar service={service.key} />}
      <JsonLd data={serviceLd(entry, service?.label ?? entry.h1)} />
    </>
  );
}
