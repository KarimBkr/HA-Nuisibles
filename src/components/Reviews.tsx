import { ChevronDown, MessageSquarePlus } from "lucide-react";
import data from "../../content/reviews.json";
import SectionHeader from "@/components/ui/SectionHeader";
import { site } from "@/config/site";

type Review = { quote: string; author: string };
const VISIBLE = 3;

// Customer reviews of the /avis/ page from content/reviews.json, as plain text: no aggregateRating markup, no drawn stars.
const INVITE = "votre avis aide vos voisins à choisir.";

/** « 42 avis Google · votre avis aide… »: count and invitation share one line (mobile height budgets: home ≈ 4.5 screens, service ≤ 6). */
export function ReviewCount({ className = "mt-2 text-muted" }: { className?: string }) {
  return (
    <p className={className}>
      <span data-review-count>{data.rating.count}</span> · {INVITE}
    </p>
  );
}

/** « Laisser un avis sur Google » (opens the review window of the Google profile); `sentence` adds the invitation above it. */
export function ReviewInvite({ reviewUrl = site.reviewUrl, dark = false, sentence = false }: { reviewUrl?: string; dark?: boolean; sentence?: boolean }) {
  if (!reviewUrl) return null;
  return (
    <div data-review-invite className="mt-4">
      {sentence && <p className={`mb-2 first-letter:uppercase ${dark ? "text-bone/80" : "text-muted"}`}>{INVITE}</p>}
      <a
        data-review-link
        href={reviewUrl}
        target="_blank"
        rel="noopener"
        className={`inline-flex min-h-11 items-center gap-2 rounded-card border-2 px-4 py-1 font-bold ${dark ? "border-bone text-bone hover:bg-bone hover:text-ink" : "border-brand bg-white text-brand-dark hover:bg-brand hover:text-white"}`}
      >
        <MessageSquarePlus aria-hidden size={18} /> Laisser un avis sur Google
      </a>
    </div>
  );
}

export default function Reviews({ items = data.items, reviewUrl = site.reviewUrl, n = 1 }: { items?: Review[]; reviewUrl?: string; n?: number }) {
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
        <ReviewCount className="mt-3 text-lg font-medium text-ink" />
        <div className="mt-8 grid max-w-prose gap-8">{items.slice(0, VISIBLE).map(card)}</div>
        {more.length > 0 && (
          <details data-reviews-more className="group mt-5">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-bold text-brand-dark underline [&::-webkit-details-marker]:hidden">
              Voir plus d&apos;avis ({more.length}) <ChevronDown aria-hidden size={18} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-8 grid max-w-prose gap-8">{more.map(card)}</div>
          </details>
        )}
        <ReviewInvite reviewUrl={reviewUrl} />
      </div>
    </section>
  );
}
