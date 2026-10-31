import type { Metadata } from "next";
import { getEntry, pageCount, postsPage } from "@/lib/content";
import BlogList from "@/components/BlogList";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ n: string }> };

// Pages 2..N of the blog (page 1 is /conseils-nuisibles/).
export const dynamicParams = false;
export const generateStaticParams = () => Array.from({ length: pageCount() - 1 }, (_, i) => ({ n: String(i + 2) }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { n } = await params;
  const blog = getEntry("conseils-nuisibles")!;
  return pageMetadata({ title: `${blog.h1} – page ${n}`, description: `${blog.description} Page ${n}.`, path: `/conseils-nuisibles/page/${n}/` });
}

export default async function BlogPage({ params }: Params) {
  const n = Number((await params).n);
  const entry = getEntry("conseils-nuisibles")!;
  return (
    <BlogList
      title={`${entry.h1} – page ${n}`}
      intro={entry.description}
      trail={[{ label: "Conseils", href: "/conseils-nuisibles/" }, { label: `Page ${n}`, href: `/conseils-nuisibles/page/${n}/` }]}
      posts={postsPage(n)}
      page={n}
      pages={pageCount()}
    />
  );
}
