import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, formatDate, relatedPosts, renderMarkdown, type Entry } from "@/lib/content";
import { SERVICES } from "@/config/services";
import PageHero, { HeroActions } from "@/components/PageHero";
import ContentBody from "@/components/ContentBody";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import SectionHeader from "@/components/ui/SectionHeader";
import RelatedServices from "@/components/RelatedServices";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { articleLd } from "@/lib/seo";

// Blog post: short header (title, date, category), image, readable body, related service CTA, FAQ, related posts and services.
export default function PostLayout({ post }: { post: Entry }) {
  const category = post.category ? CATEGORIES[post.category] : undefined;
  const service = SERVICES.find((s) => s.key === post.service);
  return (
    <>
      <article>
        <PageHero trail={[{ label: "Conseils", href: "/conseils-nuisibles/" }, { label: post.h1, href: `/${post.slug}/` }]} eyebrow={category ? `Conseils — ${category}` : "Conseils"} title={post.h1} width="lg:max-w-read">
          {post.date && (
            <p className="mt-3 text-muted">
              Publié le <time dateTime={post.date}>{formatDate(post.date)}</time>
              {category && (
                <>
                  {" · "}
                  <a href={`/category/${post.category}/`} className="underline underline-offset-4 hover:text-brand">{category}</a>
                </>
              )}
            </p>
          )}
        </PageHero>
        <div className="container-site max-w-[68ch] py-10 md:text-[1.0625rem] lg:max-w-read lg:py-section lg:text-lg 2xl:text-xl" data-reading>
          {post.image && <Img src={post.image} alt="" priority className="mb-8 w-full rounded-2xl" sizes="(max-width: 768px) 100vw, 720px" />}
          <ContentBody markdown={post.body} />
          <aside aria-labelledby="besoin-pro" className="mt-12 border-y border-rule py-6" data-post-service>
            <p className="eyebrow text-muted">Intervention</p>
            <h2 id="besoin-pro" className="serif-title mt-2 text-[1.625rem] leading-tight">Besoin d&apos;un <em>professionnel</em> ?</h2>
            <p className="mt-2 text-muted">
              {service ? (
                <>
                  Découvrez notre service{" "}
                  <a href={`/${service.mainSlug}/`} className="underline underline-offset-4 hover:text-brand">
                    {service.label.toLowerCase()} à Lyon et alentours
                  </a>{" "}
                  ou réservez directement un créneau.
                </>
              ) : (
                <>
                  Découvrez <Link href="/nos-services/" className="underline underline-offset-4 hover:text-brand">tous nos services</Link> ou réservez
                  directement un créneau.
                </>
              )}
            </p>
            <HeroActions service={service?.key} />
          </aside>
        </div>
      </article>
      {post.faq && <Faq title={post.faqTitle} intro={post.faqIntro && renderMarkdown(post.faqIntro)} items={post.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      <section aria-labelledby="articles-lies" className="py-10 md:py-16 lg:py-section">
        <div className="container-site lg:max-w-read">
          <SectionHeader n={1} label="Conseils" id="articles-lies" small>
            À lire aussi
          </SectionHeader>
          <ol className="mt-4 border-t border-rule">
            {relatedPosts(post).map((p, i) => (
              <li key={p.slug} className="border-b border-rule">
                <a href={`/${p.slug}/`} className="group flex min-h-11 items-center gap-4 py-4 hover:text-brand">
                  <span aria-hidden className="serif-title w-8 shrink-0 text-2xl tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg">{p.h1}</span>
                  <ArrowRight aria-hidden size={18} className="shrink-0" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <RelatedServices service={post.service} current={post.slug} />
      <CtaBand />
      <JsonLd data={articleLd(post)} />
    </>
  );
}
