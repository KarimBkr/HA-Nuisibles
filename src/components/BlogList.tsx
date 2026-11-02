import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NavLink } from "@/config/navigation";
import { CATEGORIES, type Entry } from "@/lib/content";
import PageHero from "@/components/PageHero";
import Img from "@/components/Img";
import CtaBand from "@/components/CtaBand";
import PostCard from "@/components/PostCard";

type Props = { title: string; intro: string; trail: NavLink[]; posts: Entry[]; page?: number; pages?: number; current?: string };

const pageHref = (n: number) => (n === 1 ? "/conseils-nuisibles/" : `/conseils-nuisibles/page/${n}/`);

// Blog index, its numbered pages and the category pages: header, category links, card grid, pagination.
export default function BlogList({ title, intro, trail, posts, page = 1, pages = 1, current }: Props) {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow={current ? `Conseils — ${CATEGORIES[current]}` : page > 1 ? `Conseils — page ${page}` : "Conseils"}
        title={title}
        text={intro}
        aside={<Img src="/images/desinsectisation-a-villeurbanne-et-toute-sa-region.webp" alt="" className="hidden w-44 rounded-t-full md:block lg:w-52" sizes="208px" />}
      />
      <section aria-label="Articles" className="py-10 md:py-14">
        <div className="container-site">
          <nav aria-label="Catégories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {Object.entries(CATEGORIES).map(([slug, label]) => (
              <a
                key={slug}
                href={`/category/${slug}/`}
                aria-current={slug === current ? "page" : undefined}
                className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-ink/20 px-4 hover:border-ink aria-[current=page]:border-forest aria-[current=page]:bg-forest aria-[current=page]:text-bone"
              >
                {label}
              </a>
            ))}
          </nav>
          <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2" data-pagination>
              {page > 1 && (
                <a href={pageHref(page - 1)} rel="prev" className="inline-flex min-h-11 items-center gap-1 rounded-full border border-ink/20 px-4 hover:border-ink">
                  <ChevronLeft aria-hidden size={18} /> Précédent
                </a>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Page ${n}`}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-ink/20 tabular-nums hover:border-ink aria-[current=page]:border-forest aria-[current=page]:bg-forest aria-[current=page]:text-bone"
                >
                  {n}
                </a>
              ))}
              {page < pages && (
                <a href={pageHref(page + 1)} rel="next" className="inline-flex min-h-11 items-center gap-1 rounded-full border border-ink/20 px-4 hover:border-ink">
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
