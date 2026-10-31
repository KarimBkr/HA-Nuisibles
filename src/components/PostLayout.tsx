import { CalendarDays, Tag } from "lucide-react";
import { CATEGORIES, formatDate, relatedPosts, renderMarkdown, type Entry } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentBody from "@/components/ContentBody";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import RelatedServices from "@/components/RelatedServices";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { blogPostingLd } from "@/lib/seo";

// Blog post: title, date, category, image, body, FAQ, related posts and services, CTA.
export default function PostLayout({ post }: { post: Entry }) {
  const category = post.category ? CATEGORIES[post.category] : undefined;
  return (
    <>
      <article>
        <header className="bg-brand-light py-10 md:py-14">
          <div className="container-site max-w-[72ch]">
            <Breadcrumbs items={[{ label: "Conseils", href: "/conseils-nuisibles/" }, { label: post.h1, href: `/${post.slug}/` }]} />
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">{post.h1}</h1>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {post.date && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden size={16} />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
              )}
              {category && (
                <a href={`/category/${post.category}/`} className="inline-flex items-center gap-1.5 hover:text-brand-dark hover:underline">
                  <Tag aria-hidden size={16} /> {category}
                </a>
              )}
            </p>
          </div>
        </header>
        <div className="container-site max-w-[72ch] py-10">
          {post.image && <Img src={post.image} alt="" priority className="mb-8 w-full rounded-card" sizes="(max-width: 768px) 100vw, 720px" />}
          <ContentBody markdown={post.body} />
        </div>
      </article>
      {post.faq && <Faq title={post.faqTitle} intro={post.faqIntro && renderMarkdown(post.faqIntro)} items={post.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      <section aria-labelledby="articles-lies" className="py-16">
        <div className="container-site">
          <h2 id="articles-lies" className="text-2xl font-bold text-brand-dark md:text-3xl">
            À lire aussi
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedPosts(post).map((p) => (
              <li key={p.slug} className="overflow-hidden rounded-card border border-line bg-white shadow-soft">
                <a href={`/${p.slug}/`} className="block h-full hover:text-brand-dark">
                  {p.image && <Img src={p.image} alt="" className="aspect-[16/9] w-full object-cover" sizes="(max-width: 768px) 100vw, 380px" />}
                  <span className="block p-5 font-semibold">{p.h1}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <RelatedServices service={post.service} current={post.slug} />
      <CtaBand />
      <JsonLd data={blogPostingLd(post)} />
    </>
  );
}
