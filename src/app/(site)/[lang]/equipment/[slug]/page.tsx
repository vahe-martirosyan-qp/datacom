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
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    return {};
  }

  const categorySlug = resolveEquipmentCategorySlug(params.slug);
  if (!categorySlug) {
    return {};
  }

  const homeEntries = getPageContent(params.lang, "home");
  const homeMap = homeEntries ? entriesToMap(homeEntries) : {};
  const siteName =
    (homeMap["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";

  const entries = getPageContent(
    params.lang,
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
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const categorySlug = resolveEquipmentCategorySlug(params.slug);
  if (!categorySlug) {
    notFound();
  }

  const entries = getPageContent(
    params.lang,
    "equipmentCategory",
    categorySlug
  );
  if (!entries) {
    notFound();
  }

  return (
    <EquipmentCategoryPageView lang={params.lang} categorySlug={categorySlug} />
  );
}
