"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";

type Item = { q: string; html: string };

// FAQPage schema.org; answers: HTML already rendered from the Markdown (allowed by Google in FAQPage text).
const faqLd = (items: Item[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.html } })),
});

// Accordion of the imported FAQ: native buttons (Enter/Space), aria-expanded and aria-controls per question.
// intro: HTML already rendered from the imported Markdown.
export default function Faq({ title = "Questions fréquentes", intro, items, home }: { title?: string; intro?: string; items: Item[]; home?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="faq-titre" data-home={home} className="bg-brand-light py-16">
      <div className="container-site max-w-[72ch]">
        <h2 id="faq-titre" className="text-2xl font-bold text-brand-dark md:text-3xl">
          {title}
        </h2>
        {intro && <div className="prose-body mt-3 text-muted" dangerouslySetInnerHTML={{ __html: intro }} />}
        <div className="mt-8 divide-y divide-line rounded-card border border-line bg-white">
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
                    className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:text-brand-dark"
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
                  className="prose-body px-5 pb-5"
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
