import { notFound } from "next/navigation";
import { SiteProjectsIndexView } from "@/components/site/SiteProjectsIndexView";
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
  const entries = getPageContent(params.lang, "home");
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
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  return <SiteProjectsIndexView lang={params.lang} />;
}
