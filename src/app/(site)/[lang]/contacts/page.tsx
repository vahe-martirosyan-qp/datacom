import { notFound } from "next/navigation";
import { ContactsPageView } from "@/components/site/ContactsPageView";
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
  const entries = getPageContent(params.lang, "contacts");
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
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(params.lang)) {
    notFound();
  }

  const entries = getPageContent(params.lang, "contacts");
  if (!entries) {
    notFound();
  }

  return <ContactsPageView lang={params.lang} />;
}
