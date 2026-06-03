import { notFound } from "next/navigation";
import { CompanyPageView } from "@/components/site/CompanyPageView";
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
  const entries = getPageContent(params.lang, "company");
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

export default async function SiteCompanyPage({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const entries = getPageContent(params.lang, "company");
  if (!entries) {
    notFound();
  }

  return <CompanyPageView lang={params.lang} />;
}
