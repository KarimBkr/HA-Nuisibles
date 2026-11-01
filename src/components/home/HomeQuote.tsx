"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Review = { quote: string; author: string };

/** One big serif quote; « Avis suivant » shows the next one. Every quote stays in the HTML (others hidden). */
export default function HomeQuote({ items }: { items: Review[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="mt-5" aria-live="polite">
      {items.map((r, k) => (
        <figure key={r.author} hidden={k !== i}>
          <blockquote className="serif-title text-[1.375rem] leading-[1.3] md:text-4xl">« {r.quote} »</blockquote>
          <figcaption className="mt-3 text-muted">{r.author}</figcaption>
        </figure>
      ))}
      {items.length > 1 && (
        <button type="button" onClick={() => setI((i + 1) % items.length)} className="btn mt-3 rounded-full border border-ink/25 px-5 hover:border-ink">
          Avis suivant <ArrowRight aria-hidden size={18} />
        </button>
      )}
    </div>
  );
}
