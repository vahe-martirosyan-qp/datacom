import { notFound } from "next/navigation";
import { SiteSubPageView } from "@/components/site/SiteSubPageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";
import { titleFromSlugSegments } from "@/lib/slugTitle";

interface Props {
  params: { lang: string; slug: string[] };
}

export async function generateMetadata({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    return {};
  }
  const entries = getPageContent(params.lang, "home");
  const map = entries ? entriesToMap(entries) : {};
  const siteName =
    (map["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";
  const pageTitle = titleFromSlugSegments(params.slug);
  return {
    title: `${pageTitle} — ${siteName}`,
  };
}

export default async function SiteDynamicPage({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }
  if (!params.slug?.length) {
    notFound();
  }

  return <SiteSubPageView lang={params.lang} slug={params.slug} />;
}
