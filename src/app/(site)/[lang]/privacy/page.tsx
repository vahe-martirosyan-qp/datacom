import { redirect } from "next/navigation";
import { getLanguages, ensureContentStoreHydrated } from "@/lib/server/contentStore";

interface Props {
  params: Promise<{ lang: string }>;
}

/** Legacy short URL → canonical `/[lang]/privacy-policy`. */
export default async function SitePrivacyRedirectPage({ params }: Props) {
  const { lang } = await params;
  await ensureContentStoreHydrated();
  const codes = getLanguages().map((l) => l.code);
  if (!codes.includes(lang)) {
    redirect("/en/privacy-policy");
  }
  redirect(`/${lang}/privacy-policy`);
}
