import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, renderMarkdown, routedEntries } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  return entry ? { title: entry.title, description: entry.description, alternates: { canonical: `/${entry.slug}/` } } : {};
}

export default async function ContentPage({ params }: Params) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  if (entry.type === "post") return <PostLayout post={entry} />;
  if (SERVICE_KINDS.includes(entry.kind)) return <ServicePage entry={entry} />;
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14">
        <div className="container-site grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="max-w-[72ch]">
            <Breadcrumbs items={[{ label: entry.h1, href: `/${entry.slug}/` }]} />
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">{entry.h1}</h1>
            {entry.kind !== "legal" && <p className="mt-4 text-lg text-muted">{entry.description}</p>}
          </div>
          {entry.image && <Img src={entry.image} alt="" priority className="w-full max-w-sm rounded-card shadow-soft" sizes="(max-width: 768px) 100vw, 384px" />}
        </div>
      </header>
      <div className="container-site max-w-[72ch] py-10">
        <ContentBody markdown={entry.body} />
      </div>
      {entry.faq && <Faq title={entry.faqTitle} intro={entry.faqIntro && renderMarkdown(entry.faqIntro)} items={entry.faq.map((f) => ({ q: f.q, html: renderMarkdown(f.a) }))} />}
      {entry.kind !== "legal" && <RelatedServices service={entry.service} current={entry.slug} />}
      <CtaBand />
    </>
  );
}
