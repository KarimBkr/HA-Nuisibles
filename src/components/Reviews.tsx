import { ChevronDown, MessageSquarePlus } from "lucide-react";
import data from "../../content/reviews.json";
import SectionHeader from "@/components/ui/SectionHeader";

type Review = { quote: string; author: string };
const VISIBLE = 3;

// Customer reviews of the /avis/ page from content/reviews.json, as plain text: no aggregateRating markup, no drawn stars.
export default function Reviews({ items = data.items, reviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "", n = 1 }: { items?: Review[]; reviewUrl?: string; n?: number }) {
  const card = (t: Review) => (
    <figure key={t.author} className="border-l-2 border-brand pl-5">
      <blockquote className="serif-title text-xl leading-snug text-ink md:text-2xl">« {t.quote} »</blockquote>
      <figcaption className="mt-3 text-muted">{t.author}</figcaption>
    </figure>
  );
  const more = items.slice(VISIBLE);
  return (
    <section data-reviews aria-labelledby="avis-liste" className="py-10 md:py-14">
      <div className="container-site lg:max-w-page">
        <SectionHeader n={n} label="Avis" id="avis-liste" small>{data.title}</SectionHeader>
        <p className="mt-3 text-lg font-medium text-ink">
          Note clients : {data.rating.score} – {data.rating.count}
        </p>
        <div className="mt-8 grid max-w-prose gap-8">{items.slice(0, VISIBLE).map(card)}</div>
        {more.length > 0 && (
          <details data-reviews-more className="group mt-5">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-bold text-brand-dark underline [&::-webkit-details-marker]:hidden">
              Voir plus d&apos;avis ({more.length}) <ChevronDown aria-hidden size={18} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-8 grid max-w-prose gap-8">{more.map(card)}</div>
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
