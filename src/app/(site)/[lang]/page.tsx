import { notFound } from "next/navigation";
import { HomePageView } from "@/components/site/HomePageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface LangPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LangPageProps) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const entries = getPageContent(resolvedParams.lang, "home");
  if (!entries) {
    return {};
  }
  const map = entriesToMap(entries);
  return {
    title: map["home.seo.title"],
    description: map["home.seo.description"],
  };
}

export default async function LangHomePage({ params }: LangPageProps) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  return <HomePageView lang={resolvedParams.lang} />;
}
