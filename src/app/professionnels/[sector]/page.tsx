import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SECTOR_PAGES, sectorHref } from "@/config/sectors";
import { pageMetadata } from "@/lib/seo";
import SectorPageView from "@/components/SectorPage";

type Params = { params: Promise<{ sector: string }> };
const find = async ({ params }: Params) => {
  const { sector } = await params;
  return SECTOR_PAGES.find((p) => p.slug === sector);
};

export const dynamicParams = false;
export const generateStaticParams = () => SECTOR_PAGES.map((p) => ({ sector: p.slug }));

export async function generateMetadata(props: Params): Promise<Metadata> {
  const p = await find(props);
  return p ? pageMetadata({ title: p.title, description: p.description, path: sectorHref(p.slug) }) : {};
}

export default async function Page(props: Params) {
  const p = await find(props);
  if (!p) notFound();
  return <SectorPageView sector={p} />;
}
