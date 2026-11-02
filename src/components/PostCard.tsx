import { ArrowRight } from "lucide-react";
import { CATEGORIES, formatDate, type Entry } from "@/lib/content";
import Img from "@/components/Img";

// Blog card (« dossier » vocabulary): image, small-caps date · category over a rule, serif title, « Lire la suite ».
// The whole card is not a link so the category stays clickable.
// inCategory: the category page already names it, so the card does not repeat it.
export default function PostCard({ post, inCategory = false }: { post: Entry; inCategory?: boolean }) {
  const category = inCategory ? undefined : post.category;
  return (
    <article className="flex h-full flex-col" data-post-card>
      {post.image && (
        <a href={`/${post.slug}/`} tabIndex={-1} aria-hidden>
          <Img src={post.image} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" sizes="(max-width: 768px) 100vw, 380px" />
        </a>
      )}
      <p className="eyebrow mt-4 flex flex-wrap items-center gap-x-2 border-t border-rule pt-3 text-muted">
        {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
        {post.date && category && <span aria-hidden>·</span>}
        {category && (
          <a href={`/category/${category}/`} className="hover:text-brand">
            {CATEGORIES[category]}
          </a>
        )}
      </p>
      <h2 className="serif-title mt-2 text-[1.625rem] leading-tight">
        <a href={`/${post.slug}/`} className="hover:text-brand">{post.h1}</a>
      </h2>
      <a href={`/${post.slug}/`} className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-2 underline underline-offset-4 hover:text-brand" aria-label={`Lire la suite : ${post.h1}`}>
        Lire la suite <ArrowRight aria-hidden size={16} />
      </a>
    </article>
  );
}
