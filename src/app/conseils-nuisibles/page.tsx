import type { Metadata } from "next";
import { getEntry, pageCount, postsPage } from "@/lib/content";
import BlogList from "@/components/BlogList";

const entry = getEntry("conseils-nuisibles")!;

export const metadata: Metadata = { title: entry.title, description: entry.description, alternates: { canonical: "/conseils-nuisibles/" } };

export default function BlogIndex() {
  return <BlogList title={entry.h1} intro={entry.description} trail={[{ label: "Conseils", href: "/conseils-nuisibles/" }]} posts={postsPage(1)} pages={pageCount()} />;
}
