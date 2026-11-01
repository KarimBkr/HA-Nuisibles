import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, renderMarkdown, routedEntries } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ContentBody from "@/components/ContentBody";
import Faq from "@/components/Faq";
import Img from "@/components/Img";
import PostLayout from "@/components/PostLayout";
import ServicePage from "@/components/ServicePage";
import RelatedServices from "@/components/RelatedServices";
import CtaBand from "@/components/CtaBand";

const SERVICE_KINDS = ["service", "local", "guide"];

type Params = { params: Promise<{ slug: string }> };

// Every old page and post at its old root URL (/<slug>/).
export const dynamicParams = false;
export const generateStaticParams = () => routedEntries().map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return entry ? entryMetadata(entry) : {};
}

// Content template (price and legal pages): short header with actions (none on legal), image, body, FAQ, links, CTA.
export default async function ContentPage({ params }: Params) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  if (entry.type === "post") return <PostLayout post={entry} />;
  if (SERVICE_KINDS.includes(entry.kind)) return <ServicePage entry={entry} />;
  return (
    <>
      <PageHero
        trail={[{ label: entry.h1, href: `/${entry.slug}/` }]}
        title={entry.h1}
        text={entry.kind === "legal" ? undefined : entry.description}
        actions={entry.kind !== "legal"}
        service={entry.service}
      />
      <div className="container-site max-w-[72ch] py-10">
        {entry.image && entry.kind !== "legal" && <Img src={entry.image} alt="" priority className="mb-8 w-full rounded-card" sizes="(max-width: 768px) 100vw, 720px" />}
        <ContentBody markdown={entry.body} />
      </div>
      {entry.faq && <Faq title={entry.faqTitle} intro={entry.faqIntro && renderMarkdown(entry.faqIntro)} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      {entry.kind !== "legal" && <RelatedServices service={entry.service} current={entry.slug} />}
      <CtaBand />
    </>
  );
}
