import { notFound } from "next/navigation";
import { ProjectPageView } from "@/components/site/ProjectPageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    return {};
  }
  const homeEntries = getPageContent(params.lang, "home");
  const homeMap = homeEntries ? entriesToMap(homeEntries) : {};
  const siteName =
    (homeMap["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";

  const projectEntries = getPageContent(
    params.lang,
    "project",
    params.slug
  );
  if (!projectEntries) {
    return { title: siteName };
  }
  const pmap = entriesToMap(projectEntries);
  const title =
    pmap[`project.${params.slug}.title`]?.trim() || params.slug;
  return {
    title: `${title} — ${siteName}`,
  };
}

export default async function SiteProjectDetailPage({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const projectEntries = getPageContent(
    params.lang,
    "project",
    params.slug
  );
  if (!projectEntries) {
    notFound();
  }

  return (
    <ProjectPageView lang={params.lang} slug={params.slug} />
  );
}
