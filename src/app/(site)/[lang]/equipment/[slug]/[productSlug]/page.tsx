import { notFound } from "next/navigation";
import { EquipmentProductPageView } from "@/components/site/EquipmentProductPageView";
import { resolveEquipmentCategorySlug } from "@/lib/equipmentHrefUtils";
import {
  equipmentProductContentPrefix,
  resolveEquipmentProductSlug,
} from "@/lib/equipmentProductHrefUtils";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  equipmentProductExists,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";
interface Props {
  params: { lang: string; slug: string; productSlug: string };
}

export async function generateMetadata({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    return {};
  }

  const categorySlug = resolveEquipmentCategorySlug(params.slug);
  const productSlug = resolveEquipmentProductSlug(params.productSlug);
  if (!categorySlug || !productSlug) {
    return {};
  }

  const homeEntries = getPageContent(params.lang, "home");
  const homeMap = homeEntries ? entriesToMap(homeEntries) : {};
  const siteName =
    (homeMap["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";

  const entries = getPageContent(
    params.lang,
    "equipmentProduct",
    `${categorySlug}/${productSlug}`
  );
  if (!entries) {
    return { title: siteName };
  }

  const map = entriesToMap(entries);
  const prefix = equipmentProductContentPrefix(categorySlug, productSlug);
  const title =
    map[`${prefix}.seo.title`]?.trim() ||
    map[`${prefix}.title`]?.trim() ||
    productSlug;
  const description = map[`${prefix}.seo.description`]?.trim();
  return {
    title: `${title} — ${siteName}`,
    ...(description ? { description } : {}),
  };
}

export default async function SiteEquipmentProductPage({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const categorySlug = resolveEquipmentCategorySlug(params.slug);
  const productSlug = resolveEquipmentProductSlug(params.productSlug);
  if (!categorySlug || !productSlug) {
    notFound();
  }

  if (!equipmentProductExists(categorySlug, productSlug)) {
    notFound();
  }

  return (
    <EquipmentProductPageView
      lang={params.lang}
      categorySlug={categorySlug}
      productSlug={productSlug}
    />
  );
}
