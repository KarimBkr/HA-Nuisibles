import type { Metadata } from "next";
import { CATEGORIES, posts } from "@/lib/content";
import BlogList from "@/components/BlogList";

type Params = { params: Promise<{ cat: string }> };

// The 5 old category URLs, all their posts on one page (16 at most).
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(CATEGORIES).map((cat) => ({ cat }));

const intro = (label: string) => `Nos articles « ${label} » : conseils pour reconnaître et éliminer les nuisibles à Lyon et Villeurbanne.`;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { cat } = await params;
  return { title: `${CATEGORIES[cat]} – Conseils nuisibles`, description: intro(CATEGORIES[cat]), alternates: { canonical: `/category/${cat}/` } };
}

export default async function CategoryPage({ params }: Params) {
  const { cat } = await params;
  const label = CATEGORIES[cat];
  return (
    <BlogList
      title={label}
      intro={intro(label)}
      trail={[{ label: "Conseils", href: "/conseils-nuisibles/" }, { label, href: `/category/${cat}/` }]}
      posts={posts().filter((p) => p.category === cat)}
      current={cat}
    />
  );
}
