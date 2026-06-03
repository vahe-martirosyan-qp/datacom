import { notFound } from "next/navigation";
import { SiteProjectsIndexView } from "@/components/site/SiteProjectsIndexView";
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
  const entries = getPageContent(resolvedParams.lang, "home");
  const map = entries ? entriesToMap(entries) : {};
  const siteName =
    (map["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";
  const title = map["home.projects.sectionTitle"]?.trim() || "Projects";
  return {
    title: `${title} — ${siteName}`,
  };
}

export default async function SiteProjectsIndexPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  return <SiteProjectsIndexView lang={resolvedParams.lang} />;
}
