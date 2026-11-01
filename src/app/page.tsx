import type { Metadata } from "next";
import { preload } from "react-dom";
import media from "../../content/media.json";
import { hero } from "@/config/home";
import { getEntry, renderMarkdown } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import ZoneBlock from "@/components/ZoneBlock";
import { Hero, Method, PricePreview, Services, UrgencyBand, WhyUs } from "@/components/home/HomeSections";
import Reviews from "@/components/Reviews";

export function generateMetadata(): Metadata {
  const home = getEntry("")!;
  return entryMetadata(home);
}

// Home page: short and scannable (urgency band, hero, services, prices, why, method, zones, reviews, closing CTA, FAQ).
export default function Home() {
  const home = getEntry("")!;
  const m = (media as Record<string, { width: number; small?: string; smallWidth?: number }>)[hero.image];
  // Desktop LCP image: preloaded with the same srcset as the hero <img>, at default priority because on phones
  // it sits below the H1 and buttons and must not compete with the CSS.
  preload(hero.image, { as: "image", imageSrcSet: `${m.small} ${m.smallWidth}w, ${hero.image} ${m.width}w`, imageSizes: "(max-width: 768px) 100vw, 520px" });
  return (
    <>
      <UrgencyBand />
      <Hero h1={home.h1} />
      <Services />
      <PricePreview />
      <WhyUs />
      <Method />
      <ZoneBlock home="zones" />
      <Reviews />
      <CtaBand home="cta" />
      {home.faq && (
        <Faq home="faq" title={home.faqTitle} intro={home.faqIntro && renderMarkdown(home.faqIntro)} items={home.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      )}
    </>
  );
}
