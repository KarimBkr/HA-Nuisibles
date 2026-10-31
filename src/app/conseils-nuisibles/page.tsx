import type { Metadata } from "next";
import { getEntry, pageCount, postsPage } from "@/lib/content";
import BlogList from "@/components/BlogList";
import { entryMetadata } from "@/lib/seo";

const entry = getEntry("conseils-nuisibles")!;

export const metadata: Metadata = entryMetadata(entry);

export default function BlogIndex() {
  return <BlogList title={entry.h1} intro={entry.description} trail={[{ label: "Conseils", href: "/conseils-nuisibles/" }]} posts={postsPage(1)} pages={pageCount()} />;
}
