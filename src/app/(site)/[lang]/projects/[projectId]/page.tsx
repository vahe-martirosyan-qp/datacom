import { notFound, redirect } from "next/navigation";
import { ProjectPageView } from "@/components/site/ProjectPageView";
import { entriesToMap } from "@/lib/contentUtils";
import {
  legacySeedSlugToUuid,
  normalizeNewProjectSlug,
  resolveProjectKeySegment,
} from "@/lib/projectHrefUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: { lang: string; projectId: string };
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

  const segment = resolveProjectKeySegment(params.projectId);
  if (!segment) {
    return { title: siteName };
  }

  const projectEntries = getPageContent(params.lang, "project", segment);
  if (!projectEntries) {
    return { title: siteName };
  }
  const pmap = entriesToMap(projectEntries);
  const title =
    pmap[`project.${segment}.title`]?.trim() || params.projectId;
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

  let rawParam = params.projectId;
  try {
    rawParam = decodeURIComponent(rawParam);
  } catch {
    notFound();
  }
  const legacySlug = normalizeNewProjectSlug(rawParam);
  const seedUuid = legacySlug ? legacySeedSlugToUuid(legacySlug) : null;
  if (seedUuid) {
    redirect(`/${params.lang}/projects/${seedUuid}`);
  }

  const segment = resolveProjectKeySegment(params.projectId);
  if (!segment) {
    notFound();
  }

  const projectEntries = getPageContent(params.lang, "project", segment);
  if (!projectEntries) {
    notFound();
  }

  return (
    <ProjectPageView lang={params.lang} projectId={segment} />
  );
}
