import { ChevronDown, MessageSquarePlus } from "lucide-react";
import data from "../../content/reviews.json";
import { H2, SECTION } from "@/components/ShortBlock";

type Review = { quote: string; author: string };
const VISIBLE = 3;

// Customer reviews from content/reviews.json, as plain text: no aggregateRating markup, no drawn stars.
export default function Reviews({ items = data.items, reviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "" }: { items?: Review[]; reviewUrl?: string }) {
  const card = (t: Review) => (
    <figure key={t.author} className="flex flex-col rounded-card bg-white p-6 shadow-soft">
      <blockquote className="flex-1 text-ink">« {t.quote} »</blockquote>
      <figcaption className="mt-4 font-bold text-brand-dark">{t.author}</figcaption>
    </figure>
  );
  const more = items.slice(VISIBLE);
  return (
    <section data-reviews data-home="testimonials" className={`${SECTION} bg-brand-light`}>
      <div className="container-site">
        <h2 className={H2}>{data.title}</h2>
        <p className="mt-3 text-lg font-bold text-ink">
          Note clients : {data.rating.score} – {data.rating.count}
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{items.slice(0, VISIBLE).map(card)}</div>
        {more.length > 0 && (
          <details data-reviews-more className="group mt-5">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-bold text-brand-dark underline [&::-webkit-details-marker]:hidden">
              Voir plus d&apos;avis ({more.length}) <ChevronDown aria-hidden size={18} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-5 grid gap-5 md:grid-cols-3">{more.map(card)}</div>
          </details>
        )}
        {reviewUrl && (
          <a
            data-review-link
            href={reviewUrl}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-card border-2 border-brand bg-white px-5 py-2 font-bold text-brand-dark hover:bg-brand hover:text-white"
          >
            <MessageSquarePlus aria-hidden size={18} /> Laisser un avis sur Google
          </a>
        )}
      </div>
    </section>
  );
}
