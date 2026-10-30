import { CalendarCheck, Phone } from "lucide-react";
import { SERVICES } from "@/config/services";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { getEntry, priceItems, renderMarkdown, type Entry } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentBody from "@/components/ContentBody";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import KeyFacts from "@/components/KeyFacts";
import PriceBlock from "@/components/PriceBlock";
import RelatedServices from "@/components/RelatedServices";
import ZoneBlock from "@/components/ZoneBlock";

// Rich template of the service and local pages (DESIGN.md §Page templates).
export default function ServicePage({ entry }: { entry: Entry }) {
  const service = SERVICES.find((s) => s.key === entry.service);
  const trail = [
    ...(service && service.mainSlug !== entry.slug ? [{ label: service.label, href: `/${service.mainSlug}/` }] : []),
    { label: entry.h1, href: `/${entry.slug}/` },
  ];
  const prices = priceItems(entry.body);
  const pricePage = service?.relatedSlugs.map(getEntry).find((e) => e?.kind === "price");
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14" data-service-hero>
        <div className="container-site grid items-center gap-8 md:grid-cols-[1fr_minmax(0,26rem)]">
          <div>
            <Breadcrumbs items={trail} />
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">{entry.h1}</h1>
            <p className="mt-4 max-w-[60ch] text-lg text-muted">{entry.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BOOKING_HREF} className="btn bg-brand text-white hover:bg-brand-hover">
                <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
              </a>
              <a href={telHref} className="btn border-2 border-brand-dark text-brand-dark hover:bg-white">
                <Phone aria-hidden size={18} /> {site.phone.display}
              </a>
            </div>
          </div>
          {entry.image && <Img src={entry.image} alt="" priority className="w-full rounded-card shadow-soft" sizes="(max-width: 768px) 100vw, 416px" />}
        </div>
      </header>
      <KeyFacts />
      <div className="container-site max-w-[72ch] py-10">
        <ContentBody markdown={entry.body} />
      </div>
      {prices.length > 0 && (
        <PriceBlock items={prices} more={pricePage && pricePage.slug !== entry.slug ? { href: `/${pricePage.slug}/`, label: "Voir tous nos tarifs" } : undefined} />
      )}
      {entry.faq && <Faq title={entry.faqTitle} intro={entry.faqIntro} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      <ZoneBlock />
      <RelatedServices service={entry.service} current={entry.slug} />
      <CtaBand />
    </>
  );
}
