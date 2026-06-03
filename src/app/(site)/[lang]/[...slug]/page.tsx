import { notFound } from "next/navigation";
import {
  ensureContentStoreHydrated,
  getLanguages,
} from "@/lib/server/contentStore";
interface Props {
  params: Promise<{ lang: string; slug: string[] }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    return {};
  }
  return { title: "Page not found" };
}

/**
 * Catch-all for URLs without a dedicated route. Returns 404 — no placeholder pages.
 */
export default async function SiteCatchAllPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }
  if (!resolvedParams.slug?.length) {
    notFound();
  }

  notFound();
}
