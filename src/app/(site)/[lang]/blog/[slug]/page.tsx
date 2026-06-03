import { notFound } from "next/navigation";
import { BlogPostPageView } from "@/components/site/BlogPostPageView";
import { resolveBlogKeySegment } from "@/lib/blogHrefUtils";
import { entriesToMap } from "@/lib/contentUtils";
import {
  ensureContentStoreHydrated,
  getLanguages,
  getPageContent,
} from "@/lib/server/contentStore";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    return {};
  }

  const blogSlug = resolveBlogKeySegment(resolvedParams.slug);
  if (!blogSlug) {
    return {};
  }

  const homeEntries = getPageContent(resolvedParams.lang, "home");
  const homeMap = homeEntries ? entriesToMap(homeEntries) : {};
  const siteName =
    (homeMap["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";

  const entries = getPageContent(resolvedParams.lang, "blogPost", blogSlug);
  if (!entries) {
    return { title: siteName };
  }

  const map = entriesToMap(entries);
  const title =
    map[`blog.${blogSlug}.title`]?.trim() || blogSlug;
  return {
    title: `${title} — ${siteName}`,
  };
}

export default async function SiteBlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const blogSlug = resolveBlogKeySegment(resolvedParams.slug);
  if (!blogSlug) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "blogPost", blogSlug);
  if (!entries) {
    notFound();
  }

  return <BlogPostPageView lang={resolvedParams.lang} blogSlug={blogSlug} />;
}
