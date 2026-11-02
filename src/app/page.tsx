import type { Metadata } from "next";
import { preload } from "react-dom";
import media from "../../content/media.json";
import { hero } from "@/config/home";
import { getEntry, renderMarkdown } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";
import Faq from "@/components/Faq";
import { ClosingBlock, Hero, HomeReviews, Method, PricePreview, Services, UrgencyBand } from "@/components/home/HomeSections";

export function generateMetadata(): Metadata {
  const home = getEntry("")!;
  return entryMetadata(home);
}

const HOME_FAQ = 4; // the other questions live on the service pages (client)

// Home « dossier d'intervention », mobile first, one column at every width: triage + services index, urgency, method, prices, reviews, FAQ, closing block (the call band stays last, M56).
export default function Home() {
  const home = getEntry("")!;
  const m = (media as Record<string, { width: number; small?: string; smallWidth?: number }>)[hero.image];
  // LCP image: the portrait beside the H1, preloaded with the same srcset/sizes as its <img>.
  preload(hero.image, { as: "image", fetchPriority: "high", imageSrcSet: `${m.small} ${m.smallWidth}w, ${hero.image} ${m.width}w`, imageSizes: "(max-width: 768px) 40vw, 320px" });
  return (
    <>
      {/* Desktop (M52): one column — full-width hero band, then the numbered sections stacked at the same width, no sticky. */}
      <Hero h1={home.h1} />
      <Services />
      <UrgencyBand />
      <Method />
      <PricePreview />
      <HomeReviews />
      {home.faq && (
        <Faq home="faq" editorial eyebrow="06 — Questions" title={home.faqTitle} items={home.faq.slice(0, HOME_FAQ).map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      )}
      <ClosingBlock />
    </>
  );
}
