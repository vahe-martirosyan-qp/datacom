import { notFound } from "next/navigation";
import { EquipmentPageView } from "@/components/site/EquipmentPageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    return {};
  }
  const entries = getPageContent(resolvedParams.lang, "equipment");
  const map = entries ? entriesToMap(entries) : {};
  const title =
    map["page.equipment.seo.title"]?.trim() ||
    map["page.equipment.title"]?.trim() ||
    "Equipment";
  const description = map["page.equipment.seo.description"]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SiteEquipmentPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "equipment");
  if (!entries) {
    notFound();
  }

  return <EquipmentPageView lang={resolvedParams.lang} />;
}
