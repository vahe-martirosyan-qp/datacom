import { notFound } from "next/navigation";
import { CompanyPageView } from "@/components/site/CompanyPageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: Promise<{ lang: string }>;
}

/** Alias for `/company` — same CMS content (`page.company.*`). */
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    return {};
  }
  const entries = getPageContent(resolvedParams.lang, "company");
  const map = entries ? entriesToMap(entries) : {};
  const title =
    map["page.company.seo.title"]?.trim() ||
    map["page.company.title"]?.trim() ||
    "Company";
  const description = map["page.company.seo.description"]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SiteAboutPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "company");
  if (!entries) {
    notFound();
  }

  return <CompanyPageView lang={resolvedParams.lang} />;
}
