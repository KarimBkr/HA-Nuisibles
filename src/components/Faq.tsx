"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { H2, SECTION } from "@/components/ShortBlock";

type Item = { q: string; html: string };

// FAQPage schema.org; answers: HTML already rendered from the Markdown (allowed by Google in FAQPage text).
const faqLd = (items: Item[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.html } })),
});

// Accordion of the imported FAQ: native buttons (Enter/Space), aria-expanded and aria-controls per question.
// intro: HTML already rendered from the imported Markdown.
// editorial: the home's « dossier » look (serif title, rules, no card); service pages keep the card until M45.
export default function Faq({ title = "Questions fréquentes", intro, items, home, editorial = false, eyebrow }: { title?: string; intro?: string; items: Item[]; home?: string; editorial?: boolean; eyebrow?: string })  {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="faq-titre" data-home={home} className={editorial ? "py-6 md:py-20" : `${SECTION} bg-brand-light`}>
      <div className="container-site max-w-[72ch]">
        {eyebrow && <p className="eyebrow border-t border-rule pt-3 text-muted">{eyebrow}</p>}
        <h2 id="faq-titre" className={editorial ? `serif-title ${eyebrow ? "mt-3" : "border-t border-rule pt-4"} text-[1.625rem] leading-tight md:text-title` : H2}>
          {title}
        </h2>
        {intro && <div className="prose-body mt-3 text-muted" dangerouslySetInnerHTML={{ __html: intro }} />}
        <div className={editorial ? "mt-4 divide-y divide-rule border-y border-rule" : "mt-8 divide-y divide-line rounded-card border border-line bg-white"}>
          {items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={expanded}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className={`flex min-h-11 w-full items-center justify-between gap-4 text-left font-bold hover:text-brand-dark ${editorial ? "py-3" : "px-5 py-4"}`}
                  >
                    {item.q}
                    <ChevronDown aria-hidden size={20} className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  hidden={!expanded}
                  className={`prose-body pb-5 ${editorial ? "" : "px-5"}`}
                  dangerouslySetInnerHTML={{ __html: item.html }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <JsonLd data={faqLd(items)} />
    </section>
  );
}
