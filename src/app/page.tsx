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

// Home « dossier d'intervention », mobile first: triage + services index, urgency, method, prices, reviews, closing block, FAQ.
export default function Home() {
  const home = getEntry("")!;
  const m = (media as Record<string, { width: number; small?: string; smallWidth?: number }>)[hero.image];
  // LCP image: the portrait beside the H1, preloaded with the same srcset/sizes as its <img>.
  preload(hero.image, { as: "image", fetchPriority: "high", imageSrcSet: `${m.small} ${m.smallWidth}w, ${hero.image} ${m.width}w`, imageSizes: "(max-width: 768px) 40vw, 320px" });
  return (
    <>
      <Hero h1={home.h1} />
      <Services />
      <UrgencyBand />
      <Method />
      <PricePreview />
      <HomeReviews />
      <ClosingBlock />
      {home.faq && (
        <Faq home="faq" editorial title={home.faqTitle} items={home.faq.slice(0, HOME_FAQ).map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      )}
    </>
  );
}
