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
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.html },
  })),
});

// Accordion of the imported FAQ: native buttons (Enter/Space), aria-expanded and aria-controls per question.
// intro: HTML already rendered from the imported Markdown.
// home: the home's FAQ, at the width of the other home sections (M56).
// editorial: the home's « dossier » look (serif title, rules, no card); service pages keep the card until M45.
export default function Faq({
  title = "Questions fréquentes",
  intro,
  items,
  home,
  editorial = false,
  eyebrow,
  fold,
  width,
}: {
  title?: string;
  intro?: string;
  items: Item[];
  home?: string;
  editorial?: boolean;
  eyebrow?: string;
  fold?: number;
  /** Container width classes (default: full on the home, 72ch elsewhere). */
  width?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const row = (item: Item, i: number) => {
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
            <ChevronDown
              aria-hidden
              size={20}
              className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
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
  };
  return (
    <section
      aria-labelledby="faq-titre"
      data-home={home}
      className={editorial ? (home ? "pt-6 pb-2 md:py-24" : "py-6 md:py-20") : `${SECTION} bg-brand-light`}
    >
      <div className={`container-site ${width ?? (home ? "" : "max-w-[72ch]")}`}>
        {eyebrow && (
          <p className="eyebrow border-t border-rule pt-3 text-muted">
            {eyebrow}
          </p>
        )}
        <h2
          id="faq-titre"
          className={
            editorial
              ? `serif-title ${eyebrow ? "mt-2" : "border-t border-rule pt-4"} text-[1.625rem] leading-tight md:text-title`
              : H2
          }
        >
          {title}
        </h2>
        {intro && (
          <div
            className="prose-body mt-3 text-muted"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        )}
        <div
          className={
            editorial
              ? "mt-4 divide-y divide-rule border-y border-rule"
              : "mt-8 divide-y divide-line rounded-card border border-line bg-white"
          }
        >
          {(fold ? items.slice(0, fold) : items).map(row)}
          {/* « ≤ 4 rows visible » (desktop rule): the other questions are folded once more; the JSON-LD keeps them all. */}
          {fold && items.length > fold && (
            <details className="group/more">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                {items.length === fold + 1 ? "Voir l’autre question" : `Voir les ${items.length - fold} autres questions`}
                <ChevronDown
                  aria-hidden
                  size={20}
                  className="shrink-0 transition-transform group-open/more:rotate-180"
                />
              </summary>
              <div className="divide-y divide-rule border-t border-rule">
                {items.slice(fold).map((item, k) => row(item, k + fold))}
              </div>
            </details>
          )}
        </div>
      </div>
      <JsonLd data={faqLd(items)} />
    </section>
  );
}
