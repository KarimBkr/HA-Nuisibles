import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NavLink } from "@/config/navigation";
import { CATEGORIES, type Entry } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import PostCard from "@/components/PostCard";

type Props = { title: string; intro: string; trail: NavLink[]; posts: Entry[]; page?: number; pages?: number; current?: string };

const pageHref = (n: number) => (n === 1 ? "/conseils-nuisibles/" : `/conseils-nuisibles/page/${n}/`);

// Blog index, its numbered pages and the category pages: header, category links, card grid, pagination.
export default function BlogList({ title, intro, trail, posts, page = 1, pages = 1, current }: Props) {
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14">
        <div className="container-site max-w-[72ch]">
          <Breadcrumbs items={trail} />
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-muted">{intro}</p>
        </div>
      </header>
      <section aria-label="Articles" className="py-10 md:py-14">
        <div className="container-site">
          <nav aria-label="Catégories" className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([slug, label]) => (
              <a
                key={slug}
                href={`/category/${slug}/`}
                aria-current={slug === current ? "page" : undefined}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-brand hover:text-brand-dark aria-[current=page]:border-brand aria-[current=page]:bg-brand aria-[current=page]:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2" data-pagination>
              {page > 1 && (
                <a href={pageHref(page - 1)} rel="prev" className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-line bg-white px-4 font-medium hover:border-brand">
                  <ChevronLeft aria-hidden size={18} /> Précédent
                </a>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Page ${n}`}
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-line bg-white font-medium hover:border-brand aria-[current=page]:border-brand aria-[current=page]:bg-brand aria-[current=page]:text-white"
                >
                  {n}
                </a>
              ))}
              {page < pages && (
                <a href={pageHref(page + 1)} rel="next" className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-line bg-white px-4 font-medium hover:border-brand">
                  Suivant <ChevronRight aria-hidden size={18} />
                </a>
              )}
            </nav>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
