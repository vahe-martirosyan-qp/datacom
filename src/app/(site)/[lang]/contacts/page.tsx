import { notFound } from "next/navigation";
import { ContactsPageView } from "@/components/site/ContactsPageView";
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
  const entries = getPageContent(resolvedParams.lang, "contacts");
  const map = entries ? entriesToMap(entries) : {};
  const title =
    map["page.contacts.seo.title"]?.trim() ||
    map["page.contacts.title"]?.trim() ||
    "Contacts";
  const description = map["page.contacts.seo.description"]?.trim();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default async function SiteContactsPage({ params }: Props) {
  const resolvedParams = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(resolvedParams.lang)) {
    notFound();
  }

  const entries = getPageContent(resolvedParams.lang, "contacts");
  if (!entries) {
    notFound();
  }

  return <ContactsPageView lang={resolvedParams.lang} />;
}
