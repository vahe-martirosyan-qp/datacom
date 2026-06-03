import { notFound } from "next/navigation";
import { IntegrationsPageView } from "@/components/site/IntegrationsPageView";
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
  const entries = getPageContent(resolvedParams.lang, "integrations");
  const map = entries ? entriesToMap(entries) : {};
  const title =
    map["page.integrations.seo.title"]?.trim() ||
    map["page.integrations.title"]?.trim() ||
    "Integrations";
  const description = map["page.integrations.seo.description"]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SiteIntegrationsPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "integrations");
  if (!entries) {
    notFound();
  }

  return <IntegrationsPageView lang={resolvedParams.lang} />;
}
