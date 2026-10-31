import type { Metadata } from "next";
import { preload } from "react-dom";
import media from "../../content/media.json";
import { hero } from "@/config/home";
import { getEntry, renderMarkdown } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import { Audiences, Cases, Hero, Method, Presentation, ProcessIntro, QuickBlocks, Solutions, Testimonials, WhyUs } from "@/components/home/HomeSections";

export function generateMetadata(): Metadata {
  const home = getEntry("")!;
  return entryMetadata(home);
}

// Home page: the 12 sections of PDF_BRIEF.md §6, texts of the old home.
export default function Home() {
  const home = getEntry("")!;
  const m = (media as Record<string, { width: number; small?: string; smallWidth?: number }>)[hero.image];
  // LCP image: preloaded with the same srcset as the hero <img>.
  preload(hero.image, { as: "image", fetchPriority: "high", imageSrcSet: `${m.small} ${m.smallWidth}w, ${hero.image} ${m.width}w`, imageSizes: "100vw" });
  return (
    <>
      <Hero h1={home.h1} />
      <QuickBlocks />
      <Presentation />
      <Solutions />
      <WhyUs />
      <ProcessIntro />
      <Cases />
      <Method />
      <Testimonials />
      <Audiences />
      <CtaBand home="cta" />
      {home.faq && (
        <Faq home="faq" title={home.faqTitle} intro={home.faqIntro && renderMarkdown(home.faqIntro)} items={home.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />
      )}
    </>
  );
}
