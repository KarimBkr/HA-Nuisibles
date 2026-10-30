"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Item = { q: string; html: string };

// Accordion of the imported FAQ: native buttons (Enter/Space), aria-expanded and aria-controls per question.
export default function Faq({ title = "Questions fréquentes", intro, items }: { title?: string; intro?: string; items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="faq-titre" className="bg-brand-light py-16">
      <div className="container-site max-w-[72ch]">
        <h2 id="faq-titre" className="text-2xl font-bold text-brand-dark md:text-3xl">
          {title}
        </h2>
        {intro && <p className="mt-3 text-muted">{intro}</p>}
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
    </section>
  );
}
