import { ArrowRight, CalendarDays } from "lucide-react";
import { CATEGORIES, formatDate, type Entry } from "@/lib/content";
import Img from "@/components/Img";

// Blog card: image, date, category, title, "Lire la suite" (whole card is not a link so the category stays clickable).
export default function PostCard({ post }: { post: Entry }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-soft" data-post-card>
      {post.image && (
        <a href={`/${post.slug}/`} tabIndex={-1} aria-hidden>
          <Img src={post.image} alt="" className="aspect-[16/9] w-full object-cover" sizes="(max-width: 768px) 100vw, 380px" />
        </a>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          {post.date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden size={15} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
          )}
          {post.category && (
            <a href={`/category/${post.category}/`} className="font-medium text-brand-dark hover:underline">
              {CATEGORIES[post.category]}
            </a>
          )}
        </p>
        <h2 className="mt-3 text-lg font-bold leading-snug text-ink">
          <a href={`/${post.slug}/`} className="hover:text-brand-dark">{post.h1}</a>
        </h2>
        <a href={`/${post.slug}/`} className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-semibold text-brand-dark hover:underline" aria-label={`Lire la suite : ${post.h1}`}>
          Lire la suite <ArrowRight aria-hidden size={16} />
        </a>
      </div>
    </article>
  );
}
