import { notFound } from "next/navigation";
import { EquipmentPageView } from "@/components/site/EquipmentPageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    return {};
  }
  const entries = getPageContent(params.lang, "equipment");
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
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const entries = getPageContent(params.lang, "equipment");
  if (!entries) {
    notFound();
  }

  return <EquipmentPageView lang={params.lang} />;
}
