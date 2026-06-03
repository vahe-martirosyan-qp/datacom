import { notFound } from "next/navigation";
import { EquipmentCategoryPageView } from "@/components/site/EquipmentCategoryPageView";
import { resolveEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    return {};
  }

  const categorySlug = resolveEquipmentCategorySlug(resolvedParams.slug);
  if (!categorySlug) {
    return {};
  }

  const homeEntries = getPageContent(resolvedParams.lang, "home");
  const homeMap = homeEntries ? entriesToMap(homeEntries) : {};
  const siteName =
    (homeMap["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";

  const entries = getPageContent(
    resolvedParams.lang,
    "equipmentCategory",
    categorySlug
  );
  if (!entries) {
    return { title: siteName };
  }

  const map = entriesToMap(entries);
  const prefix = `equipment.${categorySlug}`;
  const title =
    map[`${prefix}.seo.title`]?.trim() ||
    map[`${prefix}.title`]?.trim() ||
    categorySlug;
  const description = map[`${prefix}.seo.description`]?.trim();
  return {
    title: `${title} — ${siteName}`,
    ...(description ? { description } : {}),
  };
}

export default async function SiteEquipmentCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const categorySlug = resolveEquipmentCategorySlug(resolvedParams.slug);
  if (!categorySlug) {
    notFound();
  }

  const entries = getPageContent(
    resolvedParams.lang,
    "equipmentCategory",
    categorySlug
  );
  if (!entries) {
    notFound();
  }

  return (
    <EquipmentCategoryPageView lang={resolvedParams.lang} categorySlug={categorySlug} />
  );
}
