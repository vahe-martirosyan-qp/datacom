import { notFound } from "next/navigation";
import { PrivacyPageView } from "@/components/site/PrivacyPageView";
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
  const entries = getPageContent(resolvedParams.lang, "privacy");
  const map = entries ? entriesToMap(entries) : {};
  const title =
    map["page.privacy.seo.title"]?.trim() ||
    map["page.privacy.title"]?.trim() ||
    "Privacy policy";
  const description = map["page.privacy.seo.description"]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SitePrivacyPolicyPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "privacy");
  if (!entries) {
    notFound();
  }

  return <PrivacyPageView lang={resolvedParams.lang} />;
}
