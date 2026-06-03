import { notFound } from "next/navigation";
import { IntegrationCategoryPageView } from "@/components/site/IntegrationCategoryPageView";
import { entriesToMap } from "@/lib/contentUtils";
import { resolveIntegrationCategorySlug } from "@/lib/integrationsHrefUtils";
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
  const categorySlug = resolveIntegrationCategorySlug(resolvedParams.slug);
  if (!categorySlug) {
    return {};
  }
  const entries = getPageContent(
    resolvedParams.lang,
    "integrationCategory",
    categorySlug
  );
  const map = entries ? entriesToMap(entries) : {};
  const prefix = `integration.${categorySlug}`;
  const title =
    map[`${prefix}.seo.title`]?.trim() ||
    map[`${prefix}.title`]?.trim() ||
    "Integrations";
  const description = map[`${prefix}.seo.description`]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SiteIntegrationCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const categorySlug = resolveIntegrationCategorySlug(resolvedParams.slug);
  if (!categorySlug) {
    notFound();
  }

  const entries = getPageContent(
    resolvedParams.lang,
    "integrationCategory",
    categorySlug
  );
  if (!entries) {
    notFound();
  }

  return (
    <IntegrationCategoryPageView
      lang={resolvedParams.lang}
      categorySlug={categorySlug}
    />
  );
}
