import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PEST_PAGES, pestHref } from "@/config/pests";
import { pageMetadata } from "@/lib/seo";
import PestPageView from "@/components/PestPage";

type Params = { params: Promise<{ pest: string }> };
const find = async ({ params }: Params) => {
  const { pest } = await params;
  return PEST_PAGES.find((p) => p.slug === pest);
};

export const dynamicParams = false;
export const generateStaticParams = () => PEST_PAGES.map((p) => ({ pest: p.slug }));

export async function generateMetadata(props: Params): Promise<Metadata> {
  const p = await find(props);
  return p ? pageMetadata({ title: p.title, description: p.description, path: pestHref(p.slug) }) : {};
}

export default async function Page(props: Params) {
  const p = await find(props);
  if (!p) notFound();
  return <PestPageView pest={p} />;
}
