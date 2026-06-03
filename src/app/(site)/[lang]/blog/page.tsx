import { notFound } from "next/navigation";
import { BlogPageView } from "@/components/site/BlogPageView";
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
  const entries = getPageContent(resolvedParams.lang, "blog");
  const map = entries ? entriesToMap(entries) : {};
  const title =
    map["page.blog.seo.title"]?.trim() ||
    map["page.blog.title"]?.trim() ||
    "Blog";
  const description = map["page.blog.seo.description"]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SiteBlogPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "blog");
  if (!entries) {
    notFound();
  }

  return <BlogPageView lang={resolvedParams.lang} />;
}
