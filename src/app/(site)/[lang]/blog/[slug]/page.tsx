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
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props) {
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    return {};
  }

  const blogSlug = resolveBlogKeySegment(params.slug);
  if (!blogSlug) {
    return {};
  }

  const homeEntries = getPageContent(params.lang, "home");
  const homeMap = homeEntries ? entriesToMap(homeEntries) : {};
  const siteName =
    (homeMap["home.seo.title"] ?? "Datacom").split(/[—–-]/)[0]?.trim() ??
    "Datacom";

  const entries = getPageContent(params.lang, "blogPost", blogSlug);
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
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const blogSlug = resolveBlogKeySegment(params.slug);
  if (!blogSlug) {
    notFound();
  }

  const entries = getPageContent(params.lang, "blogPost", blogSlug);
  if (!entries) {
    notFound();
  }

  return <BlogPostPageView lang={params.lang} blogSlug={blogSlug} />;
}
